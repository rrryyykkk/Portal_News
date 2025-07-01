/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const toggleBookmark = useToggleMarked();
  const setToast = useToastStore((state) => state.setToast);
  const navigate = useNavigate();
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
                <div
                  className="bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 
                                                backdrop-blur-md border border-white/60 dark:border-white/20 ring-1 ring-black/5 flex items-center 
                                                gap-3 rounded-2xl p-3 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <button
                    onClick={() => {
                      if (!post.userId?._id) {
                        setToast({
                          type: "error",
                          message: "Account tidak ditemukan",
                        });
                        navigate("*");
                      } else {
                        navigate(`/profile/${post.userId._id}`);
                      }
                    }}
                    className="shrink-0"
                  >
                    <img
                      src={post.userId?.profileImage || "/avatar/01.jpg"}
                      alt={post.author}
                      className="w-10 h-10 object-cover rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer"
                    />
                  </button>
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        if (!post.userId?._id) {
                          setToast({
                            type: "error",
                            message: "Account tidak ditemukan",
                          });
                          navigate("*");
                        } else {
                          navigate(`/profile/${post.userId._id}`);
                        }
                      }}
                      className="shrink-0"
                    >
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:underline cursor-pointer">
                        {post.userId?.userName || post.author || "Unknown"}
                      </h4>
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {post.createdAt ? formatDate(post.createdAt) : "Unknown"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleBookmark(post._id || post.id, post.bookmark)
                    }
                    className="ml-auto rounded-xl p-2 transition-all duration-300 ease-in-out 
                                                    hover:bg-[var(--primary-color)] hover:text-white hover:shadow-md 
                                                    hover:ring-2 hover:ring-[var(--primary-color)] cursor-pointer"
                    aria-label="Bookmark post"
                  >
                    {post.bookmark ? (
                      <FaBookmark className="w-5 h-5" />
                    ) : (
                      <CiBookmark className="w-5 h-5" />
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
