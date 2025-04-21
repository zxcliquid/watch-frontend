import { useNavigate } from "react-router-dom";
import React from 'react';
import { useParams } from 'react-router-dom';

const RoomHeader = () => {
    const { roomId } = useParams();

    const navigate = useNavigate()
    const leaveRoom = () => {
        navigate('/');
    }

    return(
        <div>
            <h4>Watch Together</h4>
            <p>Код комнаты: {roomId}</p>
            <button onClick={leaveRoom}>Выход</button>
        </div>
    )
}

export default RoomHeader