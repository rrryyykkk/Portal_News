import { useDropzone } from "react-dropzone";
import { useState, useCallback, useRef } from "react";
import { FaImage } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import { IoCodeSlashOutline } from "react-icons/io5";
import { CiTextAlignLeft, CiLink } from "react-icons/ci";

const icons = [
  { id: 1, icon: <FaImage />, name: "Image" },
  { id: 2, icon: <MdBorderColor />, name: "Color" },
  { id: 3, icon: <IoCodeSlashOutline />, name: "Text" },
  { id: 4, icon: <CiTextAlignLeft />, name: "Align" },
  { id: 5, icon: <CiLink />, name: "Link" },
];

const IconItem = ({ icon, name, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(name)}
    className="flex gap-1 items-center p-3 bg-slate-100 rounded-xl w-[48%] sm:w-auto hover:bg-slate-200 transition"
  >
    <div className="text-indigo-500 text-lg">{icon}</div>
    <p className="text-sm text-slate-600">{name}</p>
  </button>
);

const NewsPostsVideoPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [explanation, setExplanation] = useState("");
  const textareaRef = useRef();

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    maxFiles: 1,
  });

  const handleInsertTemplate = (type) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let template = "";

    switch (type) {
      case "Image":
        template = "![alt text](https://your-image-url.com/image.jpg)";
        break;
      case "Link":
        template = "[Link Text](https://example.com)";
        break;
      case "Text":
        template = "Tuliskan sesuatu di sini...";
        break;
      case "Color":
        template = "<span style='color:red;'>Teks berwarna</span>";
        break;
      case "Align":
        template = "<div style='text-align:center;'>Teks rata tengah</div>";
        break;
      default:
        break;
    }

    const updatedText =
      explanation.slice(0, start) + template + explanation.slice(end);

    setExplanation(updatedText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + template.length,
        start + template.length
      );
    }, 0);
  };

  const handleSubmit = () => {
    const formData = {
      title,
      category,
      explanation,
      video: uploadedFile,
    };
    console.log("Submitted Video Post:", formData);
    alert("Postingan video berhasil dikirim!");
  };

  return (
    <section className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <fieldset className="flex flex-col gap-2">
          <label className="text-slate-700 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Judul video..."
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label className="text-slate-700 font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Kategori..."
          />
        </fieldset>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deskripsi */}
        <div className="col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Description
          </h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {icons.map((icon) => (
              <IconItem
                key={icon.id}
                icon={icon.icon}
                name={icon.name}
                onClick={handleInsertTemplate}
              />
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className="w-full bg-slate-100 rounded-lg border border-slate-300 p-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Deskripsi video..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>

        {/* Upload Video */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Upload Video
          </h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragActive
                ? "bg-violet-100 border-violet-400"
                : "bg-slate-50 border-slate-300"
            } hover:bg-violet-50`}
          >
            <input {...getInputProps()} />
            <p className="text-slate-600 text-sm">
              {isDragActive
                ? "Drop video di sini..."
                : "Drag & drop video atau klik untuk pilih"}
            </p>
            {uploadedFile && (
              <p className="mt-2 text-sm font-medium text-slate-700 truncate">
                🎥 {uploadedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition cursor-pointer"
        >
          Kirim Postingan
        </button>
      </div>
    </section>
  );
};

export default NewsPostsVideoPage;
