import axios from "axios";
import Config from "../config.json";
import Hero from "../models/characters/Hero";
import { HeroSchema } from "../../../shared/database.schemas";

export const getHeroes = async () => {
  return axios
    .get(Config.paths.SERVER_URL + "/api/hero")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Failed to get heroes", error);
      return [];
    });
};

export const getHero = async (heroId: string) => {
  return axios
    .get(Config.paths.SERVER_URL + "/api/hero/" + heroId)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Failed to get hero", error);
      return null;
    });
};

export const createHero = async (hero: Hero) => {
  const heroData: HeroSchema = {
    id: hero.getId(),
    name: hero.getName(),
    x: hero.getX(),
    y: hero.getY(),
    direction: hero.getDirection(),
    world: hero.getWorld().getName(),
    walking: hero.isWalking(),
    spriteSheet: hero.getSpriteSheet().getFilePath(),
    heroClass: hero.getHeroClass(),
    experience: hero.getExperience(),
    statsPoints: hero.getStatsPoints(),
    gold: hero.getGold(),
    level: hero.getLevel(),
    stats: hero.getStats(),
    objects: hero.getObjects().map((o) => o.getId()),
    stuffs: {
      helmet: hero.getStuff().helmet,
      armor: hero.getStuff().armor,
      weapon: hero.getStuff().weapon,
      shield: hero.getStuff().shield,
      boots: hero.getStuff().boots,
      gloves: hero.getStuff().gloves,
      pants: hero.getStuff().pants,
    },
    quests: [],
    skills: [],
  };
  return axios
    .post(Config.paths.SERVER_URL + "/api/hero", heroData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Failed to create hero", error);
      return null;
    });
};
