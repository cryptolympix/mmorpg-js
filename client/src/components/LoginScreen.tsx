import "./LoginScreen.scss";
import React, { useState, useEffect } from "react";
import Config from "../../../shared/config.json";
import * as HeroApi from "../api/heroes.api";
import Hero from "../models/characters/Hero";
import { useGameContext } from "../contexts/GameContext";
import World from "../models/map/World";
import { HeroSex, HeroClass } from "../../../shared/types";

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = ({}) => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [isCreatingHero, setIsCreatingHero] = useState(false);
  const [newHeroName, setNewHeroName] = useState<string>("");
  const [newHeroClass, setNewHeroClass] = useState<HeroClass | null>(null);
  const [newHeroSex, setNewHeroSex] = useState<HeroSex | null>(null);
  const { updatePlayerHero } = useGameContext();

  const fetchHeroes = async () => {
    const heroesData = await HeroApi.getHeroes();
    const fetchedHeroes: Hero[] = [];

    await Promise.all(
      heroesData.map(async (heroData) => {
        const hero = new Hero(
          heroData.id,
          heroData.name,
          heroData.x,
          heroData.y,
          new World(heroData.world),
          heroData.spriteSheet,
          heroData.heroClass as HeroClass,
          heroData.sex as HeroSex
        );
        await hero.load();

        if (!fetchedHeroes.some((h) => h.getId() === hero.getId())) {
          fetchedHeroes.push(hero);
        }
      })
    );

    setHeroes(fetchedHeroes);
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleSelectHero = async () => {
    if (!selectedHeroId) return;
    const hero = heroes.find((h) => h.getId() === selectedHeroId);
    if (hero) {
      updatePlayerHero(hero);
    }
  };

  const handleCreateHero = async () => {
    if (!newHeroName || !newHeroClass || !newHeroSex) return;

    if (!/^[a-zA-Z0-9_]{3,16}$/.test(newHeroName)) {
      alert(
        "Invalid hero name format, must be 3-16 characters long and contain only letters, numbers, and underscores"
      );
      return;
    }

    const initialWorld = new World(Config.start.world);
    await initialWorld.load();
    const startPoint = initialWorld.getStartPoint();

    const spriteSheetUrl =
      Config.urls.server +
      Config.paths.charactersSpritesheetsFolder +
      `heroes/${newHeroClass.toLowerCase()}_${
        newHeroSex === HeroSex.Male ? "m" : "f"
      }.png`;

    const newHero = new Hero(
      Date.now().toString(),
      newHeroName,
      startPoint.x,
      startPoint.y,
      initialWorld,
      spriteSheetUrl,
      newHeroClass,
      newHeroSex
    );

    await newHero.load();
    HeroApi.createHero(newHero)
      .then((createdHeroId) => {
        setSelectedHeroId(createdHeroId);
        updatePlayerHero(newHero);
      })
      .catch((error) => {
        alert(error.response.data);
      });
  };

  const handleDeleteHero = async (heroId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this hero? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await HeroApi.deleteHero(heroId); // Call the API to delete the hero
      setHeroes((prevHeroes) =>
        prevHeroes.filter((hero) => hero.getId() !== heroId)
      ); // Update the UI
      if (selectedHeroId === heroId) setSelectedHeroId(null); // Deselect if deleted
    } catch (error) {
      alert("Failed to delete the hero. Please try again.");
    }
  };

  return (
    <div
      className="LoginScreen"
      style={{
        backgroundImage: `url(/assets/background.png)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {isCreatingHero ? (
        <div className="HeroCreation">
          <h2>Create a New Hero</h2>
          {/* Hero Name Input */}
          <p className="instruction">
            Enter a name for your hero (3-16 characters, letters, numbers, or
            underscores):
          </p>
          <input
            type="text"
            placeholder="Enter hero name"
            value={newHeroName}
            onChange={(e) => setNewHeroName(e.target.value)}
          />

          {/* Hero Class Selection */}
          <p className="instruction">Choose your hero's class:</p>
          <div className="choice-container">
            {Object.values(HeroClass).map((heroClass) => (
              <div
                key={heroClass}
                className={`choice-box ${
                  newHeroClass === heroClass ? "selected" : ""
                }`}
                onClick={() => setNewHeroClass(heroClass)}
              >
                <label>
                  <input
                    type="radio"
                    name="heroClass"
                    value={heroClass}
                    checked={newHeroClass === heroClass}
                    onChange={() => setNewHeroClass(heroClass)}
                  />
                  {heroClass}
                </label>
              </div>
            ))}
          </div>

          {/* Hero Sex Selection */}
          <p className="instruction">Select your hero's gender:</p>
          <div className="choice-container">
            {Object.values(HeroSex).map((heroSex) => (
              <div
                key={heroSex}
                className={`choice-box ${
                  newHeroSex === heroSex ? "selected" : ""
                }`}
                onClick={() => setNewHeroSex(heroSex)}
              >
                <label>
                  <input
                    type="radio"
                    name="heroSex"
                    value={heroSex}
                    checked={newHeroSex === heroSex}
                    onChange={() => setNewHeroSex(heroSex)}
                  />
                  {heroSex === HeroSex.Male ? "♂ Male" : "♀ Female"}
                </label>
              </div>
            ))}
          </div>

          {/* Create and Back Buttons */}
          <button
            onClick={handleCreateHero}
            disabled={!newHeroName || !newHeroClass || !newHeroSex}
          >
            Create Hero
          </button>
          <button onClick={() => setIsCreatingHero(false)}>Back</button>
        </div>
      ) : (
        <div className="HeroSelection">
          <h2>Select Your Hero</h2>
          <div className="choice-container">
            {heroes.map((hero) => (
              <div
                key={hero.getId()}
                className={`choice-box ${
                  selectedHeroId === hero.getId() ? "selected" : ""
                }`}
              >
                {/* Hero Information and Sprite Sheet */}
                <div className="hero-info">
                  <label>
                    <input
                      type="radio"
                      value={hero.getId()}
                      checked={selectedHeroId === hero.getId()}
                      onChange={() => setSelectedHeroId(hero.getId())}
                    />
                    <div className="hero-details">
                      <p>
                        <strong>{hero.getName()}</strong>
                      </p>
                      <p>{`${hero.getHeroClass()} (lvl. ${hero.getLevel()})`}</p>
                    </div>
                  </label>
                </div>

                {/* Sprite Sheet Image */}
                <img
                  src={
                    Config.urls.server +
                    Config.paths.charactersFolder +
                    "icons/" +
                    hero.getHeroClass().toLowerCase() +
                    "_" +
                    (hero.getSex() === HeroSex.Male ? "m" : "f") +
                    ".png"
                  }
                  style={{ width: "48px", height: "64px" }}
                  className="hero-icon"
                />

                {/* Delete Button */}
                <button
                  className="delete-button"
                  onClick={() => handleDeleteHero(hero.getId())}
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleSelectHero} disabled={!selectedHeroId}>
            Start Game
          </button>
          <button onClick={() => setIsCreatingHero(true)}>Create Hero</button>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
