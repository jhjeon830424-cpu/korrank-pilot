// ============================================================
// 군웅쟁패 - Game Engine (original implementation)
// ============================================================

const SAVE_KEY = "gunwoong_save_v2";

let state = null; // live game state

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function emptyComposition() { return { infantry: 0, archer: 0, cavalry: 0, crossbow: 0, navy: 0 }; }

function newGame(playerFactionId) {
  const cities = deepClone(CITIES).reduce((m, c) => {
    // convert the flat starting troop count into a mixed composition (mostly infantry)
    const total = c.troops;
    c.troops = {
      infantry: Math.round(total * 0.55),
      archer: Math.round(total * 0.2),
      cavalry: Math.round(total * 0.15),
      crossbow: Math.round(total * 0.1),
      navy: 0
    };
    m[c.id] = c;
    return m;
  }, {});

  // remap named generals from their old region id onto a city within that region
  const regionCounters = {};
  const generals = {};
  for (const g0 of deepClone(GENERALS)) {
    const g = g0;
    const regionId = g.province;
    const cityList = REGION_CITIES[regionId] || [regionId];
    const idx = regionCounters[regionId] || 0;
    regionCounters[regionId] = idx + 1;
    g.province = cityList[idx % cityList.length];
    g.item = g.item || null;
    generals[g.id] = g;
  }

  // procedural "파워키드" style generic officers, distributed across every city
  let idx = 0;
  for (const city of Object.values(cities)) {
    const count = 3 + Math.floor(Math.random() * 5); // 3~7 per city
    for (let i = 0; i < count; i++) {
      const g = generateProceduralGeneral(idx++, city.owner, city.id);
      generals[g.id] = g;
    }
  }

  state = {
    year: STARTING_YEAR,
    turn: 1,
    playerFaction: playerFactionId,
    cities,
    generals,
    factions: deepClone(FACTIONS).reduce((m, f) => { m[f.id] = f; return m; }, {}),
    inventory: [...STARTING_ITEMS],
    log: [`${STARTING_YEAR}년, 천하가 어지러워지기 시작했다. (총 장수 ${Object.keys(generals).length}명)`],
    selectedCity: null,
    gameOver: false,
    storyShown: {},
    pendingStory: null
  };
  save();
  return state;
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* storage full/unavailable */ }
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    state = JSON.parse(raw);
    return state;
  } catch (e) { return null; }
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}

// ---- Derived helpers ----
function citiesOf(factionId) {
  return Object.values(state.cities).filter(c => c.owner === factionId);
}

function generalsOf(factionId) {
  return Object.values(state.generals).filter(g => g.faction === factionId);
}

function generalsIn(cityId) {
  return Object.values(state.generals).filter(g => g.province === cityId);
}

function isPlayer(factionId) { return factionId === state.playerFaction; }

function factionAlive(factionId) {
  return citiesOf(factionId).length > 0;
}

function cityTotalTroops(city) {
  return Object.values(city.troops).reduce((a, b) => a + b, 0);
}

// item-bonus-inclusive stats, used everywhere combat/internal-affairs read a stat
function getEffectiveStats(general) {
  const base = { leadership: general.leadership, war: general.war, intel: general.intel, politics: general.politics, charm: general.charm };
  if (general.item) {
    const item = ITEMS.find(i => i.id === general.item);
    if (item) for (const k in item.bonus) base[k] = (base[k] || 0) + item.bonus[k];
  }
  if (general.woundedUntilTurn && state.turn < general.woundedUntilTurn) base.war = Math.max(10, base.war - 15);
  return base;
}

function hasSpecialty(general, specId) { return general.specialty === specId; }

