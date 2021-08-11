import app from "./app";
import "./config/db";
import "./config/env";
import SocketIo from "socket.io";
import * as Socket from "./libs/socket";

const  server =  app.listen(process.env.PORT, () => {
  console.log(`Servidor desde el puerto ${process.env.PORT}`);
});

//WebSockets

const io = SocketIo(server);
io.on("connection", Socket.conexion)
