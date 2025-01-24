import Hero from "../characters/Hero";
import { HeroClass, StuffType } from "../../../../shared/types";
import Object from "./Object";

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
