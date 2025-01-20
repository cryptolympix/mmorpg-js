import Object from "./Object";

export default class ObjectGroup {
  constructor(
    private id: string,
    private name: string,
    private objects: Object[] = []
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public addObject(object: Object): void {
    this.objects.push(object);
  }

  public getObjectById(name: string): Object | undefined {
    return this.objects.find((object) => object.getId() === name);
  }

  public getObjectByName(name: string): Object | undefined {
    return this.objects.find((object) => object.getName() === name);
  }

  public getObjects(): Object[] {
    return this.objects;
  }
}
