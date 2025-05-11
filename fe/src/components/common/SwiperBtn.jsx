import { RxCaretLeft } from "react-icons/rx";
import { RxCaretRight } from "react-icons/rx";

const SwiperBtn = ({
  variant = "desktop",
  variantName = "popular",
  isBeginning,
  isEnd,
}) => {
  const prevClass = {
    mobile: `mobile-prev-${variantName}`,
    tablet: `tablet-prev-${variantName}`,
    desktop: `desktop-prev-${variantName}`,
  };
  const nexClass = {
    mobile: `mobile-next-${variantName}`,
    tablet: `tablet-next-${variantName}`,
    desktop: `desktop-next-${variantName}`,
  };

  const leftPos = {
    mobile: { left: "280px" },
    tablet: { left: "620px" },
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
