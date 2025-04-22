import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCodeComponent from "./QRCodeComponent";

const RoomHeader = () => {
    const { roomId } = useParams();  // Получаем roomId из параметров
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();
    const leaveRoom = () => {
        navigate('/');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Уведомление исчезнет через 2 сек
            });
    };

    return (
        <div className="room-header-container">
            <ul>
                <li><h4>Watch Together</h4></li>
                <li>
                    <p title="Скопировать ссылку на комнату" onClick={handleCopy}>
                        Код комнаты: {roomId}
                    </p>
                    {copied && (
                        <div className="link-alert">Ссылка скопирована!</div> 
                    )}
                </li>
                <li><button onClick={leaveRoom}>Выход</button></li>
                {/* Передаем roomId в компонент QRCodeComponent */}
                <QRCodeComponent roomId={roomId} />
            </ul>
        </div>
    );
};

export default RoomHeader;
