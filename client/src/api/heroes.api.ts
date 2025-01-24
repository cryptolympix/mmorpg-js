import axios from "axios";
import Config from "../../../shared/config.json";
import Hero from "../models/characters/Hero";
import { HeroSchema } from "../../../shared/database.schemas";

export const getHeroes = async (): Promise<HeroSchema[]> => {
  return axios.get(Config.urls.server + "/api/heroes").then((response) => {
    if (response.status === 200) {
      let data = [];
      for (let key in response.data) {
        data.push(response.data[key]);
      }
      return data;
    } else {
      throw new Error("Failed to get heroes");
    }
  });
};

export const getHero = async (heroId: string): Promise<HeroSchema> => {
  return axios
    .get(Config.urls.server + "/api/heroes/" + heroId)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Failed to get hero ${heroId}`);
      }
    });
};

export const createHero = async (hero: Hero): Promise<string> => {
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
    sex: hero.getSex(),
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
    .post(Config.urls.server + "/api/heroes", heroData)
    .then((response) => {
      if (response.status === 201) {
        return response.data;
      } else if (response.status === 400) {
        throw new Error("Hero name already exists");
      } else {
        throw new Error("Failed to create hero");
      }
    });
};
