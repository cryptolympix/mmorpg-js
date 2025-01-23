import Hero from "../models/characters/Hero";
import Character from "../models/characters/Character";
import Map from "../models/map/Map";

/**
 * Represents the Camera that manages rendering of the game map and characters.
 * The camera handles positioning and ensures the player remains centered on the screen
 * while clamping the visible area to the boundaries of the map.
 */
export default class Camera {
  /**
   * Array of characters currently visible or relevant to the camera.
   */
  public characters: Character[] = [];

  /**
   * Creates a new Camera instance.
   * @param playerHero - The main hero controlled by the player.
   * @param map - The game map being rendered.
   * @param offsetX - The horizontal offset of the camera.
   * @param offsetY - The vertical offset of the camera.
   */
  constructor(
    public playerHero: Hero,
    public map: Map,
    public offsetX: number = 0,
    public offsetY: number = 0
  ) {}

  /**
   * Renders the current game state (map and characters) to the provided canvas context.
   * @param context - The canvas rendering context used for drawing.
   */
  public render(context: CanvasRenderingContext2D) {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    // Clear the canvas for a new frame
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update the camera offset based on the player's position
    this.updateOffset(context);

    // Draw the map and characters
    this.map.draw(
      context,
      [this.playerHero, ...this.characters],
      this.offsetX,
      this.offsetY
    );
  }

  private updateOffset(context: CanvasRenderingContext2D) {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    // The player's position on the canvas
    const canvasPlayerHeroX = canvasWidth / 2 - this.playerHero.getWidth() / 2;
    const canvasPlayerHeroY =
      canvasHeight / 2 - this.playerHero.getHeight() / 2;

    // Calculate map offsets based on the player's position
    let mapOffsetX =
      this.playerHero.getX() - this.map.getX() - canvasPlayerHeroX;
    let mapOffsetY =
      this.playerHero.getY() - this.map.getY() - canvasPlayerHeroY;

    // Ensure the map offset does not exceed its boundaries
    if (mapOffsetX < 0) mapOffsetX = 0;
    if (mapOffsetY < 0) mapOffsetY = 0;
    if (mapOffsetX > this.map.getWidthInPixels() - canvasWidth)
      mapOffsetX = this.map.getWidthInPixels() - canvasWidth;
    if (mapOffsetY > this.map.getHeightInPixels() - canvasHeight)
      mapOffsetY = this.map.getHeightInPixels() - canvasHeight;

    // Update the camera's offset
    this.setOffset(
      -mapOffsetX - this.map.getX(),
      -mapOffsetY - this.map.getY()
    );
  }

  /**
   * Adds a character to the camera's render list.
   * @param character - The character to be added.
   */
  public addCharacter(character: Character) {
    this.characters.push(character);
  }

  /**
   * Removes a character from the camera's render list.
   * @param character - The character to be removed.
   */
  public removeCharacter(character: Character) {
    const index = this.characters.indexOf(character);
    if (index !== -1) {
      this.characters.splice(index, 1);
    }
  }

  /**
   * Clears all characters from the camera's render list.
   */
  public clearCharacters() {
    this.characters = [];
  }

  /**
   * Sets the horizontal and vertical offset of the camera.
   * @param offsetX - The horizontal offset of the camera.
   * @param offsetY - The vertical offset of the camera.
   */
  public setOffset(offsetX: number, offsetY: number) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Gets the horizontal offset of the camera.
   * @returns The horizontal offset of the camera.
   */
  public getOffsetX() {
    return this.offsetX;
  }

  /**
   * Gets the vertical offset of the camera.
   * @returns The vertical offset of the camera.
   */
  public getOffsetY() {
    return this.offsetY;
  }
}
