import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  const [dataURL, setDataURL] = React.useState<string | null>(null);
  const [uploadedURL, setUploadedURL] = React.useState<string | null>(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("File reading was aborted");
      reader.onerror = () => console.log("File reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result as string;
        setDataURL(binaryStr);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, acceptedFiles, getInputProps, isDragActive } =
    useDropzone({ onDrop });

  const selectedFile = acceptedFiles[0];
  console.log("selected file:", selectedFile);

  const uploadImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`http://127.0.0.1:5000/grayscale`, {
        method: "POST",
        body: formData,
      });

      const data = await response.blob();
      const imageUrl = URL.createObjectURL(data);
      console.log("data", data);
      // setUploadedURL(data.url);
      setDataURL(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg min-h-screen">
      <p className="text-4xl my-4 bg-black text-white px-2 py-1">
        Image Filter Project
      </p>
      {dataURL ? (
        <div className="flex flex-col items-center">
          <img src={dataURL} alt="Preview" className="w-96 h-96 object-cover" />
          <div className="flex space-x-2 mt-2">
            {uploadedURL ? (
              <span className="text-green-500">Uploaded!</span>
            ) : (
              <Link to="/filter" state={{ dataURL }}>
                <button className="px-16 py-2 bg-black text-white rounded hover:bg-slate-600 duration-200">
                  Submit Image
                </button>
              </Link>
            )}
            <button
              onClick={() => setDataURL(null)}
              className="px-16 py-2 bg-transparent border border-black text-black rounded hover:bg-red-200 duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center ">
          <div
            {...getRootProps()}
            className="w-96 h-64 flex justify-center items-center p-6 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  height="50"
                  width="50"
                  fill="currentColor"
                >
                  <path d="M1 14.5C1 12.1716 2.22429 10.1291 4.06426 8.9812C4.56469 5.044 7.92686 2 12 2C16.0731 2 19.4353 5.044 19.9357 8.9812C21.7757 10.1291 23 12.1716 23 14.5C23 17.9216 20.3562 20.7257 17 20.9811L7 21C3.64378 20.7257 1 17.9216 1 14.5ZM16.8483 18.9868C19.1817 18.8093 21 16.8561 21 14.5C21 12.927 20.1884 11.4962 18.8771 10.6781L18.0714 10.1754L17.9517 9.23338C17.5735 6.25803 15.0288 4 12 4C8.97116 4 6.42647 6.25803 6.0483 9.23338L5.92856 10.1754L5.12288 10.6781C3.81156 11.4962 3 12.927 3 14.5C3 16.8561 4.81833 18.8093 7.1517 18.9868L7.325 19H16.675L16.8483 18.9868ZM13 13V17H11V13H8L12 8L16 13H13Z"></path>
                </svg>
                <span>Drop your files here</span>
              </div>
            ) : (
              <div className="text-gray-500">
                Drop your files here or click to browse
              </div>
            )}
          </div>
        </div>
      )}
      {uploadedURL && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={uploadedURL}
          className="text-blue-500 underline mt-2"
        >
          {uploadedURL}
        </a>
      )}
    </div>
  );
};

export default Home;
