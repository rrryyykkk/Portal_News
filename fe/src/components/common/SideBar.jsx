/* eslint-disable no-unused-vars */
// icons
import { FaPaperPlane } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import { useState } from "react";
import { useTopNews } from "../../app/store/useNews";
import { Link } from "react-router-dom";

const tags = ["#cat", "#dog", "#rabbit", "#bird", "#fish", "#hamster"];

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

const SideBar = ({
  user,
  onBookmark,
  setToast,
  newsId,
  isBookmarked,
  setIsBookmarked,
  handleFollow,
  isPending,
  isFollowing,
}) => {
  const { data: topNews } = useTopNews();

  const handleBookmark = (newsId) => {
    if (!newsId) {
      setToast({ type: "error", message: "News not found" });
    }
    onBookmark.mutate(newsId, {
      onSuccess: () => {
        setToast({ type: "success", message: "Bookmark updated successfully" });
        setIsBookmarked((prev) => !prev);
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
    <aside className="flex flex-col pt-4 gap-6 ">
      {/* atas */}
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 items-center justify-center bg-gray-300 p-1 rounded-lg w-25">
          <FaPaperPlane className="w-3 h-3" />
          <p className="text-sm">Share</p>
        </div>
        <button
          onClick={() => handleBookmark(newsId)}
          className="flex flex-row gap-2 items-center justify-center bg-gray-300 p-2 rounded-lg w-25 transition-all 
                    duration-300 ease-in-out hover:bg-[var(--primary-color)] hover:text-white hover:shadow-md 
                    hover:ring-2 hover:ring-[var(--primary-color)] cursor-pointer"
        >
          {isBookmarked ? (
            <FaBookmark className="w-5 h-5 " />
          ) : (
            <CiBookmark className="w-5 h-5" />
          )}
          <h4 className="text-sm">Bookmark</h4>
        </button>
        <div className="flex flex-row gap-2 items-center justify-center bg-gray-300 p-2 rounded-lg w-25">
          <MdOutlineComment className="w-3 h-3" />
          <h4 className="text-sm">Comment</h4>
        </div>
      </div>
      {/* profile */}
      <div className="flex items-center bg-white rounded-2xl px-4 py-3 shadow-sm w-full">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 w-full">
          {/* Avatar */}
          <div className="avatar shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
              <img
                alt="User Avatar"
                src={user.profileImage || "/avatar/01.jpg"}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Username + Post + Button */}
          <div className="flex flex-col flex-1 justify-center gap-1">
            {/* Username and Post count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {user.userName}
              </h2>
            </div>

            {/* Follow / Unfollow Button */}
            <button
              onClick={handleFollow}
              disabled={isPending}
              className={`group relative mt-2 flex items-center cursor-pointer justify-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm
        ${
          isFollowing
            ? "bg-white text-[var(--primary-color)] border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
            : "bg-[var(--primary-color)] text-white border-[var(--primary-color)] hover:bg-rose-500"
        }
        active:scale-95`}
            >
              <FaPlus
                className={`w-4 h-4 ${
                  isFollowing ? "hidden group-hover:block" : ""
                }`}
              />
              <span>{isFollowing ? "Unfollow" : "Follow"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2 bg-gray-300 p-2 rounded-lg w-full max-w-md">
        <div className="flex flex-row items-center gap-2">
          <div className="h-4 w-1 bg-[var(--primary-color)]"></div>
          <h2 className="text-lg font-bold">Tags</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {tags.map((tag, index) => (
            <div
              className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full shadow-sm"
              key={index}
            >
              <h4>{tag}</h4>
            </div>
          ))}
        </div>
      </div>
      {/* top post */}
      <div className="flex flex-col gap-2 bg-gray-300 p-2 rounded-lg w-full">
        <div className="flex flex-row items-center gap-2">
          <div className="h-4 w-1 bg-[var(--primary-color)]"></div>
          <h2 className="text-lg font-bold">Top Post</h2>
        </div>

        {!topNews ? (
          <span className="text-sm text-gray-600 px-2 py-4">Loading...</span>
        ) : (
          <div className="flex flex-col gap-6">
            {topNews?.data?.news?.slice(0, 4).map((post, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition"
              >
                <Link
                  to={`/news/${post._id}`}
                  className="w-20 h-20 rounded-lg overflow-hidden shrink-0"
                >
                  {post.newsImage ? (
                    <img
                      src={post.newsImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : post.newsVideo ? (
                    <video
                      src={post.newsVideo}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      No Media
                    </div>
                  )}
                </Link>

                <div className="flex flex-col justify-between flex-1 h-full">
                  <Link to={`/news/${post._id}`}>
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:underline transition">
                      {post.title}
                    </h4>
                  </Link>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span className="truncate">
                      {post.category || "Uncategorized"}
                    </span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
