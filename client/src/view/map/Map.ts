import Config from "../../config.json";
import Tile from "./Tile";
import TileSet from "./TileSet";
import TileLayer from "./TileLayer";
import SpriteSheet from "../SpriteSheet";
import Character from "../../characters/Character";

/**
 * Represents a map in a tile-based game, including its tilesets, layers, and spatial properties.
 */
export default class Map {
  private name: string = ""; // Name of the map
  private filePath: string = ""; // Path to the TMX file
  private tileSets: TileSet[] = []; // Tilesets used in the map
  private tileLayers: TileLayer[] = []; // Tile layers of the map
  private x: number = 0; // X-coordinate of the map in the world
  private y: number = 0; // Y-coordinate of the map in the world
  private widthInTiles: number = 0; // Map dimensions in tiles
  private heightInTiles: number = 0; // Map dimensions in tiles
  private widthPixels: number = 0; // Width of the map in pixels
  private heightPixels: number = 0; // Height of the map in pixels

  /**
   * @param filePath - The path to the TMX file defining the map.
   * @param x - The x-coordinate of the map in the world.
   * @param y - The y-coordinate of the map in the world.
   * @param widthPixels - The width of the map in pixels.
   * @param heightPixels - The height of the map in pixels.
   */
  constructor(
    filePath: string,
    x: number,
    y: number,
    widthPixels: number,
    heightPixels: number
  ) {
    if (!filePath.endsWith(".tmx")) {
      throw new Error(`Invalid map file: ${filePath} must end with .tmx`);
    }

    this.filePath = filePath;
    this.x = x;
    this.y = y;
    this.widthPixels = widthPixels;
    this.heightPixels = heightPixels;
  }

  /**
   * Load the map data from the TMX file and initialize its tilesets and layers.
   */
  async load(): Promise<void> {
    const tmxResponse = await fetch(this.filePath);
    const tmxContent = await tmxResponse.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(tmxContent, "text/xml");

    const map = xmlDoc.querySelector("map");
    if (!map) {
      throw new Error(`Invalid TMX file: ${this.filePath}: missing <map> tag.`);
    }

    this.name = this.filePath.split("/").pop()!.replace(".tmx", "");

    const mapWidth = map.getAttribute("width");
    const mapHeight = map.getAttribute("height");
    if (!mapWidth || !mapHeight) {
      throw new Error(
        `Invalid map dimensions in TMX file: ${this.filePath}. Missing width and/or height attributes.`
      );
    }
    this.widthInTiles = parseInt(mapWidth, 10);
    this.heightInTiles = parseInt(mapHeight, 10);

    // Parse tilesets
    const tilesets = Array.from(xmlDoc.querySelectorAll("tileset"));
    for (const t of tilesets) {
      const firstGid = parseInt(t.getAttribute("firstgid") || "0", 10);
      const tsxFilePath = Config.paths.MAPS_FOLDER + t.getAttribute("source");
      if (!tsxFilePath) continue;
      const tileset = new TileSet(tsxFilePath, firstGid);
      await tileset.load();
      this.tileSets.push(tileset);
    }

    // Parse layers and create tiles
    const layers = Array.from(xmlDoc.querySelectorAll("layer"));
    for (let l = 0; l < layers.length; l++) {
      const layerId = layers[l].getAttribute("id");
      const layerName = layers[l].getAttribute("name");
      const layerWidth = parseInt(layers[l].getAttribute("width") || "0", 10);
      const layerHeight = parseInt(layers[l].getAttribute("height") || "0", 10);
      const layerData = layers[l].querySelector("data")?.textContent;
      if (!layerId || !layerName || !layerWidth || !layerHeight || !layerData) {
        throw new Error(`Invalid layer data in map: ${this.filePath}`);
      }

      const tileIds = layerData.split(",").map((id) => parseInt(id, 10));
      const tileLayer = new TileLayer(
        layerId,
        layerName,
        layerWidth,
        layerHeight
      );
      for (let j = 0; j < this.heightInTiles; j++) {
        for (let i = 0; i < this.widthInTiles; i++) {
          const tileId = tileIds[j * this.widthInTiles + i];
          if (tileId === 0) {
            continue;
          }

          const tileSet = this.getTilesetForTile(tileId);
          tileLayer.addTile(tileSet.getTile(tileId), i, j);
        }
      }

      this.tileLayers[l] = tileLayer;
    }

    if (Config.dev.debug) {
      console.log(
        `Loaded map: ${this.name} with ${this.tileSets.length} tilesets and ${this.tileLayers.length} layers.`
      );
    }
  }

