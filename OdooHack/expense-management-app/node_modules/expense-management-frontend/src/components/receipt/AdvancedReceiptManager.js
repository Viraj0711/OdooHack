import React, { useState, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';

const AdvancedReceiptManager = ({ onReceiptProcessed, onReceiptValidated }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const fileInputRef = useRef(null);
  const cameraRef = useRef(null);
  const [isCameraMode, setIsCameraMode] = useState(false);

  // OCR Processing Component
  const OCRProcessor = ({ file, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [ocrText, setOcrText] = useState('');
    const [extractedData, setExtractedData] = useState({});

    const processOCR = useCallback(async (imageFile) => {
      setIsProcessing(true);
      setProgress(0);

      try {
        const result = await Tesseract.recognize(imageFile, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        });

        const text = result.data.text;
        setOcrText(text);

        // Extract structured data from OCR text
        const extractedInfo = extractReceiptData(text);
        setExtractedData(extractedInfo);

        if (onComplete) {
          onComplete({ text, extractedData: extractedInfo });
        }

        setIsProcessing(false);
      } catch (error) {
        console.error('OCR Error:', error);
        setIsProcessing(false);
      }
    }, [onComplete]);

    const extractReceiptData = (text) => {
      const data = {};
      
      // Extract amount (looking for patterns like ₹123.45, Rs. 123.45, etc.)
      const amountRegex = /(?:₹|Rs\.?\s*|INR\s*|Total[:\s]*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi;
      const amounts = text.match(amountRegex);
      if (amounts) {
        const numericAmounts = amounts.map(amt => 
          parseFloat(amt.replace(/[₹Rs\.,\s]/g, ''))
        ).filter(amt => amt > 0);
        data.amount = Math.max(...numericAmounts);
      }

      // Extract date (DD/MM/YYYY, DD-MM-YYYY, etc.)
      const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g;
      const dates = text.match(dateRegex);
      if (dates) {
        data.date = dates[0];
      }

      // Extract vendor/merchant name (usually at the top)
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        data.vendorName = lines[0].trim();
      }

      // Extract GST/Tax numbers
      const gstRegex = /GST[:\s]*([A-Z0-9]{15})/gi;
      const gstMatch = text.match(gstRegex);
      if (gstMatch) {
        data.gstNumber = gstMatch[0];
      }

      // Extract address (lines containing common address keywords)
      const addressKeywords = ['road', 'street', 'avenue', 'city', 'state', 'pin', 'pincode'];
      const addressLines = lines.filter(line => 
        addressKeywords.some(keyword => 
          line.toLowerCase().includes(keyword)
        )
      );
      if (addressLines.length > 0) {
        data.vendorAddress = addressLines.join(', ');
      }

      // Extract line items
      const itemRegex = /(.+?)\s+(\d+(?:\.\d{2})?)/g;
      const items = [];
      let match;
      while ((match = itemRegex.exec(text)) !== null) {
        if (match[1].length > 3 && match[1].length < 50) {
          items.push({
            description: match[1].trim(),
            amount: parseFloat(match[2])
          });
        }
      }
      if (items.length > 0) {
        data.lineItems = items;
      }

      return data;
    };

    React.useEffect(() => {
      if (file) {
        processOCR(file);
      }
    }, [file, processOCR]);

    return (
      <div className="space-y-4">
        {isProcessing && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Processing Receipt with OCR...</p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-700 mt-1">{progress}% complete</p>
              </div>
            </div>
          </div>
        )}

        {extractedData && Object.keys(extractedData).length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-3">Extracted Information</h4>
            <div className="space-y-2">
              {extractedData.amount && (
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Amount:</span>
                  <span className="text-sm font-medium">₹{extractedData.amount}</span>
                </div>
              )}
              {extractedData.date && (
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Date:</span>
                  <span className="text-sm font-medium">{extractedData.date}</span>
                </div>
              )}
              {extractedData.vendorName && (
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Vendor:</span>
                  <span className="text-sm font-medium">{extractedData.vendorName}</span>
                </div>
              )}
              {extractedData.gstNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">GST Number:</span>
                  <span className="text-sm font-medium">{extractedData.gstNumber}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onReceiptProcessed(extractedData)}
              className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Auto-Fill Expense Form
            </button>
          </div>
        )}
      </div>
    );
  };

  // Receipt Validation Component
  const ReceiptValidator = ({ receiptFile, receiptData }) => {
    const [validationResults, setValidationResults] = useState([]);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [validationScore, setValidationScore] = useState(0);

    React.useEffect(() => {
      if (receiptFile && receiptData) {
        validateReceipt();
      }
    }, [receiptFile, receiptData]);

    const validateReceipt = async () => {
      const validations = [];
      let score = 0;

      // Check if receipt has required information
      if (receiptData.amount && receiptData.amount > 0) {
        validations.push({ type: 'amount', status: 'pass', message: 'Amount extracted successfully' });
        score += 25;
      } else {
        validations.push({ type: 'amount', status: 'fail', message: 'Amount not found or invalid' });
      }

      if (receiptData.date) {
        validations.push({ type: 'date', status: 'pass', message: 'Date extracted successfully' });
        score += 25;
      } else {
        validations.push({ type: 'date', status: 'fail', message: 'Date not found' });
      }

      if (receiptData.vendorName) {
        validations.push({ type: 'vendor', status: 'pass', message: 'Vendor name extracted' });
        score += 25;
      } else {
        validations.push({ type: 'vendor', status: 'warning', message: 'Vendor name not clearly visible' });
        score += 10;
      }

      // Check image quality
      const imageQuality = await checkImageQuality(receiptFile);
      if (imageQuality.score > 0.7) {
        validations.push({ type: 'quality', status: 'pass', message: 'Good image quality' });
        score += 25;
      } else {
        validations.push({ type: 'quality', status: 'warning', message: 'Image quality could be better' });
        score += 10;
      }

      // Check for duplicates
      const duplicateCheck = await checkForDuplicates(receiptData);
      if (duplicateCheck.isDuplicate) {
        validations.push({ 
          type: 'duplicate', 
          status: 'fail', 
          message: `Potential duplicate of expense #${duplicateCheck.expenseId}` 
        });
        setIsDuplicate(true);
      } else {
        validations.push({ type: 'duplicate', status: 'pass', message: 'No duplicates found' });
        score += 0; // No points for this, just validation
      }

      setValidationResults(validations);
      setValidationScore(score);

      if (onReceiptValidated) {
        onReceiptValidated({ validations, score, isDuplicate });
      }
    };

    const checkImageQuality = async (file) => {
      // Simulate image quality check
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ score: Math.random() * 0.4 + 0.6 }); // Random score between 0.6-1.0
        }, 500);
      });
    };

    const checkForDuplicates = async (data) => {
      // Simulate duplicate check against existing receipts
      return new Promise(resolve => {
        setTimeout(() => {
          const isDuplicate = Math.random() < 0.1; // 10% chance of duplicate
          resolve({ 
            isDuplicate, 
            expenseId: isDuplicate ? 'EXP-' + Math.floor(Math.random() * 1000) : null 
          });
        }, 1000);
      });
    };

    const getValidationColor = (status) => {
      switch (status) {
        case 'pass': return 'text-green-600';
        case 'warning': return 'text-yellow-600';
        case 'fail': return 'text-red-600';
        default: return 'text-gray-600';
      }
    };

    const getValidationIcon = (status) => {
      switch (status) {
        case 'pass':
          return (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case 'warning':
          return (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        case 'fail':
          return (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Receipt Validation</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Score:</span>
            <span className={`text-sm font-semibold ${
              validationScore >= 75 ? 'text-green-600' : 
              validationScore >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {validationScore}/100
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {validationResults.map((result, index) => (
            <div key={index} className="flex items-center space-x-3">
              {getValidationIcon(result.status)}
              <div className="flex-1">
                <p className={`text-sm ${getValidationColor(result.status)}`}>
                  {result.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isDuplicate && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">Duplicate Receipt Detected</h4>
                <p className="text-xs text-red-700 mt-1">
                  This receipt appears similar to a previously submitted expense. Please verify before proceeding.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mobile Camera Capture Component
  const MobileCameraCapture = ({ onCapture }) => {
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', // Use back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please use file upload instead.');
      }
    };

    const captureImage = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          const file = new File([blob], 'receipt-capture.jpg', { type: 'image/jpeg' });
          onCapture(file);
          stopCamera();
        }, 'image/jpeg', 0.9);
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsCameraMode(false);
    };

    React.useEffect(() => {
      if (isCameraMode) {
        startCamera();
      }
      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }, [isCameraMode]);

    if (!isCameraMode) {
      return (
        <button
          onClick={() => setIsCameraMode(true)}
          className="w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          📱 Capture with Camera
        </button>
      );
    }

    return (
      <div className="space-y-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
          style={{ maxHeight: '300px' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="flex space-x-3">
          <button
            onClick={captureImage}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            📷 Capture Receipt
          </button>
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setReceiptData(null);
  };

  const handleReceiptProcessed = (data) => {
    setReceiptData(data);
    if (onReceiptProcessed) {
      onReceiptProcessed(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Receipt Management</h3>
        
        {!selectedFile && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Upload Receipt Image
                  </button>
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500">or</div>

            <MobileCameraCapture onCapture={handleFileSelect} />
          </div>
        )}

        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Processing: {selectedFile.name}</h4>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setReceiptData(null);
                  setOcrResult(null);
                }}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Receipt"
              className="max-w-full h-auto rounded-lg shadow-md"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
      </div>

      {selectedFile && (
        <OCRProcessor file={selectedFile} onComplete={handleReceiptProcessed} />
      )}

      {selectedFile && receiptData && (
        <ReceiptValidator receiptFile={selectedFile} receiptData={receiptData} />
      )}
    </div>
  );
};

export default AdvancedReceiptManager;