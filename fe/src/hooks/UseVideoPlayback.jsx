import { useRef, useState } from "react";

const UseVideoPlayback = () => {
  const [playingVideoId, setPlayingVideoId] = useState(false);
  const videoRef = useRef({});

  const handlePlayClick = (id) => {
    const video = videoRef.current[id];
    if (video?.play) {
      Object.entries(videoRef.current).forEach(([vid, el]) => {
        if (Number(vid) !== id && el?.pause) el.pause();
      });
      video.play();
    }
  };

  const handlePlay = (id) => {
    setPlayingVideoId(id);
  };
  const handlePause = (id) => {
    if (playingVideoId === id) setPlayingVideoId(null);
  };
  return [videoRef, playingVideoId, handlePlayClick, handlePlay, handlePause];
};

export default UseVideoPlayback;
