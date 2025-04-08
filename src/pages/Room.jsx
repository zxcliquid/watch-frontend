import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";
import UserList from "../components/UserList";
import socket from "../utils/socket";
import YouTube from "react-youtube";

const Room = () => {
    const { roomId } = useParams();
    const [users, setUsers] = useState([]);
    const username = localStorage.getItem("username") || "Аноним"; // username не нужно менять в useEffect

    useEffect(() => {
        console.log("Подключаюсь к комнате:", roomId);
        socket.emit("join-room", { roomId, username });

        socket.on("update-users", (updatedUsers) => {
            setUsers(updatedUsers);
        });

        return () => {
            socket.emit("leave-room", roomId);
            socket.off("update-users");
        };
    }, [roomId]); // Этот useEffect теперь выполняется только при изменении roomId

    return (
        <div className="room-container">
            <div className="room-header">
                {/* Можно добавить заголовок комнаты, если нужно */}
            </div>
            <div className="video-section">
                <div className="video-player">
                    <VideoPlayer />
                </div>
                <div className="link-section">
                    <div className="input-with-button">
                        <input
                            type="text"
                            className="room-link-input"
                            placeholder="Введите ссылку на видео"
                        />
                        <button className="change-video-btn">Сменить видео</button>
                    </div>
                </div>
            </div>
            <div className="sidebar">
                <h2>Список пользователей</h2>
                <ul className="user-list">
                    {users.map((user, index) => (
                        <li key={index}>Пользователь: {user.username}</li>
                    ))}
                </ul>
                <Chat />
            </div>
        </div>
    );
}

export default Room;
