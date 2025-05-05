const BannerHome = () => {
  return (
    <div className="grid grid-cols-1 relative py-5">
      <div className="hidden lg:block md:block">
        <img
          src="/sport/06.jpg"
          alt=""
          className="object-fit blur-[2px] h-100 w-full "
        />
        <div className="grid grid-cols-3 md:grid-cols-1">
          {/* kiri */}
          <div className="hidden lg:block">
            <div className="absolute top-14 left-2">
              <img
                src="/team/calendar.jpg"
                alt="calendar"
                className="none-blur w-80 h-80 rounded-xl"
              />
            </div>
          </div>

          <div className="hidden lg:block">
            {/* tengah */}
            <div className="absolute top-14 left-85">
              <img
                src="/team/club-table.jpg"
                alt="calendar"
                className="none-blur w-135 h-80 rounded-xl"
              />
            </div>
          </div>
          {/* kanan */}
          {/* dekstop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl absolute top-14 lg:right-2 ">
              <img
                src="/team/competition.png"
                alt="calendar"
                className="none-blur w-90 h-80 rounded-xl "
              />
            </div>
          </div>

          {/* tablet */}
          <div className="hidden lg:hidden md:block">
            <div className="bg-white rounded-xl absolute top-14 lg:right-2 ">
              <img
                src="/team/competition.png"
                alt="calendar"
                className="none-blur w-90 h-80 rounded-xl "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerHome;
