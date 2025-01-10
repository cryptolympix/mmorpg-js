import SpriteSheet from "../view/SpriteSheet";
import Config from "../config.json";

enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

/**
 * The `Character` class represents a game character with position, size, and animation details.
 * It handles movement, rendering, and collision box calculations.
 */
export default class Character {
  private name: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private spriteSheet: SpriteSheet;
  private direction: Direction;

  /**
   * Creates a new `Character` instance.
   * @param name - The name of the character.
   * @param x - The initial x-coordinate of the character.
   * @param y - The initial y-coordinate of the character.
   * @param width - The width of the character.
   * @param height - The height of the character.
   * @param spriteSheetFilePath - Path to the sprite sheet image.
   * @param spriteSheetTileWidth - Width of each tile in the sprite sheet.
   * @param spriteSheetTileHeight - Height of each tile in the sprite sheet.
   * @param spriteSheetTileCount - Total number of tiles in the sprite sheet (default: 12).
   * @param spriteSheetColumns - Number of columns in the sprite sheet (default: 3).
   * @param direction - The initial direction the character is facing (default: "down").
   */
  constructor(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    spriteSheetFilePath: string,
    spriteSheetTileWidth: number,
    spriteSheetTileHeight: number,
    spriteSheetTileCount: number = 12,
    spriteSheetColumns: number = 3,
    direction = Direction.Down
  ) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.spriteSheet = new SpriteSheet(
      spriteSheetFilePath,
      spriteSheetTileWidth,
      spriteSheetTileHeight,
      spriteSheetTileCount,
      spriteSheetColumns
    );
    this.direction = direction;
  }

  /**
   * Loads the character's sprite sheet.
   */
  public async load() {
    await this.spriteSheet.load();
  }

  /**
   * Moves the character by the specified amounts in the x and y directions.
   * Updates the character's direction based on movement.
   * @param dx - Change in x-coordinate.
   * @param dy - Change in y-coordinate.
   */
  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;

    if (dx > 0) this.direction = Direction.Right;
    if (dx < 0) this.direction = Direction.Left;
    if (dy > 0) this.direction = Direction.Down;
    if (dy < 0) this.direction = Direction.Up;
  }

  /**
   * Draws the character on the canvas.
   * If debug mode is enabled, also renders the character's position and collision box.
   * @param context - The canvas rendering context.
   * @param cameraOffsetX - Horizontal offset for the camera.
   * @param cameraOffsetY - Vertical offset for the camera.
   */
  public draw(
    context: CanvasRenderingContext2D,
    cameraOffsetX: number,
    cameraOffsetY: number
  ) {
    context.fillStyle = "red";
    context.fillRect(
      this.x - this.width / 2 + cameraOffsetX,
      this.y - this.height + cameraOffsetY,
      this.width,
      this.height
    );

    if (Config.dev.debug) {
      this.drawCharacterPosition(context, cameraOffsetX, cameraOffsetY);
      this.drawBoxCollision(context, cameraOffsetX, cameraOffsetY);
    }
  }

  /**
   * Draws the character's position on the canvas.
   * @param context - The canvas rendering context.
   * @param cameraOffsetX - Horizontal offset of the camera.
   * @param cameraOffsetY - Vertical offset of the camera.
   */
  private drawCharacterPosition(
    context: CanvasRenderingContext2D,
    cameraOffsetX: number,
    cameraOffsetY: number
  ) {
    context.fillStyle = "yellow";
    context.fillRect(
      this.x + cameraOffsetX - 3,
      this.y + cameraOffsetY - 3,
      6,
      6
    );
    context.fillText(
      `(${this.x}, ${this.y})`,
      this.x + cameraOffsetX,
      this.y + cameraOffsetY + 15
    );
  }

  /**
   * Draws the character's collision box on the canvas.
   * @param context - The canvas rendering context.
   * @param cameraOffsetX - Horizontal offset of the camera.
   * @param cameraOffsetY - Vertical offset of the camera.
   */
  private drawBoxCollision(
    context: CanvasRenderingContext2D,
    cameraOffsetX: number,
    cameraOffsetY: number
  ) {
    const { left, right, top, bottom } = this.boxCollision();
    context.strokeStyle = "yellow";
    context.textAlign = "center";
    context.strokeRect(
      left + cameraOffsetX,
      top + cameraOffsetY,
      right - left,
      bottom - top
    );
  }

  /**
   * Calculates the character's collision box.
   * @returns An object containing the left, right, top, and bottom boundaries of the collision box.
   */
  public boxCollision() {
    const left = this.x - this.width / 2;
    const right = this.x + this.width / 2;
    const top = this.y - this.height / 3;
    const bottom = this.y;
    return { left, right, top, bottom };
  }

  /**
   * Gets the character's name.
   * @returns The name of the character.
   */
  public getName() {
    return this.name;
  }

  /**
   * Gets the character's x-coordinate.
   * @returns The x-coordinate of the character.
   */
  public getX() {
    return this.x;
  }

  /**
   * Gets the character's y-coordinate.
   * @returns The y-coordinate of the character.
   */
  public getY() {
    return this.y;
  }

  /**
   * Gets the character's width.
   * @returns The width of the character.
   */
  public getWidth() {
    return this.width;
  }

  /**
   * Gets the character's height.
   * @returns The height of the character.
   */
  public getHeight() {
    return this.height;
  }

  /**
   * Gets the character's sprite sheet.
   * @returns The `SpriteSheet` instance associated with the character.
   */
  public getSpriteSheet() {
    return this.spriteSheet;
  }

  /**
   * Gets the character's current direction.
   * @returns The direction the character is facing.
   */
  public getDirection() {
    return this.direction;
  }

  /**
   * Sets the character's name.
   * @param name - The new name for the character.
   */
  public setName(name: string) {
    this.name = name;
  }

  /**
   * Sets the character's direction.
   * @param direction - The new direction for the character.
   */
  public setDirection(direction: Direction) {
    this.direction = direction;
  }
}
