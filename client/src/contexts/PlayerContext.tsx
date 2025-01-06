import React, { createContext, useContext, useState, useEffect } from "react";
import Hero from "../characters/Hero";
import World from "../view/map/World";
import Map from "../view/map/Map";
import Config from "../config.json";

interface PlayerContextValue {
  playerHero: Hero | null;
  currentWorld: World | null;
  currentMap: Map | null;
  updatePlayerHero: (playerHero: Hero) => void;
  updateWorld: (newWorld: World) => void;
  updateMap: (newMap: Map) => void;
}

const PlayerContext = createContext<PlayerContextValue>({
  playerHero: null,
  currentWorld: null,
  currentMap: null,
  updatePlayerHero: () => {},
  updateWorld: () => {},
  updateMap: () => {},
});

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playerHero, setPlayerHero] = useState<Hero | null>(null);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [currentMap, setCurrentMap] = useState<Map | null>(null);

  const loadHero = async () => {
    const hero = new Hero(
      "Player",
      Config.start.position.x,
      Config.start.position.y,
      30,
      50,
      "/assets/characters/heroes/knight_m.png",
      30,
      40
    );
    await hero.load();
    setPlayerHero(hero);
  };

  const loadCurrentWorld = async () => {
    const world = new World(Config.start.world);
    await world.load();
    setCurrentWorld(world);
  };

  const loadCurrentMap = async () => {
    if (playerHero && currentWorld) {
      const map = currentWorld.getMapByPosition(
        playerHero.getX(),
        playerHero.getY()
      );
      if (map) setCurrentMap(map);
    }
  };

  // Load the hero and the current world
  useEffect(() => {
    const load = async () => {
      await loadHero();
      await loadCurrentWorld();
    };
    load();
  }, []);

  // Load the current map when the player hero or the current world changes
  useEffect(() => {
    loadCurrentMap();
  }, [playerHero, currentWorld]);

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
    <PlayerContext.Provider
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
    </PlayerContext.Provider>
  );
};
