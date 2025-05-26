import Category from "../components/common/Category";
import { Card } from "../components/home/Card";
import BannerHome from "./home/post/BannerHome";
import LatestVideos from "./home/post/LatestVideos";
import NewsPost from "./home/post/NewsPost";
import PopularPost from "./home/post/PopularPost";
import TopPost from "./home/post/TopPost";
import TrendPost from "./home/post/TrendPost";
import Weather from "./home/Weather";

const HomePage = ({ news }) => {
  return (
    <div className="min-h-screen bg-white">
      <Category news={news} />
      <Card />
      <PopularPost news={news} />
      <BannerHome />
      <NewsPost news={news} />
      <LatestVideos />
      <TrendPost news={news} />
      <Weather news={news} />
      <TopPost news={news} />
    </div>
  );
};

export default HomePage;
