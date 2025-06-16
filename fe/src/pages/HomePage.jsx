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

const HomePage = ({ video }) => {
  const {
    data: newsData,
    isLoading: newsLoading,
    isError: newsError,
  } = useNews();

  const news = newsData?.data?.news || [];
  console.log("news-home:", news);
  if (newsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-lg font-semibold text-primary">
            Memuat konten, harap tunggu...
          </p>
        </div>
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="card w-96 bg-error text-error-content shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">Gagal Memuat Berita</h2>
            <p>
              Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.
            </p>
            <div className="card-actions justify-center mt-4">
              <button
                className="btn btn-sm btn-outline btn-accent"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
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
