export default class Object {
  protected id: string;
  protected name: string;
  protected description: string;
  protected image: string;

  constructor(id: string, name: string, description: string, image: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
  }

  public draw(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const image = new Image();
    image.src = this.image;
    context.drawImage(image, x, y, width, height);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getImage(): string {
    return this.image;
  }
}
