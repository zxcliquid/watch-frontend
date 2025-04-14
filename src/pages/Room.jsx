import { useState, useEffect } from "react";
import socket from "../utils/socket";

const Room = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [videoTime, setVideoTime] = useState(0);  // Состояние для хранения времени видео

  // Подключение к комнате и получение истории чата и времени видео
  useEffect(() => {
    socket.emit("join-room", { roomId, username });

    // Получаем историю чата
    socket.on("chat-history", (chatData) => {
      setMessages(chatData);
    });

    // Получаем время видео при подключении
    socket.on("video-time", (time) => {
      setVideoTime(time);  // Обновляем время видео
    });

    // Получаем новые сообщения
    socket.on("chat-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("chat-message");
      socket.off("video-time");
    };
  }, [roomId, username]);

  // Отправка нового сообщения
  const sendMessage = () => {
    const timestamp = new Date().toLocaleTimeString();
    socket.emit("chat-message", { roomId, message: newMessage, username, timestamp });
    setNewMessage("");
  };

  // Синхронизация времени видео
  const updateVideoTime = (newTime) => {
    setVideoTime(newTime);  // Обновляем локальное состояние времени видео
    socket.emit("sync-video-time", { roomId, time: newTime });  // Отправляем новое время на сервер
  };

  return (
    <div>
      <h2>Комната: {roomId}</h2>

      <div>
        <h3>Чат:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.username}:</strong> {msg.message} <span>{msg.timestamp}</span>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение"
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>

      <div>
        <h3>Время видео: {videoTime}s</h3>
        <button onClick={() => updateVideoTime(videoTime + 10)}>+10 секунд</button>
        <button onClick={() => updateVideoTime(videoTime - 10)}>-10 секунд</button>
      </div>
    </div>
  );
};

export default Room;
