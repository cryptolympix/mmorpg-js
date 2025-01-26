import axios from "axios";
import Config from "../../../shared/config.json";
import Hero from "../models/characters/Hero";
import { HeroSchema } from "../../../shared/database.schemas";

export async function getHeroes(): Promise<HeroSchema[]> {
  return axios.get(Config.urls.server + "/api/heroes").then((response) => {
    if (response.status === 200) {
      let data = [];
      for (let key in response.data) {
        data.push(response.data[key]);
      }
      if (Config.dev.debug) {
        console.log(`Api getHeroes: ${data.length} heroes fetched`);
      }
      return data;
    } else {
      throw new Error("Failed to get heroes");
    }
  });
}

export async function getHero(heroId: string): Promise<HeroSchema> {
  return axios
    .get(Config.urls.server + "/api/heroes/" + heroId)
    .then((response) => {
      if (response.status === 200) {
        if (Config.dev.debug) {
          console.log(`Api getHero: hero ${heroId} fetched`);
        }
        return response.data;
      } else {
        throw new Error(`Failed to get hero ${heroId}`);
      }
    });
}

export async function createHero(hero: Hero): Promise<string> {
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
        if (Config.dev.debug) {
          console.log(`Api createHero: hero ${hero.getId()} created`);
        }
        return response.data;
      } else if (response.status === 400) {
        throw new Error("Hero name already exists");
      } else {
        throw new Error("Failed to create hero");
      }
    });
}

export async function updateHero(hero: Hero): Promise<void> {
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
    .put(Config.urls.server + "/api/heroes/" + hero.getId(), heroData)
    .then((response) => {
      if (response.status === 204) {
        if (Config.dev.debug) {
          console.log(`Api updateHero: hero ${hero.getId()} updated`);
        }
      } else {
        throw new Error("Failed to update hero");
      }
    });
}

export async function deleteHero(heroId: string): Promise<void> {
  return axios
    .delete(Config.urls.server + "/api/heroes/" + heroId)
    .then((response) => {
      if (response.status === 204) {
        if (Config.dev.debug) {
          console.log(`Api deleteHero: hero ${heroId} deleted`);
        }
      } else {
        throw new Error("Failed to delete hero");
      }
    });
}

export async function deleteHeroes(): Promise<void> {
  return axios.delete(Config.urls.server + "/api/heroes").then((response) => {
    if (response.status === 204) {
      if (Config.dev.debug) {
        console.log(`Api deleteHeroes: all heroes deleted`);
      }
    } else {
      throw new Error("Failed to delete heroes");
    }
  });
}
