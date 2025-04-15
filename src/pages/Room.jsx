import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import UserList from '../components/UserList';
import socket from '../utils/socket';

const Room = () => {
  const { roomId } = useParams();  // Извлекаем roomId из URL
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem('username') || 'Аноним';

  useEffect(() => {
    console.log("Подключаюсь к комнате:", roomId);
    
    // Подключаемся к комнате с именем пользователя и roomId
    socket.emit("join-room", { roomId, username });

    // Обновляем список пользователей
    socket.on("update-users", (updatedUsers) => {
        setUsers(updatedUsers);  // Обновляем состояние с пользователями
    });

    // Получаем историю чата
    socket.on("chat-history", (chatData) => {
      setMessages(chatData);
    });

    // Обработка ошибки, если комната не найдена
    socket.on("error", (message) => {
        alert(message);  // Покажем ошибку, если комната не найдена
    });

    // Очистка при выходе
    return () => {
        socket.emit("leave-room", roomId);  // Сообщаем серверу, что пользователь покидает комнату
        socket.off("update-users");  // Очищаем обработчик события
        socket.off("error");  // Очищаем обработчик ошибки
        socket.off("chat-history");  // Очищаем обработчик чата
    };
  }, [roomId, username]);

  return (
    <div className="room-container">
      <div className="video-section">
        <VideoPlayer roomId={roomId} />
      </div>
      <div className="sidebar">
        <h2>Список пользователей</h2>
        <UserList users={users} />
        <Chat roomId={roomId} messages={messages} />
      </div>
    </div>
  );
};

export default Room;
