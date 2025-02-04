import axios from "axios";
import Config from "../../../shared/config.json";
import Hero from "../models/characters/Hero";

export async function getHeroes(): Promise<Hero[]> {
  return axios.get(Config.urls.server + "/api/heroes").then((response) => {
    if (response.status === 200) {
      let data = [];
      for (let key in response.data) {
        data.push(Hero.fromSchema(response.data[key]));
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

export async function getHero(heroId: string): Promise<Hero> {
  return axios
    .get(Config.urls.server + "/api/heroes/" + heroId)
    .then((response) => {
      if (response.status === 200) {
        if (Config.dev.debug) {
          console.log(`Api getHero: hero ${heroId} fetched`);
        }
        return Hero.fromSchema(response.data);
      } else {
        throw new Error(`Failed to get hero ${heroId}`);
      }
    });
}

export async function createHero(hero: Hero): Promise<string> {
  return axios
    .post(Config.urls.server + "/api/heroes", hero.toSchema())
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
  return axios
    .put(Config.urls.server + "/api/heroes/" + hero.getId(), hero.toSchema())
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
