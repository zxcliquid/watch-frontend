import io from "socket.io-client";

const socket = io("http://localhost:5001", "https://watch-sztd.onrender.com");


export default socket;