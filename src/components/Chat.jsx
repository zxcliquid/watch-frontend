import { useState, useEffect, useRef } from "react";
import socket from "../utils/socket";

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const message_max_lenght = 300

  useEffect(() => {
    socket.emit("get-chat-history", { roomId });

    socket.on("chat-history", (chatData) => setMessages(chatData));
    socket.on("chat-message", (data) => setMessages((prev) => [...prev, data]));

    return () => {
      socket.off("chat-history");
      socket.off("chat-message");
    };
  }, [roomId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Скроллим только если пользователь уже внизу чата
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e) => {
    event.preventDefault();
    if (!message || message.length > message_max_lenght){
      alert("Сообщение слишком длинное")
      return
    };
    e.preventDefault();
    if (message.trim()) {
      const username = localStorage.getItem("username") || "Аноним";
      socket.emit("chat-message", {
        roomId,
        username,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString(),
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span className="message-username">{msg.username}: </span>
            <span className="message-text">{msg.message}</span>
            <span className="message-time">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className="message-input"
        />
        <button type="submit" className="send-button">Отправить</button>
      </form>
    </div>
  );
};

export default Chat;