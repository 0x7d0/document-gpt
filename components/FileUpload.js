import { useRef } from "react";
import { uploadFile } from "../lib/gcp";

function FileUpload({ onUpload }) {
  const inputRef = useRef();

  const handleFileChange = async (event) => {
    event.preventDefault();

    // Upload the file to Google Cloud Storage
    const file = event.target.files[0];
    const gcsUrl = await uploadFile(file);

    // Invoke the onUpload function with the file URL
    onUpload(gcsUrl);
  };

  return (
    <div className="my-4">
      <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        Upload PDF
      </label>
    </div>
  );
}

export default FileUpload;
