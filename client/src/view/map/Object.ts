export default class Object {
  constructor(
    private id: string,
    private name: string,
    private x: number,
    private y: number,
    private properties: { name: string; value: string; type: string }[]
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getProperty(name: string): string | number | boolean | undefined {
    const prop = this.properties.find((p) => p.name === name);
    if (prop) {
      if (prop.type === "bool") {
        return prop.value === "true";
      } else if (prop.type === "int") {
        return parseInt(prop.value, 10);
      } else {
        return prop.value;
      }
    }
    console.warn(`Property ${name} not found in tile ${this.id}`);
    return undefined;
  }

  public getProperties(): { name: string; value: string }[] {
    return this.properties;
  }
}
