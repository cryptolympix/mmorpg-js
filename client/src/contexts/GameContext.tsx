import React, { createContext, useContext, useState, useEffect } from "react";
import Hero from "../models/characters/Hero";
import World from "../models/map/World";
import Map from "../models/map/Map";
import Config from "../../../shared/config.json";

interface GameContextValue {
  playerHero: Hero | null;
  currentWorld: World | null;
  currentMap: Map | null;
  updatePlayerHero: (playerHero: Hero) => void;
  updateWorld: (newWorld: World) => void;
  updateMap: (newMap: Map) => void;
}

const GameContext = createContext<GameContextValue>({
  playerHero: null,
  currentWorld: null,
  currentMap: null,
  updatePlayerHero: () => {},
  updateWorld: () => {},
  updateMap: () => {},
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playerHero, setPlayerHero] = useState<Hero | null>(null);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [currentMap, setCurrentMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!playerHero) return;

    async function load() {
      const world = new World(playerHero.getWorld().getName());
      await world.load();
      const map = world.getMapByPosition(playerHero.getX(), playerHero.getY());

      if (!map) {
        throw new Error(
          `Failed to find map at position (${playerHero.getX()}, ${playerHero.getY()})`
        );
      }

      setCurrentWorld(world);
      setCurrentMap(map);
    }
    load();
  }, [playerHero]);

  const updatePlayerHero = (playerHero: Hero) => {
    setPlayerHero(playerHero);
  };

  const updateWorld = (newWorld: World) => {
    setCurrentWorld(newWorld);
  };

  const updateMap = (newMap: Map) => {
    setCurrentMap(newMap);
  };

  return (
    <GameContext.Provider
      value={{
        playerHero,
        currentWorld,
        currentMap,
        updatePlayerHero,
        updateWorld,
        updateMap,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
