import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// icons
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { RxCaretRight } from "react-icons/rx";

const posts = [
  {
    id: 1,
    title: "Post 1",
    description: "Description 1",
    image: "/animal/01.jpg",
    profile: {
      name: "John Doe",
      image: "/avatar/01.jpg",
      date: "2023-01-01",
    },
    bookmark: false,
  },
  {
    id: 2,
    title: "Post 2",
    description: "Description 2",
    image: "/animal/02.jpg",
    profile: {
      name: "Joni Dun",
      image: "/avatar/02.jpg",
      date: "2023-02-01",
    },
    bookmark: false,
  },
  {
    id: 3,
    title: "Post 3",
    description: "Description 3",
    image: "/animal/03.jpg",
    profile: {
      name: "Johan Dee",
      image: "/avatar/03.jpg",
      date: "2023-03-01",
    },
    bookmark: false,
  },
  {
    id: 4,
    title: "Post 4",
    description: "Description 4",
    image: "/animal/04.jpg",
    profile: {
      name: "ana Doe",
      image: "/avatar/04.jpg",
      date: "2023-04-01",
    },
    bookmark: false,
  },
  {
    id: 5,
    title: "Post 5",
    description: "Description 5",
    image: "/animal/05.jpg",
    profile: {
      name: "sarah Doe",
      image: "/avatar/05.jpg",
      date: "2023-05-01",
    },
    bookmark: false,
  },
  {
    id: 6,
    title: "Post 6",
    description: "Description 6",
    image: "/animal/06.jpg",
    profile: {
      name: "Hanna Doe",
      image: "/avatar/06.jpg",
      date: "2023-06-01",
    },
    bookmark: false,
  },
  {
    id: 7,
    title: "Post 7",
    description: "Description 7",
    image: "/animal/07.jpg",
    profile: {
      name: "hanna",
      image: "/avatar/07.jpg",
      date: "2023-07-01",
    },
    bookmark: false,
  },
  {
    id: 8,
    title: "Post 8",
    description: "Description 8",
    image: "/animal/08.jpg",
    profile: {
      name: "Oppica",
      image: "/avatar/08.jpg",
      date: "2023-08-01",
    },
    bookmark: false,
  },
  {
    id: 9,
    title: "Post 9",
    description: "Description 9",
    image: "/animal/09.jpg",
    profile: {
      name: "yooohan",
      image: "/avatar/09.jpg",
      date: "2023-09-01",
    },
    bookmark: false,
  },
  {
    id: 10,
    title: "Post 10",
    description: "Description 10",
    image: "/animal/10.jpg",
    profile: {
      name: "aliyah",
      image: "/avatar/10.jpg",
      date: "2023-10-01",
    },
    bookmark: false,
  },
];

const NewsPost = () => {
  const [postsData, setPostsData] = useState(posts);
  const [visiblePosts, setVisiblePosts] = useState([]);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia(
      "(min-width: 640px) and (max-width: 1024px)"
    );
    const desktop = window.matchMedia("(min-width: 1025px)");

    const handleMediaQueryChange = () => {
      if (mobile.matches) {
        setVisiblePosts(postsData.slice(0, 1));
      } else {
        setVisiblePosts(postsData.slice(0, 4));
      }
    };
    handleMediaQueryChange();
    mobile.addEventListener("change", handleMediaQueryChange);
    tablet.addEventListener("change", handleMediaQueryChange);
    desktop.addEventListener("change", handleMediaQueryChange);
    return () => {
      mobile.removeEventListener("change", handleMediaQueryChange);
      tablet.removeEventListener("change", handleMediaQueryChange);
      desktop.removeEventListener("change", handleMediaQueryChange);
    };
  }, [postsData]);

  const handleBookmark = (id) => {
    setPostsData((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, bookmark: !post.bookmark } : post
      )
    );
  };

  return (
    <div className="grid grid-rows-1">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2 pt-5 pl-5">
          <div className="h-3 w-1 bg-[var(--primary-color)] rounded-md mt-1"></div>
          <h2 className="text-2xl font-bold">News Posts</h2>
        </div>
        <div className="p-2">
          <Link
            to="/news-post"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center cursor-pointer"
          >
            <h1>Show All</h1>
            <RxCaretRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 px-4 md:px-8 pt-4 gap-5">
        {visiblePosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4 grid md:grid-cols-2 gap-2"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-40 object-cover rounded-xl"
            />

            <div className="flex flex-col justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-sm text-gray-700">{post.description}</p>
              </div>

              <div className="flex items-center bg-gray-100 p-2 rounded-lg shadow">
                <img
                  src={post.profile.image}
                  alt={post.profile.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col ml-2">
                  <h3 className="text-sm font-semibold">{post.profile.name}</h3>
                  <p className="text-xs text-gray-500">{post.profile.date}</p>
                </div>
                <button
                  onClick={() => handleBookmark(post.id)}
                  className="ml-auto cursor-pointer bg-gray-300 p-2 rounded-lg"
                >
                  {post.bookmark ? (
                    <FaBookmark className="w-5 h-5" />
                  ) : (
                    <CiBookmark className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPost;
