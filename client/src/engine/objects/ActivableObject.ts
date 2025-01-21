import Object from "./Object";
import Hero from "../characters/Hero";

export default class ActivableObject extends Object {
  private price: number;
  effect: (hero: Hero) => void;

  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    price: number,
    effect: (hero: Hero) => void
  ) {
    super(id, name, description, image);
    this.price = price;
    this.effect = effect;
  }

  public use(hero: Hero): void {
    this.effect(hero);
  }

  public getPrice(): number {
    return this.price;
  }
}
