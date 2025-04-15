import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import socket from "../utils/socket";

const VideoPlayer = ({ roomId }) => {
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ"); // Тестовое видео
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);  // Время текущего видео

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
    setCurrentTime(playerRef.current.getCurrentTime());  // Устанавливаем начальное время видео
  };

  const handlePlay = () => {
    const time = playerRef.current.getCurrentTime();
    setCurrentTime(time);  // Обновляем текущее время при воспроизведении
    socket.emit("video-action", { roomId, action: "play", time });
    socket.emit("sync-video", { roomId, action: "play", time });
  };

  const handlePause = () => {
    const time = playerRef.current.getCurrentTime();
    setCurrentTime(time);  // Обновляем текущее время при паузе
    socket.emit("video-action", { roomId, action: "pause", time });
    socket.emit("sync-video", { roomId, action: "pause", time });
  };

  const handleSeek = () => {
    const time = playerRef.current.getCurrentTime();
    setCurrentTime(time);  // Обновляем текущее время при перемотке
    socket.emit("video-action", { roomId, action: "seek", time });
    socket.emit("sync-video", { roomId, action: "seek", time });
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

  // Регулярно отправляем время видео
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        setCurrentTime(currentTime);
        socket.emit("video-action", { roomId, action: "seek", time: currentTime });
        socket.emit("sync-video", { roomId, action: "seek", time: currentTime });
      }
    }, 1000);  // Отправляем данные каждую секунду

    return () => clearInterval(interval);  // Очистка интервала при размонтировании компонента
  }, [roomId]);

  return (
    <div className="video-container">
      <YouTube
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
