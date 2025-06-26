import { Link } from "react-router-dom";

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
const NewsCard = ({ data }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={`/news/${data._id || data.id}`}>
        {data.newsImage ? (
          <img
            src={data.newsImage}
            alt={data.title}
            className="w-full h-40 object-cover rounded-xl"
          />
        ) : (
          <video
            src={data.newsVideo}
            alt={data.title}
            className="w-full h-40 object-cover rounded-xl"
          />
        )}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-1">{data.title}</h2>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {data.description || data.content || "Deskripsi tidak tersedia"}
          </p>
          <p className="text-xs text-gray-400">
            {data.createdAt
              ? formatDate(data.createdAt)
              : "Tanggal tidak tersedia"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
