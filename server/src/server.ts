import http from "http";
import fs from "fs";
import path from "path";
import { Socket } from "socket.io";

import app from "./app";

const appDirectory = fs.realpathSync(process.cwd());
export const sourceFolder = path.resolve(appDirectory, "src");
export const assetsFolder = path.resolve(sourceFolder, "assets");

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app);
const sio: Socket = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
});

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

sio.on("connection", (socket: Socket) => {
  console.log(`New connection socket : ${socket.id}`);
});

server.listen(port);
