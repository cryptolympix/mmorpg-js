/**
 * The `usePlayerMoveController` hook manages the player's movement within the game.
 */
import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../contexts/GameContext";

export function usePlayerMoveController() {
  const { playerHero, currentWorld, currentMap, updateMap } = useGameContext();
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const pressedKeys = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Handles keydown events by adding the pressed key to the set of active keys.
   * @param event - The keyboard event.
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    pressedKeys.current.add(event.key);
    if (playerHero) {
      playerHero.setWalking(true);
    }
  };

  /**
   * Handles keyup events by removing the released key from the set of active keys.
   * @param event - The keyboard event.
   */
  const handleKeyUp = (event: KeyboardEvent) => {
    pressedKeys.current.delete(event.key);
    if (playerHero) {
      playerHero.setWalking(false);
    }
  };

  /**
   * Updates the player's position and animation frame in the game loop.
   */
  const gameLoop = (currentTime: number) => {
    if (playerHero) {
      playerHero.updateFrame(currentTime);
      updatePlayerPosition();
    }

    // Request the next frame
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  /**
   * Updates the player's position based on the active keys.
   */
  const updatePlayerPosition = () => {
    if (!playerHero || !currentWorld || !currentMap) return;

    let dx = 0;
    let dy = 0;

    if (pressedKeys.current.has("ArrowUp")) dy -= playerHero.getMoveSpeed();
    if (pressedKeys.current.has("ArrowDown")) dy += playerHero.getMoveSpeed();
    if (pressedKeys.current.has("ArrowLeft")) dx -= playerHero.getMoveSpeed();
    if (pressedKeys.current.has("ArrowRight")) dx += playerHero.getMoveSpeed();

    const { left, right, top, bottom } = playerHero.boxCollision();
    const nextBoxCollision = {
      left: left + dx,
      right: right + dx,
      top: top + dy,
      bottom: bottom + dy,
    };

    if (dx !== 0 || dy !== 0) {
      if (
        !checkMapBorders(nextBoxCollision) ||
        checkCollision(nextBoxCollision)
      ) {
        return;
      }

      // Move the player
      playerHero.move(dx, dy);
      setPlayerPosition({ x: playerHero.getX(), y: playerHero.getY() });

      // Check if the player has moved to a new map
      const nextMap = currentWorld.getMapByPosition(
        playerHero.getX(),
        playerHero.getY()
      );
      if (nextMap && currentMap !== nextMap) {
        updateMap(nextMap);
      }
    }
  };

  useEffect(() => {
    // Set up event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Start the game loop
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [playerHero, currentWorld, currentMap]);

  /**
   * Checks if the player's collision box is within the bounds of the map.
   * @param boxCollision - The player's collision box boundaries.
   * @returns True if the box is within the map, otherwise false.
   */
  const checkMapBorders = (boxCollision: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }) => {
    if (!currentWorld || !currentMap) return false;
    const nextMap =
      currentWorld.getMapByPosition(boxCollision.left, boxCollision.top) &&
      currentWorld.getMapByPosition(boxCollision.right, boxCollision.bottom) &&
      currentWorld.getMapByPosition(boxCollision.right, boxCollision.top) &&
      currentWorld.getMapByPosition(boxCollision.left, boxCollision.bottom);
    return nextMap !== undefined;
  };

  /**
   * Checks if the player's collision box overlaps with any collidable tiles in the map.
   * @param boxCollision - The player's collision box boundaries.
   * @returns True if a collision is detected, otherwise false.
   */
  const checkCollision = (boxCollision: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }) => {
    if (!currentWorld || !currentMap) return false;
    for (let l = 0; l < currentMap.getNbLayers(); l++) {
      for (let x = boxCollision.left; x < boxCollision.right; x++) {
        for (let y = boxCollision.top; y < boxCollision.bottom; y++) {
          const tile = currentMap.getTileByPositionInPixels(x, y, l);
          if (tile?.hasCollision()) return true;
        }
      }
    }
    return false;
  };
}
