import { useNavigate } from "react-router-dom";
import React from 'react';
import { useParams } from 'react-router-dom';

const RoomHeader = ({ onShareClick }) => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const leaveRoom = () => {
        navigate('/');
    };

    return (
        <div className="room-header-container">
            <ul>
                <li><h4>Watch Together</h4></li>
                <li>
                    <span>Код комнаты: {roomId}</span>
                </li>
                <li>
                    <button onClick={onShareClick}>Поделиться</button>
                </li>
                <li>
                    <button onClick={leaveRoom}>Выход</button>
                </li>
            </ul>
        </div>
    );
};

export default RoomHeader;