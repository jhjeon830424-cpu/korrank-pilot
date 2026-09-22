// ============================================================
// 군웅쟁패 - Duel (일기토) & multi-round battlefield system
// composition-aware (병종 상성) battle math
// ============================================================

// ---- 일기토 (single-combat duel between two generals) ----
function resolveDuel(generalA, generalB) {
  const stA = getEffectiveStats(generalA);
  const stB = getEffectiveStats(generalB);
  let scoreA = stA.war * 0.7 + stA.intel * 0.2 + Math.random() * 20;
  let scoreB = stB.war * 0.7 + stB.intel * 0.2 + Math.random() * 20;
  if (hasSpecialty(generalA, "duelist")) scoreA *= 1.15;
  if (hasSpecialty(generalB, "duelist")) scoreB *= 1.15;
  const winner = scoreA >= scoreB ? generalA : generalB;
  const loser = winner === generalA ? generalB : generalA;
  loser.woundedUntilTurn = (state.turn || 0) + 2;
  return {
    winner, loser,
    log: `${generalA.name} 대 ${generalB.name}, 일기토 승자: ${winner.name}! (${loser.name}은(는) 부상을 입어 당분간 무력이 저하된다)`
  };
}

function typeById(id) { return TROOP_TYPES.find(t => t.id === id); }

// weighted average base atk/def across a composition, plus a 0~1 "matchup edge"
// describing how favorably this composition is countered against the opposing one
function compositionProfile(comp, oppComp) {
  const total = Object.values(comp).reduce((a, b) => a + b, 0);
  if (total <= 0) return { atk: 1, def: 1, matchupBonus: 0 };
  const oppTotal = Object.values(oppComp).reduce((a, b) => a + b, 0) || 1;
  let atk = 0, def = 0, edge = 0;
  for (const t of TROOP_TYPES) {
    const frac = (comp[t.id] || 0) / total;
    if (frac <= 0) continue;
    atk += frac * t.atk;
    def += frac * t.def;
    const strongFrac = t.strongVs.reduce((s, id2) => s + (oppComp[id2] || 0), 0) / oppTotal;
    edge += frac * strongFrac;
  }
  return { atk, def, matchupBonus: edge * TROOP_MATCHUP_BONUS };
}

// ---- Multi-round battlefield simulation (전장 턴), 병종 상성 반영 ----
function simulateBattlefield(attackComposition, attackGeneral, targetCity, duelResult) {
  const defenders = generalsIn(targetCity.id);
  const defGeneral = defenders.sort((a, b) => b.war - a.war)[0];
  const defComposition0 = { ...targetCity.troops };

  let atkComp = { ...attackComposition };
  let defComp = { ...targetCity.troops };
  const rounds = [];

  let atkBonus = 1;
  let defBonus = 1;
  if (duelResult) {
    if (duelResult.winner === attackGeneral) atkBonus = 1.2;
    else if (duelResult.winner === defGeneral) defBonus = 1.2;
  }
  if (attackGeneral && hasSpecialty(attackGeneral, "fireattk")) atkBonus *= 1.15;
  if (defGeneral && hasSpecialty(defGeneral, "siege")) defBonus *= 1.15;

  const atkStats = attackGeneral ? getEffectiveStats(attackGeneral) : { war: 30, leadership: 40 };
  const defStats = defGeneral ? getEffectiveStats(defGeneral) : { war: 30 };

  const maxRounds = 5;
  for (let n = 1; n <= maxRounds; n++) {
    let atkTroops = Object.values(atkComp).reduce((a, b) => a + b, 0);
    let defTroops = Object.values(defComp).reduce((a, b) => a + b, 0);
    if (atkTroops <= 0 || defTroops <= 0) break;

    const atkProfile = compositionProfile(atkComp, defComp);
    const defProfile = compositionProfile(defComp, atkComp);

    const atkPower = atkTroops * atkProfile.atk * (1 + atkProfile.matchupBonus)
      * (0.6 + atkStats.war / 150) * (0.6 + atkStats.leadership / 150) * atkBonus;
    const defPower = defTroops * defProfile.def * (1 + defProfile.matchupBonus)
      * (0.6 + defStats.war / 150) * (1 + targetCity.defense / 100) * defBonus;
    const rng = 0.85 + Math.random() * 0.3;

    const atkLossTotal = Math.round(Math.min(atkTroops, defPower * rng * 0.22));
    const defLossTotal = Math.round(Math.min(defTroops, atkPower * rng * 0.22));

    atkComp = reduceCompositionBy(atkComp, atkTroops > 0 ? atkLossTotal / atkTroops : 0);
    defComp = reduceCompositionBy(defComp, defTroops > 0 ? defLossTotal / defTroops : 0);

    const newAtkTroops = Object.values(atkComp).reduce((a, b) => a + b, 0);
    const newDefTroops = Object.values(defComp).reduce((a, b) => a + b, 0);
    rounds.push({ n, atkTroops: newAtkTroops, defTroops: newDefTroops, atkLoss: atkLossTotal, defLoss: defLossTotal });
  }

  const finalAtk = Object.values(atkComp).reduce((a, b) => a + b, 0);
  const finalDef = Object.values(defComp).reduce((a, b) => a + b, 0);
  const attackerWins = finalDef <= 0 || (finalAtk > finalDef && finalAtk > 0);

  return {
    rounds,
    attackerWins,
    survivors: Math.max(0, Math.round(finalAtk)),
    defenderSurvivors: Math.max(0, Math.round(finalDef)),
    defGeneral,
    defComposition0
  };
}

function reduceCompositionBy(comp, ratio) {
  const out = {};
  for (const k in comp) out[k] = Math.max(0, Math.round(comp[k] * (1 - ratio)));
  return out;
}
