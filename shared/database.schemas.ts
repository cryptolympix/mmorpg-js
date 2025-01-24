import { Direction, HeroClass, HeroStuff, Stats } from "./types";

export interface HeroSchema {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: Direction;
  world: string;
  walking: boolean;
  spriteSheet: string;
  heroClass: HeroClass;
  sex: string;
  experience: number;
  statsPoints: number;
  gold: number;
  level: number;
  stats: Stats;
  objects: Array<string>;
  stuffs: HeroStuff;
  quests: Array<string>;
  skills: Array<string>;
}
