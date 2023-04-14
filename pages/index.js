import DocumentAnalysis from "../components/DocumentAnalysis";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Legal Document Analyzer</h1>
          <p className="text-xl">
            Upload a scanned PDF of a Polish legal document, and our AI will analyze its content.
          </p>
        </header>
        <DocumentAnalysis />
      </div>
    </div>
  );
}
