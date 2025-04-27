import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import TwitchPlayer from "./TwitchPlayer";
import socket from "../utils/socket";

function extractVideoId(input) {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  const match = input.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const VideoPlayer = ({ roomId }) => {
  const [playerType, setPlayerType] = useState("youtube");
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ");
  const [twitchChannel, setTwitchChannel] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [twitchInput, setTwitchInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const ignoreEvents = useRef(false);

  // Слушаем синхронизацию плеера (тип, id, канал)
  useEffect(() => {
    socket.on("sync-player", ({ playerType, videoId, twitchChannel, time }) => {
      setPlayerType(playerType);
      setVideoId(videoId || "dQw4w9WgXcQ");
      setTwitchChannel(twitchChannel || "");
      setIsPlaying(false);
      if (playerType === "youtube" && playerRef.current) {
        playerRef.current.seekTo(time || 0, true);
        playerRef.current.pauseVideo();
      }
    });

    return () => {
      socket.off("sync-player");
    };
  }, []);

  // YouTube sync
  useEffect(() => {
    socket.on("sync-video", ({ action, time, videoId: newVideoId }) => {
      if (playerType !== "youtube") return;
      const player = playerRef.current;
      if (!player) return;

      ignoreEvents.current = true;
      if (newVideoId && newVideoId !== videoId) {
        setVideoId(newVideoId);
        player.loadVideoById(newVideoId, time || 0);
      } else if (action === "play") {
        player.seekTo(time || 0, true);
        player.playVideo();
        setIsPlaying(true);
      } else if (action === "pause") {
        player.pauseVideo();
        setIsPlaying(false);
      } else if (action === "seek") {
        player.seekTo(time || 0, true);
      }
      setTimeout(() => { ignoreEvents.current = false; }, 500);
    });

    return () => {
      socket.off("sync-video");
    };
    // eslint-disable-next-line
  }, [videoId, playerType]);

  // Twitch sync
  useEffect(() => {
    socket.on("sync-twitch", ({ action }) => {
      if (playerType !== "twitch") return;
      setIsPlaying(action === "play");
    });
    return () => {
      socket.off("sync-twitch");
    };
  }, [playerType]);

  // YouTube events
  const handleReady = (event) => {
    playerRef.current = event.target;
  };

  const handlePlay = () => {
    if (ignoreEvents.current) return;
    const time = playerRef.current.getCurrentTime();
    socket.emit("sync-video", { roomId, action: "play", time });
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (ignoreEvents.current) return;
    const time = playerRef.current.getCurrentTime();
    socket.emit("sync-video", { roomId, action: "pause", time });
    setIsPlaying(false);
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

  // Twitch events
  const handleTwitchPlay = () => {
    if (ignoreEvents.current) return;
    socket.emit("sync-twitch", { roomId, action: "play" });
    setIsPlaying(true);
  };

  const handleTwitchPause = () => {
    if (ignoreEvents.current) return;
    socket.emit("sync-twitch", { roomId, action: "pause" });
    setIsPlaying(false);
  };

  // Переключение плеера
  const switchToYouTube = () => {
    socket.emit("switch-player", {
      roomId,
      playerType: "youtube",
      videoId: videoId || "dQw4w9WgXcQ",
    });
  };

  const switchToTwitch = () => {
    if (!twitchChannel.trim()) {
      alert("Введите название Twitch-канала!");
      return;
    }
    socket.emit("switch-player", {
      roomId,
      playerType: "twitch",
      twitchChannel: twitchChannel.trim(),
    });
  };

  // Смена YouTube видео
  const handleInputChange = (e) => setInputValue(e.target.value);

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

  // Смена Twitch канала
  const handleTwitchInput = (e) => setTwitchInput(e.target.value);

  const handleChangeTwitchChannel = () => {
    if (!twitchInput.trim()) {
      alert("Введите название Twitch-канала!");
      return;
    }
    setTwitchChannel(twitchInput.trim());
    socket.emit("switch-player", {
      roomId,
      playerType: "twitch",
      twitchChannel: twitchInput.trim(),
    });
    setTwitchInput("");
  };

  const options = {
    playerVars: {
      controls: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className="video-container">
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={switchToYouTube}
          disabled={playerType === "youtube"}
        >
          YouTube
        </button>
        <button
          onClick={switchToTwitch}
          disabled={playerType === "twitch"}
        >
          Twitch
        </button>
      </div>

      {playerType === "youtube" ? (
        <>
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
        </>
      ) : (
        <>
          <TwitchPlayer
            channel={twitchChannel}
            isPlaying={isPlaying}
            onPlay={handleTwitchPlay}
            onPause={handleTwitchPause}
          />
          <div className="video-controls">
            <input
              type="text"
              className="video-input"
              placeholder="Введите Twitch-канал"
              value={twitchInput}
              onChange={handleTwitchInput}
              onKeyDown={e => { if (e.key === "Enter") handleChangeTwitchChannel(); }}
            />
            <button
              className="change-button"
              onClick={handleChangeTwitchChannel}
              disabled={!twitchInput.trim()}
            >
              Сменить канал
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;