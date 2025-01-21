import Hero, { HeroClass } from "../characters/Hero";
import Object from "./Object";

export enum StuffType {
  Helmet = "helmet",
  Armor = "armor",
  Weapon = "weapon",
  Shield = "shield",
  Boots = "boots",
  Gloves = "gloves",
  Pants = "pants",
}

export default class StuffObject extends Object {
  private type: StuffType;
  private price: number;
  private heroClass: HeroClass;
  effect: (hero: Hero) => void;

  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    type: StuffType,
    price: number,
    heroClass: HeroClass,
    effect: (hero: Hero) => void
  ) {
    super(id, name, description, image);
    this.type = type;
    this.price = price;
    this.heroClass = heroClass;
    this.effect = effect;
  }

  public use(hero: Hero): void {
    this.effect(hero);
  }

  public getType(): StuffType {
    return this.type;
  }

  public getPrice(): number {
    return this.price;
  }

  public getHeroClass(): HeroClass {
    return this.heroClass;
  }
}
