import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import socket from '../utils/socket';
import RoomHeader from '../components/RoomHeader';
import QRCodeComponent from '../components/QRCodeComponent';
import LinkList from '../components/LinkList';

const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [videos, setVideos] = useState([]);  // Состояние для хранения видео
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  // Открытие модального окна
  const openModal = () => {
    setIsLinksModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsLinksModalOpen(false);
  };

  // Функция для получения популярных видео с YouTube
  const fetchPopularVideos = async () => {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&key=YOUR_API_KEY`);
    const data = await response.json();
    setVideos(data.items); // Устанавливаем видео в состояние
  };

  useEffect(() => {
    const fetchVideos = async () => {
      await fetchPopularVideos();
    };
    fetchVideos();
  }, []);

  useEffect(() => {
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

  if (!username) return null;

  // Ссылка на комнату
  const roomUrl = window.location.href;

  return (
    <div className="room-container">
      <RoomHeader onOpen={openModal} onShareClick={() => setIsShareModalOpen(true)} />
      <div className="video-section">
        <VideoPlayer roomId={roomId} />
      </div>
      <div className="sidebar">
        <Chat roomId={roomId} />
        <h2>Список пользователей</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.username + user.socketId}>{user.username}</li>
          ))}
        </ul>
      </div>

      {isShareModalOpen && (
        <ShareModal
          url={roomUrl}
          onClose={() => setIsShareModalOpen(false)}
          roomId={roomId}
        />
      )}

      <LinkList videos={videos} isOpen={isLinksModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Room;
