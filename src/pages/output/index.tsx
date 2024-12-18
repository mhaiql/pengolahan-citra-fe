import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OutputPage: React.FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const image = location.state?.image; 

  const handleStartAgain = () => {
    navigate("/"); 
  };

  const handleDownload = () => {
    if (image) {
      const link = document.createElement("a");
      link.href = image;
      link.download = "output-image.png";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-xl font-bold mb-6 text-center">Output:</h2>

      <div className="w-3/4 h-96 bg-gray-300 rounded-lg flex items-center justify-center shadow-md">
        {image ? (
          <img
            src={image}
            alt="Output Image"
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <p className="text-gray-500">No Output Image</p>
        )}
      </div>

      <div className="flex space-x-8 mt-6">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 text-gray-600 hover:text-black"
        >
          <span>&#x2B07;</span> <span>Download</span>
        </button>
        <button
          onClick={handleStartAgain}
          className="flex items-center space-x-2 text-gray-600 hover:text-black"
        >
          <span>&#8634;</span> <span>Start Again</span>
        </button>
      </div>
    </div>
  );
};

export default OutputPage;
