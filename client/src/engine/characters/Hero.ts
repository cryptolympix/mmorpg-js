import FighterCharacter from "./FighterCharacter";
import Object from "../objects/Object";
import ActivableObject from "../objects/ActivableObject";
import QuestObject from "../objects/QuestObject";
import StuffObject, { StuffType } from "../objects/StuffObject";

export enum HeroClass {
  Druid = "Druid",
  Hunter = "Hunter",
  Knight = "Archer",
  Mage = "Mage",
  Paladin = "Paladin",
  Robber = "Robber",
}

interface HeroStuff {
  helmet?: StuffObject;
  armor?: StuffObject;
  weapon?: StuffObject;
  shield?: StuffObject;
  boots?: StuffObject;
  gloves?: StuffObject;
  pants?: StuffObject;
}

function getExperienceForLevel(level: number): number {
  return level * 100;
}

function getStatsPointsForLevel(level: number): number {
  return level * 10;
}

export default class Hero extends FighterCharacter {
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
  private objects: Object[] = [];
  private stuff: HeroStuff = {};

  /**
   * Creates a new `Hero` instance.
   * @param name - The name of the hero.
   * @param x - The initial x-coordinate of the hero.
   * @param y - The initial y-coordinate of the hero.
   * @param spriteSheetFilePath - Path to the sprite sheet image.
   * @param heroClass - The class of the hero.
   */
  constructor(
    name: string,
    x: number,
    y: number,
    spriteSheetFilePath: string,
    heroClass: HeroClass
  ) {
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
    this.heroClass = heroClass;
  }

  public async load() {
    await super.load();
    this.loadStats(0);
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

  public useObject(ActivableObjectId: string): void {
    const objectIndex = this.objects.findIndex(
      (object) => object.getId() === ActivableObjectId
    );

    if (objectIndex !== -1) {
      const object = this.objects[objectIndex];
      if (object instanceof ActivableObject) {
        object.use(this);
      }
    }
  }

  public equipStuff(stuff: StuffObject): void {
    if (stuff.getHeroClass() !== this.heroClass) {
      return;
    }

    if (this.stuff[stuff.getType()]) {
      this.objects.push(this.stuff[stuff.getType()]);
    }

    switch (stuff.getType()) {
      case StuffType.Helmet:
        this.stuff.helmet = stuff;
        break;
      case StuffType.Armor:
        this.stuff.armor = stuff;
        break;
      case StuffType.Weapon:
        this.stuff.weapon = stuff;
        break;
      case StuffType.Shield:
        this.stuff.shield = stuff;
        break;
      case StuffType.Boots:
        this.stuff.boots = stuff;
        break;
      case StuffType.Gloves:
        this.stuff.gloves = stuff;
        break;
      case StuffType.Pants:
        this.stuff.pants = stuff;
        break;
    }
  }

  public removeStuff(stuffType: StuffType): void {
    const stuff = this.stuff[stuffType];
    if (stuff) {
      this.objects.push(stuff);
      this.stuff[stuffType] = undefined;
    }
  }

  public getLevel(): number {
    return this.level;
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
}
