const weathers = [
  {
    id: 2,
    name: "Weather 2",
    image: "/weather/app/2.jpg",
  },
  {
    id: 3,
    name: "Weather 3",
    image: "/weather/app/3.jpg",
  },
  {
    id: 4,
    name: "Weather 4",
    image: "/weather/app/4.jpg",
  },
  {
    id: 5,
    name: "Weather 5",
    image: "/weather/app/5.jpg",
  },
];

const Weather = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 bg-gray-100 py-5">
      {/* kiri */}
      <div className="p-5 hidden lg:block">
        <img
          src="/weather/app/1.jpg"
          alt="weather app"
          className="w-full rounded-xl"
        />
      </div>
      {/* kanan */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        {weathers.map((item) => (
          <div key={item.id} className="p-5 hidden lg:block">
            <img
              src={item.image}
              alt="weather app"
              className="w-full rounded-xl"
            />
          </div>
        ))}
      </div>
      <div className="p-5 flex justify-center lg:hidden ">
        <div className=" w-full max-w-sm">
          <img
            src="/weather/app/2.jpg"
            alt=""
            className="w-full rounded-2xl "
          />
        </div>
      </div>
    </div>
  );
};

export default Weather;
