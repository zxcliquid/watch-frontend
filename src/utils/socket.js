import io from "socket.io-client";

// Указываем публичный URL сервера на Render
const socket = io("https://watch-sztd.onrender.com"); // Замените на ваш URL

socket.on("connect", () => {
    console.log("Соединение с сервером установлено:", socket.id);
  });
  
  socket.on("disconnect", () => {
    console.log("Отключено от сервера");
  });

export default socket;
