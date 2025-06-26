import { useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { useToggleMarked } from "../../app/store/useActivities";
import { useToastStore } from "../../app/store/useToastStore";

/**
 * @param {{ user: object }} props
 */

// Format tanggal ke bahasa Indonesia
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Tanggal tidak tersedia";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Marked = ({ user }) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState(user?.marked || []);
  const setToast = useToastStore((state) => state.setToast);

  const { mutate: toggleMarked } = useToggleMarked(user?._id);

  const handleRemoveBookmark = (newsId) => {
    if (!newsId) return;

    toggleMarked(newsId, {
      onSuccess: () => {
        // Optimistically remove from local state
        setBookmarkedPosts((prev) =>
          prev.filter((post) => post._id !== newsId)
        );

        setToast({
          type: "success",
          message: "Bookmark berhasil dihapus!",
        });
      },
      onError: () => {
        setToast({
          type: "error",
          message: "Gagal menghapus bookmark. Silakan coba lagi.",
        });
      },
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Postingan Ditandai</h2>

      {bookmarkedPosts.length === 0 ? (
        <p className="text-gray-500">Belum ada postingan yang ditandai.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {post.newsImage ? (
                <img
                  src={post.newsImage}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
              ) : post.newsVideo ? (
                <video
                  src={post.newsVideo}
                  controls
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                  No media
                </div>
              )}

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.description}</p>

                {/* Profile Info */}
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={post.userId?.profileImage || "/avatar/01.jpg"}
                    alt={post.userId?.userName || "Anonymous"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {post.userId?.userName || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={() => handleRemoveBookmark(post._id)}
                  className="mt-3 self-end text-[var(--primary-color)] flex items-center gap-1 hover:text-red-500 transition cursor-pointer"
                >
                  <FaBookmark className="w-4 h-4" />
                  <span className="text-sm">Hapus Bookmark</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marked;
