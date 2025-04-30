import { useNavigate } from "react-router-dom";
import React from 'react';
import { useParams } from 'react-router-dom';

const RoomHeader = ({ onShareClick, onOpen }) => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const leaveRoom = () => {
        navigate('/');
    };

    return (
        <div className="room-header-container">
            <ul>
                <li className="mini-png"><img src="../public/main.png" alt="" /></li>
                <li>
                    <span className="room-id">Код комнаты: {roomId}</span>
                </li>
                <li>
                    <button onClick={onShareClick}>Поделиться</button>
                </li>
                <li>
                    <button onClick={onOpen}>Что посмотреть?</button>
                </li>
                <li>
                    <button onClick={leaveRoom}>Выход</button>
                </li>
            </ul>
        </div>
    );
};

export default RoomHeader;