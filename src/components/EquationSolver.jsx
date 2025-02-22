import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { createWorker } from 'tesseract.js';
import * as math from 'mathjs';
import 'katex/dist/katex.min.css';
import Katex from 'katex';

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

  const solveEquation = (text) => {
    try {
      console.log('Attempting to solve:', text);
      
      // Remove any non-essential characters
      text = text.trim()
        .replace(/['"]/g, '')
        .replace(/\s+/g, '')
        .replace(/[×x]/g, '*')
        .replace(/[÷]/g, '/');

      // Handle basic arithmetic
      if (/^[\d\s+\-*/().]+$/.test(text)) {
        const result = math.evaluate(text);
        console.log('Basic arithmetic result:', result);
        return result;
      }

      // Handle equations with variables
      if (text.includes('=')) {
        const [leftSide, rightSide] = text.split('=').map(side => side.trim());
        console.log('Equation sides:', { left: leftSide, right: rightSide });
        
        // Move everything to the left side of the equation
        const equation = `${leftSide}-(${rightSide})`;
        console.log('Normalized equation:', equation);
        
        try {
          const parsed = math.parse(equation);
          const variables = parsed.filter(node => node.isSymbolNode).map(node => node.name);
          console.log('Found variables:', variables);

          if (variables.length === 1) {
            const variable = variables[0];
            const solutions = math.solve(equation, variable);
            console.log('Solutions:', solutions);
            return `${variable} = ${solutions.join(' or ')}`;
          } else if (variables.length === 0) {
            const result = math.evaluate(equation);
            console.log('No variables, evaluating as expression:', result);
            return result;
          } else {
            throw new Error(`Found multiple variables: ${variables.join(', ')}`);
          }
        } catch (e) {
          console.error('Math.js error:', e);
          throw new Error(`Could not solve equation: ${e.message}`);
        }
      }

      // If no equals sign, evaluate as expression
      const result = math.evaluate(text);
      console.log('Expression result:', result);
      return result;
    } catch (error) {
      console.error('Error in solveEquation:', error);
      throw new Error(`Could not solve: ${error.message}`);
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

      // Get and preprocess the canvas
      const canvas = signaturePad.current.getCanvas();
      setDebug(prev => prev + '\nPreprocessing image...');
      const processedCanvas = preprocessImage(canvas);

      // Initialize worker
      setDebug(prev => prev + '\nInitializing Tesseract...');
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      setDebug(prev => prev + '\nConfiguring OCR...');
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789+-*/()=xyz^.',
        tessedit_pageseg_mode: '7',
        preserve_interword_spaces: '0',
        tessedit_ocr_engine_mode: '2',
        tessjs_create_pdf: '0',
        tessjs_create_hocr: '0',
      });

      setDebug(prev => prev + '\nPerforming OCR...');
      const { data: { text, confidence } } = await worker.recognize(processedCanvas);
      await worker.terminate();

      setDebug(prev => prev + `\nRecognized text: "${text}" (confidence: ${confidence}%)`);

      if (!text.trim()) {
        throw new Error('No text was recognized. Please write more clearly.');
      }

      // Clean up the recognized text
      let cleanedText = text
        .replace(/\s+/g, '')
        .replace(/[×x]/g, '*')
        .replace(/[÷]/g, '/')
        .replace(/(\d)([a-z])/gi, '$1*$2')
        .replace(/([a-z])(\d)/gi, '$1*$2')
        .replace(/\^(\d+)/g, '^($1)')
        .replace(/([a-z])\(/, '$1*(')
        .replace(/\)([a-z])/, ')*$1')
        .replace(/['"]/g, '')
        .replace(/[[\]]/g, '')
        .replace(/[oO]/g, '0')
        .replace(/[lI]/g, '1')
        .replace(/[S]/g, '5')
        .replace(/[B]/g, '8')
        .replace(/[Z]/g, '2')
        .replace(/[Tt]/g, '+')
        .replace(/[Ee]q/gi, '=');

      setDebug(prev => prev + `\nCleaned text: "${cleanedText}"`);
      setEquation(cleanedText);

      const result = solveEquation(cleanedText);
      setDebug(prev => prev + `\nSolution: ${result}`);
      setSolution(result.toString());
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
          <div className="bg-red-900/50 rounded-lg border border-red-800 p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {equation && (
          <div className="bg-neutral-900/50 rounded-lg border border-neutral-800 p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Recognized Equation</h2>
            <div 
              className="text-lg flex justify-center text-neutral-200"
              dangerouslySetInnerHTML={renderMath(equation)}
            />
          </div>
        )}

        {solution && (
          <div className="bg-neutral-900/50 rounded-lg border border-neutral-800 p-6">
            <h2 className="text-xl font-medium mb-4">Solution</h2>
            <div 
              className="text-lg flex justify-center text-neutral-200"
              dangerouslySetInnerHTML={renderMath(solution)}
            />
          </div>
        )}

        {debug && (
          <div className="mt-8 p-4 bg-neutral-900/30 rounded-lg border border-neutral-800">
            <pre className="text-xs text-neutral-500 whitespace-pre-wrap">{debug}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 