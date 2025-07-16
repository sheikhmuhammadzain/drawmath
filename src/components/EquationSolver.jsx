import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function EquationSolver() {
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState('');
  const signaturePad = useRef(null);
  const showGuideLines = true;

  useEffect(() => {
    if (signaturePad.current) {
      const canvas = signaturePad.current.getCanvas();
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      drawGuideLines(ctx, canvas.width, canvas.height);
    }
  }, []);

  const drawGuideLines = (ctx, width, height) => {
    if (!showGuideLines) return;
    
    const centerY = height / 2;
    ctx.save();
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw top and bottom guide lines
    ctx.beginPath();
    ctx.moveTo(0, centerY - 50);
    ctx.lineTo(width, centerY - 50);
    ctx.moveTo(0, centerY + 50);
    ctx.lineTo(width, centerY + 50);
    ctx.stroke();

    ctx.restore();
  };

  const renderMath = (tex) => {
    try {
      return {
        __html: Katex.renderToString(tex, {
          displayMode: true,
          throwOnError: false,
          strict: false
        })
      };
    } catch {
      return { __html: tex };
    }
  };

  const preprocessImage = (canvas) => {
    try {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Invert colors since we're drawing white on black
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];       // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
      }

      // Create a new canvas with 2x size (4x was too large and causing performance issues)
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = canvas.width * 2;
      scaledCanvas.height = canvas.height * 2;
      const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });

      // Fill with white background
      scaledCtx.fillStyle = 'white';
      scaledCtx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height);

      // Apply the processed image data
      ctx.putImageData(imageData, 0, 0);

      // Scale up with better quality
      scaledCtx.imageSmoothingEnabled = true;
      scaledCtx.imageSmoothingQuality = 'high';
      scaledCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);

      return scaledCanvas;
    } catch (error) {
      console.error('Error in preprocessImage:', error);
      throw new Error('Failed to preprocess image');
    }
  };

  const processDrawing = async () => {
    setIsProcessing(true);
    setError(null);
    setDebug('');
    
    try {
      if (!signaturePad.current) {
        throw new Error('Drawing component not ready!');
      }

      if (signaturePad.current.isEmpty()) {
        throw new Error('Please draw something first!');
      }

      // Get canvas
      const canvas = signaturePad.current.getCanvas();
      setDebug(prev => prev + '\nPreprocessing image...');
      const processedCanvas = preprocessImage(canvas);

      // Convert to base64
      const base64Image = processedCanvas.toDataURL('image/jpeg').split(',')[1];

      // Get API key
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your .env file.');
      }

      // Initialize Gemini
      setDebug(prev => prev + '\nInitializing Gemini AI...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Prepare content
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      };
      const prompt = "Solve the handwritten equation in the image. Provide only the final solution in LaTeX format. For example, for '4x^2 + 3 = 1', the output should be 'x = \\pm \\frac{i\\sqrt{2}}{2}'. Do not include any explanations or steps.";

      setDebug(prev => prev + '\nSending to Gemini AI...');
      const result = await model.generateContent([imagePart, { text: prompt }]);
      const responseText = result.response.text();
      const cleanedSolution = responseText.replace(/\$/g, '');
      setDebug(prev => prev + `\nAI Response: ${responseText}`);
      setSolution(cleanedSolution);
    } catch (error) {
      console.error('Error processing drawing:', error);
      setError(error.message || 'An error occurred while processing. Please try again.');
      setSolution(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearDrawing = () => {
    if (signaturePad.current) {
      signaturePad.current.clear();
      const canvas = signaturePad.current.getCanvas();
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      drawGuideLines(ctx, canvas.width, canvas.height);
    }
    setEquation('');
    setSolution(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-medium tracking-tight">Math Equation Solver</h1>
          <Link to="/" className="text-neutral-400 hover:text-neutral-200 transition-colors">
            Back to Home
          </Link>
        </div>
        
        <div className="bg-neutral-900/50 rounded-lg border border-neutral-800 p-6 mb-8">
          <div className="border border-neutral-800 rounded-lg mb-6 relative" style={{ height: '400px', background: 'black' }}>
            <SignatureCanvas
              ref={signaturePad}
              canvasProps={{
                className: 'signature-canvas',
                style: {
                  width: '100%',
                  height: '100%',
                  background: 'black',
                }
              }}
              backgroundColor="rgb(0,0,0)"
              penColor="white"
              throttle={0}
              minWidth={3}
              maxWidth={4}
              onEnd={() => {
                if (signaturePad.current) {
                  const canvas = signaturePad.current.getCanvas();
                  const ctx = canvas.getContext('2d', { willReadFrequently: true });
                  drawGuideLines(ctx, canvas.width, canvas.height);
                }
              }}
            />
            <div className="absolute top-0 left-0 right-0 p-2 text-center text-neutral-500 text-sm">
              Write your equation clearly between the guide lines
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={processDrawing}
              disabled={isProcessing}
              className="px-6 py-2 bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-all border border-neutral-700 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-neutral-500 border-t-neutral-200 rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Solve Equation'
              )}
            </button>
            <button
              onClick={clearDrawing}
              className="px-6 py-2 bg-neutral-900 text-neutral-400 rounded-lg hover:bg-neutral-800 transition-all border border-neutral-800"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-900/50 p-4 rounded-lg border border-red-700">
            <h3 className="text-lg font-bold text-red-300">Error</h3>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {solution && (
          <div className="bg-neutral-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-white">Solution:</h3>
            <BlockMath math={solution} />
          </div>
        )}

        {debug && (
          <div className="hidden mt-4 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
            <h3 className="text-lg font-bold mb-2 text-neutral-400">Processing Log:</h3>
            <pre className="whitespace-pre-wrap text-sm text-neutral-500">{debug}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 