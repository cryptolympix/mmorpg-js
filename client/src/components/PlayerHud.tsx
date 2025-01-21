import { useState, useEffect } from "react";
import "./PlayerHud.scss";
import { useGameContext } from "../contexts/GameContext";

export default function PlayerHud() {
  const { playerHero } = useGameContext();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (playerHero) {
      const stats = playerHero.getStats();
      setStats({
        health: stats.health,
        maxHealth: stats.maxHealth,
        mana: stats.mana,
        maxMana: stats.maxMana,
        experience: playerHero.getExperienceAtCurrentLevel(),
        maxExperience: playerHero.getExperienceToNextLevel(),
        gold: playerHero.getGold(),
      });
    }
  }, [playerHero]);

  if (!stats) return null;

  const healthPercentage = (stats.health / stats.maxHealth) * 100;
  const manaPercentage = (stats.mana / stats.maxMana) * 100;
  const experiencePercentage = (stats.experience / stats.maxExperience) * 100;

  return (
    <div className="PlayerHud">
      <div className="PlayerHud__stat">
        <label>Health:</label>
        <div className="PlayerHud__bar PlayerHud__bar--health">
          <div
            className="PlayerHud__barInner"
            style={{ width: `${healthPercentage}%` }}
          >
            <span className="PlayerHud__barText">
              {stats.health} / {stats.maxHealth}
            </span>
          </div>
        </div>
      </div>
      <div className="PlayerHud__stat">
        <label>Mana:</label>
        <div className="PlayerHud__bar PlayerHud__bar--mana">
          <div
            className="PlayerHud__barInner"
            style={{ width: `${manaPercentage}%` }}
          >
            <span className="PlayerHud__barText">
              {stats.mana} / {stats.maxMana}
            </span>
          </div>
        </div>
      </div>
      <div className="PlayerHud__stat">
        <label>Experience:</label>
        <div className="PlayerHud__bar PlayerHud__bar--experience">
          <div
            className="PlayerHud__barInner"
            style={{ width: `${experiencePercentage}%` }}
          >
            <span className="PlayerHud__barText">
              {stats.experience} / {stats.maxExperience}
            </span>
          </div>
        </div>
      </div>
      <div className="PlayerHud__gold">Gold: {stats.gold}</div>
    </div>
  );
}
