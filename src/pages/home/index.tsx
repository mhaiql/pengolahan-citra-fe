import * as React from "react";
import { useDropzone } from "react-dropzone";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  const [dataURL, setDataURL] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryStr = reader.result as string;
        setDataURL(binaryStr);
        if (binaryStr) navigate("/filter", { state: { image: binaryStr } });
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // const handleUpload = () => {
  //   // Navigasi ke halaman Filter dan mengirim data gambar
  //   if (dataURL) navigate("/filter", { state: { image: dataURL } });
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center">
        IMAGE FILTER PROJECT
      </h1>
      {/* Area Drag & Drop */}
      {!dataURL ? (
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center w-96 h-24 border border-black rounded-lg shadow-md cursor-pointer hover:shadow-lg"
          style={{ boxShadow: "4px 4px 0px black" }} // Bayangan tebal
        >
          <input {...getInputProps()} />
          <div className="flex items-center space-x-2">
            <FiImage className="text-black w-6 h-6" />
            <p className="text-black font-semibold">Select Image File</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">Or Just Drop It Here!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={dataURL}
            alt="Preview"
            className="w-80 h-80 object-cover border border-gray-300 rounded-lg shadow-md"
          />
          {/* <div className="flex space-x-4 mt-4">
            <button
              onClick={handleUpload}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 duration-200"
            >
              Upload
            </button>

            <button
              onClick={() => setDataURL(null)}
              className="px-6 py-2 text-black border border-black rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Home;
