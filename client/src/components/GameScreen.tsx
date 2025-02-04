import { useEffect, useRef, useState } from "react";
import "./GameScreen.scss";
import Config from "../../../shared/config.json";
import LoginScreen from "./LoginScreen";
import Chat from "./Chat";
import Camera from "../utils/Camera";
import PlayerHud from "./PlayerHud";
import { useGameContext } from "../contexts/GameContext";
import { usePlayerMoveController } from "../controllers/PlayerMoveController";

interface GameScreenProps {}

const GameScreen: React.FC<GameScreenProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const { playerHero, otherPlayersHero, map } = useGameContext();

  // Player movement controller
  usePlayerMoveController();

  // Set up the camera
  useEffect(() => {
    if (!map || !playerHero) return;
    setCamera(new Camera(playerHero, map));
  }, [map, playerHero]);

  // Render the map and hero
  useEffect(() => {
    if (!camera) return;

    const context = canvasRef.current?.getContext("2d");
    if (!context) return;

    const render = () => {
      const allCharacters = [playerHero, ...otherPlayersHero];
      const loadedCharacters = allCharacters.filter((c) => c.isLoaded());

      // Clear the canvas
      context.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );

      // Render only loaded characters
      if (loadedCharacters.length > 0) {
        camera.render(loadedCharacters, context);
      }

      // Log a warning if some characters are not loaded
      if (Config.dev.debug && loadedCharacters.length < allCharacters.length) {
        console.warn(
          `Some characters are not loaded yet. Loaded: ${loadedCharacters.length}, Total: ${allCharacters.length}`
        );
      }

      // Continue the game loop
      requestAnimationFrame(render);
    };

    render(); // Start the game loop
  }, [camera, playerHero, otherPlayersHero]);

  // Set the canvas dimensions
  const canvasWidth = Math.min(1800, map?.getWidthInPixels() || 0);
  const canvasHeight = Math.min(1200, map?.getHeightInPixels() || 0);

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
          <Chat />
        </>
      ) : (
        <LoginScreen />
      )}
    </div>
  );
};

export default GameScreen;
