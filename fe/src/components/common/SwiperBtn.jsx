import { RxCaretLeft } from "react-icons/rx";
import { RxCaretRight } from "react-icons/rx";

const SwiperBtn = ({ variant = "desktop", isBeginning, isEnd }) => {
  const prevClass = {
    mobile: "swiper-button-prev-custom-mobile-popular",
    tablet: "swiper-button-prev-custom-tablet-popular",
    desktop: "swiper-button-prev-custom-popular",
  };
  const nexClass = {
    mobile: "swiper-button-next-custom-mobile-popular",
    tablet: "swiper-button-next-custom-tablet-popular",
    desktop: "swiper-button-next-custom-popular",
  };

  const leftPos = {
    mobile: { left: "100px" },
    tablet: { left: "100px" },
    desktop: { left: "1080px" },
  };
  return (
    <>
      {/* Tombol Swipper */}

      {/* kiri */}
      <div
        className={`${
          prevClass[variant]
        } absolute -top-10 z-10 -translate-y-1/2  bg-gray-300 p-2 rounded-lg shadow hover:bg-gray-200 cursor-pointer ${
          isBeginning ? "opacity-30 pointer-events-none" : ""
        }`}
        style={leftPos[variant]}
      >
        <RxCaretLeft className="w-6 h-6" />
      </div>

      {/* kanan */}
      <div
        className={`${
          nexClass[variant]
        } absolute -top-10 right-10 z-10 -translate-y-1/2 bg-gray-300 p-2 rounded-lg shadow hover:bg-gray-200 cursor-pointer ${
          isEnd ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        <RxCaretRight className="w-6 h-6" />
      </div>
    </>
  );
};

export default SwiperBtn;
