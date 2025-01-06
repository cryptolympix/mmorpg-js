import Tile from "./Tile";

/**
 * Represents a layer of tiles within a tile map, organized as a 2D grid.
 * Each layer has an ID, name, dimensions, and a grid of tiles.
 */
export default class TileLayer {
  /**
   * @param id - Unique identifier for the tile layer.
   * @param name - Name of the tile layer.
   * @param width - Width of the tile layer in tiles.
   * @param height - Height of the tile layer in tiles.
   * @param tiles - Optional 2D array of tiles (default initializes to null values).
   */
  constructor(
    private id: string, // Tile layer ID
    private name: string, // Tile layer name
    private width: number, // Tile layer width in tiles
    private height: number, // Tile layer height in tiles
    private tiles: (Tile | null)[][] = [] // 2D array of tiles
  ) {
    // Initialize the 2D array of tiles with null values
    for (let j = 0; j < height; j++) {
      this.tiles.push([]);
      for (let i = 0; i < width; i++) {
        this.tiles[j].push(null);
      }
    }
  }

  /**
   * Adds a tile to the layer at the specified position.
   * @param tile - The Tile instance to add.
   * @param i - The column index of the tile.
   * @param j - The row index of the tile.
   */
  public addTile(tile: Tile, i: number, j: number): void {
    this.tiles[j][i] = tile;
  }

  /**
   * Retrieves the tile at the specified position.
   * @param i - The column index of the tile.
   * @param j - The row index of the tile.
   * @returns The Tile instance at the given position, or null if no tile exists.
   */
  public getTile(i: number, j: number): Tile | null {
    return this.tiles[j][i];
  }

  /**
   * Retrieves the unique identifier for the tile layer.
   * @returns The ID of the tile layer.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Retrieves the name of the tile layer.
   * @returns The name of the tile layer.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Retrieves the width of the tile layer in tiles.
   * @returns The width of the tile layer.
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Retrieves the height of the tile layer in tiles.
   * @returns The height of the tile layer.
   */
  public getHeight(): number {
    return this.height;
  }

  /**
   * Retrieves the entire 2D array of tiles for this layer.
   * @returns A 2D array where each element is a Tile instance or null.
   */
  public getTiles(): (Tile | null)[][] {
    return this.tiles;
  }
}
