import { useState } from "react";
import { FaPlay } from "react-icons/fa";

const VideoCard = ({ video }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="aspect-video relative">
      <video className="w-full h-full object-cover" controls muted>
        <source src={video.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg truncate">{video.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
    </div>
  </div>
);

const LatestVideoPage = ({ videos }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;

  const indexOfLast = currentPage * videosPerPage;
  const indexOfFirst = indexOfLast - videosPerPage;
  const currentVideos = videos.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(videos.length / videosPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Latest Videos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-2 rounded-md border ${
                currentPage === i + 1
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestVideoPage;
