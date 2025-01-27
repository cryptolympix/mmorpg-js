import { useEffect, useRef, useState } from "react";
import "./GameScreen.scss";
import Config from "../../../shared/config.json";
import LoginScreen from "./LoginScreen";
import Camera from "../utils/Camera";
import PlayerHud from "./PlayerHud";
import { useGameContext } from "../contexts/GameContext";
import { usePlayerMoveController } from "../controllers/PlayerMoveController";

interface GameScreenProps {}

const GameScreen: React.FC<GameScreenProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  const { playerHero, otherPlayersHero, world, map } = useGameContext();

  // Player movement controller
  usePlayerMoveController();

  // Set up the camera
  useEffect(() => {
    if (!world || !map || !playerHero || !canvasRef.current) return;

    if (!camera) {
      setCamera(new Camera(playerHero, map));
    }
  }, [world, map, playerHero]); // Avoid recreating the camera unnecessarily

  // Render the map and hero
  useEffect(() => {
    if (!camera) return;

    const context = canvasRef.current?.getContext("2d");
    if (!context) return;

    const render = () => {
      const allCharacters = [playerHero, ...otherPlayersHero];
      const allCharactersLoaded = allCharacters.every((c) => c.isLoaded());

      if (allCharactersLoaded) {
        camera.render(allCharacters, context);
        requestAnimationFrame(render);
      } else if (Config.dev.debug) {
        console.warn("Not all characters are loaded yet");
      }
    };

    render(); // Start the game loop
  }, [camera, playerHero, otherPlayersHero]);

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
