/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";

// components
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";

// icons
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";

// swiper
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperBtn from "../../../components/common/SwiperBtn";

// hooks
import { usePopularNews } from "../../../app/store/useNews";
import { useToggleMarked } from "../../../app/store/useActivities";

// assets
import defaultProfile from "/avatar/01.jpg";
import { Link } from "react-router-dom";
import { useToastStore } from "../../../app/store/useToastStore";

// date formatter
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Unknown date";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PopularPost = () => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [screen, setScreen] = useState("desktop");
  const [news, setNews] = useState([]);

  const { data: postsData, isLoading, isError } = usePopularNews();
  const toggleMarked = useToggleMarked();
  const setToast = useToastStore((state) => state.setToast);

  useEffect(() => {
    if (postsData?.data?.news) {
      setNews(postsData.data.news.slice(0, 10));
    }
  }, [postsData]);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia(
      "(min-width: 641px) and (max-width: 1024px)"
    );
    const desktop = window.matchMedia("(min-width: 1025px)");
    const handleMediaQueryChange = () => {
      if (mobile.matches) {
        setScreen("mobile");
      } else if (tablet.matches) {
        setScreen("tablet");
      } else {
        setScreen("desktop");
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

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }
  };

  const handleBookmark = (newsId, isBookmarked) => {
    if (!newsId) {
      return setToast({ type: "error", message: "News not found" });
    }

    toggleMarked.mutate(newsId, {
      onSuccess: () => {
        setNews((prevNews) =>
          prevNews.map(
            (n) => (n._id === newsId ? { ...n, bookmark: !isBookmarked } : n) // ✅ ini kuncinya
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

  const navVariant =
    screen === "mobile" ? "mobile" : screen === "tablet" ? "tablet" : "desktop";

  if (isLoading) return <Loading message="Loading..." />;
  if (isError || !postsData?.data?.news)
    return <Error message="Failed to load news" />;

  if (news.length === 0) {
    return <Error message="No popular news found" />;
  }

  return (
    <div className="grid grid-cols-1">
      {/* Header */}
      <div className="flex items-center gap-2 pt-5 pl-4 mb-5">
        <div className="h-3 w-1 bg-[var(--primary-color)] rounded-md mt-1"></div>
        <h2 className="text-2xl font-bold">Popular Posts</h2>
      </div>

      {/* Slider */}
      <div className="relative w-full h-[430px] px-4">
        <SwiperBtn
          variant={navVariant}
          isBeginning={isBeginning}
          isEnd={isEnd}
        />
        <Swiper
          key={navVariant}
          modules={[Navigation, Pagination]}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 10 },
            640: { slidesPerView: 2.2, spaceBetween: 15 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 },
            1280: { slidesPerView: 4.2, spaceBetween: 20 },
          }}
          navigation={{
            prevEl: `.${navVariant}-prev-popular`,
            nextEl: `.${navVariant}-next-popular`,
          }}
          pagination={{ clickable: true }}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          className="h-full"
        >
          {news.map((post) => (
            <SwiperSlide key={post._id || post.id} className="h-full">
              <div className="h-full flex flex-col justify-between space-y-2 shadow rounded-lg p-3 bg-white">
                <Link to={`/news/${post._id || post.id}`}>
                  {post.newsImage ? (
                    <img
                      src={post.newsImage}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-xl transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <video
                      src={post.newsVideo}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  )}
                </Link>
                <Link to={`/news/${post._id || post.id}`}>
                  <h3 className="text-lg font-semibold line-clamp-2 hover:underline">
                    {post.title || "Untitled"}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.description || "No description available."}
                </p>
                <div className="bg-gray-200 flex items-center gap-2 rounded-lg p-2">
                  <img
                    src={post.profile?.image || defaultProfile}
                    alt={post.author || "Unknown"}
                    className="w-8 h-8 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">
                      {post.author || "Unknown"}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {post.createdAt
                        ? formatDate(post.createdAt)
                        : "Unknown date"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookmark(post._id, post.bookmark)}
                    className="ml-auto rounded-md p-2 transition-all duration-300 ease-in-out 
                    hover:bg-[var(--primary-color)] hover:text-white hover:shadow-md 
                    hover:ring-2 hover:ring-[var(--primary-color)] cursor-pointer"
                  >
                    {post.bookmark ? (
                      <FaBookmark className="w-5 h-5" />
                    ) : (
                      <CiBookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PopularPost;
