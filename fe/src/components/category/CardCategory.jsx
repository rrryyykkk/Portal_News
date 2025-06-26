import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import defaultProfile from "/avatar/01.jpg";

// Format tanggal
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Unknown date";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CardCategory = ({ data, layout, onBookmark }) => {
  console.log("data-card:", data);
  const handleBookmarkClick = () => {
    onBookmark(data._id);
  };

  return (
    <div
      className={`rounded-xl shadow p-4 bg-white transition-all gap-5 ${
        layout === "list" ? "flex flex-row gap-4 items-start" : ""
      }`}
    >
      {/* Gambar utama */}
      <Link to={`/news/${data._id}`}>
        <div
          className={`rounded-xl overflow-hidden ${
            layout === "list"
              ? "min-w-[100px] sm:min-w-[120px] md:min-w-[160px] h-28"
              : "w-full h-48 mb-4"
          }`}
        >
          {(data.newsImage && (
            <img
              src={data.newsImage}
              alt={data.title}
              className="w-full h-full object-cover transition duration-300 hover:scale-105"
            />
          )) || (
            <video
              src={data.newsVideo}
              alt={data.title}
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </Link>

      {/* Konten */}
      <div className={`pt-4 ${layout === "list" ? "w-full" : ""}`}>
        {/* Kategori */}
        <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
          #{data.category}
        </p>

        {/* Judul & deskripsi */}
        <Link to={`/news/${data._id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:underline">
            {data.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-3">{data.description}</p>

        {/* Info user & bookmark */}
        <div className="flex items-center gap-4 mt-3 bg-gray-200 p-2 rounded-lg">
          <div className="avatar">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src={data.user?.img || defaultProfile} alt={data.author} />
            </div>
          </div>
          <div>
            <h4 className="font-bold">{data.author}</h4>
            <p className="text-sm text-gray-600">
              {data.createdAt ? formatDate(data.createdAt) : "Unknown date"}
            </p>
          </div>

          <button
            className="ml-auto rounded-md p-2 transition-all duration-300 ease-in-out 
              hover:bg-[var(--primary-color)] hover:text-white hover:shadow-md 
              hover:ring-2 hover:ring-[var(--primary-color)] cursor-pointer"
            onClick={handleBookmarkClick}
          >
            {data.bookmark ? (
              <FaBookmark className="w-6 h-6 cursor-pointer" />
            ) : (
              <CiBookmark className="w-6 h-6 cursor-pointer" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCategory;
