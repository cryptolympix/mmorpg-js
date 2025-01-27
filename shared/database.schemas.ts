import { Direction, HeroClass, HeroGender, HeroStuff, Stats } from "./types";

export interface HeroSchema {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: Direction;
  currentAnimationFrameIndex: number;
  world: string;
  walking: boolean;
  spriteSheet: string;
  heroClass: HeroClass;
  gender: HeroGender;
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
