import { useEffect, useRef } from "react";

const TwitchPlayer = ({ channel, isPlaying, onPlay, onPause }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Загружаем скрипт Twitch, если его нет
    if (!window.Twitch) {
      const script = document.createElement("script");
      script.src = "https://player.twitch.tv/js/embed/v1.js";
      script.async = true;
      script.onload = () => createPlayer();
      document.body.appendChild(script);
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (playerRef.current) {
        playerRef.current.innerHTML = "";
        const player = new window.Twitch.Player(playerRef.current, {
          channel,
          width: "100%",
          height: 480,
          autoplay: false,
          controls: true,
          parent: [window.location.hostname],
        });

        player.addEventListener(window.Twitch.Player.PLAY, () => {
          onPlay && onPlay();
        });
        player.addEventListener(window.Twitch.Player.PAUSE, () => {
          onPause && onPause();
        });

        // Сохраняем player в ref для управления play/pause
        playerRef.current.playerInstance = player;
      }
    }

    return () => {
      if (playerRef.current) playerRef.current.innerHTML = "";
    };
    // eslint-disable-next-line
  }, [channel]);

  // Управление play/pause по пропсу isPlaying
  useEffect(() => {
    const player = playerRef.current?.playerInstance;
    if (player) {
      if (isPlaying) player.play();
      else player.pause();
    }
  }, [isPlaying]);

  return <div ref={playerRef} />;
};

export default TwitchPlayer;