import { useState, useEffect } from "react";
import socket from "../utils/socket";

const Room = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Подключение к комнате и получение истории чата
  useEffect(() => {
    socket.emit("join-room", { roomId, username });

    // Получаем историю чата
    socket.on("chat-history", (chatData) => {
      setMessages(chatData);
    });

    // Получаем новые сообщения
    socket.on("chat-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("chat-message");
    };
  }, [roomId, username]);

  // Отправка нового сообщения
  const sendMessage = () => {
    const timestamp = new Date().toLocaleTimeString();
    socket.emit("chat-message", { roomId, message: newMessage, username, timestamp });
    setNewMessage("");
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
    </div>
  );
};

export default Room;
