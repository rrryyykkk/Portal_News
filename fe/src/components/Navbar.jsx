import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiAngleDown } from "react-icons/tfi";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Contact Us", path: "/contact-us" },
  { name: "About Us", path: "/about-us" },
];

const AvatarDropdown = ({ meUser }) => {
  return (
    <div className="dropdown dropdown-end hidden sm:block">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar hover:ring hover:ring-red-400 transition duration-300"
      >
        <div className="w-10 rounded-full ring ring-red-500 ring-offset-2 ring-offset-white">
          <img
            alt="User Avatar"
            src={meUser?.avatarUrl || "/default.jpg"}
            className="object-cover"
          />
        </div>
      </div>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-4 z-[1] p-4 shadow-2xl bg-white rounded-xl w-56 space-y-2 text-sm text-gray-700 animate-fade-in"
      >
        <li className="flex flex-col px-2 py-1 border-b border-gray-200">
          <span className="font-semibold">{meUser?.userName}</span>
          <span className="text-xs text-gray-400">{meUser?.email || ""}</span>
        </li>
        <li>
          <Link
            to="/profile/me"
            className="hover:bg-red-100 hover:text-red-600 font-medium rounded-lg"
          >
            👤 Profile
          </Link>
        </li>
        <li>
          <Link
            to="/profile/me/edit"
            className="hover:bg-red-100 hover:text-red-600 font-medium rounded-lg"
          >
            ✏️ Edit Profile
          </Link>
        </li>
        <li>
          <a
            href="/logout"
            className="hover:bg-red-100 hover:text-red-600 font-medium rounded-lg"
          >
            <IoIosLogOut className="w-4 h-4" /> Log Out
          </a>
        </li>
      </ul>
    </div>
  );
};

const Navbar = ({ meUser, news = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get unique category list from news
  const CategoryOptions = Array.from(
    new Set(news.map((item) => item.category))
  ).filter(Boolean);

  return (
    <>
      {/* Navbar */}
      <div
        className={`${
          isScrolled ? "fixed top-0 bg-gray-100" : "relative bg-gray-100"
        } top-0 z-50 w-full`}
      >
        <div className="flex justify-between items-center px-6 h-20">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden btn btn-ghost btn-square"
            >
              <RxHamburgerMenu className="w-8 h-8" />
            </button>

            <Link
              to="/"
              className="text-2xl font-bold text-[color:var(--primary-color)] tracking-wide hidden md:block"
            >
              ZYnnn.news
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex gap-8 text-sm font-medium text-gray-600 ml-8">
              <div className="dropdown dropdown-hover">
                <div
                  tabIndex={0}
                  className="flex items-center gap-1 hover:text-[var(--primary-color)] cursor-pointer"
                >
                  Category
                  <TfiAngleDown className="w-3 h-3 translate-y-0.5" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content flex flex-row flex-wrap menu p-2 shadow bg-base-100 rounded-box z-50"
                >
                  {CategoryOptions.map((item) => (
                    <li key={item}>
                      <Link
                        to={`/category/${item.toLowerCase()}`}
                        className="hover:text-[var(--primary-color)] capitalize"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-red-500 cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="relative block md:hidden lg:block w-fit lg:w-80">
              <input
                type="text"
                placeholder="Search..."
                className="input input-sm input-bordered border-none bg-gray-200 rounded-lg w-full pr-8 text-sm"
              />
              <FaSearch className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500" />
            </div>

            <AvatarDropdown meUser={meUser} />

            <Link
              to={"/profile/me"}
              className="cursor-pointer hidden md:block bg-gray-200 p-2 rounded-3xl hover:bg-[var(--primary-color)] hover:text-white"
            >
              <CiBookmark className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Search Input for Tablet only */}
        <div className="px-6 py-1 hidden md:block lg:hidden bg-white shadow-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="input input-sm input-bordered border-none bg-gray-200 rounded-lg w-full pr-8 text-sm"
            />
            <FaSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Sidebar + Overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          ></div>

          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50">
            <div className="flex flex-col justify-between h-full p-6 text-gray-700 text-sm">
              <div className="flex flex-col gap-4">
                <button
                  className="self-end bg-gray-200 h-8 w-8 rounded-md hover:bg-[var(--primary-color)] hover:text-white flex items-center justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <IoMdClose className="h-6 w-6 cursor-pointer" />
                </button>

                <Link
                  to="/"
                  className="text-2xl font-bold text-[var(--primary-color)] md:hidden"
                >
                  ZYnnn.news
                </Link>

                <div className="font-bold text-md mt-4">Category</div>
                {CategoryOptions.map((item) => (
                  <Link
                    key={item}
                    to={`/category/${item.toLowerCase()}`}
                    className="hover:text-[var(--primary-color)] hover:bg-gray-200 p-2 rounded-md capitalize"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="hover:text-[var(--primary-color)] hover:bg-gray-200 p-2 rounded-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr />
              </div>

              {/* Bottom Sidebar */}
              <div className="flex flex-col gap-4">
                <div className="block md:hidden cursor-pointer hover:bg-gray-200 p-2 rounded-md">
                  <div className="flex items-center gap-2 hover:text-[var(--primary-color)]">
                    <img
                      className="w-10 rounded-full ring ring-red-500 ring-offset-2 ring-offset-white"
                      src={meUser?.avatarUrl || "/default.jpg"}
                      alt="User"
                    />
                    <h2 className="font-bold">{meUser?.userName || "Guest"}</h2>
                  </div>
                </div>
                <button className="flex items-center gap-2 hover:text-[var(--primary-color)]">
                  <IoIosLogOut className="text-[var(--primary-color)] h-7 w-7" />
                  <h2 className="text-lg font-bold">Log Out</h2>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
