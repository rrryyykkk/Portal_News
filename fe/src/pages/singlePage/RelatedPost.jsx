import { useEffect, useRef, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperBtn from "../../components/common/SwiperBtn";
import { useRelatedNews } from "../../app/store/useNews";

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

const RelatedPost = ({ newsId, toggleBookmark, setToast }) => {
  const { data, isLoading, isError } = useRelatedNews(newsId);

  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [screen, setScreen] = useState("desktop");
  const [postsData, setPostsData] = useState([]);
  console.log("postsData-related:", postsData);

  // ✅ Normalize data on load
  useEffect(() => {
    if (data?.data?.relatedNews) {
      const normalized = data.data.relatedNews.map((item) => ({
        ...item,
        _id: item._id,
        bookmark: Boolean(item.bookmark),
        author: item.author || null,
      }));
      setPostsData(normalized);
    }
  }, [data]);

  // ✅ Responsiveness for Swiper
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia(
      "(min-width: 641px) and (max-width: 1024px)"
    );
    const desktop = window.matchMedia("(min-width: 1025px)");

    const handleMediaQueryChange = () => {
      if (mobile.matches) setScreen("mobile");
      else if (tablet.matches) setScreen("tablet");
      else setScreen("desktop");
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

  // ✅ Init custom swiper navigation (after render)
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const prevEl = document.querySelector(`.${screen}-prev-related`);
    const nextEl = document.querySelector(`.${screen}-next-related`);

    if (prevEl && nextEl && swiper.params?.navigation) {
      swiper.params.navigation.prevEl = prevEl;
      swiper.params.navigation.nextEl = nextEl;
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [screen, postsData]);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }
  };

  const handleBookmark = (postId, isBookmarked) => {
    if (!postId) {
      return setToast({ type: "error", message: "News not found" });
    }

    toggleBookmark.mutate(postId, {
      onSuccess: () => {
        setPostsData((prevNews) =>
          prevNews.map((n) =>
            n._id === postId ? { ...n, bookmark: !isBookmarked } : n
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
          message:
            error?.response?.data?.message || "Bookmark failed. Please login.",
        });
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[200px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center">
        <div className="text-red-500 text-3xl mb-2">⚠️</div>
        <h2 className="text-xl font-semibold text-red-600">
          Terjadi Kesalahan
        </h2>
        <p className="text-gray-500">Gagal memuat data. Silakan coba lagi.</p>
      </div>
    );

  if (!postsData.length)
    return (
      <div className="text-center py-10 text-gray-400">
        Tidak ada berita terkait.
      </div>
    );

  return (
    <div className="grid grid-cols-1 py-5">
      <div className="flex items-center gap-2 pt-5 pl-4 mb-5">
        <div className="h-3 w-1 bg-[var(--primary-color)] rounded-md mt-1"></div>
        <h2 className="text-2xl font-bold">RelatedPost</h2>
      </div>

      <div className="relative w-full h-[430px] px-4">
        <SwiperBtn
          variant={screen}
          variantName="related"
          isBeginning={isBeginning}
          isEnd={isEnd}
        />

        <Swiper
          modules={[Navigation, Pagination]}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 10 },
            640: { slidesPerView: 2.2, spaceBetween: 15 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 },
            1280: { slidesPerView: 4.2, spaceBetween: 20 },
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
          {postsData.map((post) => (
            <SwiperSlide key={post._id} className="h-full">
              <div className="h-full flex flex-col justify-between space-y-2 shadow rounded-lg p-3 bg-white">
                {post.newsImage ? (
                  <img
                    src={post.newsImage}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-xl transition duration-300 hover:scale-105"
                  />
                ) : (
                  <video
                    src={post.newsVideo}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                )}

                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.description}</p>

                <div className="bg-gray-200 flex items-center gap-2 rounded-lg p-2">
                  <img
                    src={post.author?.profileImage || "/avatar/01.jpg"}
                    alt={post.author?.userName || "anonymous"}
                    className="w-8 h-8 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">
                      {post.author?.fullName || "anonymous"}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleBookmark(post._id || post.externalId, post.bookmark)
                    }
                    className="ml-auto rounded-md p-2 transition-all duration-300 ease-in-out 
                    hover:bg-[var(--primary-color)] hover:text-white hover:shadow-md 
                    hover:ring-2 hover:ring-[var(--primary-color)] cursor-pointer"
                  >
                    {post.bookmark ? (
                      <FaBookmark className="w-5 h-5 " />
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

export default RelatedPost;
