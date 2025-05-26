import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import socket from '../utils/socket';
import RoomHeader from '../components/RoomHeader';
import QRCodeComponent from '../components/QRCodeComponent';
import LinkList from '../components/LinkList';
import ContactsModal from '../components/ContactsModal';

const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false); 
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const videoPlayerRef = useRef();

  const openModal = () => setIsLinksModalOpen(true);
  const closeModal = () => setIsLinksModalOpen(false);


  const openContactsModal = () => setIsContactsModalOpen(true); 
  const closeContactsModal = () => setIsContactsModalOpen(false); 

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

  // Функция для смены видео у себя
  const handleLaunchVideo = (videoId) => {
    videoPlayerRef.current?.changeVideo(videoId);
  };

  return (
    <div className="room-container">
      <RoomHeader onOpen={openModal} onShareClick={() => setIsShareModalOpen(true)} onOpenContacts={openContactsModal}/>
      <div className="video-section">
        <VideoPlayer ref={videoPlayerRef} roomId={roomId} />
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

      <LinkList
        isOpen={isLinksModalOpen}
        onClose={closeModal}
        roomId={roomId}
        onLaunchVideo={handleLaunchVideo}
      />

    {isContactsModalOpen && (
        <ContactsModal onClose={closeContactsModal} />  // Отображаем модальное окно с контактами
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
          <h4 className="copy-txt" onClick={handleCopy}>{url}</h4>
          <p>Нажмите на ссылку чтобы скопировать</p>
        </div>
        {copied && <div className="copy-alert">Ссылка скопирована!</div>}
      </div>
    </div>
  );
};