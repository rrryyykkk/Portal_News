/* eslint-disable no-unused-vars */
import { useNews } from "../app/store/useNews";
import Category from "../components/common/Category";
import { Card } from "../components/home/Card";
import BannerHome from "./home/post/BannerHome";
import LatestVideos from "./home/post/LatestVideos";
import NewsPost from "./home/post/NewsPost";
import PopularPost from "./home/post/PopularPost";
import TopPost from "./home/post/TopPost";
import TrendPost from "./home/post/TrendPost";
import Weather from "./home/Weather";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const HomePage = ({ video }) => {
  const {
    data: newsData,
    isLoading: newsLoading,
    isError: newsError,
  } = useNews();

  const news = newsData?.data?.news || [];

  if (newsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-lg font-medium text-primary animate-pulse">
            Memuat konten, harap tunggu...
          </p>
        </motion.div>
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl shadow-lg bg-white dark:bg-base-200 border border-red-500 text-red-500 p-6"
        >
          <div className="flex flex-col items-center text-center">
            <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Gagal Memuat Berita</h2>
            <p className="text-sm mb-6">
              Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline btn-sm border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Coba Lagi
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Category news={news} />
      <Card />
      <PopularPost news={news} />
      <BannerHome />
      <NewsPost news={news} />
      <LatestVideos videos={video} />
      <TrendPost news={news} />
      <Weather news={news} />
      <TopPost news={news} />
    </div>
  );
};

export default HomePage;
