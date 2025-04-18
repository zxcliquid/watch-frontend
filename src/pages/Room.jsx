import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import socket from '../utils/socket';

const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const username = localStorage.getItem('username') || 'Аноним';

  useEffect(() => {
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
  }, [roomId, username]);

  return (
    <div className="room-container">
      <div className="video-section">
        <VideoPlayer roomId={roomId} />
      </div>
      <div className="sidebar">
        <h2>Список пользователей</h2>
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={user.username + user.socketId}>{user.username}</li>
          ))}
        </ul>
        <Chat roomId={roomId} />
      </div>
    </div>
  );
};

export default Room;