  /**
   * Draw a specific layer of the map onto a canvas context.
   * @param context - The canvas 2D context to draw on.
   * @param layerIndex - The index of the layer to draw.
   * @param characters - An array of characters to draw on the map.
   * @param cameraOffsetX - The x-offset for rendering (camera position).
   * @param cameraOffsetY - The y-offset for rendering (camera position).
   */
  public drawLayer(
    context: CanvasRenderingContext2D,
    layerIndex: number,
    charactersToDraw: Character[] = [],
    cameraOffsetX: number = 0,
    cameraOffsetY: number = 0
  ): void {
    const tileLayer = this.tileLayers[layerIndex];
    let tilesToDraw: { drawX: number; drawY: number; tile: Tile }[] = [];

    // Get all tiles to draw
    for (let j = 0; j < tileLayer.getHeight(); j++) {
      for (let i = 0; i < tileLayer.getWidth(); i++) {
        const tile = tileLayer.getTile(i, j);
        if (!tile) {
          continue;
        }

        const drawX = this.getX() + i * tile.getWidth() + cameraOffsetX;
        const drawY = this.getY() + j * tile.getHeight() + cameraOffsetY;

        if (
          drawX + tile.getWidth() > 0 &&
          drawX < context.canvas.width &&
          drawY + tile.getHeight() > 0 &&
          drawY < context.canvas.height
        ) {
          tilesToDraw.push({ drawX, drawY, tile });
        }
      }
    }

    // Sort the characters and tiles by their y-coordinate
    charactersToDraw.sort((a, b) => a.getY() - b.getY());
    tilesToDraw.sort((a, b) => a.drawY - b.drawY);

    // Group all objects to draw
    let allObjectsToDraw = [...tilesToDraw, ...charactersToDraw];

    // Sort the objects by their y-coordinate
    allObjectsToDraw.sort((obj1, obj2) => {
      let obj1X =
        obj1 instanceof Character
          ? obj1.getY()
          : obj1.drawY + obj1.tile.getHeight();
      let obj2X =
        obj2 instanceof Character
          ? obj2.getY()
          : obj2.drawY + obj2.tile.getHeight();
      return obj1X - obj2X;
    });

    // Draw all objects
    for (let object of allObjectsToDraw) {
      if (object instanceof Character) {
        object.draw(context, cameraOffsetX, cameraOffsetY);
      } else {
        const { drawX, drawY, tile } = object;
        const tileSet = this.getTilesetForTile(tile.getId());
        tileSet
          .getSpriteSheet()
          .drawTile(
            context,
            tile.getId() - tileSet.getFirstGid(),
            drawX,
            drawY
          );

        if (Config.dev.debug) {
          context.fillStyle = "red";
          context.fillRect(drawX, drawY, 1, 1);
        }
      }
    }
  }

  /**
   * Draw the entire map onto a given canvas context.
   * @param context - The canvas 2D context to draw on.
   * @param characters - An array of characters to draw on the map.
   * @param cameraOffsetX - The x-offset for rendering (camera position).
   * @param cameraOffsetY - The y-offset for rendering (camera position).
   */
  public draw(
    context: CanvasRenderingContext2D,
    characters: Character[] = [],
    cameraOffsetX: number = 0,
    cameraOffsetY: number = 0
  ): void {
    for (let i = 0; i < this.tileLayers.length; i++) {
      if (this.tileLayers[i].getName() === "Overlay 1") {
        // Remove the character that are not in the map
        characters = characters.filter((c) => this.containsCharacter(c));
        this.drawLayer(context, i, characters, cameraOffsetX, cameraOffsetY);
      } else {
        this.drawLayer(context, i, [], cameraOffsetX, cameraOffsetY);
      }
    }
  }

