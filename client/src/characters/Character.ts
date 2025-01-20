import SpriteSheet from "../view/SpriteSheet";
import Config from "../config.json";

enum Direction {
  Down = "down",
  Left = "left",
  Right = "right",
  Up = "up",
}

/**
 * The `Character` class represents a game character with position, size, and animation details.
 * It handles movement, rendering, and collision box calculations.
 */
export default class Character {
  private static readonly MOVE_SPEED = 5;
  private static readonly SPRITE_SHEET_TILE_COUNT = 12;
  private static readonly SPRITE_SHEET_COLUMNS = 3;
  private static readonly ANIMATION_FRAMES = {
    down: [0, 1, 2],
    left: [3, 4, 5],
    right: [6, 7, 8],
    up: [9, 10, 11],
  };
  private static readonly FRAME_INTERVAL = 100;

  protected spriteSheet: SpriteSheet;
  protected moveSpeed: number = Character.MOVE_SPEED;
  protected walking: boolean = false;
  protected currentFrame = 1;
  protected lastFrameTime: number = 0; // Temps de la dernière mise à jour en ms
  protected frameInterval: number = Character.FRAME_INTERVAL; // Intervalle minimum entre frames en ms

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
    protected name: string,
    protected x: number,
    protected y: number,
    protected width: number,
    protected height: number,
    protected spriteSheetFilePath: string,
    protected spriteSheetTileWidth: number,
    protected spriteSheetTileHeight: number,
    protected spriteSheetTileCount: number = Character.SPRITE_SHEET_TILE_COUNT,
    protected spriteSheetColumns: number = Character.SPRITE_SHEET_COLUMNS,
    protected animationFrames = Character.ANIMATION_FRAMES,
    protected direction = Direction.Down
  ) {
    this.spriteSheet = new SpriteSheet(
      spriteSheetFilePath,
      spriteSheetTileWidth,
      spriteSheetTileHeight,
      spriteSheetTileCount,
      spriteSheetColumns
    );
  }

  /**
   * Loads the character's sprite sheet.
   */
  public async load() {
    await this.spriteSheet.load();
  }

  /**
   * Updates the character's animation frame.
   * Advances the current frame index if the character is walking and the frame interval has elapsed.
   */
  public updateFrame(currentTime: number) {
    if (this.walking) {
      // Vérifie si suffisamment de temps s'est écoulé depuis la dernière mise à jour
      if (currentTime - this.lastFrameTime >= this.frameInterval) {
        this.currentFrame = (this.currentFrame + 1) % 3;
        this.lastFrameTime = currentTime; // Met à jour le dernier temps
      }
    }
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
    // context.fillStyle = "red";
    // context.fillRect(
    //   this.x - this.width / 2 + cameraOffsetX,
    //   this.y - this.height + cameraOffsetY,
    //   this.width,
    //   this.height
    // );

    // Draw the character's current animation frame
    context.drawImage(
      this.getAnimationFrame(),
      this.x - this.width / 2 + cameraOffsetX,
      this.y - this.height + cameraOffsetY
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
    context.font = "12px Avenir";
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
   * Gets the current animation frame for the character.
   * @returns The canvas element containing the current animation frame.
   */
  public getAnimationFrame() {
    const tileIndex = this.animationFrames[this.direction][this.currentFrame];
    return this.spriteSheet.getTile(tileIndex);
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

  /**
   * Sets the character's walking state.
   * @param walking - Whether the character is walking.
   */
  public setWalking(walking: boolean) {
    this.walking = walking;
  }

  /**
   * Checks if the character is walking.
   * @returns True if the character is walking, otherwise false.
   */
  public isWalking() {
    return this.walking;
  }

  /**
   * Gets the character's movement speed.
   * @returns The movement speed of the character.
   */
  public getMoveSpeed() {
    return this.moveSpeed;
  }

  /**
   * Sets the character's movement speed.
   * @param moveSpeed - The new movement speed for the character.
   */
  public setMoveSpeed(moveSpeed: number) {
    this.moveSpeed = moveSpeed;
  }
}
