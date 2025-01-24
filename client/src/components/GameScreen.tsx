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
  const { playerHero, currentWorld, currentMap } = useGameContext();

  // Player controllers
  usePlayerMoveController();

  useEffect(() => {
    if (!currentWorld || !currentMap || !playerHero || !canvasRef.current)
      return;
    setCamera(new Camera(playerHero, currentMap));
  }, [canvasRef.current, currentWorld, currentMap, playerHero]);

  // Render the map and hero
  useEffect(() => {
    if (!camera || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    const render = () => {
      camera.render(context);
      requestAnimationFrame(render);
    };

    render(); // Start the game loop
  }, [camera, !canvasRef.current]);

  if (!Config.common.gamescreen.width || !Config.common.gamescreen.height) {
    throw new Error("Invalid Config: gamescreen width and height must be set");
  }

  const canvasWidth = Math.min(
    Config.common.gamescreen.width,
    currentMap?.getWidthInPixels() || 0
  );

  const canvasHeight = Math.min(
    Config.common.gamescreen.height,
    currentMap?.getHeightInPixels() || 0
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
