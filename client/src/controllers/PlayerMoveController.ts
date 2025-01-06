/**
 * The `usePlayerMoveController` hook manages the player's movement within the game.
 * It handles keyboard inputs, collision detection, and updates the player's position.
 */
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import Config from "../config.json";

export function usePlayerMoveController() {
  const { playerHero, currentWorld, currentMap, updateMap } = usePlayer();
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const pressedKeys = useRef<Set<string>>(new Set());

  /**
   * Handles keydown events by adding the pressed key to the set of active keys.
   * Triggers a position update for the player.
   * @param event - The keyboard event.
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    pressedKeys.current.add(event.key);
    updatePlayerPosition();
  };

  /**
   * Handles keyup events by removing the released key from the set of active keys.
   * @param event - The keyboard event.
   */
  const handleKeyUp = (event: KeyboardEvent) => {
    pressedKeys.current.delete(event.key);
  };

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
    if (!currentWorld || !currentMap || !playerHero) return false;
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
    if (!currentWorld || !currentMap || !playerHero) return false;

    let testCases: { x: number; y: number }[] = [];
    for (let l = 0; l < currentMap.getNbLayers(); l++) {
      for (let x = boxCollision.left; x < boxCollision.right; x++) {
        for (let y = boxCollision.top; y < boxCollision.bottom; y++) {
          testCases.push({ x, y });
        }
      }
    }

    for (let l = 0; l < currentMap.getNbLayers(); l++) {
      for (let i = 0; i < testCases.length; i++) {
        const { x, y } = testCases[i];
        const tile = currentMap.getTileByPositionInPixels(x, y, l);
        if (tile && tile.hasCollision()) {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * Updates the player's position based on the active keys and handles collisions and map transitions.
   * @param moveStep - The distance to move in each step (default: 10).
   */
  const updatePlayerPosition = (moveStep: number = 10) => {
    if (!playerHero || !currentWorld || !currentMap) return;

    let dx = 0;
    let dy = 0;

    if (pressedKeys.current.has("ArrowUp")) dy -= moveStep;
    if (pressedKeys.current.has("ArrowDown")) dy += moveStep;
    if (pressedKeys.current.has("ArrowLeft")) dx -= moveStep;
    if (pressedKeys.current.has("ArrowRight")) dx += moveStep;

    const { left, right, top, bottom } = playerHero.boxCollision();
    const nextBoxCollision = {
      left: left + dx,
      right: right + dx,
      top: top + dy,
      bottom: bottom + dy,
    };

    if (dx !== 0 || dy !== 0) {
      if (!checkMapBorders(nextBoxCollision)) {
        if (Config.dev.debug) {
          console.log("Cannot move outside the map");
        }
        return;
      }

      if (checkCollision(nextBoxCollision)) {
        if (Config.dev.debug) {
          console.log("Cannot move: collision detected");
        }
        return;
      }

      // Move the player
      playerHero.move(dx, dy);
      setPlayerPosition({ x: playerHero.getX(), y: playerHero.getY() });
      if (Config.dev.debug) {
        console.log(
          `Player moved to (${playerHero.getX()}, ${playerHero.getY()})`
        );
      }

      // Check if the player has moved to a new map
      const nextMap = currentWorld.getMapByPosition(
        playerHero.getX(),
        playerHero.getY()
      );
      if (nextMap && currentMap !== nextMap) {
        updateMap(nextMap);
        if (Config.dev.debug) {
          console.log(`Player moved to map ${nextMap.getName()}`);
        }
      }
    }
  };

  /**
   * Sets up event listeners for player movement and cleans them up on unmount.
   */
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playerHero, playerPosition, currentWorld, currentMap]);
}
