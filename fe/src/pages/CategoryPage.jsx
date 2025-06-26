import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeaders from "../components/PageHeaders";
import CardCategory from "../components/category/CardCategory";
import Category from "../components/common/Category";
import { CiGrid41, CiGrid2H } from "react-icons/ci";
import {
  useLatestNews,
  useNews,
  usePopularNews,
  useTopNews,
  useTrendyNews,
} from "../app/store/useNews";
import { useToggleMarked } from "../app/store/useActivities";
import { useToastStore } from "../app/store/useToastStore";
import Loading from "../components/common/Loading";

const postTypes = ["New", "Trend", "Popular", "Top", "all"];

const CategoryPage = () => {
  const { categoryName } = useParams();
  const toggleBookmarked = useToggleMarked();
  const setToast = useToastStore((state) => state.setToast);

  const { data: trendNewsData } = useTrendyNews();
  const { data: popularNewsData } = usePopularNews();
  const { data: topNewsData } = useTopNews();
  const { data: latestNewsData } = useLatestNews();
  const { data: allNewsData } = useNews();

  const [news, setNews] = useState([]);
  const [activePost, setActivePost] = useState("New");
  const [layout, setLayout] = useState("grid");
  const [screen, setScreen] = useState("desktop");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (
      !latestNewsData ||
      !trendNewsData ||
      !popularNewsData ||
      !topNewsData ||
      !allNewsData
    ) {
      return;
    }

    let rawData = [];

    switch (activePost) {
      case "New":
        rawData = latestNewsData.data.news || [];
        break;
      case "Trend":
        rawData = trendNewsData.data.news || [];
        break;
      case "Popular":
        rawData = popularNewsData.data.news || [];
        break;
      case "Top":
        rawData = topNewsData.data.news || [];
        break;
      case "all":
      default:
        rawData = allNewsData.data.news || [];
        break;
    }

    const filtered = rawData.filter(
      (item) =>
        item?.category?.toLowerCase() === categoryName?.toLocaleLowerCase()
    );
    setNews(filtered);
    setCurrentPage(1);
  }, [
    activePost,
    latestNewsData,
    trendNewsData,
    popularNewsData,
    topNewsData,
    allNewsData,
    categoryName,
  ]);

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

  const isLoading =
    !trendNewsData ||
    !popularNewsData ||
    !topNewsData ||
    !latestNewsData ||
    !allNewsData;

  if (isLoading) {
    return <Loading message="Loading news..." />;
  }

  const handleBookmark = (newsId) => {
    if (!newsId) {
      setToast({ type: "error", message: "News not found" });
    }
    toggleBookmarked.mutate(newsId, {
      onSuccess: () => {
        setToast({ type: "success", message: "Bookmark updated successfully" });
      },
      onError: () => {
        setToast({
          type: "error",
          message: "Bookmark failed. Please login.",
        });
      },
    });
  };

  const itemsPerPage = screen === "mobile" ? 5 : screen === "tablet" ? 10 : 12;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const paginatedNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="grid grid-cols-1">
      <PageHeaders curPage="Category" title={categoryName} />

      {/* Header kategori tampil semua */}
      {allNewsData?.data?.news && (
        <Category news={allNewsData.data.news} activeCategory={categoryName} />
      )}

      {/* Filter & Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-200 p-2 gap-2">
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
      {paginatedNews.length > 0 ? (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
              : "flex flex-col gap-4 p-4"
          }
        >
          {paginatedNews.map((item) => (
            <CardCategory
              key={item._id}
              data={item}
              layout={layout}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-10 text-gray-500">
          Belum ada berita pada kategori <b>{categoryName}</b>.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer ${
                currentPage === num
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-white text-black"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </main>
  );
};

export default CategoryPage;
