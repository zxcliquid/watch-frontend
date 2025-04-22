import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import socket from '../utils/socket';
import RoomHeader from '../components/RoomHeader';
import QRCodeComponent from '../components/QRCodeComponent';

const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

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
      <RoomHeader onShareClick={() => setIsShareModalOpen(true)} />
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
    </div>
  );
};

export default Room;

const ShareModal = ({ url, onClose, roomId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="modal-overlay">
  <div className="modal-content">
    <button className="modal-close-btn" onClick={onClose}>×</button>
    <h2>Поделиться комнатой</h2>
    <QRCodeComponent url={url} roomId={roomId}/>
    <div style={{ marginTop: 16 }}>
      <input
        type="text"
        value={url}
        readOnly
        style={{ width: "80%" }}
        onFocus={e => e.target.select()}
      />
      <button onClick={handleCopy} className="copy-btn">
        Копировать
      </button>
    </div>
    {copied && <div className="copy-alert">Ссылка скопирована!</div>}
  </div>
</div>
  );
};


