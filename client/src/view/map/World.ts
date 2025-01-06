import Map from "./Map";
import Config from "../../config.json";

/**
 * Represents a game world consisting of multiple maps.
 */
export default class World {
  private name: string = ""; // Name of the world
  private filePath: string = ""; // File path of the world configuration
  private maps: Map[] = []; // Collection of maps in the world

  /**
   * Creates a new World instance.
   * @param filePath - The file path to the world configuration (must end with .world).
   * @throws {Error} If the filePath does not end with .world.
   */
  constructor(filePath: string) {
    if (!filePath.endsWith(".world")) {
      throw new Error(
        `Invalid world file: ${filePath} - must be a .world file`
      );
    }

    this.filePath = filePath;
    this.name = filePath.split("/").pop()!.replace(".world", "");
  }

  /**
   * Loads the world data from the specified file path and initializes the maps.
   * @throws {Error} If the world file cannot be fetched or parsed.
   */
  async load(): Promise<void> {
    const response = await fetch(this.filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch world file: ${response.statusText}`);
    }

    const data = await response.json();
    for (const mapData of data.maps) {
      const { fileName, width, height, x, y } = mapData;
      const map = new Map(
        Config.paths.MAPS_FOLDER + fileName,
        x,
        y,
        width,
        height
      );
      await map.load();
      this.maps.push(map);
    }
  }

  /**
   * Retrieves the name of the world.
   * @returns The name of the world.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Retrieves all maps in the world.
   * @returns An array of maps in the world.
   */
  getMaps(): Map[] {
    return this.maps;
  }

  /**
   * Retrieves a map by its name.
   * @param name - The name of the map to retrieve.
   * @returns The map with the specified name, or undefined if not found.
   */
  getMap(name: string): Map | undefined {
    return this.maps.find((map) => map.getName() === name);
  }

  /**
   * Retrieves the map at a specific position in the world.
   * @param x - The x-coordinate of the position (in pixels).
   * @param y - The y-coordinate of the position (in pixels).
   * @returns The map containing the specified position, or null if no map is found.
   */
  getMapByPosition(x: number, y: number): Map | undefined {
    return this.maps.find((map) => {
      return (
        x >= map.getX() &&
        x < map.getX() + map.getWidthInPixels() &&
        y >= map.getY() &&
        y < map.getY() + map.getHeightInPixels()
      );
    });
  }
}
