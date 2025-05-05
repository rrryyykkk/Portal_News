import React from "react";

const categories = [
  { id: 1, text: "#Food", img: "/food/01.jpg" },
  { id: 2, text: "#Animal", img: "/animal/01.jpg" },
  { id: 3, text: "#Weather", img: "/weather/01.jpg" },
  { id: 4, text: "#City", img: "/city/01.jpg" },
  { id: 5, text: "#Dance", img: "/dance/01.jpg" },
  { id: 6, text: "#Car", img: "/car/01.jpg" },
  { id: 7, text: "#Technology", img: "/technology/01.jpg" },
  { id: 8, text: "#Music", img: "/music/02.jpg" },
  { id: 9, text: "#Sport", img: "/sport/01.jpg" },
];

const Category = () => {
  return (
    <div className="hidden lg:block">
      <div className="flex flex-row gap-5 p-5 items-center justify-center">
        {categories.slice(0, 7).map((category) => (
          <div key={category.id} className="mt-2">
            <div className="relative w-40 h-10">
              <a href="/category" className="">
                <img
                  src={category.img}
                  alt={category.text}
                  className=" bg-cover w-full h-full rounded-md blur-[1px] hover:blur-xs"
                />
                <h5 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                  {category.text}
                </h5>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