// ---- Actions (player): 도시 행정 (city administration, split by focus) ----
function actionDevelop(cityId, generalId, kind) {
  const c = state.cities[cityId];
  if (!c || c.owner !== state.playerFaction) return { ok: false, msg: "내 영지가 아닙니다." };
  const g = state.generals[generalId];
  const st = g ? getEffectiveStats(g) : { politics: 40, intel: 40, leadership: 40 };

  if (kind === "agriculture") {
    let gain = Math.round(25 + st.politics * 1.6);
    if (g && hasSpecialty(g, "logistics")) gain = Math.round(gain * 1.4);
    c.food += gain;
    c.pop = Math.min(100, c.pop + 1);
    log(`${c.name}: ${g ? g.name : "관리"}이(가) 농업을 장려해 식량 +${fmt(gain)}`);
  } else if (kind === "commerce") {
    let gain = Math.round(22 + st.politics * 1.5);
    if (g && hasSpecialty(g, "commerce")) gain = Math.round(gain * 1.4);
    c.gold += gain;
    log(`${c.name}: ${g ? g.name : "관리"}이(가) 상업을 육성해 금 +${fmt(gain)}`);
  } else if (kind === "technology") {
    let gain = Math.round(1 + st.intel / 25);
    c.defense = Math.min(99, c.defense + gain);
    log(`${c.name}: ${g ? g.name : "관리"}이(가) 축성/기술을 발전시켜 방어 +${gain}`);
  } else if (kind === "security") {
    let gain = Math.round(1 + st.leadership / 20);
    c.defense = Math.min(99, c.defense + gain);
    c.pop = Math.min(100, c.pop + 1);
    log(`${c.name}: ${g ? g.name : "관리"}이(가) 치안을 다스려 민심과 방어가 안정되었다.`);
  } else {
    return { ok: false, msg: "알 수 없는 내정 종류입니다." };
  }
  save();
  return { ok: true };
}

// ---- 인재 등용 (recruit an unaffiliated / neutral-faction general) ----
function actionRecruitGeneral(generalId, fromCityId) {
  const g = state.generals[generalId];
  const from = state.cities[fromCityId];
  if (!g || g.faction !== "neutral") return { ok: false, msg: "등용할 수 없는 대상입니다." };
  if (!from || from.owner !== state.playerFaction) return { ok: false, msg: "내 영지가 아닙니다." };
  const adjacent = from.id === g.province || from.neighbors.includes(g.province);
  if (!adjacent) return { ok: false, msg: "해당 인재가 인접한 곳에 있지 않습니다." };
  const cost = 300;
  if (from.gold < cost) return { ok: false, msg: "금이 부족합니다. (필요: 300)" };
  from.gold -= cost;

  const myGeneral = generalsIn(fromCityId).sort((a, b) => b.charm - a.charm)[0];
  let persuade = (myGeneral ? getEffectiveStats(myGeneral).charm : 40) + Math.random() * 30;
  if (myGeneral && hasSpecialty(myGeneral, "oratory")) persuade *= 1.25;
  const resist = getEffectiveStats(g).charm + Math.random() * 30;

  if (persuade > resist) {
    g.faction = state.playerFaction;
    g.province = fromCityId;
    log(`${g.name}이(가) 그대의 세력에 합류했다!`);
    save();
    return { ok: true, success: true };
  } else {
    log(`${from.name}에서 ${g.name}을(를) 등용하려 했으나 실패했다.`);
    save();
    return { ok: true, success: false };
  }
}

// ---- 장수 창조 (파워키드 스타일 커스텀 장수 생성) ----
const CREATE_GENERAL_BUDGET = 280;
const CREATE_GENERAL_COST = 500;

