import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";

const FilterPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const image = location.state?.image;
  const [loading, setLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);

  const handleBack = () => {
    navigate("/");
  };

  const handleApplyFilter = async (filterName: string) => {
    setLoading(true);
    setError(null);
    setCurrentFilter(filterName);
    console.log("Selected Filter:", filterName);

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
        formData.append("percentage", "50");
      }

      const response = await fetch(
        `https://citra-be-python.vercel.app/${endpoint}`,
        {
          method: "POST",
          body: formData,
        }
      );

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
      setCurrentFilter(null);
    }
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
            className="flex items-center text-gray-500 hover:text-black hover:underline mb-4"
          >
            <span className="ml-2 flex items-center space-x-1">
              <FaAngleLeft className="h-5" />
              <p className="text-lg font-semibold">Back</p>
            </span>
          </button>

          <h2 className="text-xl font-bold mb-6 text-center">Select Filters</h2>

          <div className="space-y-4">
            {["Grayscale", "Blur Edges", "Resize"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleApplyFilter(filter)}
                disabled={loading && currentFilter === filter}
                className={`w-full py-3 border border-black rounded-lg shadow-md hover:bg-gray-100 ${
                  loading && currentFilter === filter
                    ? "bg-gray-300 cursor-not-allowed"
                    : ""
                }`}
                style={{
                  boxShadow: "4px 4px 0px black",
                  position: "relative",
                }}
              >
                {loading && currentFilter === filter ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-t-black border-gray-400 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  filter
                )}
              </button>
            ))}
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
