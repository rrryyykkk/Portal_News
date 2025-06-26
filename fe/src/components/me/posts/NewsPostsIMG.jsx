/* eslint-disable no-unused-vars */
import { useDropzone } from "react-dropzone";
import { useState, useCallback, useRef } from "react";
import { FaImage } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import { IoCodeSlashOutline } from "react-icons/io5";
import { CiTextAlignLeft, CiLink } from "react-icons/ci";
import { useCreateNews } from "../../../app/store/useNews";
import { useToastStore } from "../../../app/store/useToastStore";

const icons = [
  { id: 1, icon: <FaImage />, name: "Image" },
  { id: 2, icon: <MdBorderColor />, name: "Color" },
  { id: 3, icon: <IoCodeSlashOutline />, name: "Text" },
  { id: 4, icon: <CiTextAlignLeft />, name: "Align" },
  { id: 5, icon: <CiLink />, name: "Link" },
];

const categoryOptions = [
  {
    value: "Politics",
    label: "Politics",
  },
  {
    value: "Sport",
    label: "Sport",
  },
  {
    value: "Technology",
    label: "Technology",
  },
  {
    value: "Entertainment",
    label: "Entertainment",
  },
  {
    value: "Business",
    label: "Business",
  },
  {
    value: "Health",
    label: "Health",
  },
  {
    value: "general",
    label: "general",
  },
  {
    value: "Other",
    label: "Other",
  },
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

const NewsPostIMGPage = () => {
  const { mutateAsync, isPending } = useCreateNews();
  const setToast = useToastStore((state) => state.setToast);

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
    accept: { "image/*": [] },
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

    // Set cursor after inserted template
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + template.length,
        start + template.length
      );
    }, 0);
  };

  const handleSubmit = async () => {
    if (!title || !category || !explanation || !uploadedFile) {
      setToast({ type: "error", message: "Semua field wajib diisi!" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", explanation);
    formData.append("newsImage", uploadedFile);

    try {
      await mutateAsync(formData); // ❗ Tunggu proses BE selesai
      setToast({ type: "success", message: "Postingan berhasil dikirim!" });

      // Reset form setelah berhasil
      setTitle("");
      setCategory("");
      setExplanation("");
      setUploadedFile(null);
    } catch (error) {
      setToast({ type: "error", message: "Postingan gagal dikirim!" });
    }
  };

  return (
    <section className="p-6">
      {/* Form Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <fieldset className="flex flex-col gap-2">
          <label className="text-slate-700 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Judul gambar..."
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <label className="text-slate-700 font-medium">Category</label>
          <select
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Kategori..."
          >
            <option value="">Pilih Kategori</option>
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </fieldset>
      </div>

      {/* Deskripsi dan Upload */}
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
            placeholder="Deskripsi gambar..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>

        {/* Upload Gambar */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Upload Gambar
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
                ? "Drop gambar di sini..."
                : "Drag & drop gambar atau klik untuk pilih"}
            </p>
            {uploadedFile && (
              <p className="mt-2 text-sm font-medium text-slate-700 truncate">
                📷 {uploadedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isPending && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {isPending ? "Mengirim..." : "Kirim Postingan"}
        </button>
      </div>
    </section>
  );
};

export default NewsPostIMGPage;
