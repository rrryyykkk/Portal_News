import { CiStar } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { BsFilePost } from "react-icons/bs";
import { useState } from "react";

const Headers = () => {
  const [follow, setFollow] = useState(false);

  const handleFollow = () => {
    setFollow(!follow);
    console.log(follow);
  };

  return (
    // ini header untuk users liat admin
    <header className="grid gird-cols-2">
      {/* dektop */}
      <div className="hidden lg:block">
        {/* atas */}
        <div className="flex px-5 pt-2 ">
          <img
            src="/header/1.png"
            alt="header"
            className="rounded-md w-full "
          />
        </div>
        {/* bawah */}
        <div className="grid grid-cols-3">
          {/* image */}
          <div className="avatar pl-5 py-2 items-center gap-2">
            <div className="w-16 rounded">
              <img src="/avatar/1.png" alt="avatar" className="" />
            </div>
            <h2 className="text-lg font-bold">Leon Kurniawan</h2>
          </div>
          {/* tengah */}

          <div className="grid grid-cols-3 gap-8 text-gray-600  w-120">
            <div className="flex flex-row justify-start items-center gap-2">
              <CiStar className="w-6 h-6" />
              <p className="text-sm">Rate : 4.2</p>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 ">
              <FaRegUser className="w-4 h-4" />
              <p className="text-sm">Followers : 1.2k</p>
            </div>
            <div className="flex flex-row justify-end items-center gap-2">
              <BsFilePost className="w-4 h-4" />
              <p className="text-sm">Post : 29</p>
            </div>
          </div>
          {/* kanan */}
          <div className="flex items-center justify-end pr-5">
            <button
              onClick={handleFollow}
              className="btn flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)]  text-white w-30 h-10 rounded-2xl cursor-pointer hover:bg-red-400"
            >
              <FaPlus className="w-4 h-4" />
              <p className="text-sm">Follow</p>
            </button>
          </div>
        </div>
      </div>
      {/* tablet */}
      <div className="hidden lg:hidden md:block ">
        {/* atas */}
        <div className="flex px-5 py-2 w-full h-35">
          <img src="/header/1.png" alt="header" className="rounded-md" />
        </div>
        {/* bawah */}
        <div className="grid grid-cols-2 gap-3 items-center py-2">
          {/* Kolom 1: Avatar + Info */}
          <div className="flex items-center gap-5 w-120 ">
            {/* Avatar */}
            <div className="avatar pl-5 ">
              <div className="w-16 rounded ">
                <img src="/avatar/1.png" alt="avatar" />
              </div>
            </div>
            {/* Info */}
            <div className="text-gray-600">
              <h2 className="text-lg font-bold">Leon Kurniawan</h2>
              <div className="grid grid-cols-3 mt-2 gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <CiStar className="w-6 h-6" />
                  <p className="text-sm">Rate : 4.2</p>
                </div>
                <div className="flex flex-row items-center justify-center gap-2">
                  <FaRegUser className="w-4 h-4" />
                  <p className="text-sm">Followers : 1.2k</p>
                </div>
                <div className="flex flex-row items-center justify-end gap-2">
                  <BsFilePost className="w-4 h-4" />
                  <p className="text-sm">Post : 29</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 2: Tombol Follow */}
          <div className="hidden md:block">
            <div className="flex justify-end pr-5 ">
              <button
                onClick={handleFollow}
                className=" btn flex items-center gap-2 bg-[var(--primary-color)] text-white px-4 py-2 rounded-2xl hover:bg-red-400"
              >
                <FaPlus className="w-4 h-4" />
                <p className="text-sm">Follow</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="block md:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center p-2 m-5 rounded-lg bg-gray-200">
          {/* Kolom 1: Avatar + Info */}
          <div className="flex items-center gap-5 w-fit">
            {/* Avatar */}
            <div className="avatar pl-2">
              <div className="w-16 rounded">
                <img src="/avatar/1.png" alt="avatar" />
              </div>
            </div>
            {/* Info */}
            <div className="text-gray-600">
              <div className="flex flex-row items-center justify-between gap-2 w-full">
                <h2 className="text-md font-bold">Leon Kurniawan</h2>
                {/* Tombol Follow (Mobile only) */}
                <div className="block md:hidden pl-5">
                  <button
                    onClick={handleFollow}
                    className="btn flex items-center gap-2 bg-[var(--primary-color)] text-white rounded-xl hover:bg-red-400 px-3 py-1 cursor-pointer"
                  >
                    <FaPlus className="w-4 h-4" />
                    <p className="text-sm">Follow</p>
                  </button>
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 mt-2 gap-2">
                <div className="flex items-center justify-center gap-2">
                  <CiStar className="w-6 h-6" />
                  <p className="text-sm">4.2</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FaRegUser className="w-4 h-4" />
                  <p className="text-sm">1.2 K</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <BsFilePost className="w-4 h-4" />
                  <p className="text-sm">29</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Headers;
