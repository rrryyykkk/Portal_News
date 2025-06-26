import { useState } from "react";
import SideBar from "../../components/common/SideBar";
import {
  MdOutlineDateRange,
  MdOutlineCategory,
  MdOutlineComment,
  MdOutlineFavoriteBorder,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { useLikeUnlike } from "../../app/store/useActivities";

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

const MainContent = ({
  news,
  toggleBookmark,
  setToast,
  newsId,
  isBookmarked,
  setIsBookmarked,
}) => {
  const {
    title,
    description,
    image,
    video,
    createdAt,
    category,
    comments,
    views,
    likes,

    isLiked,
  } = news.data;

  const [liked, setLiked] = useState(isLiked || false);
  const [likeCount, setLikeCount] = useState(likes || 0);

  const likeMutation = useLikeUnlike();

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    likeMutation.mutate({ type: "news", targetId: newsId, newsId: newsId });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 py-6 max-w-screen-xl mx-auto">
      {/* Konten Berita */}
      <div className="lg:col-span-9 w-full bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <MdOutlineDateRange />
            {formatDate(createdAt)}
          </div>
          <div className="flex items-center gap-2">
            <MdOutlineCategory />
            {category}
          </div>
          <div className="flex items-center gap-2">
            <MdOutlineComment />
            {comments}
          </div>
          <div className="flex items-center gap-2">
            <MdOutlineRemoveRedEye />
            {views}
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition"
            onClick={handleLike}
            title={liked ? "Unlike" : "Like"}
          >
            {liked ? (
              <AiFillHeart className="text-red-500" />
            ) : (
              <MdOutlineFavoriteBorder />
            )}
            {likeCount}
          </div>
        </div>

        {/* Gambar atau Video */}
        <div className="mb-6">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full rounded-xl object-cover max-h-[400px] shadow-md"
            />
          ) : (
            <video
              src={video}
              controls
              className="w-full rounded-xl max-h-[400px] shadow-md"
            />
          )}
        </div>

        {/* Deskripsi */}
        <p className="text-base leading-relaxed text-gray-800 whitespace-pre-line">
          {description}
        </p>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-3 w-full">
        <SideBar
          user={news.data.author}
          onBookmark={toggleBookmark}
          setToast={setToast}
          newsId={newsId}
          isBookmarked={isBookmarked}
          setIsBookmarked={setIsBookmarked}
        />
      </div>
    </div>
  );
};

export default MainContent;
