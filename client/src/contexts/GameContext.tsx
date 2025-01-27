import React, { createContext, useContext, useState, useEffect } from "react";
import Hero from "../models/characters/Hero";
import World from "../models/map/World";
import Map from "../models/map/Map";
import { io } from "socket.io-client";
import Config from "../../../shared/config.json";
import { HeroSchema } from "../../../shared/database.schemas";

// Connect to the Socket.IO server
const socket = io(Config.urls.server);

interface GameContextValue {
  playerHero: Hero | null; // The current player's hero
  otherPlayersHero: Hero[]; // Other players' heroes in the same world
  world: World | null; // The world where the player currently is
  map: Map | null; // The current map based on the player's position
  updatePlayerHero: (playerHero: Hero) => void; // Function to update the player's hero
  updateWorld: (newWorld: World) => void; // Function to update the current world
  updateMap: (newMap: Map) => void; // Function to update the current map
}

const GameContext = createContext<GameContextValue>({
  playerHero: null,
  otherPlayersHero: [],
  world: null,
  map: null,
  updatePlayerHero: () => {},
  updateWorld: () => {},
  updateMap: () => {},
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

  // Send player updates to the server
  useEffect(() => {
    if (!playerHero) return;

    const interval = setInterval(() => {
      socket.emit("update-player", playerHero.toSchema());
    }, 10);

    return () => clearInterval(interval);
  }, [playerHero]);

  // Listen for updates from the server
  useEffect(() => {
    if (!playerHero || !otherPlayersHero) return;

    socket.on("player-joined", async (playerData: HeroSchema) => {
      if (
        playerData.id !== playerHero.getId() &&
        !otherPlayersHero.some((p) => p.getId() === playerData.id)
      ) {
        const player = Hero.fromSchema(playerData);
        await player.load();
        addOtherPlayerHeroe(player);
      }
    });

    socket.on("player-updated", async (playerData: HeroSchema) => {
      if (playerData.id !== playerHero.getId()) {
        const player = otherPlayersHero.find(
          (p) => p.getId() === playerData.id
        );
        if (player) {
          player.update(playerData);
        } else {
          const player = Hero.fromSchema(playerData);
          await player.load();
          addOtherPlayerHeroe(player);
        }
      }
    });

    socket.on("player-disconnected", (playerId: string) => {
      if (Config.dev.debug) {
        console.log("Socket player-disconnected", playerId);
      }
      const player = otherPlayersHero.find((p) => p.getId() === playerId);
      if (player) {
        removeOtherPlayerHero(player);
      }
    });

    return () => {
      socket.off("player-joined");
      socket.off("player-updated");
      socket.off("player-disconnected");
    };
  }, [playerHero, otherPlayersHero]);

  // Check when world change
  useEffect(() => {
    if (!world || !playerHero) return;

    socket.emit("join-world", playerHero.toSchema());

    return () => {
      socket.off("current-players");
    };
  }, [world, playerHero]);

  const updatePlayerHero = (playerHero: Hero) => {
    setPlayerHero(playerHero);
  };

  const updateWorld = (newWorld: World) => {
    setWorld(newWorld);
    if (Config.dev.debug) {
      console.log("Change world to:", newWorld.getName());
    }
  };

  const updateMap = (newMap: Map) => {
    setMap(newMap);
    if (Config.dev.debug) {
      console.log("Change map to:", newMap.getName());
    }
  };

  const addOtherPlayerHeroe = (hero: Hero) => {
    setOtherPlayersHero((prev) => [...prev, hero]);
    if (Config.dev.debug) {
      console.log("New players added:", hero.getName());
    }
  };

  const removeOtherPlayerHero = (hero: Hero) => {
    setOtherPlayersHero((prev) => {
      const index = prev.findIndex((p) => p.getId() === hero.getId());
      if (index === -1) {
        return prev;
      }

      const updatedHeroes = [...prev];
      updatedHeroes.splice(index, 1);
      if (Config.dev.debug) {
        console.log("Player removed:", hero.getName());
      }
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
