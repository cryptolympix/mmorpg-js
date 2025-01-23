export default interface HeroSchema {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: string;
  world: string;
  walking: boolean;
  spriteSheet: string;
  heroClass: string;
  experience: number;
  statsPoints: number;
  gold: number;
  level: number;
  stats: {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    attack: Number;
    defense: number;
    magic: number;
    resistance: number;
    speed: number;
    dodge: number;
  };
  objects: Array<string>;
  stuffs: {
    helmet?: string;
    armor: string;
    weapon: string;
    shield: string;
    boots: string;
    gloves: string;
    pants: string;
  };
  quests: Array<string>;
  skills: Array<string>;
}
