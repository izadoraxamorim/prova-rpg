"use client";

import Character from "./components/Character";
import { useGameManager } from "./hooks/gameManager";
import "./style.css";

export default function Home() {
  const {
    hero,
    villain,
    isHeroTurn,
    log,
    gameOver,
    result,
    onAction,
    restart,
  } = useGameManager();

  return (
    <div className="game">
      <h1 className="game-title">⚔️ Battle RPG</h1>

      <div className="arena">
        <Character
          data={hero}
          isHero={true}
          isHeroTurn={isHeroTurn}
          onAction={gameOver ? null : onAction}
        />
        <div className="vs">VS</div>
        <Character
          data={villain}
          isHero={false}
          isHeroTurn={false}
          onAction={null}
        />
      </div>

      {!isHeroTurn && !gameOver && (
        <p className="thinking">💀 {villain.name} está pensando...</p>
      )}

      {gameOver && (
        <div className="result">
          {result === "hero" && <p>🏆 Você venceu!</p>}
          {result === "villain" && <p>💀 Você foi derrotado!</p>}
          {result === "flee" && <p>💨 Você fugiu da batalha!</p>}
          <button onClick={restart}>Nova Batalha</button>
        </div>
      )}

      <div className="log">
        <h3>📜 Batalha</h3>
        {log
          .slice()
          .reverse()
          .map((entry, i) => (
            <p key={i} className={i === 0 ? "log-latest" : ""}>
              {entry}
            </p>
          ))}
      </div>
    </div>
  );
}
