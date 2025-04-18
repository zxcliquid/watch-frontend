import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import socket from "../utils/socket";

const VideoPlayer = ({ roomId }) => {
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ");
  const playerRef = useRef(null);
  const ignoreEvents = useRef(false);

  useEffect(() => {
    socket.on("sync-video", ({ action, time, videoId: newVideoId }) => {
      const player = playerRef.current;
      if (!player) return;

      ignoreEvents.current = true;
      if (newVideoId && newVideoId !== videoId) {
        setVideoId(newVideoId);
        player.loadVideoById(newVideoId, time || 0);
      } else if (action === "play") {
        player.seekTo(time || 0, true);
        player.playVideo();
      } else if (action === "pause") {
        player.pauseVideo();
      } else if (action === "seek") {
        player.seekTo(time || 0, true);
      }
      setTimeout(() => { ignoreEvents.current = false; }, 500);
    });

    return () => {
      socket.off("sync-video");
    };
    // eslint-disable-next-line
  }, [videoId]);

  const handleReady = (event) => {
    playerRef.current = event.target;
  };

  const handlePlay = () => {
    if (ignoreEvents.current) return;
    const time = playerRef.current.getCurrentTime();
    socket.emit("sync-video", { roomId, action: "play", time });
  };

  const handlePause = () => {
    if (ignoreEvents.current) return;
    const time = playerRef.current.getCurrentTime();
    socket.emit("sync-video", { roomId, action: "pause", time });
  };

  const handleStateChange = (event) => {
    if (ignoreEvents.current) return;
    // 1 = play, 2 = pause, 0 = ended, 3 = buffering, 5 = cued
    if (event.data === 1) handlePlay();
    if (event.data === 2) handlePause();
  };

  const handleSeek = () => {
    if (ignoreEvents.current) return;
    const time = playerRef.current.getCurrentTime();
    socket.emit("sync-video", { roomId, action: "seek", time });
  };

  const changeVideo = () => {
    const newVideoId = prompt("Введите YouTube Video ID:");
    if (newVideoId) {
      setVideoId(newVideoId);
      socket.emit("sync-video", { roomId, action: "pause", time: 0, videoId: newVideoId });
    }
  };

  const options = {
    playerVars: {
      controls: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className="video-container">
      <YouTube
        videoId={videoId}
        opts={options}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onPlaybackRateChange={handleSeek}
        onPlaybackQualityChange={handleSeek}
      />
      <button onClick={changeVideo}>Сменить видео</button>
    </div>
  );
};

export default VideoPlayer;