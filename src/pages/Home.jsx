import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const [name, setName] = useState(localStorage.getItem("username") || "");
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    useEffect(() => {
        if (name.trim()) {
            localStorage.setItem("username", name);
        }
    }, [name]);


    const createRoom = () => {
        if (name.length > 15) {
            alert("Имя слишком длинное")
            return
        }
        if (!name.trim()) {
            alert("Введите имя!");
            return;
        }
        
        // Генерируем случайный roomId, минимум 10 символов
        let newRoomId = Math.random().toString(36).substring(2, 15);  // Начальная длина 13 символов
        while (newRoomId.length < 15) {
            // Если строка меньше 10 символов, добавляем еще случайных символов
            newRoomId += Math.random().toString(36).substring(2, 5);
        }
    
        navigate(`/room/${newRoomId}`);
    };


    const handleJoin = () => {
        if (name.length > 15) {
            alert("Имя слишком длинное")
            return
        }
        if (!name.trim()) {
            alert("Введите имя!");
            return;
        }
        if (redirect) {
            navigate(redirect);
        } else {
            navigate(`/room/${roomId}`);
        }
    };

    return (
        <div className="home-body">
            <div className="home-container">
                <header className="home-header">
                    <img width="64" src="logo.jpeg" alt=""/>
                    <h5>Education platform <p>by Step Academy</p></h5>
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
                        onClick={handleJoin}
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