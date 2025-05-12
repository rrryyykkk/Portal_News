import { useState, useEffect } from "react";
import PageHeaders from "../components/PageHeaders";
import newsData from "../data/news.json";

// icons
import { CiGrid41 } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";
import CardCategory from "../components/category/Card";

const postTypes = ["New", "Trend", "Popular", "Top"];

const CategoryPage = () => {
  const [news, setNews] = useState(newsData);
  const [activePost, setActivePost] = useState("New");
  const [layout, setLayout] = useState("grid");
  const [screen, setScreen] = useState("desktop");
  const [currentPage, setCurrentPage] = useState(1);

  // Determine screen size
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia(
      "(min-width: 641px) and (max-width: 1024px)"
    );
    const desktop = window.matchMedia("(min-width: 1025px)");

    const handleMediaQueryChange = () => {
      if (mobile.matches) {
        setScreen("mobile");
        setLayout("list");
      } else if (tablet.matches) {
        setScreen("tablet");
        setLayout("list");
      } else {
        setScreen("desktop");
        setLayout("grid");
      }
    };

    handleMediaQueryChange();
    mobile.addEventListener("change", handleMediaQueryChange);
    tablet.addEventListener("change", handleMediaQueryChange);
    desktop.addEventListener("change", handleMediaQueryChange);

    return () => {
      mobile.removeEventListener("change", handleMediaQueryChange);
      tablet.removeEventListener("change", handleMediaQueryChange);
      desktop.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleBookmark = (id) => {
    setNews((prevNews) =>
      prevNews.map((item) =>
        item.id === id ? { ...item, bookmark: !item.bookmark } : item
      )
    );
  };

  // Determine how many items to show per page
  const itemsPerPage = screen === "mobile" ? 5 : screen === "tablet" ? 10 : 12;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const paginatedNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="grid grid-cols-1">
      <PageHeaders curPage="Category" title={news[0].category} />

      {/* Filter & Layout Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-200 p-2 gap-2">
        {/* Filter (Inactive for now) */}
        <div className="flex gap-2 flex-wrap">
          {postTypes.map((item) => (
            <button
              onClick={() => setActivePost(item)}
              key={item}
              className={`${
                item === activePost
                  ? "text-[var(--primary-color)] font-bold"
                  : "text-black hover:text-gray-500"
              } px-4 py-2 rounded-xl cursor-pointer`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Layout Switcher (Visible only on desktop) */}
        {screen === "desktop" && (
          <div className="flex gap-2 justify-end">
            <CiGrid41
              size={24}
              onClick={() => setLayout("grid")}
              className={`cursor-pointer ${
                layout === "grid"
                  ? "text-[var(--primary-color)]"
                  : "text-gray-600"
              }`}
            />
            <CiGrid2H
              size={24}
              onClick={() => setLayout("list")}
              className={`cursor-pointer ${
                layout === "list"
                  ? "text-[var(--primary-color)]"
                  : "text-gray-600"
              }`}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
            : "flex flex-col gap-4 p-4"
        }
      >
        {paginatedNews.map((item) => (
          <CardCategory
            key={item.id}
            data={item}
            layout={layout}
            onBookmark={handleBookmark}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 py-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              currentPage === num
                ? "bg-[var(--primary-color)] text-white"
                : "bg-white text-black"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </main>
  );
};

export default CategoryPage;
