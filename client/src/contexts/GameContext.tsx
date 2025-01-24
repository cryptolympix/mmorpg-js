import React, { createContext, useContext, useState, useEffect } from "react";
import Hero from "../models/characters/Hero";
import * as HeroApi from "../api/hero.api";
import World from "../models/map/World";
import Map from "../models/map/Map";
import Config from "../config.json";
import { HeroClass } from "../../../shared/types";

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

  const loadInitialWorld = async () => {
    const world = new World(Config.paths.SERVER_URL + Config.start.world);
    await world.load();
    setCurrentWorld(world);
  };

  const loadInitialMap = async () => {
    if (!currentWorld) return;

    // Search the map where the start object is located
    for (const map of currentWorld.getMaps()) {
      if (
        map
          .getObjectGroups()
          .some((o) => o.getObjectByName("Start") !== undefined)
      ) {
        setCurrentMap(map);
        break;
      }
    }
  };

  const loadHero = async () => {
    if (!currentWorld || !currentMap) return;

    // Do not load the hero if it already exists
    if (playerHero) return;

    const objectGroup = currentMap
      .getObjectGroups()
      .find((o) => o.getObjectByName("Start") !== undefined);

    if (!objectGroup) {
      throw new Error("Start object not found in map");
    }

    const startObject = objectGroup.getObjectByName("Start");

    const hero = new Hero(
      Date.now().toString(),
      "Player",
      startObject.getX(),
      startObject.getY(),
      currentWorld,
      Config.paths.SERVER_URL + "/assets/characters/heroes/knight_m.png",
      HeroClass.Knight
    );

    await hero.load();
    setPlayerHero(hero);
    console.log(hero);
    HeroApi.createHero(hero).then(() => {
      console.log("Hero created");
    });
  };

  // Load the current world
  useEffect(() => {
    const load = async () => {
      await loadInitialWorld();
    };
    load();
  }, []);

  // Load the current map
  useEffect(() => {
    const load = async () => {
      await loadInitialMap();
    };
    load();
  }, [currentWorld]);

  // Load the player hero
  useEffect(() => {
    const load = async () => {
      await loadHero();
    };
    load();
  }, [currentMap, currentWorld]);

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
