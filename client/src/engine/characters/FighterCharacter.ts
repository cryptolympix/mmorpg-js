import Character from "./Character";

interface Stats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  magic: number;
  resistance: number;
  speed: number;
  dodge: number;
}

export default class FighterCharacter extends Character {
  protected level: number = 1;
  protected stats: Stats = {
    health: 0,
    maxHealth: 0,
    mana: 0,
    maxMana: 0,
    attack: 0,
    defense: 0,
    magic: 0,
    resistance: 0,
    speed: 0,
    dodge: 0,
  };

  protected async loadStats(characterId: number) {
    this.level = 1;
    this.stats = {
      health: 100,
      maxHealth: 100,
      mana: 100,
      maxMana: 100,
      attack: 10,
      defense: 5,
      magic: 10,
      resistance: 5,
      speed: 10,
      dodge: 5,
    };
  }

  public getLevel(): number {
    return this.level;
  }

  public getStats(): Stats {
    return this.stats;
  }

  public getHealth(): number {
    return this.stats.health;
  }

  public getMaxHealth(): number {
    return this.stats.maxHealth;
  }

  public getMana(): number {
    return this.stats.mana;
  }

  public getMaxMana(): number {
    return this.stats.maxMana;
  }

  public getAttack(): number {
    return this.stats.attack;
  }

  public getDefense(): number {
    return this.stats.defense;
  }

  public getMagic(): number {
    return this.stats.magic;
  }

  public getResistance(): number {
    return this.stats.resistance;
  }

  public getSpeed(): number {
    return this.stats.speed;
  }

  public getDodge(): number {
    return this.stats.dodge;
  }

  public setHealth(health: number): void {
    this.stats.health = health;
  }

  public setMaxHealth(maxHealth: number): void {
    this.stats.maxHealth = maxHealth;
  }

  public setMana(mana: number): void {
    this.stats.mana = mana;
  }

  public setMaxMana(maxMana: number): void {
    this.stats.maxMana = maxMana;
  }

  public setAttack(attack: number): void {
    this.stats.attack = attack;
  }

  public setDefense(defense: number): void {
    this.stats.defense = defense;
  }

  public setMagic(magic: number): void {
    this.stats.magic = magic;
  }

  public setResistance(resistance: number): void {
    this.stats.resistance = resistance;
  }

  public setSpeed(speed: number): void {
    this.stats.speed = speed;
  }

  public setDodge(dodge: number): void {
    this.stats.dodge = dodge;
  }

  public resetHealth(): void {
    this.stats.health = this.stats.maxHealth;
  }

  public resetMana(): void {
    this.stats.mana = this.stats.maxMana;
  }
}
