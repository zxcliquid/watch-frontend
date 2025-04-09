import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const [name, setName] = useState(localStorage.getItem("username") || ""); // Проверка по умолчанию
    const navigate = useNavigate();

    // Сохраняем имя в localStorage при его изменении
    useEffect(() => {
        if (name.trim()) {
            localStorage.setItem("username", name); // Сохраняем только если имя не пустое
        }
    }, [name]); // Эффект срабатывает при изменении имени

    const createRoom = () => {
        if (!name.trim()) {
            alert("Введите имя!"); // Если имя пустое, показываем предупреждение
            return;
        }
        const newRoomId = Math.random().toString(36).substring(2, 9);
        navigate(`/room/${newRoomId}`);
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
                    <input
                        className="home-id-input home-input"
                        type="text"
                        placeholder="Введите ID комнаты"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />

                    <input
                        className="home-name-input home-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите ваше имя"
                    />  

                    <button
                        className="home-join-button home-input"
                        onClick={() => navigate(`/room/${roomId}`)}
                    >
                        Присоединиться
                    </button>

                    <p className="ili">или</p>
                    <button
                        className="home-create-button home-input"
                        onClick={createRoom}
                    >
                        Создать комнату
                    </button>
                </div>
            </div>
            <HomeFooter />
        </div>
    );
};

export default Home;
