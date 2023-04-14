import { useState } from "react";
import FileUpload from "./FileUpload";
import { getTextFromPDF } from "../lib/ocr";
import { analyzeDocument } from "../lib/openai";

function DocumentAnalysis() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [googleAPIKey, setGoogleAPIKey] = useState("");
  const [openAIAPIKey, setOpenAIAPIKey] = useState("");
  const [message, setMessage] = useState("");

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    const fileBuffer = await uploadedFile.arrayBuffer();
    const text = await getTextFromPDF(Buffer.from(fileBuffer));

    const prompt = `Analyze the following Polish legal document and provide a summary: ${text}`;
    const result = await analyzeDocument(prompt);
    setAnalysisResult(result);
  };

  const handleGoogleAPIKeyChange = (event) => {
    setGoogleAPIKey(event.target.value);
  };

  const handleOpenAIAPIKeyChange = (event) => {
    setOpenAIAPIKey(event.target.value);
  };

  const handleSaveAPIKeys = () => {
    localStorage.setItem("googleAPIKey", googleAPIKey);
    localStorage.setItem("openAIAPIKey", openAIAPIKey);
    setMessage("API keys saved.");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Upload and Analyze Legal Documents</h1>
      <form className="mb-8">
        <div className="mb-4">
          <label htmlFor="google-api-key" className="block text-sm font-bold mb-2">
            Google API Key:
          </label>
          <input
            type="text"
            id="google-api-key"
            value={googleAPIKey}
            onChange={handleGoogleAPIKeyChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="openai-api-key" className="block text-sm font-bold mb-2">
            OpenAI API Key:
          </label>
          <input
            type="text"
            id="openai-api-key"
            value={openAIAPIKey}
            onChange={handleOpenAIAPIKeyChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="button"
          onClick={handleSaveAPIKeys}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save API Keys
        </button>
        {message && (
          <p className="text-green-500 mt-4">
            {message}
          </p>
        )}
      </form>
      <FileUpload onUpload={handleFileUpload} />
      {analysisResult && (
        <div className="bg-gray-100 rounded p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
          <p className="text-lg">{analysisResult}</p>
        </div>
      )}
    </div>
  );
}

export default DocumentAnalysis;
