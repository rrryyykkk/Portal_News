import React, { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiAngleDown } from "react-icons/tfi";

const navLinks = ["Contact Us", "About Us"];
const userOptions = ["Profile", "Settings"];
const CategoryOptions = [
  "Politics",
  "Sport",
  "Technology",
  "Entertainment",
  "Business",
];

const AvatarDropdown = () => (
  <div className="dropdown dropdown-end hidden sm:block">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full ring ring-red-500 ring-offset-2 ring-offset-white">
        <img
          alt="User Avatar"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        />
      </div>
    </div>
    <ul className="menu menu-sm dropdown-content mt-4 z-[1] p-3 shadow-lg bg-white rounded-xl w-48 space-y-2 text-sm text-gray-700">
      {userOptions.map((item) => (
        <li key={item}>
          <a>{item}</a>
        </li>
      ))}
    </ul>
  </div>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setisScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setisScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Wrapper Fixed Navbar */}

      <div
        className={`${
          isScrolled ? "fixed top-0 bg-gray-100" : "relative bg-gray-100"
        } top-0 z-50 w-full `}
      >
        <div className="flex justify-between items-center px-6 h-20">
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden btn btn-ghost btn-square"
            >
              <RxHamburgerMenu className="w-8 h-8" />
            </button>

            <a
              href="#"
              className="text-2xl font-bold text-[color:var(--primary-color)] tracking-wide hidden md:block"
            >
              ZYnnn.news
            </a>

            {/* Nav Links - Desktop only */}
            <div className="hidden lg:flex gap-8 text-sm font-medium text-gray-600 ml-8">
              <div className="dropdown dropdown-hover">
                <a
                  href="#"
                  className="flex items-center gap-1 hover:text-[var(--primary-color)]"
                  tabIndex={0}
                >
                  Category
                  <TfiAngleDown className="w-3 h-3 translate-0.5" />
                </a>
                <ul
                  tabIndex={0}
                  className="dropdown-content flex flex-row menu p-2 shadow bg-base-100 rounded-box"
                >
                  {CategoryOptions.map((item) => (
                    <li key={item}>
                      <a className="hover:text-[var(--primary-color)]">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {navLinks.map((link) => (
                <a key={link} className="hover:text-red-500 cursor-pointer">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Search + Avatar + Bookmark */}
          <div className="flex items-center gap-4">
            <div className="relative block md:hidden lg:block w-fit lg:w-80">
              <input
                type="text"
                placeholder="Search..."
                className="input input-sm input-bordered border-none bg-gray-200 rounded-lg w-full pr-8 text-sm"
              />
              <FaSearch className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500" />
            </div>

            <AvatarDropdown />

            <div className="cursor-pointer hidden md:block bg-gray-200 p-2 rounded-3xl hover:bg-[var(--primary-color)] hover:text-white">
              <CiBookmark className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search Input - Mobile/Tablet */}
        <div className="px-6 py-1 hidden md:block lg:hidden bg-white shadow-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="input input-sm input-bordered border-none bg-gray-200 rounded-lg w-full pl-8 text-sm"
            />
            <FaSearch className="absolute top-2.5 right-3 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Sidebar & Overlay */}
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

                <a
                  href="#"
                  className="text-2xl font-bold text-[var(--primary-color)] md:hidden"
                >
                  ZYnnn.news
                </a>

                <a className="hover:text-[var(--primary-color)] hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                  Category
                </a>

                {navLinks.map((link) => (
                  <a
                    key={link}
                    className="hover:text-[var(--primary-color)] hover:bg-gray-200 p-2 rounded-md cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}
                <hr />
              </div>

              {/* Profile + Logout */}
              <div className="flex flex-col gap-4">
                <a className="block md:hidden cursor-pointer hover:bg-gray-200 p-2 rounded-md">
                  <div className="flex items-center gap-2 hover:text-[var(--primary-color)]">
                    <img
                      className="w-10 rounded-full ring ring-red-500 ring-offset-2 ring-offset-white"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt="User"
                    />
                    <h2 className="font-bold">John Doe</h2>
                  </div>
                </a>
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
