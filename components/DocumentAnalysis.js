import { useState } from "react";
import { analyzeDocument } from "../lib/openai";

const DocumentAnalysis = () => {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    const fileBuffer = await uploadedFile.arrayBuffer();

    try {
      const response = await fetch("/api/extractText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBuffer: Buffer.from(fileBuffer).toString("base64") }),
      });

      if (response.ok) {
        const { text } = await response.json();
        const prompt = `Analyze the following Polish legal document and provide a summary: ${text}`;
        const result = await analyzeDocument(prompt);
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
        {analysisResult && (
          <div>
            <h2 className="text-xl font-semibold">Analysis Result:</h2>
            <p>{analysisResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysis;
