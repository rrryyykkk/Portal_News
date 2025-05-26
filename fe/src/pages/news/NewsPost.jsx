import { useState } from "react";
import NewsCard from "../../components/news/NewsCard"; // sesuaikan path

const ITEMS_PER_PAGE = 8;

const NewsPost = ({ news }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Ambil hanya 20 berita pertama
  const slicedNews = news?.slice(0, 20) || [];

  const totalPages = Math.ceil(slicedNews.length / ITEMS_PER_PAGE);

  const paginatedNews = slicedNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Berita Terbaru</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedNews.map((item) => (
          <NewsCard key={item._id} data={item} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsPost;
