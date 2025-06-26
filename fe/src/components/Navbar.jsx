// ...imports
import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiAngleDown } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { useAuthStore } from "../app/store/useAuthStore";
import { useToastStore } from "../app/store/useToastStore";
import { useSearch } from "../app/store/useSearch";

// ...LoginButton & navLinks tetap sama
const LoginButton = () => (
  <Link
    to="/login"
    className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-md group transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
  >
    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-white opacity-10 group-hover:translate-x-0 group-hover:translate-y-0"></span>
    <span className="relative">Login</span>
  </Link>
);

const navLinks = [
  { name: "Contact Us", path: "/contact-us" },
  { name: "About Us", path: "/about-us" },
];

const AvatarDropdown = ({ meUser }) => {
  const { logout } = useAuthStore();
  const { setToast } = useToastStore();

  const handleLogout = async () => {
    try {
      await logout();
      setToast({ message: "Logout successfully", type: "success" });
    } catch (error) {
      setToast({ message: "Logout failed", type: "error" });
      console.error(error);
    }
  };

  return (
    <div className="dropdown dropdown-end hidden sm:block">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar hover:ring hover:ring-red-400 transition duration-300"
      >
        <div className="w-10 rounded-full ring ring-red-500 ring-offset-2 ring-offset-white">
          {meUser?.avatarUrl ? (
            <img
              alt="User Avatar"
              src={meUser.avatarUrl}
              className="object-cover"
            />
          ) : (
            <div className="bg-neutral text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              {meUser?.userName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
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
          <button
            onClick={handleLogout}
            className="hover:bg-red-100 hover:text-red-600 font-medium rounded-lg flex items-center gap-2 w-full"
          >
            <IoIosLogOut className="w-4 h-4" /> Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

const Navbar = ({ meUser, news = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const { logout } = useAuthStore();
  const { setToast } = useToastStore();

  const {
    data: searchResult,
    refetch,
    isFetching,
  } = useSearch(debouncedSearchKeyword);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword.trim());
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchKeyword]);

  useEffect(() => {
    if (debouncedSearchKeyword.length >= 2) {
      refetch();
      setShowDropDown(true);
    } else {
      setShowDropDown(false);
    }
  }, [debouncedSearchKeyword, refetch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const CategoryOptions = Array.from(
    new Set(news.map((item) => item.category))
  ).filter(Boolean);

  const renderSearchDropdown = () => (
    <div className="absolute left-0 right-0 bg-white border rounded-md shadow-lg mt-2 z-50 max-h-96 overflow-y-auto">
      {isFetching ? (
        <div className="p-4 text-sm text-gray-500">Loading...</div>
      ) : !searchResult ||
        (!searchResult.news?.length && !searchResult.user?.length) ? (
        <div className="p-4 text-sm text-gray-500">No results found</div>
      ) : (
        <>
          {searchResult?.users?.length > 0 && (
            <div className="px-3 pt-2 text-xs text-gray-500">Users</div>
          )}
          {searchResult?.users?.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              onMouseDown={(e) => e.preventDefault()}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={user.profileImage || "/avatar/01.jpg"}
                alt={user.userName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm">{user.userName}</span>
            </Link>
          ))}
          {searchResult?.news?.length > 0 && (
            <div className="px-3 pt-2 text-xs text-gray-500">News</div>
          )}
          {searchResult?.news?.map((news) => (
            <Link
              to={`/news/${news._id}`}
              key={news._id}
              onMouseDown={(e) => e.preventDefault()}
              className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <span className="text-sm">{news.title}</span>
            </Link>
          ))}
        </>
      )}
    </div>
  );

  return (
    <div
      className={`${
        isScrolled ? "fixed top-0 bg-gray-100" : "relative bg-gray-100"
      } top-0 z-50 w-full`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 h-20">
        {/* Left */}
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

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-8 text-sm font-medium text-gray-600 ml-8">
            <div className="dropdown dropdown-hover">
              <div
                tabIndex={0}
                className="flex items-center gap-1 hover:text-[var(--primary-color)] cursor-pointer"
              >
                Category <TfiAngleDown className="w-3 h-3 translate-y-0.5" />
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

        {/* Search + Auth */}
        <div className="flex items-center gap-4">
          {/* Search input */}
          <div className="relative block md:hidden lg:block w-fit lg:w-80">
            <input
              type="text"
              placeholder="Search..."
              className="input input-sm input-bordered border-none bg-gray-200 rounded-lg w-full pr-8 text-sm"
              onChange={(e) => setSearchKeyword(e.target.value)}
              onFocus={() =>
                debouncedSearchKeyword.length >= 2 && setShowDropDown(true)
              }
              onBlur={() => setTimeout(() => setShowDropDown(false), 200)}
            />
            <FaSearch className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500" />
            {showDropDown && renderSearchDropdown()}
          </div>

          {/* Auth */}
          {meUser ? (
            <>
              <AvatarDropdown meUser={meUser} />
              <Link
                to="/profile/me"
                className="cursor-pointer hidden md:block bg-gray-200 p-2 rounded-3xl hover:bg-[var(--primary-color)] hover:text-white"
              >
                <CiBookmark className="w-6 h-6" />
              </Link>
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>

      {/* Tablet search */}
      <div className="px-6 py-1 hidden md:block lg:hidden bg-white shadow-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="input input-sm input-bordered border-none bg-gray-200 rounded-lg w-full pr-8 text-sm"
            onChange={(e) => setSearchKeyword(e.target.value)}
            onFocus={() =>
              debouncedSearchKeyword.length >= 2 && setShowDropDown(true)
            }
            onBlur={() => setTimeout(() => setShowDropDown(false), 200)}
          />
          <FaSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500" />
          {showDropDown && renderSearchDropdown()}
        </div>
      </div>

      {/* Sidebar mobile/tablet */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto max-h-screen">
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
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold text-[var(--primary-color)] md:hidden"
                >
                  ZYnnn.news
                </Link>
                <div className="font-bold text-md mt-4">Category</div>
                {CategoryOptions.map((item) => (
                  <Link
                    key={item}
                    to={`/category/${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-[var(--primary-color)] hover:bg-gray-200 p-2 rounded-md capitalize"
                  >
                    {item}
                  </Link>
                ))}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-[var(--primary-color)] hover:bg-gray-200 p-2 rounded-md font-bold"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr />
              </div>

              {/* User Info + Logout */}
              <div className="flex flex-col gap-8">
                <div className="font-bold text-md block lg:hidden md:hidden space-y-4">
                  {meUser ? (
                    <>
                      <Link
                        to="/profile/me"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 hover:text-[var(--primary-color)]"
                      >
                        {meUser.avatarUrl ? (
                          <img
                            className="w-10 h-10 rounded-full ring ring-red-500 ring-offset-2 ring-offset-white object-cover"
                            src={meUser.avatarUrl}
                            alt="User"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full ring ring-red-500 ring-offset-2 ring-offset-white bg-neutral text-white flex items-center justify-center font-bold">
                            {meUser?.userName?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <h2 className="font-bold">
                          {meUser?.userName || "Guest"}
                        </h2>
                      </Link>
                      <button
                        onClick={async () => {
                          try {
                            await logout();
                            setToast({
                              message: "Logout successfully",
                              type: "success",
                            });
                            setMenuOpen(false); // ✅ Tutup sidebar setelah logout
                          } catch {
                            setToast({
                              message: "Logout failed",
                              type: "error",
                            });
                          }
                        }}
                        className="flex items-center gap-2 hover:text-[var(--primary-color)] mb-5 cursor-pointer"
                      >
                        <IoIosLogOut className="text-[var(--primary-color)] h-7 w-7" />
                        <h2 className="text-lg font-bold">Log Out</h2>
                      </button>
                    </>
                  ) : (
                    <LoginButton />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
