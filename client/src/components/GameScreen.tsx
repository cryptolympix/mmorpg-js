import { useEffect, useRef, useState } from "react";
import "./GameScreen.scss";
import { io } from "socket.io-client";
import Config from "../../../shared/config.json";
import LoginScreen from "./LoginScreen";
import Camera from "../utils/Camera";
import PlayerHud from "./PlayerHud";
import { useGameContext } from "../contexts/GameContext";
import { usePlayerMoveController } from "../controllers/PlayerMoveController";
import { HeroSchema } from "../../../shared/database.schemas";
import Hero from "../models/characters/Hero";

// Connect to the Socket.IO server
const socket = io(Config.urls.server); // Replace with your server's URL if different

interface GameScreenProps {}

const GameScreen: React.FC<GameScreenProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const {
    playerHero,
    otherPlayersHero,
    world,
    map,
    updatePlayerHero,
    addOtherPlayerHeroe,
    removeOtherPlayerHero,
  } = useGameContext();

  // Player movement controller
  usePlayerMoveController();

  useEffect(() => {
    if (!playerHero || !world) return;

    // Join the world on the server
    socket.emit("join-world", playerHero.toSchema());

    // Listen for updates from the server
    socket.on("current-players", (currentPlayers: HeroSchema[]) => {
      if (Config.dev.debug) {
        console.log("Current players:", currentPlayers);
      }
      currentPlayers.forEach((playerData) => {
        if (playerData.id !== playerHero.getId()) {
          const newPlayer = Hero.fromSchema(playerData);
          addOtherPlayerHeroe(newPlayer);
        }
      });
    });

    socket.on("player-joined", (playerData: HeroSchema) => {
      if (playerData.id !== playerHero.getId()) {
        if (Config.dev.debug) {
          console.log("Player joined:", playerData);
        }
        const newPlayer = Hero.fromSchema(playerData);
        addOtherPlayerHeroe(newPlayer);
      }
    });

    socket.on("player-updated", (playerData: HeroSchema) => {
      if (playerData.id !== playerHero.getId()) {
        const existingPlayer = otherPlayersHero.find(
          (p) => p.getId() === playerData.id
        );
        if (existingPlayer) {
          existingPlayer.update(playerData);
        } else {
          const newPlayer = Hero.fromSchema(playerData);
          addOtherPlayerHeroe(newPlayer);
        }
      }
    });

    socket.on("player-disconnected", (playerId: string) => {
      const player = otherPlayersHero.find((p) => p.getId() === playerId);
      if (player) {
        removeOtherPlayerHero(player);
      }
    });

    setIsConnected(true);

    return () => {
      socket.off("current-players");
      socket.off("player-joined");
      socket.off("player-updated");
      socket.off("player-disconnected");
    };
  }, [playerHero, world]);

  useEffect(() => {
    if (!world || !map || !playerHero || !canvasRef.current) return;
    setCamera(new Camera(playerHero, map));
  }, [canvasRef.current, world, map, playerHero]);

  // Render the map and hero
  useEffect(() => {
    if (!camera || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    const render = () => {
      const allCharacters = [playerHero, ...otherPlayersHero];
      const allCharactersLoaded = allCharacters.every((c) => c.isLoaded());

      if (!allCharactersLoaded) {
        requestAnimationFrame(render);
        return;
      }

      camera.render(allCharacters, context);
      requestAnimationFrame(render);
    };

    render(); // Start the game loop
  }, [camera, playerHero, otherPlayersHero]);

  useEffect(() => {
    // Send player position updates to the server
    if (!playerHero || !isConnected) return;

    const interval = setInterval(() => {
      socket.emit("update-player", playerHero.toSchema());
    }, 100);

    return () => clearInterval(interval);
  }, [playerHero, isConnected]);

  if (!Config.common.gamescreen.width || !Config.common.gamescreen.height) {
    throw new Error("Invalid Config: gamescreen width and height must be set");
  }

  const canvasWidth = Math.min(
    Config.common.gamescreen.width,
    map?.getWidthInPixels() || 0
  );

  const canvasHeight = Math.min(
    Config.common.gamescreen.height,
    map?.getHeightInPixels() || 0
  );

  return (
    <div className="GameScreen">
      {playerHero ? (
        <>
          <PlayerHud />
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
          ></canvas>
        </>
      ) : (
        <LoginScreen />
      )}
    </div>
  );
};

export default GameScreen;
