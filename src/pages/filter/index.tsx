import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { FiImage } from "react-icons/fi";
import { Popover } from "antd";
import { MdInfoOutline } from "react-icons/md";

const FilterPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState(location.state?.image);
  const [loading, setLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [isResizeActive, setIsResizeActive] = useState(false); // State untuk melacak filter Resize
  const [error, setError] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [resizePercentage, setResizePercentage] = useState(50); // Default nilai slider
  const [isShowModal, setIsShowModal] = useState(false);
  const [sizeBefore, setSizeBefore] = useState(0);
  const [sizeAfter, setSizeAfter] = useState(0);

  const handleBack = () => {
    navigate("/");
  };

  const handleDownload = () => {
    if (filteredImage) {
      const link = document.createElement("a");
      link.href = filteredImage;
      link.download = "output-image.jpg";
      link.click();
    }
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryStr = reader.result as string;
        setImage(binaryStr);
        setFilteredImage(null);
        setIsShowModal(false);
        setSizeAfter(0);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
      if (filterName === "Resize") {
        setSizeBefore(blob.size);
        setSizeAfter(blobResult.size);
        console.log(blobResult.size);
      }

      console.log("blob image:", blobResult);

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
    setSizeAfter(0);
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

  const contentGrayscale = (
    <div className="w-64 h-full">
      <p>
        Grayscale adalah teknik yang mengubah gambar berwarna menjadi
        hitam-putih dengan berbagai gradasi abu-abu. Proses ini bekerja dengan
        mengambil rata-rata dari warna merah, hijau, dan biru (RGB) untuk
        menghasilkan warna abu-abu yang sesuai.
      </p>
    </div>
  );

  const contentBlur = (
    <div className="w-96 h-full">
      <p>
        Gaussian blur adalah teknik dalam pengolahan citra yang digunakan untuk
        menghaluskan gambar dengan cara mengurangi tingkat detail dan meratakan
        perbedaan intensitas antar piksel. Teknik ini bekerja dengan menerapkan
        filter Gaussian, yang menggunakan fungsi Gaussian untuk memberikan bobot
        pada piksel di sekitarnya berdasarkan jaraknya dari piksel pusat. Piksel
        yang lebih dekat mendapatkan bobot lebih besar, sedangkan piksel yang
        lebih jauh mendapatkan bobot lebih kecil, sehingga menghasilkan efek
        kabur yang alami.
      </p>
    </div>
  );

  const contentResize = (
    <div className="w-64 h-full">
      <p>
        Filter resize adalah mengubah ukuran gambar resize bekerja dengan
        mengubah dimensi gambar, baik itu memperbesar atau memperkecil. Saat
        gambar diperbesar, piksel yang ada akan dihitung ulang dan diperluas
        menggunakan interpolasi untuk menjaga gambar tetap tajam dan tidak
        pecah. Sementara ketika gambar diperkecil, beberapa piksel akan digabung
        untuk menghasilkan gambar yang lebih kecil tanpa kehilangan terlalu
        banyak detail.
      </p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {isShowModal ? (
        <div className="fixed w-screen h-screen bg-gray-300 bg-opacity-70 z-10 flex justify-center items-center">
          <div
            className="fixed w-screen h-screen z-10 flex justify-center items-center"
            onClick={() => setIsShowModal(false)}
          ></div>
          <div
            {...getRootProps()}
            className="bg-white w-2/4 h-2/4 rounded-2xl flex flex-col justify-center items-center z-40 border border-black"
          >
            <input {...getInputProps()} />
            <div className="flex items-center space-x-2">
              <FiImage className="text-black w-6 h-6" />
              <p className="text-black font-semibold">Select Image File</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">Or Just Drop It Here!</p>
          </div>
        </div>
      ) : null}
      <div className="flex-1 bg-gray-300 flex items-center justify-center flex-col">
        <div className="w-full h-full bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
          <img
            src={filteredImage || image}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>

      <div className="w-1/4 p-6 bg-white border-l border-gray-200 shadow-md flex flex-col justify-between">
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
            <div className="flex items-center space-x-4">
              <div className="cursor-pointer">
                <Popover content={contentGrayscale} trigger="hover">
                  <MdInfoOutline className="text-2xl text-gray-500" />
                </Popover>
              </div>
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
            </div>

            {/* Tombol Blur Edges */}
            <div className="flex items-center space-x-4">
              <div className="cursor-pointer">
                <Popover content={contentBlur} trigger="hover">
                  <MdInfoOutline className="text-2xl text-gray-500" />
                </Popover>
              </div>
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
                  "Gaussian Blur"
                )}
              </button>
            </div>

            {/* Tombol Resize */}
            <div className="flex items-center space-x-4">
              <div className="cursor-pointer">
                <Popover content={contentResize} trigger="hover">
                  <MdInfoOutline className="text-2xl text-gray-500" />
                </Popover>
              </div>
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
            </div>

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

            {/* info resize */}
            {sizeAfter && isResizeActive ? (
              <div className="border border-black rounded-xl p-3">
                Document Size
                <p>
                  <span className="text-gray-600">From :</span>{" "}
                  <strong>{(sizeBefore / 1024).toFixed(2)} KB</strong>{" "}
                </p>
                <p>
                  <span className="text-gray-600">To :</span>{" "}
                  <strong>{(sizeAfter / 1024).toFixed(2)} KB</strong>
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center space-y-4">
          <button
            onClick={handleDownload}
            disabled={!filteredImage}
            className={`w-full py-3 mt-6 bg-gray-200 text-black border border-black rounded-lg hover:bg-gray-300 ${
              !filteredImage ? "cursor-not-allowed opacity-50" : ""
            }`}
            style={{ boxShadow: "4px 4px 0px black" }}
          >
            Download
          </button>
          <p className="cursor-pointer" onClick={() => setIsShowModal(true)}>
            <span>&#8634;</span> <span>Upload Again</span>
          </p>
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default FilterPage;
