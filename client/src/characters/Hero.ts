import Character from "./Character";

export default class Hero extends Character {
  private static readonly HERO_WIDTH = 32;
  private static readonly HERO_HEIGHT = 48;
  private static readonly HERO_SPRITE_SHEET_TILE_WIDTH = 32;
  private static readonly HERO_SPRITE_SHEET_TILE_HEIGHT = 48;
  private static readonly HERO_ANIMATION_FRAMES = {
    down: [0, 1, 2],
    left: [3, 4, 5],
    right: [6, 7, 8],
    up: [9, 10, 11],
  };
  private static readonly HERO_INACTIVE_FRAME_INDEX = 1; // Index of the inactive frame

  private level: number = 1;
  private experience: number = 0;
  private gold: number = 0;
  private health: number = 100;
  private maxHealth: number = 100;
  private mana: number = 100;
  private maxMana: number = 100;
  private attack: number = 10;
  private defense: number = 5;
  private magic: number = 10;
  private resistance: number = 5;
  private speed: number = 10;
  private dodge: number = 5;

  /**
   * Creates a new `Hero` instance.
   * @param name - The name of the hero.
   * @param x - The initial x-coordinate of the hero.
   * @param y - The initial y-coordinate of the hero.
   * @param spriteSheetFilePath - Path to the sprite sheet image.
   */
  constructor(name: string, x: number, y: number, spriteSheetFilePath: string) {
    super(
      name,
      x,
      y,
      Hero.HERO_WIDTH,
      Hero.HERO_HEIGHT,
      spriteSheetFilePath,
      Hero.HERO_SPRITE_SHEET_TILE_WIDTH,
      Hero.HERO_SPRITE_SHEET_TILE_HEIGHT,
      Hero.HERO_ANIMATION_FRAMES,
      Hero.HERO_INACTIVE_FRAME_INDEX
    );
  }

  public draw(
    context: CanvasRenderingContext2D,
    cameraOffsetX: number,
    cameraOffsetY: number
  ): void {
    super.draw(context, cameraOffsetX, cameraOffsetY);

    // Draw the character's level
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = "12px Avenir";
    context.fillText(
      `Level ${this.level}`,
      this.x + cameraOffsetX,
      this.y - this.getHeight() + cameraOffsetY - 25
    );

    // Draw the character's name
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = "16px Avenir";
    context.fillText(
      this.name,
      this.x + cameraOffsetX,
      this.y - this.getHeight() + cameraOffsetY - 5
    );
  }
}
