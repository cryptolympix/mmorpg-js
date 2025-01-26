export enum Direction {
  Down = "down",
  Left = "left",
  Right = "right",
  Up = "up",
}

export enum HeroGender {
  Male = "male",
  Female = "female",
}

export enum HeroClass {
  Druid = "Druid",
  Hunter = "Hunter",
  Knight = "Knight",
  Mage = "Mage",
  Paladin = "Paladin",
  Assassin = "Assassin",
}

export interface HeroStuff {
  helmet?: string;
  armor?: string;
  weapon?: string;
  shield?: string;
  boots?: string;
  gloves?: string;
  pants?: string;
}

export enum StuffType {
  Helmet = "helmet",
  Armor = "armor",
  Weapon = "weapon",
  Shield = "shield",
  Boots = "boots",
  Gloves = "gloves",
  Pants = "pants",
}

export interface Stats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  magic: number;
  resistance: number;
  speed: number;
  dodge: number;
}