  /**
   * Check if all sprite sheets have been loaded.
   * @returns Whether all sprite sheets have been loaded.
   */
  public isLoaded(): boolean {
    for (let tileset of this.tileSets) {
      if (!tileset.getSpriteSheet().isLoaded()) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if a character is contained within the map.
   * @param character - The character to check.
   * @returns Whether the character is within the map.
   */
  public containsCharacter(character: Character): boolean {
    const { left, right, top, bottom } = character.boxCollision();
    return (
      left >= this.getX() &&
      right < this.getX() + this.getWidthInPixels() &&
      top >= this.getY() &&
      bottom < this.getY() + this.getHeightInPixels()
    );
  }

  /**
   * Find the tileset corresponding to a specific tile ID.
   * @param tileId - The ID of the tile.
   * @returns The Tileset instance.
   */
  private getTilesetForTile(tileId: number): TileSet {
    let ts = this.tileSets.find((ts) => ts.hasTile(tileId))!;
    if (!ts) {
      throw new Error(`No tileset found for tile ID ${tileId}.`);
    }
    return ts;
  }

  /**
   * Get the tile at a specific position in the map.
   * @param i - The x-coordinate of the tile.
   * @param j - The y-coordinate of the tile.
   * @param layerIndex - The index of the layer to get the tile from.
   * @returns The Tile instance at the given position.
   */
  public getTileByPositionInPixels(
    x: number,
    y: number,
    layerIndex: number
  ): Tile | null {
    if (
      x < this.getX() ||
      x >= this.getX() + this.getWidthInPixels() ||
      y < this.getY() ||
      y >= this.getY() + this.getHeightInPixels()
    ) {
      return null;
    }
    const i = Math.floor((x - this.getX()) / this.getTileWidthInPixels());
    const j = Math.floor((y - this.getY()) / this.getTileHeightInPixels());
    return this.tileLayers[layerIndex].getTile(i, j);
  }

  /**
   * Get the number of tile layers in the map.
   * @returns The number of tile layers in the map.
   */
  public getNbLayers(): number {
    return this.tileLayers.length;
  }

  /**
   * Get the tile width in pixels.
   * @returns The width of a tile in pixels
   */
  public getTileWidthInPixels(): number {
    return this.tileSets[0].getSpriteSheet().getTileWidth();
  }

  /**
   * Get the tile height in pixels.
   * @returns The height of a tile in pixels
   */
  public getTileHeightInPixels(): number {
    return this.tileSets[0].getSpriteSheet().getTileHeight();
  }

  /**
   * Get the name of the map.
   * @returns The map name.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Get the width of the map in tiles.
   * @returns The width of the map in tiles.
   */
  public getWidthInTiles(): number {
    return this.widthInTiles;
  }

  /**
   * Get the height of the map in tiles.
   * @returns The height of the map in tiles.
   */
  public getHeightInTiles(): number {
    return this.heightInTiles;
  }

  /**
   * Get all tile layers in the map.
   * @returns An array of TileLayer objects.
   */
  public getTileLayers(): TileLayer[] {
    return this.tileLayers;
  }

  /**
   * Get all tilesets in the map.
   * @returns An array of TileSet objects.
   */
  public getTilesets(): TileSet[] {
    return this.tileSets;
  }

  /**
   * Get all sprite sheets in the map.
   * @returns An array of SpriteSheet objects.
   */
  public getSpriteSheets(): SpriteSheet[] {
    return this.tileSets.map((ts) => ts.getSpriteSheet());
  }

  /**
   * Get the x-coordinate of the map in the world.
   * @returns The x-coordinate of the map.
   */
  public getX(): number {
    return this.x;
  }

  /**
   * Get the y-coordinate of the map in the world.
   * @returns The y-coordinate of the map.
   */
  public getY(): number {
    return this.y;
  }

  /**
   * Get the width of the map in pixels.
   * @returns The width of the map in pixels.
   */
  public getWidthInPixels(): number {
    return this.widthPixels;
  }

  /**
   * Get the height of the map in pixels.
   * @returns The height of the map in pixels.
   */
  public getHeightInPixels(): number {
    return this.heightPixels;
  }
}
