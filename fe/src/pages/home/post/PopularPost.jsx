import { useEffect, useRef, useState } from "react";

// icons
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";

// swiper
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperBtn from "../../../components/common/SwiperBtn";

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

const PopularPost = () => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [postsData, setPostsData] = useState(posts);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsTablet(window.innerWidth <= 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // useEffect(() => {
  //   const swiper = swiperRef.current;
  //   if (isMobile) {
  //     swiper.params.navigation.prevEl =
  //       ".swiper-button-prev-custom-popular-mobile";
  //     swiper.params.navigation.nextEl =
  //       ".swiper-button-next-custom-popular-mobile";
  //   } else if (isTablet) {
  //     swiper.params.navigation.prevEl =
  //       ".swiper-button-prev-custom-popular-tablet";
  //     swiper.params.navigation.nextEl =
  //       ".swiper-button-next-custom-popular-tablet";
  //   } else {
  //     swiper.params.navigation.prevEl = ".swiper-button-prev-custom-popular";
  //     swiper.params.navigation.nextEl = ".swiper-button-next-custom-popular";
  //   }
  //   swiper.navigation.destroy();
  //   swiper.navigation.init();
  //   swiper.navigation.update();
  // }, [isMobile, isTablet]);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }
  };

  const handleBookmark = (id) => {
    setPostsData((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, bookmark: !post.bookmark } : post
      )
    );
  };

  const navVariant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  console.log("navVariant:", navVariant);
  return (
    <div className="grid grid-cols-1">
      {/* atas */}
      <div className="flex items-center gap-2 pt-5 pl-4 mb-5">
        <div className="h-3 w-1 bg-[var(--primary-color)] rounded-md mt-1"></div>
        <h2 className="text-2xl font-bold">Popular Posts</h2>
      </div>
      <div className="relative w-full h-[430px] px-4">
        {/* Tombol Panah  */}
        <SwiperBtn
          variant={navVariant}
          isBeginning={isBeginning}
          isEnd={isEnd}
        />
        {/* Swiper */}
        <Swiper
          key={navVariant}
          modules={[Navigation, Pagination]}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 10 },
            640: { slidesPerView: 2.2, spaceBetween: 15 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 },
            1280: { slidesPerView: 4.2, spaceBetween: 20 },
          }}
          navigation={
            isMobile
              ? {
                  prevEl: ".swiper-button-prev-custom-mobile-popular",
                  nextEl: ".swiper-button-next-custom-mobile-popular",
                }
              : isTablet
              ? {
                  prevEl: ".swiper-button-prev-custom-tablet-popular",
                  nextEl: ".swiper-button-next-custom-tablet-popular",
                }
              : {
                  prevEl: ".swiper-button-prev-custom-popular",
                  nextEl: ".swiper-button-next-custom-popular",
                }
          }
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          className="h-full"
        >
          {postsData.slice(0, 10).map((post) => (
            <SwiperSlide key={post.id} className="h-full">
              <div className="h-full flex flex-col justify-between space-y-2 shadow rounded-lg p-3 bg-white">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.description}</p>
                <div className="bg-gray-200 flex items-center gap-2 rounded-lg p-2">
                  <img
                    src={post.profile.image}
                    alt={post.profile.name}
                    className="w-8 h-8 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">
                      {post.profile.name}
                    </h4>
                    <p className="text-xs text-gray-600">{post.profile.date}</p>
                  </div>
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className="ml-auto rounded-md  transition cursor-pointer hover:bg-gray-200 p-2"
                  >
                    {post.bookmark ? <FaBookmark /> : <CiBookmark />}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PopularPost;
