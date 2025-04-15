import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import socket from "../utils/socket";

const VideoPlayer = ({ roomId }) => {
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ"); // Тестовое видео
  const playerRef = useRef(null);

  useEffect(() => {
    socket.on("sync-video", ({ action, time }) => {
      console.log(`Получено событие синхронизации видео: ${action} на ${time} секунд`);
      const player = playerRef.current;
      if (!player) return;
  
      if (action === "play") player.playVideo();
      else if (action === "pause") player.pauseVideo();
      else if (action === "seek" && typeof time === "number") {
        player.seekTo(time, true);
      }
    });
  
    return () => {
      socket.off("sync-video");
    };
  }, []);

  const handleReady = (event) => {
    playerRef.current = event.target;
  };

  const handlePlay = () => {
    const time = playerRef.current.getCurrentTime();
    socket.emit("video-action", { roomId, action: "play", time });
  };

  const handlePause = () => {
    const time = playerRef.current.getCurrentTime();
    socket.emit("video-action", { roomId, action: "pause", time });
  };

  const handleSeek = () => {
    const time = playerRef.current.getCurrentTime();
    socket.emit("video-action", { roomId, action: "seek", time });
  };

  const options = {
    playerVars: {
      controls: 1,
      modestbranding: 1,
    },
  };

  const changeVideo = () => {
    const newVideoId = prompt("Введите YouTube Video ID:");
    if (newVideoId) {
      setVideoId(newVideoId);
      socket.emit("video-action", { roomId, action: "seek", time: 0 });
      socket.emit("sync-video", { videoId: newVideoId, time: 0, action: "pause" });
    }
  };

  return (
    <div className="video-container">
      <YouTube className="youtube"
        videoId={videoId}
        opts={options}
        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onStateChange={handleSeek}
      />
      <button onClick={changeVideo}>Сменить видео</button>
    </div>
  );
};

export default VideoPlayer;
