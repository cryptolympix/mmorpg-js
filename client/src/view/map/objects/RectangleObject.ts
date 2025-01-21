import Object from "./Object";

export default class RectangleObject extends Object {
  private width: number;
  private height: number;

  constructor(
    id: string,
    name: string,
    objectClass: string,
    x: number,
    y: number,
    width: number,
    height: number,
    properties: { name: string; value: string; type: string }[]
  ) {
    super(id, name, objectClass, x, y, properties);
    this.width = width;
    this.height = height;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}
