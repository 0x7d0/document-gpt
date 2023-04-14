import { useState } from "react";
import { analyzeDocument } from "../lib/openai";

const DocumentAnalysis = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const fileBuffer = await file.arrayBuffer();

    try {
      const response = await fetch("/api/extractText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBuffer: Buffer.from(fileBuffer).toString("base64") }),
      });

      if (response.ok) {
        const { text } = await response.json();
        const fullPrompt = `${prompt} ${text}`;
        const result = await analyzeDocument(fullPrompt);
        setAnalysisResult(result);
      } else {
        const { error } = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
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
        {analysisResult && (
          <div>
            <h2 className="text-xl font-semibold">Analysis Result:</h2>
            <textarea
              className="w-full h-32 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
