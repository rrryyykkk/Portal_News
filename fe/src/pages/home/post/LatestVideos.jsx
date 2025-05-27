import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FaPlay, FaPause } from "react-icons/fa";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

const groupVideos = (videos, groupSize) => {
  const groups = [];
  for (let i = 0; i < videos.length; i += groupSize) {
    groups.push(videos.slice(i, i + groupSize));
  }
  return groups;
};

const VideoCard = ({
  setSelectedVideo,
  videoRefs,
  playingVideoId,
  handlePlayClick,
  handlePlay,
  handlePause,
  video,
}) => (
  <div
    onClick={() => setSelectedVideo(video)}
    className="flex flex-col shadow rounded-lg bg-white relative w-full"
  >
    <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
      <video
        src={video.video}
        ref={(el) => (videoRefs.current[video.id] = el)}
        onPlay={() => handlePlay(video.id)}
        onPause={() => handlePause(video.id)}
        className="w-full h-full object-cover cursor-pointer"
        muted
      />
      <div className="block lg:hidden">
        {playingVideoId === video.id ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              videoRefs.current[video.id]?.pause();
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-black/50 rounded-full p-3"
          >
            <FaPause className="w-8 h-8 text-[var(--primary-color)]" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayClick(video.id);
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-black/50 rounded-full p-3"
          >
            <FaPlay className="w-8 h-8 text-[var(--primary-color)]" />
          </button>
        )}
      </div>
    </div>

    <div className="p-3">
      <h3 className="text-sm font-bold truncate">{video.title}</h3>
      <p className="text-xs text-gray-700 line-clamp-2">{video.description}</p>
    </div>
  </div>
);

const LatestVideos = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const swiperRef = useRef(null);
  const videoRefs = useRef({});
  const highlightVideoRef = useRef(null);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia(
      "(min-width: 641px) and (max-width: 1024px)"
    );
    const desktop = window.matchMedia("(min-width: 1025px)");

    const updateScreenSize = () => {
      setIsMobile(mobile.matches);
      setIsTablet(tablet.matches);
      setIsDesktop(desktop.matches);
    };

    updateScreenSize();
    mobile.addEventListener("change", updateScreenSize);
    tablet.addEventListener("change", updateScreenSize);
    desktop.addEventListener("change", updateScreenSize);

    return () => {
      mobile.removeEventListener("change", updateScreenSize);
      tablet.removeEventListener("change", updateScreenSize);
      desktop.removeEventListener("change", updateScreenSize);
    };
  }, []);

  const handlePlayClick = (id) => {
    Object.entries(videoRefs.current).forEach(([vid, el]) => {
      if (Number(vid) !== id && el?.pause) el.pause();
    });
    highlightVideoRef.current?.pause();
    videoRefs.current[id]?.play();
  };

  const handlePlay = (id) => setPlayingVideoId(id);

  const handlePause = (id) => {
    if (playingVideoId === id) setPlayingVideoId(null);
  };

  return (
    <div className="grid grid-rows-1 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center px-5 pt-5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-1 bg-[var(--primary-color)] rounded-md mt-1"></div>
          <h2 className="text-2xl font-bold">Latest Videos</h2>
        </div>
        <div className="block lg:hidden p-2">
          <Link
            to="/latest-video"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <span>Show All</span>
            <RxCaretRight className="w-6 h-6 ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
        {/* Highlight Video */}
        <div className="hidden lg:block">
          <div className="relative h-96 w-full shadow rounded-xl overflow-hidden group">
            <video
              key={selectedVideo.id}
              src={selectedVideo.video}
              ref={highlightVideoRef}
              onPlay={() => handlePlay(selectedVideo.id)}
              onPause={() => handlePause(selectedVideo.id)}
              className="h-full w-full object-cover rounded-xl"
              muted
            ></video>

            {playingVideoId === selectedVideo.id ? (
              <button
                onClick={() => highlightVideoRef.current?.pause()}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-black/50 rounded-full p-3 cursor-pointer"
              >
                <FaPause className="w-8 h-8 text-[var(--primary-color)]" />
              </button>
            ) : (
              <button
                onClick={() => {
                  Object.values(videoRefs.current).forEach((el) => el?.pause());
                  highlightVideoRef.current?.play();
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-black/50 rounded-full p-3 cursor-pointer"
              >
                <FaPlay className="w-8 h-8 text-[var(--primary-color)]" />
              </button>
            )}

            <div className="absolute bottom-0 w-[91%] bg-white/70 backdrop-blur-md text-black p-4 m-5 rounded-xl">
              <h1 className="text-lg font-bold">{selectedVideo.title}</h1>
              <p className="text-sm text-gray-700">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Video Carousel */}
        <div className="relative w-full min-h-[350px] max-h-[90vh] px-4">
          {isTablet || isMobile ? (
            <>
              <div
                className={`swiper-button-prev-custom-mobile absolute top-1/2 left-10 z-10 -translate-y-1/2 bg-white p-2 rounded-lg shadow ${
                  isBeginning ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <RxCaretLeft className="w-6 h-6 text-black" />
              </div>
              <div
                className={`swiper-button-next-custom-mobile absolute top-1/2 right-10 z-10 -translate-y-1/2 bg-white p-2 rounded-lg shadow ${
                  isEnd ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <RxCaretRight className="w-6 h-6 text-black" />
              </div>
            </>
          ) : (
            <>
              <div
                className={`swiper-button-prev-custom absolute -top-13 left-95 z-10 bg-white p-2 rounded-lg shadow ${
                  isBeginning ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <RxCaretLeft className="w-6 h-6 text-black" />
              </div>
              <div
                className={`swiper-button-next-custom absolute -top-13 right-10 z-10 bg-white p-2 rounded-lg shadow ${
                  isEnd ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <RxCaretRight className="w-6 h-6 text-black" />
              </div>
            </>
          )}

          <Swiper
            modules={[Navigation, Pagination]}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 1, spaceBetween: 10 },
              1024: { slidesPerView: 2.2, spaceBetween: 20 },
            }}
            navigation={{
              prevEl:
                isTablet || isMobile
                  ? ".swiper-button-prev-custom-mobile"
                  : ".swiper-button-prev-custom",
              nextEl:
                isTablet || isMobile
                  ? ".swiper-button-next-custom-mobile"
                  : ".swiper-button-next-custom",
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            className="h-full"
          >
            {isDesktop
              ? groupVideos(videos, 2).map((group, index) => (
                  <SwiperSlide key={`group-${index}`}>
                    <div className="grid grid-rows-1 gap-4 h-full">
                      {group.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          setSelectedVideo={setSelectedVideo}
                          videoRefs={videoRefs}
                          playingVideoId={playingVideoId}
                          handlePlayClick={handlePlayClick}
                          handlePlay={handlePlay}
                          handlePause={handlePause}
                        />
                      ))}
                    </div>
                  </SwiperSlide>
                ))
              : videos.map((video) => (
                  <SwiperSlide key={video.id}>
                    <VideoCard
                      video={video}
                      setSelectedVideo={setSelectedVideo}
                      videoRefs={videoRefs}
                      playingVideoId={playingVideoId}
                      handlePlayClick={handlePlayClick}
                      handlePlay={handlePlay}
                      handlePause={handlePause}
                    />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default LatestVideos;
