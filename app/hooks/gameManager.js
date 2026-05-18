import { useState, useCallback } from "react";

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function useGameManager() {
  const [hero, setHero] = useState({
    name: "Izoca",
    life: 100,
    maxLife: 100,
    potions: 3,
    defending: false,
  });
  const [villain, setVillain] = useState({
    name: "Fatec",
    life: 120,
    maxLife: 120,
    defending: false,
  });
  const [isHeroTurn, setIsHeroTurn] = useState(true);
  const [log, setLog] = useState(["⚔️ A batalha começou!"]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null); // 'hero' | 'villain' | 'flee'

  const addLog = (msg) => setLog((prev) => [...prev, msg]);

  const villainTurn = useCallback((currentHero, currentVillain) => {
    setTimeout(() => {
      let newHero = { ...currentHero, defending: false };
      let newVillain = { ...currentVillain, defending: false };

      const hpPct = currentVillain.life / currentVillain.maxLife;

      if (hpPct < 0.3 && Math.random() < 0.5) {
        newVillain.defending = true;
        addLog(`🛡️ ${currentVillain.name} se prepara para defender!`);
      } else {
        const miss = Math.random() < 0.15;
        if (miss) {
          addLog(`${currentVillain.name} ataca mas ERRA!`);
        } else {
          let dmg = rnd(10, 20);
          if (currentHero.defending) dmg = Math.floor(dmg * 0.4);
          newHero.life = Math.max(0, newHero.life - dmg);
          addLog(
            `💀 ${currentVillain.name} causa ${dmg} de dano em ${currentHero.name}!`,
          );
          if (newHero.life <= 0) {
            setGameOver(true);
            setResult("villain");
          }
        }
      }

      setHero(newHero);
      setVillain(newVillain);
      setIsHeroTurn(true);
    }, 1200);
  }, []);

  const onAction = useCallback(
    (action) => {
      if (!isHeroTurn || gameOver) return;
      setIsHeroTurn(false);

      let newHero = { ...hero, defending: false };
      let newVillain = { ...villain };

      if (action === "attack") {
        const isCrit = Math.random() < 0.2;
        let dmg = rnd(12, 22);
        if (isCrit) dmg = Math.round(dmg * 1.8);
        if (newVillain.defending) dmg = Math.floor(dmg / 2);
        newVillain.life = Math.max(0, newVillain.life - dmg);
        addLog(
          isCrit
            ? `💥 CRÍTICO! ${newHero.name} causa ${dmg} de dano!`
            : `⚔️ ${newHero.name} causa ${dmg} de dano em ${newVillain.name}!`,
        );
        if (newVillain.life <= 0) {
          setGameOver(true);
          setResult("hero");
          setHero(newHero);
          setVillain(newVillain);
          return;
        }
      } else if (action === "defense") {
        newHero.defending = true;
        addLog(`🛡️ ${newHero.name} assume postura defensiva!`);
      } else if (action === "usePotion") {
        if (newHero.potions <= 0) {
          addLog("Sem poções!");
          setIsHeroTurn(true);
          return;
        }
        const heal = Math.min(30, newHero.maxLife - newHero.life);
        newHero.life += heal;
        newHero.potions--;
        addLog(`🧪 ${newHero.name} recupera ${heal} pontos de vida!`);
      } else if (action === "flee") {
        if (Math.random() < 0.4) {
          addLog(`💨 ${newHero.name} fugiu da batalha!`);
          setGameOver(true);
          setResult("flee");
          setHero(newHero);
          setVillain(newVillain);
          return;
        }
        addLog(`💨 ${newHero.name} tentou fugir mas falhou!`);
      }

      setHero(newHero);
      setVillain(newVillain);
      villainTurn(newHero, newVillain);
    },
    [hero, villain, isHeroTurn, gameOver, villainTurn],
  );

  const restart = () => {
    setHero({
      name: "Roxas",
      life: 100,
      maxLife: 100,
      potions: 3,
      defending: false,
    });
    setVillain({ name: "Darkron", life: 120, maxLife: 120, defending: false });
    setIsHeroTurn(true);
    setLog(["⚔️ Nova batalha começou!"]);
    setGameOver(false);
    setResult(null);
  };

  return {
    hero,
    villain,
    isHeroTurn,
    log,
    gameOver,
    result,
    onAction,
    restart,
  };
}
