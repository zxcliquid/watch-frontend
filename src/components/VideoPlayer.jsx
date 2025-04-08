import { useEffect, useRef, useState } from "react";

import YouTube from "react-youtube";
import socket from "../utils/socket";
import { useParams } from "react-router-dom";

const VideoPlayer = () => {
    const [videoId, setVideoId] = useState("dQw4w9WgXcQ"); // Тестовое видео
    const playerRef = useRef(null);
    const { roomId } = useParams();
  
    useEffect(() => {
      socket.on("sync-video", ({ action, time }) => {
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
  
    const handleSeek = (e) => {
      const time = playerRef.current.getCurrentTime();
      socket.emit("video-action", { roomId, action: "seek", time });
    };
  
    const options = {
      playerVars: {
        controls: 1,
      },
    };

    const changeVideo = () => {
        const newVideoId = prompt("Введите YouTube Video ID:");
        if (newVideoId) {
          setVideoId(newVideoId);
          socket.emit("sync-video", { videoId: newVideoId, time: 0, isPlaying: false });
        }
      };
      
      <button onClick={changeVideo}>Сменить видео</button>;
      
  
    return (
      <div className="video-container">
        <YouTube videoId={videoId} opts={options} onReady={handleReady} onPlay={handlePlay} onPause={handlePause} onStateChange={handleSeek} />
      </div>
    );
  };
  
  export default VideoPlayer;