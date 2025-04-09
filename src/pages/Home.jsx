import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket"; // Подключаем сокеты
import HomeFooter from "../components/HomeFooter";

const Home = () => {
  const [name, setName] = useState(localStorage.getItem("username") || "");
  const [roomId, setRoomId] = useState("");  // Здесь будет храниться ID комнаты для присоединения
  const navigate = useNavigate();

  // Создание комнаты
  const createRoom = () => {
    if (!name.trim()) return alert("Введите имя!");

    localStorage.setItem("username", name); // Сохраняем имя в localStorage

    // Отправляем запрос на создание комнаты на сервер
    socket.emit('create-room');

    // Ожидаем ответа от сервера
    socket.on('room-created', (newRoomId) => {
      // После создания комнаты перенаправляем пользователя в комнату
      navigate(`/room/${newRoomId}`);
    });
  };

  // Присоединение к существующей комнате
  const joinRoom = () => {
    if (!roomId.trim()) return alert("Введите ID комнаты!");

    socket.emit('join-room', roomId); // Присоединяемся к комнате на сервере

    // Если комната существует, перенаправляем пользователя
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="home-body">
      <div className="home-container">
        <header className="home-header">
          <h1 className="title">Watch Together</h1>
        </header>
        <div className="home-join">
          <h2>С возвращением!</h2>
          <h4>Создать или войти в комнату</h4>
          
          {/* Ввод ID комнаты для присоединения */}
          <input
            className="home-id-input home-input"
            type="text"
            placeholder="Введите ID комнаты"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          
          {/* Ввод имени пользователя */}
          <input
            className="home-name-input home-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ваше имя"
          />
          
          <button className="home-join-button home-input" onClick={joinRoom}>
            Присоединиться
          </button>

          <p className="ili">или</p>
          <button className="home-create-button home-input" onClick={createRoom}>
            Создать комнату
          </button>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default Home;
