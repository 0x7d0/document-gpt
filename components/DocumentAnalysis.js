import { useState } from "react";
import { analyzeDocument } from "../lib/openai";

const DocumentAnalysis = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    logMessage("Uploading file...");
    setProgress(25);
    const fileBuffer = await file.arrayBuffer();

    try {
      logMessage("Extracting text from PDF...");
      setProgress(50);
      const response = await fetch("/api/extractText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBuffer: Buffer.from(fileBuffer).toString("base64") }),
      });

      if (response.ok) {
        const { text } = await response.json();
        const fullPrompt = `${prompt} ${text}`;

        logMessage("Analyzing document with OpenAI...");
        setProgress(75);
        const result = await analyzeDocument(fullPrompt);
        setAnalysisResult(result);

        logMessage("Analysis complete");
        setProgress(100);
      } else {
        const { error } = await response.json();
        logMessage(`Error: ${error}`);
      }
    } catch (error) {
      logMessage(`Error: ${error}`);
    }
  };

  const logMessage = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-blue-700">Document Analysis</h1>
        <div className="flex flex-col items-center">
          <label className="w-full text-center cursor-pointer bg-blue-700 text-white rounded-md px-4 py-2" htmlFor="upload">
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
            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button
          className="w-full py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          onClick={handleSubmit}
        >
          Analyze Document
        </button>
        <div className="mt-4">
        <label htmlFor="logs" className="block text-sm font-medium text-gray-700">Logs:</label>
          <textarea
            id="logs"
            className="w-full h-32 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
            value={logs.join("\n")}
            readOnly
          />
        </div>
        {analysisResult && (
          <div className="mt-4">
            <label htmlFor="analysisResult" className="block text-sm font-medium text-gray-700">Analysis Result:</label>
            <textarea
              id="analysisResult"
              className="w-full h-32 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
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

