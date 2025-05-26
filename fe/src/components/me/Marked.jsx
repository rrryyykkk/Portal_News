import { useState } from "react";
import { FaBookmark } from "react-icons/fa";

/**
 * @param {{ user: object }} props
 */
const Marked = ({ user }) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState(user?.bookmark || []);

  const handleRemoveBookmark = (id) => {
    const updated = bookmarkedPosts.filter((post) => post.id !== id);
    setBookmarkedPosts(updated);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Bookmarked Posts</h2>

      {bookmarkedPosts.length === 0 ? (
        <p className="text-gray-500">Belum ada postingan yang ditandai.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.description}</p>

                {/* Profile Info */}
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={post.profile.image}
                    alt={post.profile.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{post.profile.name}</p>
                    <p className="text-xs text-gray-500">{post.profile.date}</p>
                  </div>
                </div>

                {/* Bookmark button */}
                <button
                  onClick={() => handleRemoveBookmark(post.id)}
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
