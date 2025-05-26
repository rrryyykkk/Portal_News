import { Link } from "react-router-dom";

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
};

const NewsCard = ({ data }) => {
  console.log("data:", data);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={`/news/${data._id || data.id}`}>
        <img
          src={data.img || "https://via.placeholder.com/400x200"}
          alt={data.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-1">{data.title}</h2>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {data.description || data.content || "Deskripsi tidak tersedia"}
          </p>
          <p className="text-xs text-gray-400">
            {parseDate(data.date)?.toLocaleDateString("id-ID") ||
              "Tanggal tidak tersedia"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
