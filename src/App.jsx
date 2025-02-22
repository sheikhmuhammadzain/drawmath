import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { createWorker } from 'tesseract.js';
import * as math from 'mathjs';
import 'katex/dist/katex.min.css';
import Katex from 'katex';
import LandingPage from './LandingPage';

function EquationSolver() {
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const signaturePad = useRef(null);
  const [showGuideLines, setShowGuideLines] = useState(true);

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
    ctx.strokeStyle = '#e5e7eb';
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
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Enhance contrast and convert to binary
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      const avg = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
      histogram[avg]++;
    }

    // Calculate optimal threshold using Otsu's method
    let totalPixels = canvas.width * canvas.height;
    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i];
    }

    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let maxVariance = 0;
    let threshold = 0;

    for (let i = 0; i < 256; i++) {
      wB += histogram[i];
      if (wB === 0) continue;
      wF = totalPixels - wB;
      if (wF === 0) break;

      sumB += i * histogram[i];
      let mB = sumB / wB;
      let mF = (sum - sumB) / wF;
      let variance = wB * wF * (mB - mF) * (mB - mF);
      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = i;
      }
    }

    // Apply threshold and enhance edges
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const color = avg > threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = color;
    }

    // Create a new canvas with 3x size for better OCR
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width * 3;
    scaledCanvas.height = canvas.height * 3;
    const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });

    // Fill with white background
    scaledCtx.fillStyle = 'white';
    scaledCtx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height);

    // Draw the original image scaled up with smoothing
    scaledCtx.imageSmoothingEnabled = true;
    scaledCtx.imageSmoothingQuality = 'high';
    
    // First put the processed image data
    ctx.putImageData(imageData, 0, 0);
    
    // Then scale it up
    scaledCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);

    return scaledCanvas;
  };

  const processDrawing = async () => {
    setIsProcessing(true);
    try {
      if (!signaturePad.current) {
        alert('Drawing component not ready!');
        return;
      }

      if (signaturePad.current.isEmpty()) {
        alert('Please draw something first!');
        return;
      }

      // Get and preprocess the canvas
      const canvas = signaturePad.current.getCanvas();
      const processedCanvas = preprocessImage(canvas);

      // Process with Tesseract with improved configuration
      const worker = await createWorker();
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789+-*/()=xyz^√∫∑πe.',
        tessedit_pageseg_mode: '7', // Treat the image as a single text line
        preserve_interword_spaces: '0',
        tessjs_create_pdf: '0',
        tessjs_create_hocr: '0',
        textord_heavy_nr: '1',
        textord_min_linesize: '3',
        tessedit_do_invert: '0',
        tessedit_fix_fuzzy_spaces: '1',
        debug_file: '0',
        resolve_builder_words: '1',
        textord_really_quick: '0',
        textord_force_make_prop_words: '1',
      });

      const { data } = await worker.recognize(processedCanvas);
      await worker.terminate();

      // Clean up and format the recognized text
      let cleanedText = data.text
        .replace(/\s+/g, '')
        .replace(/[×x]/g, '*')  // Replace × or x with *
        .replace(/[÷]/g, '/')   // Replace ÷ with /
        .replace(/(\d)([a-z])/gi, '$1*$2')  // Add * between number and variable
        .replace(/([a-z])(\d)/gi, '$1*$2')  // Add * between variable and number
        .replace(/\^(\d+)/g, '^($1)')      // Wrap exponents in parentheses
        .replace(/([a-z])\(/, '$1*(')      // Add * before parentheses
        .replace(/\)([a-z])/, ')*$1')      // Add * after parentheses
        .replace(/['"]/g, '')              // Remove any quotes
        .replace(/[[\]]/g, '')             // Remove square brackets
        .replace(/[oO]/g, '0')             // Replace o/O with 0
        .replace(/[lI]/g, '1')             // Replace l/I with 1
        .replace(/[S]/g, '5')              // Replace S with 5
        .replace(/[B]/g, '8')              // Replace B with 8
        .replace(/[Z]/g, '2');             // Replace Z with 2

      setEquation(cleanedText);

      // Try to solve the equation
      try {
        const result = math.evaluate(cleanedText);
        setSolution(result.toString());
      } catch {
        setSolution('Could not solve the equation. Please try again.');
      }
    } catch (error) {
      console.error('Error processing drawing:', error);
      setSolution('An error occurred while processing. Please try again.');
    }
    setIsProcessing(false);
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
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Math Equation Solver</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="border rounded-lg mb-4 relative" style={{ height: '400px', background: 'white' }}>
            <SignatureCanvas
              ref={signaturePad}
              canvasProps={{
                className: 'signature-canvas',
                style: {
                  width: '100%',
                  height: '100%',
                  background: 'white',
                }
              }}
              backgroundColor="rgb(255,255,255)"
              penColor="black"
              throttle={0}
              minWidth={4}
              maxWidth={5}
              onEnd={() => {
                if (signaturePad.current) {
                  const canvas = signaturePad.current.getCanvas();
                  const ctx = canvas.getContext('2d', { willReadFrequently: true });
                  drawGuideLines(ctx, canvas.width, canvas.height);
                }
              }}
            />
            <div className="absolute top-0 left-0 right-0 p-2 text-center text-gray-500 text-sm">
              Write your equation clearly between the guide lines, keeping symbols well-separated
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={processDrawing}
              disabled={isProcessing}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Solve Equation'}
            </button>
            <button
              onClick={clearDrawing}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>

        {equation && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Recognized Equation:</h2>
            <div 
              className="text-lg mb-4 flex justify-center"
              dangerouslySetInnerHTML={renderMath(equation)}
            />
          </div>
        )}

        {solution && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Solution:</h2>
            <div 
              className="text-lg flex justify-center"
              dangerouslySetInnerHTML={renderMath(solution)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/solve" element={<EquationSolver />} />
      </Routes>
    </Router>
  );
}

export default App;