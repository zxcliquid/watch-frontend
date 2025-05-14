import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import YouTube from "react-youtube";
import socket from "../utils/socket";

function extractVideoId(input) {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  const match = input.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const VideoPlayer = forwardRef(({ roomId }, ref) => {
  const [videoId, setVideoId] = useState(0);
  const [inputValue, setInputValue] = useState("");
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
    if (event.data === 1) handlePlay();
    if (event.data === 2) handlePause();
  };

  const handleSeek = () => {
    if (ignoreEvents.current) return;
    const time = playerRef.current.getCurrentTime();
    socket.emit("sync-video", { roomId, action: "seek", time });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleChangeVideo = () => {
    const newVideoId = extractVideoId(inputValue.trim());
    if (newVideoId) {
      setVideoId(newVideoId);
      socket.emit("sync-video", { roomId, action: "pause", time: 0, videoId: newVideoId });
      setInputValue("");
    } else {
      alert("Некорректная ссылка или ID!");
    }
  };

  useImperativeHandle(ref, () => ({
    changeVideo: (newVideoId) => {
      setVideoId(newVideoId);
      if (playerRef.current) {
        playerRef.current.loadVideoById(newVideoId, 0);
      }
    }
  }));

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
      <div className="video-controls">
        <input
          type="text"
          className="video-input"
          placeholder="Вставьте ссылку на YouTube или Video ID"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={e => { if (e.key === "Enter") handleChangeVideo(); }}
        />
        <button
          className="change-button"
          onClick={handleChangeVideo}
          disabled={!inputValue.trim()}
        >
          Сменить видео
        </button>
      </div>
    </div>
  );
});

export default VideoPlayer;