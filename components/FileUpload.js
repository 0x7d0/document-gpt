import { useRef } from "react";

function FileUpload({ onUpload }) {
    const inputRef = useRef();
  
    const handleFileChange = (event) => {
      event.preventDefault();
      onUpload(event.target.files[0]);
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
