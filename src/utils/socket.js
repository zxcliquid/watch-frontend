import io from "socket.io-client";

const socket = io("https://watch-sztd.onrender.com"); // Ваш сервер

socket.on("connect", () => {
  console.log("Соединение с сервером установлено:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Отключено от сервера");
});

export default socket;