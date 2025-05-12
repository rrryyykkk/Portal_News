import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";

const CardCategory = ({ data, layout, onBookmark }) => {
  const handleBookmarkClick = () => {
    onBookmark(data.id);
  };

  return (
    <div
      className={`rounded-xl shadow p-4 bg-white transition-all gap-5 ${
        layout === "list" ? "flex flex-row gap-4 items-start" : ""
      }`}
    >
      <img
        src={data.img}
        alt={data.title}
        className={`rounded-xl ${
          layout === "list"
            ? "w-1/3 h-32 object-cover"
            : "w-full h-48 object-cover mb-4"
        }`}
      />
      <div className={`pt-4 ${layout === "list" ? "w-2/3" : ""}`}>
        <h3 className="font-bold text-lg mb-2">{data.title}</h3>
        <p className="text-sm text-gray-600">{data.description}</p>
        <div className="flex items-center gap-4 mt-3 bg-gray-200 p-2 rounded-lg">
          <div className="avatar">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src={data.user.img} alt={data.user.name} />
            </div>
          </div>
          <div>
            <h4 className="font-bold">{data.user.name}</h4>
            <p className="text-sm text-gray-600">{data.date}</p>
          </div>
          <button className="ml-auto" onClick={handleBookmarkClick}>
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
