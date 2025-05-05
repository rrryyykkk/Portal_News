import Category from "../components/common/Category";
import { Card } from "../components/home/Card";
import BannerHome from "./home/post/BannerHome";
import LatesetVideos from "./home/post/LatesetVideos";
import NewsPost from "./home/post/NewsPost";
import PopularPost from "./home/post/PopularPost";
import TopPost from "./home/post/TopPost";
import TrendPost from "./home/post/TrendPost";
import Weather from "./home/Weather";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Category />
      <Card />
      <PopularPost />
      <BannerHome />
      <NewsPost />
      <LatesetVideos />
      <TrendPost />
      <Weather />
      <TopPost />
    </div>
  );
};

export default HomePage;
