import Map from "./Map";
import Config from "../../../../shared/config.json";

/**
 * Represents a game world consisting of multiple maps.
 */
export default class World {
  private name: string = ""; // Name of the world
  private filePath: string = ""; // File path of the world configuration
  private maps: Map[] = []; // Collection of maps in the world

  /**
   * Creates a new World instance.
   * @param name - The name of the world.
   * @throws {Error} If the filePath does not end with .world.
   */
  constructor(name: string) {
    this.filePath =
      Config.urls.server + Config.paths.worldsFolder + "/" + name + ".world";
    this.name = name;
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
        Config.urls.server + Config.paths.worldsFolder + fileName,
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
   * Retrieves the starting point of the world.
   * @returns An object containing the x and y coordinates of the starting point.
   */
  public getStartPoint(): { x: number; y: number } {
    for (const map of this.maps) {
      const objectGroup = map
        .getObjectGroups()
        .find((o) => o.getObjectByName("Start") !== undefined);

      if (objectGroup) {
        const startObject = objectGroup.getObjectByName("Start");
        return { x: startObject.getX(), y: startObject.getY() };
      }
    }

    if (Config.dev.debug) {
      console.warn("Start point not found in the world:", this.name);
    }

    // Return default start point if not found
    return { x: 0, y: 0 };
  }

  /**
   * Retrieves the initial map of the world.
   * @returns The initial map of the world.
   */
  public getInitialMap(): Map {
    for (const map of this.maps) {
      if (
        map
          .getObjectGroups()
          .some((o) => o.getObjectByName("Start") !== undefined)
      ) {
        return map;
      }
    }
  }

  /**
   * Retrieves the name of the world.
   * @returns The name of the world.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Retrieves all maps in the world.
   * @returns An array of maps in the world.
   */
  public getMaps(): Map[] {
    return this.maps;
  }

  /**
   * Retrieves a map by its name.
   * @param name - The name of the map to retrieve.
   * @returns The map with the specified name, or undefined if not found.
   */
  public getMap(name: string): Map | undefined {
    return this.maps.find((map) => map.getName() === name);
  }

  /**
   * Retrieves the map at a specific position in the world.
   * @param x - The x-coordinate of the position (in pixels).
   * @param y - The y-coordinate of the position (in pixels).
   * @returns The map containing the specified position, or null if no map is found.
   */
  public getMapByPosition(x: number, y: number): Map | undefined {
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
