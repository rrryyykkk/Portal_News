import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { useState } from "react";

const CardProfile = ({ news = [], marked = [] }) => {
  console.log("marked", marked);
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  // Gunakan marked jika tersedia
  const dataToShow = Array.isArray(marked) && marked.length > 0 ? marked : news;

  if (!Array.isArray(dataToShow)) {
    return <div className="p-4 text-red-500">Invalid news data</div>;
  }

  const totalPages = Math.ceil(dataToShow.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNews = dataToShow.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (dataToShow.length === 0) {
    return <div className="p-4 text-gray-500">No news found.</div>;
  }

  return (
    <div className="w-full">
      {/* Section title */}
      <div className="flex p-3 gap-2 items-center">
        <div className="w-1 h-5 bg-[var(--primary-color)] rounded"></div>
        <h2 className="text-2xl font-bold">News</h2>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-3">
        {currentNews.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300"
          >
            {
              // Display video if available
              item.newsVideo ? (
                <video
                  src={item.newsVideo}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  controls
                />
              ) : (
                <img
                  src={item.newsImage || "/placeholder.jpg"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )
            }

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {item.description?.slice(0, 100)}...
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-xl overflow-hidden">
                    <img
                      src={item.userId?.profileImage || "/avatar/01.jpg"}
                      alt={item.userId?.userName || "User"}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {item.userId?.userName || "Unknown"}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-start gap-3 my-6 px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-sm text-gray-600 bg-white hover:bg-gray-100 border px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm border transition-all duration-200 cursor-pointer ${
                currentPage === page
                  ? "bg-[var(--primary-color)] text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-sm text-gray-600 bg-white hover:bg-gray-100 border px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProfile;
