import TileSet from "./TileSet";

/**
 * Represents a single tile within a tileset, including its dimensions
 * and associated properties.
 */
export default class Tile {
  /**
   * @param id - Unique identifier for the tile.
   * @param width - Width of the tile in pixels.
   * @param height - Height of the tile in pixels.
   * @param tileset - The tileset to which the tile belongs.
   * @param properties - Array of properties associated with the tile, where each property has a name and a value.
   */
  constructor(
    private id: number, // Tile ID
    private width: number, // Tile width in pixels
    private height: number, // Tile height in pixels
    private tileset: TileSet, // Tileset to which the tile belongs
    private properties: { name: string; value: string; type: string }[]
  ) {}

  /**
   * Retrieves the unique identifier of the tile.
   * @returns The ID of the tile.
   */
  public getId(): number {
    return this.id;
  }

  /**
   * Retrieves the width of the tile in pixels.
   * @returns The width of the tile.
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Retrieves the height of the tile in pixels.
   * @returns The height of the tile.
   */
  public getHeight(): number {
    return this.height;
  }

  /**
   * Retrieves the tileset to which the tile belongs.
   * @returns The tileset of the tile.
   */
  public getTileset(): TileSet {
    return this.tileset;
  }

  /**
   * Retrieves the value of a specific property by its name.
   * @param name - The name of the property to retrieve.
   * @returns The value of the property, or undefined if the property does not exist.
   */
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

  /**
   * Retrieves all properties associated with the tile.
   * @returns An array of property objects, where each object contains a name and a value.
   */
  public getProperties(): { name: string; value: string }[] {
    return this.properties;
  }

  /**
   * Determines whether the tile has collision enabled.
   * @returns True if the tile has a "collision" property set to "true"; otherwise, false.
   */
  public hasCollision(): boolean {
    return this.getProperty("collision") as boolean;
  }
}
