import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface IFilterPageProps {}

const FilterPage: React.FunctionComponent<IFilterPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dataURL } = location.state || {};

  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(
    null
  );

  const [filteredImageURL, setFilteredImageURL] = React.useState<string | null>(
    null
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleBackToHome = () => {
    navigate("/", { state: { reset: true } });
  };

  const handleSelectFilter = (filter: string) => {
    console.log("Selected filter:", filter);
    setSelectedFilter(filter);
    setFilteredImageURL(null);
  };

  const handleApplyFilter = async () => {
    if (!selectedFilter || !dataURL) return;
    console.log("Applied filter:", selectedFilter);
    setIsLoading(true);

    try {
      const blob = await fetch(dataURL).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "uploaded-image.jpg");

      const response = await fetch(`http://127.0.0.1:5000/${selectedFilter}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to apply filter");

      const data = await response.blob();
      const imageUrl = URL.createObjectURL(data);
      setFilteredImageURL(imageUrl);
    } catch (error) {
      console.log("Error applying filter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2  bg-red-100">
        {filteredImageURL ? (
          <img
            src={filteredImageURL}
            alt="Filtered Preview"
            className="w-full h-full object-cover"
          />
        ) : dataURL ? (
          <img
            src={dataURL}
            alt="Filtered Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-center">no image selected!</p>
        )}
      </div>
      <div className="w-1/2 bg-white py-10 px-8">
        <p
          onClick={handleBackToHome}
          className="pb-10 hover:underline cursor-pointer"
        >
          Back
        </p>
        <div className="flex flex-col items-center">
          <div>
            <p className="font-semibold text-4xl pb-8">
              Select your desired filter!
            </p>
          </div>
          <div className="flex flex-col px-10 space-y-6">
            <button
              onClick={() => handleSelectFilter("grayscale")}
              className={`w-80 py-4 rounded-xl duration-200 text-white ${
                selectedFilter === "grayscale"
                  ? "bg-slate-600"
                  : "bg-gray-500 hover:bg-slate-600"
              }`}
            >
              Grayscale
            </button>
            <button
              onClick={() => handleSelectFilter("blur_edges")}
              className={`w-80 py-4 rounded-xl duration-200 text-white ${
                selectedFilter === "blur_edges"
                  ? "bg-slate-600"
                  : "bg-gray-500 hover:bg-slate-600"
              }`}
            >
              Blur Edges
            </button>
          </div>
          <div className="pt-20">
            <button
              onClick={handleApplyFilter}
              disabled={!selectedFilter}
              className={`w-80 py-4 rounded-xl text-white duration-200 ${
                selectedFilter
                  ? "bg-black hover:bg-slate-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
