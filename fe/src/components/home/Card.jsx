import { useEffect, useRef, useState } from "react";
// icons
import { RxCaretLeft } from "react-icons/rx";
import { RxCaretRight } from "react-icons/rx";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const cards = [
  {
    id: 1,
    title: "Mastering the Basics of Safe Driving",
    description:
      "Every great journey starts with understanding the road. Learn how to stay safe and confident behind the wheel.",
    img: "/car/01.jpg",
  },
  {
    id: 2,
    title: "Top 10 Defensive Driving Tips You Must Know",
    description:
      "From blind spots to bad weather—these essential techniques will help you avoid accidents before they happen.",
    img: "/car/02.jpg",
  },
  {
    id: 3,
    title: "The Beginner's Guide to Driving Etiquette",
    description:
      "Driving isn't just about rules—it's about respect. Discover the unspoken codes of the road.",
    img: "/car/03.jpg",
  },
  {
    id: 4,
    title: "Night Driving: How to Stay Focused and Alert",
    description:
      "Low visibility and fatigue can be dangerous at night. Here's how to drive safely when the sun goes down.",
    img: "/car/04.jpg",
  },
  {
    id: 5,
    title: "Rainy Day Driving: What Most People Get Wrong",
    description:
      "Wet roads require more than just slower speeds. Learn the smart way to handle your car in the rain.",
    img: "/car/05.jpg",
  },
  {
    id: 6,
    title: "Car Maintenance Basics for New Drivers",
    description:
      "Keeping your vehicle in top shape is key to safe driving. Here's what every beginner should know.",
    img: "/car/06.jpg",
  },
  {
    id: 7,
    title: "Understanding Road Signs Like a Pro",
    description:
      "It's not just about passing the test—knowing your signs helps you react faster and safer on the road.",
    img: "/car/07.jpg",
  },
  {
    id: 8,
    title: "How to Handle Emergencies on the Road",
    description:
      "Tire blowouts, engine failure, or getting lost—stay calm with these quick response tips.",
    img: "/car/08.jpg",
  },
];

const StaticCard = ({ img, title, description }) => (
  <div className="relative w-70 h-96 rounded-xl overflow-hidden shadow-lg">
    <img src={img} alt="Car" className="w-full h-full object-cover" />
    <div className="absolute bottom-0 w-[90%] bg-white/70 backdrop-blur-md text-black p-4 m-5 rounded-2xl text-center">
      <h1 className="text-lg font-bold mb-2">{title}</h1>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

export const Card = () => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const swiper = swiperRef.current;
    swiper.params.navigation.prevEl = isTablet
      ? ".swiper-button-prev-custom-mobile"
      : ".swiper-button-prev-custom";
    swiper.params.navigation.nextEl = isTablet
      ? ".swiper-button-next-custom-mobile"
      : ".swiper-button-next-custom";
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, [isTablet]);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
      console.log("isBeginning:", swiper.isBeginning, "isEnd:", swiper.isEnd);
    }
  };
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-10 p-5">
      {/* Kiri */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-10">
          <StaticCard
            img="/car/01.jpg"
            title="How to Drive a Car Safely"
            description="Ah, The Joy Of The Open Road—It's A Good Feeling. But If You're New To Driving, You May…"
          />
          <StaticCard
            img="/car/02.jpg"
            title="How to Drive a Car Safely"
            description="Ah, The Joy Of The Open Road—It's A Good Feeling. But If You're New To Driving, You May…"
          />
        </div>
      </div>
      {/* Kanan - Swiper */}
      <div className="hidden lg:block md:block">
        <div className="w-full h-96">
          {/* custom swiper */}
          {isTablet ? (
            <>
              {/* tablet */}
              {/* Panah Kiri */}
              <div
                className={`swiper-button-prev-custom-mobile absolute top-2/4 left-10 z-10 -translate-y-1/2 bg-white p-2 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition ${
                  isBeginning ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <RxCaretLeft className="w-6 h-6 text-black" />
              </div>
              {/* Panah kanan */}
              <div
                className={`swiper-button-next-custom-mobile absolute top-1/2 right-10 z-10 -translate-y-1/2 bg-white p-2 rounded-lg shadow cursor-pointer hover:bg-gray-200 ${
                  isEnd ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <RxCaretRight className="w-6 h-6 text-black" />
              </div>
            </>
          ) : (
            <>
              {/* desktop */}
              {/* Panah Kiri */}
              <div
                className={`swiper-button-prev-custom absolute top-2/4 left-168 z-10 -translate-y-1/2 bg-white p-2 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition ${
                  isBeginning ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <RxCaretLeft className="w-6 h-6 text-black" />
              </div>
              {/* Panah kanan */}
              <div
                className={`swiper-button-next-custom absolute top-1/2 right-10 z-10 -translate-y-1/2 bg-white p-2 rounded-lg shadow cursor-pointer hover:bg-gray-200 ${
                  isEnd ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <RxCaretRight className="w-6 h-6 text-black" />
              </div>
            </>
          )}

          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            navigation={{
              prevEl: isTablet
                ? ".swiper-button-prev-custom-mobile"
                : ".swiper-button-prev-custom",
              nextEl: isTablet
                ? ".swiper-button-next-custom-mobile"
                : ".swiper-button-next-custom",
            }}
            pagination={{ clickable: true }}
            className="h-full"
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
          >
            {cards.slice(0, 8).map((card) => (
              <SwiperSlide key={card.id} className="relative h-full">
                <img
                  src={card.img}
                  alt="Car"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
                <div className="absolute bottom-0 w-[90%] bg-white/70 backdrop-blur-md text-black p-4 m-5 rounded-2xl text-center">
                  <h1 className="text-lg font-bold mb-2">{card.title}</h1>
                  <p className="text-sm text-gray-700">{card.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
