import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";
import UserList from "../components/UserList";
import socket from "../utils/socket";

const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const username = localStorage.getItem("username") || "Аноним";

  useEffect(() => {
    // Подключаемся к комнате
    console.log("Подключаюсь к комнате:", roomId);
    socket.emit("join-room", { roomId, username });

    socket.on("update-users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("update-users");
    };
  }, [roomId]);

  return (
    <div className="room-container">
      <div className="video-section">
        <VideoPlayer roomId={roomId} />
      </div>
      <div className="sidebar">
        <h2>Список пользователей</h2>
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
        <Chat roomId={roomId} />
      </div>
    </div>
  );
};

export default Room;
