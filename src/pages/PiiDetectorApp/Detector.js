import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import axios from 'axios';
import './Detector.css'; // Import the CSS for styling

// Setting the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Patterns for PII detection
const patterns = {
  aadhaar: /\b\d{4}\s\d{4}\s\d{4}\b/g,
  pan: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
  phone: /\b\d{10}\b/g,
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi,
  creditCard: /\b(?:\d[ -]*?){13,19}\b/g, // Matches most credit card numbers
  driverLicense: /\b[A-Z]{1,2}\d{1,6}\b/g // Example pattern; adjust based on specific formats
};

// Function to detect PII in text using regex
const detectPIIWithRegex = (text) => {
  let results = [];
  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    if (matches) {
      results.push({ type: key, matches });
    }
  }
  return results;
};

// Function to redact PII in text
const redactPII = (text, matches) => {
  matches.forEach(match => {
    const regex = new RegExp(match, 'g');
    text = text.replace(regex, '<b>[REDACTED]</b>');
  });
  return text;
};

// Function to extract text from PDF files using pdfjs-dist
const extractTextFromPDF = async (pdfFile) => {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let textContent = '';

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const textContentObj = await page.getTextContent();
    const strings = textContentObj.items.map(item => item.str);
    textContent += strings.join(' ');
  }
  return textContent;
};

// Function to preprocess image (e.g., convert to grayscale)
const preprocessImage = (image) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  img.src = URL.createObjectURL(image);
  
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Convert to grayscale
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = avg; // Red
        imageData.data[i + 1] = avg; // Green
        imageData.data[i + 2] = avg; // Blue
      }
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => resolve(blob));
    };
  });
};

// Function to clean extracted text
const cleanText = (text) => {
  return text.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with a single space and trim
};

// Function to extract text from image files using Tesseract
const extractTextFromImage = async (imageFile) => {
  // Preprocess the image
  const preprocessedImageBlob = await preprocessImage(imageFile);
  
  // Use Tesseract to recognize text from the preprocessed image
  const { data: { text } } = await Tesseract.recognize(preprocessedImageBlob, 'eng');
  
  // Clean the extracted text
  return cleanText(text);
};

// Function to detect PII using a machine learning model API
const detectPIIWithMLModel = async (text) => {
  try {
    // Example URL; adjust according to your actual API endpoint
    const url = 'https://language.googleapis.com/v1/documents:analyzeEntities';
    
    const response = await axios.post(url, { text }, {
      headers: {
        'Content-Type': 'application/json',
        // Add other necessary headers like API keys if needed
      }
    });

    if (response.data && response.data.piiEntities) {
      return response.data.piiEntities.map(entity => ({
        type: entity.Type,
        matches: entity.Text
      }));
    } else {
      console.warn('No PII entities found in the response.');
      return [];
    }
  } catch (error) {
    console.error('Error detecting PII with ML model:', error.response ? error.response.data : error.message);
    return [];
  }
};

// FileUpload Component
const FileUpload = ({ onUpload }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleFileUpload = () => {
    onUpload(files);
  };

  return (
    <div className="file-upload">
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

// EditableText Component for users to select and redact text manually
const EditableText = ({ text, onSelect }) => {
  const handleTextSelection = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      onSelect(selectedText);
    }
  };

  return (
    <div className="editable-text" onMouseUp={handleTextSelection}>
      <pre>{text}</pre>
    </div>
  );
};

// ResultsDisplay Component
const ResultsDisplay = ({ results, onConfirm, onSelectRedaction }) => {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return <div className="results-container">No results to display</div>;
  }

  // Show confirmation pop-up with redacted data upload
  const handleConfirmation = async (result) => {
    try {
      // Example API endpoint; adjust according to your actual endpoint
      const endpoint = 'https://your-aws-api-endpoint.com/upload';

      const response = await axios.post(endpoint, { data: result.redactedText }, {
        headers: {
          'Content-Type': 'application/json',
          // Add other necessary headers like API keys if needed
        }
      });

      if (response.status === 200) {
        alert('The Document is uploaded successfully!');
      } else {
        alert('An error occurred while uploading the document.');
      }
    } catch (error) {
      console.error('Error uploading document:', error.response ? error.response.data : error.message);
      alert('An error occurred while uploading the document.');
    }
  };

  return (
    <div className="results-container">
      {results.map((result, index) => (
        <div key={index} className="result-card">
          <h4>Document {index + 1}</h4>
          <div className="text-section">
            <h5>Extracted Text:</h5>
            <EditableText text={result.text} onSelect={(selectedText) => onSelectRedaction(result, selectedText)} />
          </div>
          <div className="pii-section">
            <h5>Detected PII (Regex):</h5>
            <ul>
              {result.piiMatchesRegex.map((pii, i) => (
                <li key={i}><strong>{pii.type}:</strong> {pii.matches.join(', ')}</li>
              ))}
            </ul>
            <h5>Detected PII (ML Model):</h5>
            <ul>
              {result.piiMatchesML.map((pii, i) => (
                <li key={i}><strong>{pii.type}:</strong> {pii.matches.join(', ')}</li>
              ))}
            </ul>
          </div>
          <div className="redacted-section">
            <h5>Redacted Text:</h5>
            <pre dangerouslySetInnerHTML={{ __html: result.redactedText }} />
          </div>
          <button onClick={() => handleConfirmation(result)}>Confirm</button>
        </div>
      ))}
    </div>
  );
};

// Main Application Component
const PiiDetectorApp = () => {
  const [results, setResults] = useState([]);
  
  const handleFileUpload = async (files) => {
    let detectedResults = [];

    for (let file of files) {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        text = await extractTextFromImage(file);
      }

      const piiMatchesRegex = detectPIIWithRegex(text);
      const piiMatchesML = await detectPIIWithMLModel(text);
      const redactedText = redactPII(text, [
        ...piiMatchesRegex.flatMap(pii => pii.matches), 
        ...piiMatchesML.flatMap(pii => pii.matches)
      ]);
      detectedResults.push({ file, text, piiMatchesRegex, piiMatchesML, redactedText });
    }

    setResults(detectedResults);
  };

  const handleSelectRedaction = (result, selectedText) => {
    const updatedResults = results.map(r => {
      if (r === result) {
        const redactedText = redactPII(r.text, [selectedText]);
        return { ...r, redactedText };
      }
      return r;
    });
    setResults(updatedResults);
  };

  return (
    <div className="app-container">
      <h1>PII Detector</h1>
      <FileUpload onUpload={handleFileUpload} />
      <ResultsDisplay results={results} onConfirm={handleFileUpload} onSelectRedaction={handleSelectRedaction} />
    </div>
  );
}

export default PiiDetectorApp;