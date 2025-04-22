import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import socket from '../utils/socket';
import RoomHeader from '../components/RoomHeader';

const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    // Если нет ника — редирект на Home с параметром redirect
    if (!username) {
      navigate(`/?redirect=/room/${roomId}`);
      return;
    }

    socket.emit("join-room", { roomId, username });

    socket.on("update-users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on("error", (message) => {
      alert(message);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("update-users");
      socket.off("error");
    };
  }, [roomId, username, navigate]);

  if (!username) return null; // Пока редиректим — ничего не рендерим

  return (
    <div className="room-container">
      <RoomHeader />
      <div className="video-section">
        <VideoPlayer roomId={roomId} />
      </div>
      <div className="sidebar">
        <Chat roomId={roomId} />
        <h2>Список пользователей</h2>
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={user.username + user.socketId}>{user.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Room;