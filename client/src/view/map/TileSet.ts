import SpriteSheet from "../SpriteSheet";
import Tile from "./Tile";
import Config from "../../config.json";

/**
 * Represents a tileset used in a map, allowing for the loading of tileset files
 * and management of individual tiles and their associated sprite sheet.
 */
export default class TileSet {
  private filePath: string | null = null;
  private spriteSheet: SpriteSheet | null = null;
  private firstGid: number = 1;
  private tiles: Tile[] = [];

  /**
   * Creates a new TileSet instance.
   * @param filePath - Path to the tileset file (.tsx format).
   * @param firstGid - The first global ID for the tiles in this tileset.
   * @throws Will throw an error if the file path does not end with ".tsx".
   */
  constructor(filePath: string, firstGid: number) {
    if (!filePath.endsWith(".tsx")) {
      throw new Error(`Invalid tileset file: ${filePath} must end with .tsx`);
    }
    this.filePath = filePath;
    this.firstGid = firstGid;
  }

  /**
   * Loads the tileset file, parses its contents, and initializes the tiles and sprite sheet.
   * @throws Will throw an error if the file path is invalid, the tileset file cannot be fetched,
   * or if required attributes are missing from the tileset file.
   */
  public async load(): Promise<void> {
    if (!this.filePath) {
      throw new Error("Tileset file path is not provided.");
    }

    try {
      const response = await fetch(this.filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch tileset file: ${response.statusText}`);
      }

      // ----------------- Parse the tileset file -----------------

      const tsxContent = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(tsxContent, "text/xml");
      const tileset = xmlDoc.querySelector("tileset");

      if (!tileset) {
        throw new Error(
          `Invalid tileset file: ${this.filePath} missing <tileset> tag.`
        );
      }

      // ----------------- Parse the image file path -----------------

      const image = tileset.querySelector("image");

      if (!image) {
        throw new Error(
          `Invalid tileset file: ${this.filePath} missing <image> tag.`
        );
      }

      const imageFilepath = (
        Config.paths.SPRITESHEETS_FOLDER + image.getAttribute("source")!
      )
        .replace(/\.\//g, "/")
        .replace(/\/\//g, "/");

      if (!imageFilepath) {
        throw new Error(
          `Invalid tileset file: ${this.filePath} missing image source.`
        );
      }

      // ----------------- Parse tileset attributes -----------------

      const tileWidth = parseInt(tileset.getAttribute("tilewidth") || "0", 10);
      const tileHeight = parseInt(
        tileset.getAttribute("tileheight") || "0",
        10
      );
      const tileCount = parseInt(tileset.getAttribute("tilecount") || "0", 10);
      const columns = parseInt(tileset.getAttribute("columns") || "0", 10);

      if (!tileWidth || !tileHeight || !tileCount || !columns) {
        throw new Error(
          `Invalid tileset file: ${this.filePath} missing tileset required attributes.`
        );
      }

      // ----------------- Load the sprite sheet -----------------

      this.spriteSheet = new SpriteSheet(
        imageFilepath,
        tileWidth,
        tileHeight,
        tileCount,
        columns
      );

      await this.spriteSheet.load();

      // ----------------- Parse the tiles -----------------

      const tiles = Array.from(tileset.querySelectorAll("tile"));

      for (const t of tiles) {
        const id = parseInt(t.getAttribute("id") || "0", 10) + this.firstGid;

        if (!id) continue;

        // Parse the property of the tile
        const properties = Array.from(t.querySelectorAll("property")).map(
          (p) => ({
            name: p.getAttribute("name") || "",
            value: p.getAttribute("value") || "",
            type: p.getAttribute("type") || "",
          })
        );

        this.tiles.push(new Tile(id, tileWidth, tileHeight, this, properties));
      }

      if (Config.dev.debug) {
        console.log(`Tileset loaded: ${this.filePath}`);
      }
    } catch (error: any) {
      throw new Error(`Error loading tileset file: ${error.message}`);
    }
  }

  /**
   * Retrieves the file path of this tileset.
   * @returns The file path as a string.
   * @throws Will throw an error if the file path is not provided.
   */
  public getFilePath(): string {
    if (!this.filePath) {
      throw new Error("Tileset file path not provided.");
    }
    return this.filePath;
  }

  /**
   * Retrieves the sprite sheet associated with this tileset.
   * @returns The loaded SpriteSheet instance.
   * @throws Will throw an error if the sprite sheet has not been loaded.
   */
  public getSpriteSheet(): SpriteSheet {
    if (!this.spriteSheet) {
      throw new Error(`Tileset sprite sheet not loaded: ${this.filePath}`);
    }
    return this.spriteSheet;
  }

  /**
   * Retrieves the first global ID for the tiles in this tileset.
   * @returns The first global ID as a number.
   */
  public getFirstGid(): number {
    return this.firstGid;
  }

  /**
   * Retrieves a specific tile by its global ID.
   * @param tileId - The global ID of the tile to retrieve.
   * @returns The Tile instance matching the given ID.
   * @throws Will throw an error if the tile cannot be found.
   */
  public getTile(tileId: number): Tile {
    const tile = this.tiles.find((t) => t.getId() === tileId);
    if (!tile) {
      throw new Error(`Tile not found: ${tileId} in ${this.filePath}`);
    }
    return tile;
  }

  /**
   * Checks if a tile with the given global ID exists in this tileset.
   * @param tileId - The global ID of the tile to check.
   * @returns True if the tile exists, false otherwise.
   */
  public hasTile(tileId: number): boolean {
    return this.tiles.some((t) => t.getId() === tileId);
  }
}
