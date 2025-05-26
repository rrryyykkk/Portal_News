import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Layout = ({ children, meUser, news }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar meUser={meUser} news={news} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
