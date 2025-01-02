import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FilterPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const image = location.state?.image;
  const [loading, setLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [isResizeActive, setIsResizeActive] = useState(false); // State untuk melacak filter Resize
  const [error, setError] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [resizePercentage, setResizePercentage] = useState(50); // Default nilai slider

  const handleBack = () => {
    navigate("/");
  };

  const handleApplyFilter = async (filterName: string) => {
    setLoading(true);
    setError(null);
    setCurrentFilter(filterName);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then((res) => res.blob());
      formData.append("image", blob, "uploaded_image.jpg");

      let endpoint = "";
      if (filterName === "Grayscale") {
        endpoint = "grayscale";
      } else if (filterName === "Blur Edges") {
        endpoint = "blur_edges";
      } else if (filterName === "Resize") {
        endpoint = "resize";
        formData.append("percentage", resizePercentage.toString()); // Gunakan nilai slider
      }

      const response = await fetch(`https://citra-be-python.vercel.app/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to apply filter. Please try again.");
      }

      const blobResult = await response.blob();
      const resultUrl = URL.createObjectURL(blobResult);

      setFilteredImage(resultUrl); // Simpan gambar yang telah difilter
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
      if (filterName !== "Resize") {
        setIsResizeActive(false); // Slider tertutup untuk filter lain
      }
    }
  };

  const handleResizeClick = () => {
    setIsResizeActive(true); // Aktifkan slider Resize
    setCurrentFilter("Resize");
  };

  const handleSubmit = () => {
    if (filteredImage) {
      navigate("/output", { state: { image: filteredImage } });
    } else {
      setError("No filter applied yet. Please apply a filter first.");
    }
  };

  if (!image) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 bg-gray-300 flex items-center justify-center">
        <div className="w-3/4 h-3/4 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
          <img
            src={filteredImage || image}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>

      <div className="w-96 p-6 bg-white border-l border-gray-200 shadow-md flex flex-col justify-between">
        <div>
          <button
            onClick={handleBack}
            className="flex items-center text-gray-500 hover:text-black mb-4"
          >
            <span>&larr;</span>
            <span className="ml-2">Back</span>
          </button>

          <h2 className="text-xl font-bold mb-6 text-center">Select Filters</h2>

          <div className="space-y-4">
            {/* Tombol Grayscale */}
            <button
              onClick={() => handleApplyFilter("Grayscale")}
              disabled={loading && currentFilter === "Grayscale"}
              className={`w-full py-3 border border-black rounded-lg shadow-md hover:bg-gray-100 ${
                loading && currentFilter === "Grayscale"
                  ? "bg-gray-300 cursor-not-allowed"
                  : ""
              }`}
              style={{ boxShadow: "4px 4px 0px black", position: "relative" }}
            >
              {loading && currentFilter === "Grayscale" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-black border-gray-400 rounded-full animate-spin"></div>
                </div>
              ) : (
                "Grayscale"
              )}
            </button>

            {/* Tombol Blur Edges */}
            <button
              onClick={() => handleApplyFilter("Blur Edges")}
              disabled={loading && currentFilter === "Blur Edges"}
              className={`w-full py-3 border border-black rounded-lg shadow-md hover:bg-gray-100 ${
                loading && currentFilter === "Blur Edges"
                  ? "bg-gray-300 cursor-not-allowed"
                  : ""
              }`}
              style={{ boxShadow: "4px 4px 0px black", position: "relative" }}
            >
              {loading && currentFilter === "Blur Edges" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-black border-gray-400 rounded-full animate-spin"></div>
                </div>
              ) : (
                "Blur Edges"
              )}
            </button>

            {/* Tombol Resize */}
            <button
              onClick={handleResizeClick}
              disabled={loading && currentFilter === "Resize"}
              className={`w-full py-3 border border-black rounded-lg shadow-md hover:bg-gray-100 ${
                loading && currentFilter === "Resize"
                  ? "bg-gray-300 cursor-not-allowed"
                  : ""
              }`}
              style={{ boxShadow: "4px 4px 0px black", position: "relative" }}
            >
              {loading && currentFilter === "Resize" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-black border-gray-400 rounded-full animate-spin"></div>
                </div>
              ) : (
                "Resize"
              )}
            </button>

            {/* Slider Resize */}
            {isResizeActive && (
              <div className="mt-4">
                <label htmlFor="resize-slider" className="block text-gray-700">
                  Resize Percentage: {resizePercentage}%
                </label>
                <input
                  id="resize-slider"
                  type="range"
                  min="1"
                  max="99" 
                  value={resizePercentage}
                  onChange={(e) => setResizePercentage(Number(e.target.value))}
                  className="w-full mt-2"
                />
                <button
                  onClick={() => handleApplyFilter("Resize")}
                  className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {loading && currentFilter === "Resize" ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-white border-gray-400 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "Apply Resize"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!filteredImage}
          className={`w-full py-3 mt-6 bg-gray-200 text-black border border-black rounded-lg hover:bg-gray-300 ${
            !filteredImage ? "cursor-not-allowed opacity-50" : ""
          }`}
          style={{ boxShadow: "4px 4px 0px black" }}
        >
          Submit
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default FilterPage;
