/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// icons
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { RxCaretRight } from "react-icons/rx";
import { useToggleMarked } from "../../../app/store/useActivities";
import { useToastStore } from "../../../app/store/useToastStore";

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

// Potong deskripsi
const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const NewsPost = ({ news }) => {
  const [postsData, setPostsData] = useState(news);
  console.log("postsData-newsAll:", postsData);
  const toggleBookmark = useToggleMarked();
  const setToast = useToastStore((state) => state.setToast);

  useEffect(() => {
    setPostsData(news);
  }, [news]);

  const handleBookmark = (newsId, isBookmarked) => {
    if (!newsId) {
      return setToast({ type: "error", message: "News not found" });
    }

    toggleBookmark.mutate(newsId, {
      onSuccess: () => {
        setPostsData((prevNews) =>
          prevNews.map((n) =>
            n._id === newsId || n.id === newsId
              ? { ...n, bookmark: !isBookmarked } // ✅ Update yang benar
              : n
          )
        );

        setToast({
          type: isBookmarked ? "info" : "success",
          message: isBookmarked
            ? "Unbookmark successfully"
            : "Bookmark successfully",
        });
      },
      onError: (error) => {
        setToast({
          type: "error",
          message: "Bookmark failed. Please login.",
        });
      },
    });
  };

  return (
    <div className="grid grid-rows-1">
      {/* Header */}
      <div className="flex flex-row justify-between items-center px-5 pt-5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-1 bg-[var(--primary-color)] rounded-md mt-1" />
          <h2 className="text-2xl font-bold">News</h2>
        </div>
        <Link
          to="/news-post"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <span>Show All</span>
          <RxCaretRight className="w-6 h-6 ml-1" />
        </Link>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 px-4 md:px-8 pt-4 gap-5">
        {postsData.slice(0, 4).map((post) => {
          console.log("post-user:", post.userId);
          return (
            <div
              key={post.id || post._id}
              className="bg-white p-4 rounded-lg shadow-md grid md:grid-cols-2 gap-2"
            >
              {/* Image: Klik menuju detail */}
              <Link to={`/news/${post.id || post._id}`}>
                {post.newsImage ? (
                  <img
                    src={post.newsImage}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                ) : (
                  <video
                    src={post.newsVideo}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                )}
              </Link>

              <div className="flex flex-col justify-between gap-2">
                <div>
                  {/* Judul: Klik menuju detail */}
                  <Link to={`/news/${post.id || post._id}`}>
                    <h3 className="text-lg font-bold hover:underline ">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-700">
                    {truncateText(post.description, 100)}
                  </p>
                </div>

                {/* Author section */}
                <div className="flex items-center bg-gray-100 p-2 rounded-lg shadow">
                  <img
                    src={post.userId?.profileImage || "/avatar/01.jpg"}
                    alt={post.author}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col ml-2">
                    <h3 className="text-sm font-semibold">
                      {post.userId?.userName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {post.createdAt
                        ? formatDate(post.createdAt)
                        : "Unknown date"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleBookmark(post.id || post._id, post.bookmark)
                    }
                    className="ml-auto rounded-md p-2 transition-all duration-300 ease-in-out 
                  hover:bg-[var(--primary-color)] hover:text-white hover:shadow-md 
                  hover:ring-2 hover:ring-[var(--primary-color)] cursor-pointer"
                  >
                    {post.bookmark ? (
                      <FaBookmark className="w-5 h-5 text-blue-600" />
                    ) : (
                      <CiBookmark className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsPost;
