// icons
import { FaPaperPlane } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import { useState } from "react";

const user = {
  id: 1,
  name: "John Doe",
  img: "/avatar/1.png",
  post: 100,
};

const tags = ["#cat", "#dog", "#rabbit", "#bird", "#fish", "#hamster"];

const topPost = [
  {
    id: 1,
    title: "Test-1",
    img: "/weather/01.jpg",
    date: "2023-01-01",
    category: "Weather",
  },
  {
    id: 2,
    title: "Test-2",
    img: "/abstract/02.jpg",
    date: "2023-02-02",
    category: "abstract",
  },
  {
    id: 3,
    title: "Test-3",
    img: "/animal/03.jpg",
    date: "2023-03-03",
    category: "animal",
  },
  {
    id: 4,
    title: "Test-4",
    img: "/weather/04.jpg",
    date: "2023-04-04",
    category: "Weather",
  },
  {
    id: 5,
    title: "Test-5",
    img: "/city/02.jpg",
    date: "2023-05-05",
    category: "city",
  },
  {
    id: 6,
    title: "Test-6",
    img: "/weather/06.jpg",
    date: "2023-06-06",
    category: "Weather",
  },
];

const SideBar = () => {
  const [follow, setFollow] = useState(false);

  const handleFollow = () => {
    setFollow(!follow);
    console.log(follow);
  };
  return (
    <aside className="flex flex-col pt-4 gap-6 ">
      {/* atas */}
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 items-center justify-center bg-gray-300 p-1 rounded-lg w-25">
          <FaPaperPlane className="w-3 h-3" />
          <p className="text-sm">Share</p>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center bg-gray-300 p-2 rounded-lg w-25">
          <CiBookmark className="w-5 h-5" />
          <h4 className="text-sm">Bookmark</h4>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center bg-gray-300 p-2 rounded-lg w-25">
          <MdOutlineComment className="w-3 h-3" />
          <h4 className="text-sm">Comment</h4>
        </div>
      </div>
      {/* profile */}
      <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm w-full">
        {/* avatar + name */}
        <div className="flex items-center gap-4">
          <div className="avatar shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img alt="User Avatar" src={user.img} />
            </div>
          </div>
          <div className="flex flex-col  w-fit gap-2">
            <div className="flex flex-row items-center justify-between gap-15">
              <h2 className="text-base font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.post} post</p>
            </div>

            <button
              onClick={handleFollow}
              className="self-start flex items-center gap-1 px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-medium rounded-xl hover:bg-pink-600"
            >
              <FaPlus className="w-4 h-4" />
              <span>Follow</span>
            </button>
          </div>
        </div>
      </div>
      {/* Tags */}
      <div className="flex flex-col gap-2 bg-gray-300 p-2 rounded-lg w-full max-w-md">
        <div className="flex flex-row items-center gap-2">
          <div className="h-4 w-1 bg-[var(--primary-color)]"></div>
          <h2 className="text-lg font-bold">Tags</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {tags.map((tag, index) => (
            <div
              className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full shadow-sm"
              key={index}
            >
              <h4>{tag}</h4>
            </div>
          ))}
        </div>
      </div>
      {/* top post */}
      <div className="flex flex-col  gap-2 bg-gray-300 p-2 rounded-lg w-full">
        <div className="flex flex-row items-center gap-2">
          <div className="h-4 w-1 bg-[var(--primary-color)]"></div>
          <h2 className="text-lg font-bold">Top Post</h2>
        </div>
        <div className="flex flex-col gap-4">
          {topPost.map((post, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Image */}
              <div className="w-20 h-20 shrink-0">
                <img
                  alt={post.title}
                  src={post.img}
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-between flex-1 gap-10">
                <h4 className="text-sm font-semibold line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
