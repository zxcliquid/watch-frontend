import { useEffect } from "react"
import { Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RoomHeader = () => {

    const navigate = useNavigate()
    const leaveRoom = () => {
        navigate('/');
    }

    return(
        <div>
            <h4>Watch Together</h4>
            <p></p>
            <button onClick={leaveRoom}>Выход</button>
        </div>
    )
}

export default RoomHeader