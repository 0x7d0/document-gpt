import { useState } from "react";
import { analyzeDocument } from "../lib/openai";
import { checkGoogleCloudVisionAPIConnection } from "../lib/ocr";

const DocumentAnalysis = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [googleCloudVisionAPIStatus, setGoogleCloudVisionAPIStatus] = useState("");
  const [openAPIStatus, setOpenAPIStatus] = useState("");

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setStatus("Uploading file...");
    setProgress(25);
    const fileBuffer = await file.arrayBuffer();

    try {
      setStatus("Extracting text from PDF...");
      setProgress(50);
      const response = await fetch("/api/extractText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBuffer: Buffer.from(fileBuffer).toString("base64") }),
      });

      if (response.ok) {
        const { text } = await response.json();
        const fullPrompt = `${prompt} ${text}`;

        setStatus("Analyzing document with OpenAI...");
        setProgress(75);
        const result = await analyzeDocument(fullPrompt);
        setAnalysisResult(result);

        setStatus("Analysis complete");
        setProgress(100);
      } else {
        const { error } = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleCloudVisionAPIConnectionCheck = async () => {
    try {
      setStatus("Checking connection to Google Cloud Vision API...");
      const response = await fetch("/api/ocr");
      const result = await response.json();
      if (response.ok) {
        setGoogleCloudVisionAPIStatus("OK");
      } else {
        console.error(result.error);
        setGoogleCloudVisionAPIStatus("Failed");
      }
    } catch (error) {
      console.error(error);
      setGoogleCloudVisionAPIStatus("Failed");
    }
  };
  

  const handleOpenAPIConnectionCheck = async () => {
    try {
      setStatus("Checking connection to OpenAPI...");
      // You can add the code to check the OpenAPI connection status here
      setOpenAPIStatus("OK");
    } catch (error) {
      console.error(error);
      setOpenAPIStatus("Failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border rounded-md shadow-lg">
        <h1 className="text-3xl font-bold text-center">Document Analysis</h1>
        <div className="flex flex-col items-center">
          <label className="w-full text-center cursor-pointer bg-blue-500 text-white rounded-md px-4 py-2" htmlFor="upload">
            {file ? file.name : "Select a PDF file"}
          </label>
          <input
            id="upload"
            className="hidden"
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </div>
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt:</label>
          <input
            id="prompt"
            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button
          className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleSubmit}
        >
          Analyze Document
        </button>
        {status && (
          <div className="text-center">
            <p className="mt-2">{status}</p>
            <div className="w-full h-2 bg-gray-300 mt-2 rounded-md">
              <div
                className="h-full bg-blue-500 rounded-md"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        <div className="mt-4">
          <label htmlFor="logs" className="block text-sm font-medium text-gray-700">
            Runtime Logs:
          </label>
          <textarea
            id="logs"
            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows="4"
            value={logs}
            readOnly
          />
        </div>
        <div className="flex justify-between">
          <button
            className="py-2 px-4 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={handleGoogleCloudVisionAPIConnectionCheck}
          >
            Check Google Cloud Vision API Connection
          </button>
          <p className="text-sm font-medium text-gray-700">{googleCloudVisionAPIStatus}</p>
        </div>
        <div className="flex justify-between">
          <button
            className="py-2 px-4 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={handleOpenAPIConnectionCheck}
          >
            Check OpenAPI Connection
          </button>
          <p className="text-sm font-medium text-gray-700">{openAPIStatus}</p>
        </div>
        {analysisResult && (
          <div className="mt-4">
            <label htmlFor="analysis-result" className="block text-sm font-medium text-gray-700">
              Analysis Result:
            </label>
            <textarea
              id="analysis-result"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows="4"
              value={analysisResult}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysis;
