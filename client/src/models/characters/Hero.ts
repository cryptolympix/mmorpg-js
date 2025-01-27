import Fighter from "./Fighter";
import Object from "../objects/Object";
import World from "../map/World";
import { HeroClass, HeroGender, HeroStuff } from "../../../../shared/types";
import { HeroSchema } from "../../../../shared/database.schemas";

function getExperienceForLevel(level: number): number {
  return level * 100;
}

function getStatsPointsForLevel(level: number): number {
  return level * 10;
}

export default class Hero extends Fighter {
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

  private experience: number = 0;
  private experienceAtCurrentLevel: number = 0;
  private experienceToNextLevel: number = 100;
  private statsPoints: number = 0; // Points to distribute to stats
  private gold: number = 0;
  private heroClass: HeroClass;
  private gender: HeroGender;
  private objects: Object[] = [];
  private stuff: HeroStuff = {};

  /**
   * Creates a new `Hero` instance.
   * @param id - The unique identifier for the hero.
   * @param name - The name of the hero.
   * @param x - The initial x-coordinate of the hero.
   * @param y - The initial y-coordinate of the hero.
   * @param world - The world the hero belongs to.
   * @param spriteSheetFilePath - Path to the sprite sheet image.
   * @param heroClass - The class of the hero.
   * @param gender - The gender of the hero.
   */
  constructor(
    id: string,
    name: string,
    x: number,
    y: number,
    world: string,
    spriteSheetFilePath: string,
    heroClass: HeroClass,
    gender: HeroGender
  ) {
    super(
      id,
      name,
      x,
      y,
      world,
      Hero.HERO_WIDTH,
      Hero.HERO_HEIGHT,
      spriteSheetFilePath,
      Hero.HERO_SPRITE_SHEET_TILE_WIDTH,
      Hero.HERO_SPRITE_SHEET_TILE_HEIGHT,
      Hero.HERO_ANIMATION_FRAMES,
      Hero.HERO_INACTIVE_FRAME_INDEX
    );
    this.world = world;
    this.heroClass = heroClass;
    this.gender = gender;
  }

  public async load() {
    await super.load();
    this.loadStats();
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
    context.font = "14px Avenir";
    context.fillText(
      `Level ${this.level}`,
      this.x + cameraOffsetX,
      this.y - this.getHeight() + cameraOffsetY - 25
    );

    // Draw the character's name
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = "20px Avenir";
    context.fillText(
      this.name,
      this.x + cameraOffsetX,
      this.y - this.getHeight() + cameraOffsetY - 5
    );
  }

  public levelUp(): void {
    this.level++;
    this.experienceAtCurrentLevel = 0;
    this.experienceToNextLevel = getExperienceForLevel(this.level);
    this.statsPoints += getStatsPointsForLevel(this.level);
  }

  public gainExperience(amount: number): void {
    this.experience += amount;
    this.experienceAtCurrentLevel += amount;

    if (this.experienceAtCurrentLevel >= this.experienceToNextLevel) {
      this.levelUp();
      this.gainExperience(
        this.experienceAtCurrentLevel - this.experienceToNextLevel
      );
    }
  }

  public gainGold(amount: number): void {
    this.gold += amount;
  }

  public spendGold(amount: number): void {
    this.gold -= amount;
  }

  public addObject(Object: Object): void {
    this.objects.push(Object);
  }

  public useObject(objectId: string): void {}

  public equipStuff(stuffId: string): void {}

  public removeStuff(stuffId: string): void {}

  public update(schema: HeroSchema): void {
    this.name = schema.name;
    this.x = schema.x;
    this.y = schema.y;
    this.direction = schema.direction;
    this.currentAnimationFrameIndex = schema.currentAnimationFrameIndex;
    this.walking = schema.walking;
    this.heroClass = schema.heroClass;
    this.gender = schema.gender;
    this.experience = schema.experience;
    this.experienceAtCurrentLevel =
      schema.experience - getExperienceForLevel(schema.level - 1);
    this.experienceToNextLevel = getExperienceForLevel(schema.level);
    this.statsPoints = schema.statsPoints;
    this.gold = schema.gold;
    this.level = schema.level;
    this.stats = schema.stats;
  }

  public getLevel(): number {
    return this.level;
  }

  public getGender(): HeroGender {
    return this.gender;
  }

  public getExperience(): number {
    return this.experience;
  }

  public getExperienceAtCurrentLevel(): number {
    return this.experienceAtCurrentLevel;
  }

  public getExperienceToNextLevel(): number {
    return this.experienceToNextLevel;
  }

  public getGold(): number {
    return this.gold;
  }

  public getStatsPoints(): number {
    return this.statsPoints;
  }

  public getHeroClass(): HeroClass {
    return this.heroClass;
  }

  public getObjects(): Object[] {
    return this.objects;
  }

  public getStuff(): HeroStuff {
    return this.stuff;
  }

  static fromSchema(schema: HeroSchema): Hero {
    const hero = new Hero(
      schema.id,
      schema.name,
      schema.x,
      schema.y,
      schema.world,
      schema.spriteSheet,
      schema.heroClass,
      schema.gender
    );
    hero.currentAnimationFrameIndex = schema.currentAnimationFrameIndex;
    hero.experience = schema.experience;
    hero.experienceAtCurrentLevel =
      schema.experience - getExperienceForLevel(schema.level - 1);
    hero.experienceToNextLevel = getExperienceForLevel(schema.level);
    hero.statsPoints = schema.statsPoints;
    hero.gold = schema.gold;
    hero.level = schema.level;
    hero.stats = schema.stats;
    return hero;
  }

  public toSchema(): HeroSchema {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      direction: this.direction,
      currentAnimationFrameIndex: this.currentAnimationFrameIndex,
      world: this.world,
      walking: this.walking,
      spriteSheet: this.spriteSheet.getFilePath(),
      heroClass: this.heroClass,
      gender: this.gender,
      experience: this.experience,
      statsPoints: this.statsPoints,
      gold: this.gold,
      level: this.level,
      stats: this.stats,
      objects: this.objects.map((o) => o.getId()),
      stuffs: this.stuff,
      quests: [],
      skills: [],
    };
  }
}
