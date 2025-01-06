import { useEffect, useRef, useState } from "react";
import "./GameScreen.scss";
import Config from "../config.json";
import Camera from "../view/Camera";
import { usePlayer } from "../contexts/PlayerContext";
import { usePlayerMoveController } from "../controllers/PlayerMoveController";

function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const { playerHero, currentWorld, currentMap } = usePlayer();

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
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
    </div>
  );
}

export default GameScreen;
