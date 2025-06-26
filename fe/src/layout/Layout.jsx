/* eslint-disable no-unused-vars */
import { useNews } from "../app/store/useNews";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Layout = ({ children, meUser }) => {
  const {
    data: newsData,
    isLoading: newsLoading,
    isError: newsError,
  } = useNews();

  const newsList = newsData?.data?.news || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar meUser={meUser} news={newsList} isLoading={newsLoading} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
