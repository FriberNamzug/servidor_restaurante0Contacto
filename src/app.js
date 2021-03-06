import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import cors from "cors";
import { creandoUsuario } from "./libs/initialSetup";

import productosRoutes from "./routes/productos.routes";
import autenticacionRoutes from "./routes/autenticacion.routes";
import usuarioRoutes from "./routes/usuario.routes";
import chatRoutes from "./routes/chat.routes";
import carritoRoutes from "./routes/carrito.routes";
import pagoRoutes from "./routes/pago.routes";

const app = express();

creandoUsuario();

app.use(express.static("public")); //https://es.stackoverflow.com/questions/406518/c%C3%B3mo-mostrar-las-imagenes-guardadas-en-nodejs-desde-angular //Esta linea nos ayuda a ver las imagenes en el servidor
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.set("pkg", pkg);
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.json({
    autor: app.get("pkg").author,
    descripcion: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

app.use("/api/productos", productosRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/autenticacion", autenticacionRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/pago", pagoRoutes);

export default app;
