import React, { createContext, useContext, useState, useEffect } from "react";
import Hero from "../models/characters/Hero";
import World from "../models/map/World";
import Map from "../models/map/Map";
import Config from "../../../shared/config.json";

interface GameContextValue {
  playerHero: Hero | null; // The current player's hero
  otherPlayersHero: Hero[]; // Other players' heroes in the same world
  world: World | null; // The world where the player currently is
  map: Map | null; // The current map based on the player's position
  updatePlayerHero: (playerHero: Hero) => void; // Function to update the player's hero
  updateWorld: (newWorld: World) => void; // Function to update the current world
  updateMap: (newMap: Map) => void; // Function to update the current map
  addOtherPlayerHeroe: (hero: Hero) => void; // Function to add other players' heroes
  removeOtherPlayerHero: (hero: Hero) => void; // Function to remove other players' heroes
}

const GameContext = createContext<GameContextValue>({
  playerHero: null,
  otherPlayersHero: [],
  world: null,
  map: null,
  updatePlayerHero: () => {},
  updateWorld: () => {},
  updateMap: () => {},
  addOtherPlayerHeroe: () => {},
  removeOtherPlayerHero: () => {},
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playerHero, setPlayerHero] = useState<Hero | null>(null); // State for the player's hero
  const [otherPlayersHero, setOtherPlayersHero] = useState<Hero[]>([]); // State for other players' heroes
  const [world, setWorld] = useState<World | null>(null); // State for the current world
  const [map, setMap] = useState<Map | null>(null); // State for the current map

  useEffect(() => {
    if (!playerHero) return;

    // Load the player's world and determine the current map based on position
    async function loadPlayerWorld() {
      const world = new World(playerHero.getWorld());
      await world.load();
      const map = world.getMapByPosition(playerHero.getX(), playerHero.getY());

      if (!map) {
        throw new Error(
          `Failed to find map at position (${playerHero.getX()}, ${playerHero.getY()})`
        );
      }

      setWorld(world);
      setMap(map);
    }

    loadPlayerWorld();
  }, [playerHero]);

  const updatePlayerHero = (playerHero: Hero) => {
    setPlayerHero(playerHero);
  };

  const updateWorld = (newWorld: World) => {
    setWorld(newWorld);
  };

  const updateMap = (newMap: Map) => {
    setMap(newMap);
  };

  const addOtherPlayerHeroe = (hero: Hero) => {
    if (otherPlayersHero.some((p) => p.getId() === hero.getId())) {
      return;
    }
    setOtherPlayersHero((prev) => [...prev, hero]);
  };

  const removeOtherPlayerHero = (hero: Hero) => {
    setOtherPlayersHero((prev) => {
      const index = prev.findIndex((p) => p.getId() === hero.getId());
      if (index === -1) {
        return prev;
      }

      const updatedHeroes = [...prev];
      updatedHeroes.splice(index, 1);
      return updatedHeroes;
    });
  };

  return (
    <GameContext.Provider
      value={{
        playerHero,
        otherPlayersHero,
        world,
        map,
        updatePlayerHero,
        updateWorld,
        updateMap,
        addOtherPlayerHeroe,
        removeOtherPlayerHero,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
