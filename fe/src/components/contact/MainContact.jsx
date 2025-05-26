// icons
import { FaImage } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import { IoCodeSlashOutline } from "react-icons/io5";
import { CiTextAlignLeft, CiLink } from "react-icons/ci";

import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

// icon list
const icons = [
  { id: 1, icon: <FaImage />, name: "Image" },
  { id: 2, icon: <MdBorderColor />, name: "Color" },
  { id: 3, icon: <IoCodeSlashOutline />, name: "Text" },
  { id: 4, icon: <CiTextAlignLeft />, name: "Align" },
  { id: 5, icon: <CiLink />, name: "Link" },
];

// reusable IconItem
const IconItem = ({ icon, name }) => (
  <div className="flex gap-1 sm:gap-2 justify-center items-center bg-gray-100 p-2 rounded-lg w-[48%] sm:w-full">
    <div className="text-gray-600 text-sm sm:text-base">{icon}</div>
    <p className="text-xs sm:text-sm text-gray-600">{name}</p>
  </div>
);

// main component
const MainContact = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    maxFiles: 1,
  });

  return (
    <section className="grid grid-cols-1">
      {/* input form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 p-4 gap-4">
        <fieldset className="fieldset">
          <h3 className="font-semibold lg:text-lg text-sm">Subject</h3>
          <input
            type="text"
            className="input bg-gray-200 w-full border-none rounded-lg"
          />
        </fieldset>
        <fieldset className="fieldset">
          <h3 className="font-semibold lg:text-lg text-sm">Name</h3>
          <input
            type="text"
            className="input bg-gray-200 w-full border-none rounded-lg"
          />
        </fieldset>
        <fieldset className="fieldset">
          <h3 className="font-semibold lg:text-lg text-sm">Subject</h3>
          <input
            type="text"
            className="input bg-gray-200 w-full border-none rounded-lg"
          />
        </fieldset>
      </div>

      {/* textarea + icons + file upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 p-4 gap-4">
        {/* left: icons & textarea */}
        <div className="col-span-2">
          <h2 className="font-semibold lg:text-lg text-sm mb-2">Explanation</h2>
          <div className="flex flex-col gap-3 rounded-2xl shadow p-4 lg:w-180 sm:w-full">
            <div className="flex  gap-1 sm:gap-2 lg:gap-7">
              {icons.map((icon) => (
                <IconItem key={icon.id} icon={icon.icon} name={icon.name} />
              ))}
            </div>
            <div className="flex pt-2">
              <textarea
                placeholder="Text..."
                className="bg-gray-200 w-full border-none rounded-lg p-4 text-base sm:text-lg h-40 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* right: drag & drop file upload */}
        <div className="col-span-1">
          <h1 className="text-xl font-semibold mb-2">Add File</h1>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${
                isDragActive
                  ? "bg-blue-100 border-blue-400"
                  : "bg-gray-100 border-gray-300"
              }
            `}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the file here..."
                : "Drag & drop image/video here or click to select"}
            </p>
            {uploadedFile && (
              <p className="mt-2 text-sm font-medium text-gray-800 truncate">
                Selected: {uploadedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainContact;