function actionCreateGeneral(cityId, name, stats, specialty) {
  const c = state.cities[cityId];
  if (!c || c.owner !== state.playerFaction) return { ok: false, msg: "내 영지가 아닙니다." };
  const cleanName = (name || "").trim().slice(0, 8);
  if (!cleanName) return { ok: false, msg: "이름을 입력하세요." };
  const total = ["leadership","war","intel","politics","charm"].reduce((s, k) => s + (Number(stats[k]) || 0), 0);
  if (total > CREATE_GENERAL_BUDGET) return { ok: false, msg: `능력치 총합이 예산(${CREATE_GENERAL_BUDGET})을 초과했습니다.` };
  for (const k of ["leadership","war","intel","politics","charm"]) {
    const v = Number(stats[k]);
    if (!(v >= 10 && v <= 99)) return { ok: false, msg: "각 능력치는 10~99 사이여야 합니다." };
  }
  if (c.gold < CREATE_GENERAL_COST) return { ok: false, msg: `금이 부족합니다. (필요: ${CREATE_GENERAL_COST})` };
  c.gold -= CREATE_GENERAL_COST;

  const id = `g_custom_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const g = {
    id, name: cleanName, faction: state.playerFaction, province: cityId, isLord: false,
    specialty: specialty || "none", item: null,
    leadership: Number(stats.leadership), war: Number(stats.war), intel: Number(stats.intel),
    politics: Number(stats.politics), charm: Number(stats.charm)
  };
  state.generals[id] = g;
  log(`${c.name}에서 새로운 장수 ${cleanName}이(가) 출사했다!`);
  save();
  return { ok: true, general: g };
}

// ---- 아이템 장착/해제 ----
function actionEquipItem(generalId, itemId) {
  const g = state.generals[generalId];
  if (!g || g.faction !== state.playerFaction) return { ok: false, msg: "내 장수가 아닙니다." };
  if (!state.inventory.includes(itemId)) return { ok: false, msg: "보유하지 않은 아이템입니다." };
  // unequip whatever this general currently has (back to inventory) and equip the new one
  if (g.item) state.inventory.push(g.item);
  state.inventory = state.inventory.filter(i => i !== itemId);
  g.item = itemId;
  save();
  return { ok: true };
}

function actionUnequipItem(generalId) {
  const g = state.generals[generalId];
  if (!g || g.faction !== state.playerFaction || !g.item) return { ok: false, msg: "장착된 아이템이 없습니다." };
  state.inventory.push(g.item);
  g.item = null;
  save();
  return { ok: true };
}

// ---- 모병 (recruit troops, choosing a 병종) ----
function actionRecruit(cityId, generalId, troopType) {
  const c = state.cities[cityId];
  if (!c || c.owner !== state.playerFaction) return { ok: false, msg: "내 영지가 아닙니다." };
  const type = TROOP_TYPES.find(t => t.id === troopType);
  if (!type) return { ok: false, msg: "알 수 없는 병종입니다." };
  if (type.coastalOnly && !COASTAL_CITIES.has(cityId)) return { ok: false, msg: "이 도시에서는 수군을 모병할 수 없습니다." };
  const g = state.generals[generalId];
  const leadership = g ? getEffectiveStats(g).leadership : 40;
  const amount = Math.round(200 + leadership * 5);
  const cost = Math.round(amount * type.cost / 10);
  if (c.gold < cost) return { ok: false, msg: `금이 부족합니다. (필요: ${cost})` };
  c.gold -= cost;
  c.troops[troopType] += amount;
  log(`${c.name}: ${g ? g.name : "장수"}이(가) ${type.name} ${fmt(amount)}명을 모집했다.`);
  save();
  return { ok: true };
}

function buildAttackForce(city, targetCityId) {
  const allowNavy = COASTAL_CITIES.has(city.id) && COASTAL_CITIES.has(targetCityId);
  const comp = emptyComposition();
  let total = 0;
  for (const t of TROOP_TYPES) {
    if (t.id === "navy" && !allowNavy) continue;
    const avail = city.troops[t.id] || 0;
    const take = Math.floor(avail * 0.6);
    comp[t.id] = take;
    total += take;
  }
  return { comp, total };
}

function prepareBattle(fromCityId, toCityId, generalId) {
  const from = state.cities[fromCityId];
  const to = state.cities[toCityId];
  if (!from || from.owner !== state.playerFaction) return { ok: false, msg: "내 영지가 아닙니다." };
  if (!to) return { ok: false, msg: "대상이 없습니다." };
  if (!from.neighbors.includes(toCityId)) return { ok: false, msg: "인접한 도시가 아닙니다." };
  if (to.owner === state.playerFaction) return { ok: false, msg: "이미 내 영지입니다." };
  const general = state.generals[generalId];
  if (!general || general.province !== fromCityId) return { ok: false, msg: "출정할 장수를 선택하세요." };
  const { comp, total } = buildAttackForce(from, toCityId);
  if (total < 500) return { ok: false, msg: "병력이 부족합니다. (최소 500 필요)" };
  const defGeneral = generalsIn(toCityId).sort((a, b) => b.war - a.war)[0];
  return { ok: true, from, to, general, comp, attackTroops: total, defGeneral };
}

// executes the battle; if requestDuel is true and a defender general exists,
// resolves 일기토 (single combat) first, then a multi-round battlefield simulation
function actionAttack(fromCityId, toCityId, generalId, requestDuel) {
  const prep = prepareBattle(fromCityId, toCityId, generalId);
  if (!prep.ok) return prep;
  const { from, to, general, comp, attackTroops, defGeneral } = prep;

  let duelResult = null;
  if (requestDuel && defGeneral) {
    duelResult = resolveDuel(general, defGeneral);
    log(duelResult.log);
  }

  const result = simulateBattlefield(comp, general, to, duelResult);

  // remove the deployed force from the origin city (proportional to what was sent)
  for (const t of TROOP_TYPES) from.troops[t.id] -= comp[t.id];

  for (const r of result.rounds) {
    log(`  ${r.n}회전: 아군 -${fmt(r.atkLoss)}(잔여 ${fmt(r.atkTroops)}) / 적군 -${fmt(r.defLoss)}(잔여 ${fmt(r.defTroops)})`);
  }

  if (result.attackerWins) {
    to.troops = scaleComposition(comp, attackTroops > 0 ? result.survivors / attackTroops : 0);
    const oldOwner = to.owner;
    to.owner = state.playerFaction;
    general.province = toCityId;
    if (oldOwner !== "neutral") {
      const stillHasCity = citiesOf(oldOwner).length > 0;
      if (!stillHasCity) log(`${state.factions[oldOwner].name} 세력이 멸망했다!`);
    }
    log(`${from.name}에서 출정한 ${general.name}이(가) ${to.name}을(를) 점령했다! (아군 생존 ${fmt(result.survivors)})`);
  } else {
    const defTotal = cityTotalTroopsFromComposition(result.defComposition0);
    to.troops = scaleComposition(result.defComposition0, defTotal > 0 ? result.defenderSurvivors / defTotal : 0);
    log(`${from.name}에서 출정한 ${general.name}이(가) ${to.name} 공략에 실패했다. (아군 생존 ${fmt(result.survivors)})`);
  }
  save();
  return { ok: true, result, duelResult };
}

function scaleComposition(comp, ratio) {
  const out = emptyComposition();
  for (const k in comp) out[k] = Math.max(0, Math.round(comp[k] * ratio));
  return out;
}

function cityTotalTroopsFromComposition(comp) {
  return Object.values(comp).reduce((a, b) => a + b, 0);
}

function fmt(n) { return Math.round(n).toLocaleString("ko-KR"); }

function log(msg) {
  state.log.unshift(`[${state.year}년] ${msg}`);
  if (state.log.length > 60) state.log.length = 60;
}

// ---- Turn progression ----
function endTurn() {
  // simple AI for non-player, non-neutral factions
  for (const f of Object.values(state.factions)) {
    if (f.id === "neutral" || f.id === state.playerFaction) continue;
    if (!factionAlive(f.id)) continue;
    aiTakeTurn(f.id);
  }

  // passive growth for all owned cities (food upkeep)
  for (const c of Object.values(state.cities)) {
    if (c.owner === "neutral") continue;
    const total = cityTotalTroops(c);
    c.food -= Math.round(total / 200);
    if (c.food < 0) {
      const starveRatio = 0.9;
      for (const t of TROOP_TYPES) c.troops[t.id] = Math.round(c.troops[t.id] * starveRatio);
      const starved = total - cityTotalTroops(c);
      c.food = 0;
      if (isPlayer(c.owner)) log(`${c.name}: 식량이 부족해 병사 ${fmt(starved)}명이 굶주렸다.`);
    }
  }

  state.turn += 1;
  if (state.turn % 4 === 0) state.year += 1;

  checkStoryTriggers();
  checkGameOver();
  save();
}

// ---- Story mode ----
function checkStoryTriggers() {
  if (state.pendingStory) return; // don't stack events
  for (const ch of STORY_CHAPTERS) {
    if (state.storyShown[ch.id]) continue;
    if (state.turn >= ch.turn) {
      state.pendingStory = ch.id;
      return;
    }
  }
}

function applyStoryChoice(chapterId, choiceIndex) {
  const chapter = STORY_CHAPTERS.find(c => c.id === chapterId);
  if (!chapter) return;
  const choice = chapter.choices[choiceIndex];
  const mine = citiesOf(state.playerFaction);
  switch (choice.effect) {
    case "food":
      mine.forEach(c => { c.food += 150; });
      log(`[사건] ${chapter.title}: "${choice.label}" — 모든 영지의 식량이 늘었다.`);
      break;
    case "troops":
      mine.forEach(c => { c.troops.infantry += 300; c.food = Math.max(0, c.food - 60); });
      log(`[사건] ${chapter.title}: "${choice.label}" — 모든 영지의 병력이 늘고 식량이 줄었다.`);
      break;
    case "gold":
      mine.forEach(c => { c.gold += 150; });
      log(`[사건] ${chapter.title}: "${choice.label}" — 모든 영지의 금이 늘었다.`);
      break;
    case "pop":
      mine.forEach(c => { c.pop = Math.min(100, c.pop + 3); c.food = Math.max(0, c.food - 100); });
      log(`[사건] ${chapter.title}: "${choice.label}" — 인구가 늘고 식량이 줄었다.`);
      break;
    default:
      log(`[사건] ${chapter.title}: "${choice.label}"`);
  }
  state.storyShown[chapterId] = true;
  state.pendingStory = null;
  save();
}

function aiTakeTurn(factionId) {
  const myCities = citiesOf(factionId);
  if (myCities.length === 0) return;

  const devTarget = myCities.reduce((a, b) => (a.gold < b.gold ? a : b));
  devTarget.gold += 30;
  devTarget.food += 30;

  for (const c of myCities) {
    if (c.gold >= 150 && Math.random() < 0.5) {
      const type = pick(TROOP_TYPES.filter(t => !t.coastalOnly || COASTAL_CITIES.has(c.id)));
      const amount = Math.round(200 + 60 * 5);
      const cost = Math.round(amount * type.cost / 10);
      if (c.gold >= cost) {
        c.gold -= cost;
        c.troops[type.id] += amount;
      }
    }
  }

  for (const c of myCities) {
    if (cityTotalTroops(c) < 3000) continue;
    const target = c.neighbors
      .map(id => state.cities[id])
      .filter(n => n.owner !== factionId)
      .sort((a, b) => cityTotalTroops(a) - cityTotalTroops(b))[0];
    if (!target) continue;
    const myGeneral = generalsIn(c.id)[0];
    if (!myGeneral) continue;
    const { comp, total } = buildAttackForce(c, target.id);
    if (total < target.defense * 20 || total < cityTotalTroops(target) * 1.1) continue;
    const result = simulateBattlefield(comp, myGeneral, target, null);
    for (const t of TROOP_TYPES) c.troops[t.id] -= comp[t.id];
    if (result.attackerWins) {
      const oldOwner = target.owner;
      target.troops = scaleComposition(comp, total > 0 ? result.survivors / total : 0);
      target.owner = factionId;
      myGeneral.province = target.id;
      if (oldOwner === state.playerFaction) {
        log(`${state.factions[factionId].name}이(가) ${target.name}을(를) 침공하여 점령했다!`);
      } else if (oldOwner !== "neutral") {
        log(`${state.factions[factionId].name}이(가) ${target.name}을(를) 점령했다.`);
      }
    } else {
      const defTotal = cityTotalTroopsFromComposition(result.defComposition0);
      target.troops = scaleComposition(result.defComposition0, defTotal > 0 ? result.defenderSurvivors / defTotal : 0);
    }
    break; // one attack per faction per turn keeps pacing reasonable
  }
}

function checkGameOver() {
  const playerAlive = factionAlive(state.playerFaction);
  if (!playerAlive) {
    state.gameOver = "defeat";
    return;
  }
  const others = Object.keys(state.factions).filter(id => id !== "neutral" && id !== state.playerFaction);
  const anyOtherAlive = others.some(factionAlive);
  const totalCities = Object.keys(state.cities).length;
  const playerCities = citiesOf(state.playerFaction).length;
  if (!anyOtherAlive || playerCities === totalCities) {
    state.gameOver = "victory";
  }
}
