import http from "http";
import fs from "fs";
import path from "path";
import { Socket } from "socket.io";
import Config from "../../shared/config.json";

import app from "./app";

import "./database";
import { HeroSchema } from "./database";

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

const port =
  normalizePort(
    Config.urls.server.split(":")[Config.urls.server.split(":").length - 1]
  ) || 3000;
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

server.on("error", errorHandler);

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

const io: Socket = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
});

// Store players in memory per world
const playersByWorld: { [world: string]: { [id: string]: HeroSchema } } = {};

io.on("connection", (socket: Socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Join a specific world
  socket.on("join-world", (playerData: HeroSchema) => {
    const world = playerData.world;

    // Add player to the corresponding room and store data
    if (!playersByWorld[world]) {
      playersByWorld[world] = {};
    }

    playersByWorld[world][socket.id] = playerData;

    socket.join(world);
    console.log(`Player ${socket.id} joined world ${world}`);

    // Notify the player of the current players in the world
    socket.emit("current-players", Object.values(playersByWorld[world]));

    // Notify other players in the room about the new player
    socket.to(world).emit("player-joined", playerData);
  });

  // Update player data in the world
  socket.on("update-player", (playerData: HeroSchema) => {
    const world = playerData.world;

    if (playersByWorld[world] && playersByWorld[world][socket.id]) {
      playersByWorld[world][socket.id] = playerData;

      console.log(`Player ${socket.id} updated in world ${world}`);

      // Broadcast the updated player data to others in the room
      socket.to(world).emit("player-updated", playerData);
    }
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    // Remove player from all worlds they belong to
    for (const [world, players] of Object.entries(playersByWorld)) {
      if (players[socket.id]) {
        const playerData = players[socket.id];
        delete players[socket.id];
        console.log(`Player ${socket.id} disconnected from world ${world}`);

        // Notify others in the room about the player leaving
        socket.to(world).emit("player-disconnected", playerData.id);

        // Clean up the room if empty
        if (Object.keys(players).length === 0) delete playersByWorld[world];
        break;
      }
    }
  });
});

server.listen(port);

export default server;
