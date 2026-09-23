// ============================================================
// 군웅쟁패 - UI rendering & event wiring
// ============================================================

const el = (sel) => document.querySelector(sel);
const elAll = (sel) => Array.from(document.querySelectorAll(sel));

function init() {
  const existing = loadSave();
  if (existing && !existing.gameOver) {
    state = existing;
    showScreen("game");
    renderAll();
  } else {
    showScreen("title");
  }
  wireEvents();
}

function showScreen(name) {
  elAll(".screen").forEach(s => s.hidden = true);
  el(`#screen-${name}`).hidden = false;
}

function wireEvents() {
  el("#btn-new-game").addEventListener("click", () => showScreen("faction-pick"));
  elAll(".faction-card").forEach(btn => {
    btn.addEventListener("click", () => {
      newGame(btn.dataset.faction);
      showScreen("game");
      renderAll();
    });
  });
  el("#btn-continue").addEventListener("click", () => {
    if (loadSave()) { showScreen("game"); renderAll(); }
  });
  el("#btn-end-turn").addEventListener("click", () => {
    endTurn();
    renderAll();
    if (state.gameOver) showGameOverModal();
  });
  el("#btn-title").addEventListener("click", () => {
    if (confirm("타이틀로 돌아가시겠습니까? (진행 상황은 저장되어 있습니다)")) {
      showScreen("title");
    }
  });
  el("#btn-new-game-2").addEventListener("click", () => {
    if (confirm("새 게임을 시작하면 이전 저장이 사라집니다. 계속할까요?")) {
      clearSave();
      showScreen("faction-pick");
    }
  });
  el("#city-modal-close").addEventListener("click", closeCityModal);
  el("#battle-modal-close").addEventListener("click", () => { el("#battle-modal").hidden = true; });
  el("#roster-modal-close").addEventListener("click", () => { el("#roster-modal").hidden = true; });
  el("#recruit-modal-close").addEventListener("click", () => { el("#recruit-modal").hidden = true; });
  el("#create-general-modal-close").addEventListener("click", () => { el("#create-general-modal").hidden = true; });
  el("#item-modal-close").addEventListener("click", () => { el("#item-modal").hidden = true; });
  el("#btn-roster").addEventListener("click", () => { el("#roster-modal").hidden = false; renderRoster(); });
  el("#btn-recruit-talent").addEventListener("click", () => { el("#recruit-modal").hidden = false; renderRecruitTalent(); });
  elAll(".map-toggle-btn").forEach(btn => btn.addEventListener("click", () => setMapViewMode(btn.dataset.mode)));
}

function renderAll() {
  renderTopbar();
  renderMap();
  renderLog();
  if (!el("#city-modal").hidden && state.selectedCity) {
    renderCityModal(state.selectedCity);
  }
  if (state.pendingStory) showStoryModal(state.pendingStory);
}

function renderTopbar() {
  const f = state.factions[state.playerFaction];
  el("#hud-faction").textContent = `${f.name} (${f.lordName})`;
  el("#hud-year").textContent = `${state.year}년 · ${state.turn}턴`;
  const mine = citiesOf(state.playerFaction);
  const totalGold = mine.reduce((s, c) => s + c.gold, 0);
  const totalFood = mine.reduce((s, c) => s + c.food, 0);
  const totalTroops = mine.reduce((s, c) => s + cityTotalTroops(c), 0);
  const totalGenerals = generalsOf(state.playerFaction).length;
  el("#hud-stats").textContent = `영지 ${mine.length} · 장수 ${totalGenerals} · 금 ${fmt(totalGold)} · 식량 ${fmt(totalFood)} · 병력 ${fmt(totalTroops)}`;
}

// ---- Map: schematic SVG map (default) with a region-grouped list as an alternate view ----
let mapViewMode = "svg"; // "svg" | "list"

function renderMap() {
  el("#map-view-svg").hidden = mapViewMode !== "svg";
  el("#map-view-list").hidden = mapViewMode !== "list";
  if (mapViewMode === "svg") renderMapSvg(); else renderMapList();
}

function setMapViewMode(mode) {
  mapViewMode = mode;
  elAll(".map-toggle-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  renderMap();
}

// city coordinates: cities are arranged in a small ring around their region's
// anchor point; passes sit at the midpoint of the two cities they connect
function computeCityLayout() {
  const positions = {};
  const byRegion = {};
  Object.values(state.cities).filter(c => !c.isPass).forEach(c => {
    (byRegion[c.region] = byRegion[c.region] || []).push(c);
  });
  for (const regionId in byRegion) {
    const cities = byRegion[regionId];
    const anchor = REGION_ANCHORS[regionId] || { x: 320, y: 380 };
    const n = cities.length;
    cities.forEach((c, i) => {
      if (n === 1) { positions[c.id] = { x: anchor.x, y: anchor.y }; return; }
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      positions[c.id] = { x: anchor.x + Math.cos(angle) * 34, y: anchor.y + Math.sin(angle) * 34 };
    });
  }
  Object.values(state.cities).filter(c => c.isPass).forEach(c => {
    const pts = c.neighbors.map(id => positions[id]).filter(Boolean);
    if (pts.length >= 2) {
      positions[c.id] = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    } else {
      const anchor = REGION_ANCHORS[c.region] || { x: 320, y: 380 };
      positions[c.id] = { x: anchor.x, y: anchor.y };
    }
  });
  return positions;
}

function renderMapSvg() {
  const positions = computeCityLayout();
  const cities = Object.values(state.cities);

  let lines = "";
  const seen = new Set();
  cities.forEach(c => {
    c.neighbors.forEach(nid => {
      const key = [c.id, nid].sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);
      const p1 = positions[c.id], p2 = positions[nid];
      if (!p1 || !p2) return;
      lines += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" class="map-edge"/>`;
    });
  });

  const regionLabels = REGIONS.map(r => {
    const a = REGION_ANCHORS[r.id];
    if (!a) return "";
    return `<text x="${a.x}" y="${a.y - 44}" class="map-region-label" text-anchor="middle">${escapeHtml(r.name)}</text>`;
  }).join("");

  const nodes = cities.map(c => {
    const p = positions[c.id];
    if (!p) return "";
    const faction = state.factions[c.owner];
    const mine = c.owner === state.playerFaction;
    const r = c.isPass ? 7 : 11;
    return `
      <g class="map-city-node" data-city="${c.id}" transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})">
        <circle r="${r}" fill="${faction.color}" class="map-node-circle${mine ? " mine" : ""}${c.isPass ? " pass" : ""}"/>
        <text y="${r + 11}" class="map-city-label" text-anchor="middle">${c.isPass ? "⛰" : ""}${escapeHtml(c.name)}</text>
      </g>`;
  }).join("");

  el("#map-view-svg").innerHTML = `
    <svg viewBox="0 0 640 760" width="640" height="760" class="map-svg">
      <g>${lines}</g>
      <g>${regionLabels}</g>
      <g>${nodes}</g>
    </svg>`;

  elAll(".map-city-node").forEach(node => {
    node.addEventListener("click", () => openCityModal(node.dataset.city));
  });
}

function renderMapList() {
  el("#map-view-list").innerHTML = REGIONS.map(region => {
    const cities = Object.values(state.cities).filter(c => c.region === region.id && !c.isPass);
    const passes = Object.values(state.cities).filter(c => c.region === region.id && c.isPass);
    const chips = [...cities, ...passes].map(c => cityChipHtml(c)).join("");
    return `<div class="region-block"><div class="region-title">${region.name}</div><div class="city-chip-row">${chips}</div></div>`;
  }).join("");

  elAll(".city-chip").forEach(chip => {
    chip.addEventListener("click", () => openCityModal(chip.dataset.city));
  });
}

function cityChipHtml(c) {
  const faction = state.factions[c.owner];
  const mine = c.owner === state.playerFaction ? " mine" : "";
  const passClass = c.isPass ? " pass" : "";
  return `<button class="city-chip${mine}${passClass}" data-city="${c.id}" style="--fcolor:${faction.color}">
    <div class="cc-name">${c.isPass ? "⛰ " : ""}${c.name}</div>
    <div class="cc-owner">${faction.name}</div>
    <div class="cc-troops">${fmt(cityTotalTroops(c))}</div>
  </button>`;
}

function renderLog() {
  el("#log-list").innerHTML = state.log.slice(0, 20).map(l => `<li>${escapeHtml(l)}</li>`).join("");
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function specialtyName(id) { const s = SPECIALTIES.find(x => x.id === id); return s ? s.name : "-"; }
function itemName(id) { const i = ITEMS.find(x => x.id === id); return i ? i.name : null; }

function generalItemHtml(g) {
  const iname = itemName(g.item);
  return iname ? `<span class="item-chip">${iname}</span>` : "";
}

// ---- City modal ----
function openCityModal(cityId) {
  state.selectedCity = cityId;
  el("#city-modal").hidden = false;
  renderCityModal(cityId);
}

function closeCityModal() {
  el("#city-modal").hidden = true;
  state.selectedCity = null;
}

function renderCityModal(cityId) {
  const c = state.cities[cityId];
  const faction = state.factions[c.owner];
  const generals = generalsIn(cityId);
  const mine = c.owner === state.playerFaction;
  const troopBreakdown = TROOP_TYPES.map(t => `${t.name} ${fmt(c.troops[t.id] || 0)}`).join(" · ");

  let html = `
    <h2>${c.isPass ? "⛰ " : ""}${c.name} <span class="badge" style="background:${faction.color}">${faction.name}</span></h2>
    <div class="province-stats">
      <div>인구 ${c.pop}만</div>
      <div>금 ${fmt(c.gold)}</div>
      <div>식량 ${fmt(c.food)}</div>
      <div>방어 ${c.defense}</div>
    </div>
    <p class="hint-text">병력 구성: ${troopBreakdown} (총 ${fmt(cityTotalTroops(c))})</p>
    <h3>주둔 장수 (${generals.length}명)</h3>
    <ul class="general-list">
      ${generals.map(g => `
        <li class="general-item">
          <img class="general-portrait" src="assets/generals/${g.id}.png" alt="" onerror="this.style.visibility='hidden'">
          <div class="general-info">
            <div>${g.name} ${g.isLord ? "👑" : ""} ${generalItemHtml(g)}</div>
            <span class="gstat">통솔${g.leadership} 무력${g.war} 지력${g.intel} 정치${g.politics} 매력${g.charm} · 특기:${specialtyName(g.specialty)}</span>
            ${g.bio ? `<div class="gbio">${escapeHtml(g.bio)}</div>` : ""}
          </div>
          ${mine ? `<button class="equip-btn" data-general="${g.id}">장비</button>` : ""}
        </li>`).join("") || "<li>없음</li>"}
    </ul>
  `;

  if (mine) {
    html += `
      <h3>도시 행정</h3>
      <div class="action-row">
        <select id="sel-dev-general">${generals.map(g => `<option value="${g.id}">${g.name}</option>`).join("") || "<option value=''>관리</option>"}</select>
      </div>
      <div class="action-row">
        <button id="btn-dev-agri">농업</button>
        <button id="btn-dev-comm">상업</button>
        <button id="btn-dev-tech">기술</button>
        <button id="btn-dev-sec">치안</button>
      </div>
      <h3>모병</h3>
      <div class="action-row">
        <select id="sel-recruit-general">${generals.map(g => `<option value="${g.id}">${g.name}</option>`).join("")}</select>
        <select id="sel-troop-type">
          ${TROOP_TYPES.filter(t => !t.coastalOnly || COASTAL_CITIES.has(cityId)).map(t => `<option value="${t.id}">${t.name}</option>`).join("")}
        </select>
        <button id="btn-recruit">모병</button>
      </div>
      <h3>출정</h3>
      <div class="action-row">
        <select id="sel-atk-general">${generals.map(g => `<option value="${g.id}">${g.name}</option>`).join("")}</select>
        <select id="sel-atk-target">
          ${c.neighbors.filter(id => state.cities[id].owner !== state.playerFaction)
            .map(id => `<option value="${id}">${state.cities[id].name} (${state.factions[state.cities[id].owner].name})</option>`).join("") || "<option value=''>공격 가능한 인접 도시 없음</option>"}
        </select>
      </div>
      <label class="duel-check"><input type="checkbox" id="chk-duel"> 일기토 신청 (상대 장수와 1:1 승부, 이기면 전투 유리)</label>
      <div class="action-row">
        <button id="btn-attack">출정</button>
      </div>
      <div class="action-row">
        <button id="btn-open-create-general" class="ghost-btn small">장수 창조 (금 ${CREATE_GENERAL_COST})</button>
      </div>
    `;
  }

  el("#city-modal-body").innerHTML = html;

  elAll(".equip-btn").forEach(btn => btn.addEventListener("click", () => openItemModal(btn.dataset.general)));

  if (mine) {
    const devGeneral = () => el("#sel-dev-general").value;
    el("#btn-dev-agri").addEventListener("click", () => runDev(cityId, devGeneral(), "agriculture"));
    el("#btn-dev-comm").addEventListener("click", () => runDev(cityId, devGeneral(), "commerce"));
    el("#btn-dev-tech").addEventListener("click", () => runDev(cityId, devGeneral(), "technology"));
    el("#btn-dev-sec").addEventListener("click", () => runDev(cityId, devGeneral(), "security"));

    el("#btn-recruit").addEventListener("click", () => {
      const g = el("#sel-recruit-general").value;
      const type = el("#sel-troop-type").value;
      const r = actionRecruit(cityId, g, type);
      if (!r.ok) { alert(r.msg); return; }
      renderAll(); renderCityModal(cityId);
    });

    el("#btn-attack").addEventListener("click", () => {
      const g = el("#sel-atk-general").value;
      const target = el("#sel-atk-target").value;
      const wantDuel = el("#chk-duel").checked;
      if (!target) { alert("공격 대상이 없습니다."); return; }
      const r = actionAttack(cityId, target, g, wantDuel);
      if (!r.ok) { alert(r.msg); return; }
      closeCityModal();
      renderAll();
      showBattleReport(r);
    });

    el("#btn-open-create-general").addEventListener("click", () => openCreateGeneralModal(cityId));
  }
}

function runDev(cityId, generalId, kind) {
  const r = actionDevelop(cityId, generalId, kind);
  if (!r.ok) { alert(r.msg); return; }
  renderAll();
  renderCityModal(cityId);
}

// ---- Item equip modal ----
function openItemModal(generalId) {
  el("#item-modal").hidden = false;
  const g = state.generals[generalId];
  const owned = state.inventory.map(id => ITEMS.find(i => i.id === id)).filter(Boolean);
  let html = `<h2>${g.name} - 장비 관리</h2>`;
  html += `<p class="hint-text">현재 장착: ${g.item ? itemName(g.item) : "없음"}</p>`;
  if (g.item) html += `<button id="btn-unequip" class="ghost-btn small">해제</button>`;
  html += `<ul class="general-list">`;
  html += owned.map(it => `
    <li class="general-item">
      <div class="general-info">
        <div>${it.name} <span class="gloc">(${it.slot})</span></div>
        <span class="gstat">${Object.entries(it.bonus).map(([k, v]) => `${statLabel(k)}+${v}`).join(" ")}</span>
      </div>
      <button class="equip-pick-btn" data-item="${it.id}">장착</button>
    </li>`).join("") || "<li>보유 중인 아이템이 없습니다.</li>";
  html += `</ul>`;
  el("#item-modal-body").innerHTML = html;

  const unequipBtn = el("#btn-unequip");
  if (unequipBtn) unequipBtn.addEventListener("click", () => { actionUnequipItem(generalId); openItemModal(generalId); renderAll(); });
  elAll(".equip-pick-btn").forEach(btn => btn.addEventListener("click", () => {
    actionEquipItem(generalId, btn.dataset.item);
    openItemModal(generalId);
    renderAll();
  }));
}

function statLabel(k) {
  return { leadership: "통솔", war: "무력", intel: "지력", politics: "정치", charm: "매력" }[k] || k;
}

// ---- 장수 창조 (custom character creation) ----
function openCreateGeneralModal(cityId) {
  el("#create-general-modal").hidden = false;
  el("#create-general-modal-body").innerHTML = `
    <h2>장수 창조</h2>
    <p class="hint-text">능력치 총합 ${CREATE_GENERAL_BUDGET} 이내로 자유 배분하세요 (각 10~99). 비용: 금 ${CREATE_GENERAL_COST}</p>
    <input id="cg-name" type="text" maxlength="8" placeholder="장수 이름" class="nickname-input">
    ${["leadership","war","intel","politics","charm"].map(k => `
      <label class="stat-slider-label">${statLabel(k)} <span id="cg-${k}-val">50</span>
        <input id="cg-${k}" type="range" min="10" max="99" value="50" class="stat-slider">
      </label>`).join("")}
    <div id="cg-remaining" class="hint-text"></div>
    <select id="cg-specialty">${SPECIALTIES.map(s => `<option value="${s.id}">${s.name} - ${s.desc}</option>`).join("")}</select>
    <div class="action-row"><button id="cg-submit">창조하기</button></div>
  `;
  const keys = ["leadership","war","intel","politics","charm"];
  const updateRemaining = () => {
    const total = keys.reduce((s, k) => s + Number(el(`#cg-${k}`).value), 0);
    el("#cg-remaining").textContent = `배분 합계: ${total} / ${CREATE_GENERAL_BUDGET} ${total > CREATE_GENERAL_BUDGET ? "(초과!)" : ""}`;
  };
  keys.forEach(k => el(`#cg-${k}`).addEventListener("input", () => {
    el(`#cg-${k}-val`).textContent = el(`#cg-${k}`).value;
    updateRemaining();
  }));
  updateRemaining();

  el("#cg-submit").addEventListener("click", () => {
    const stats = {};
    keys.forEach(k => stats[k] = el(`#cg-${k}`).value);
    const r = actionCreateGeneral(cityId, el("#cg-name").value, stats, el("#cg-specialty").value);
    if (!r.ok) { alert(r.msg); return; }
    el("#create-general-modal").hidden = true;
    renderAll();
    renderCityModal(cityId);
  });
}

// ---- Story modal ----
function showStoryModal(chapterId) {
  const chapter = STORY_CHAPTERS.find(c => c.id === chapterId);
  if (!chapter) return;
  el("#story-modal").hidden = false;
  el("#story-title").textContent = chapter.title;
  el("#story-text").textContent = chapter.text;
  const choicesEl = el("#story-choices");
  choicesEl.innerHTML = chapter.choices.map((c, i) => `
    <button class="story-choice-btn" data-idx="${i}">
      <div class="sc-label">${c.label}</div>
      <div class="sc-desc">${c.desc}</div>
    </button>
  `).join("");
  elAll(".story-choice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      applyStoryChoice(chapter.id, Number(btn.dataset.idx));
      el("#story-modal").hidden = true;
      renderAll();
    });
  });
}

function renderRoster() {
  const mine = generalsOf(state.playerFaction).sort((a, b) => (b.isLord ? 1 : 0) - (a.isLord ? 1 : 0) || b.leadership - a.leadership);
  el("#roster-modal-body").innerHTML = `
    <p class="hint-text">보유 장수 ${mine.length}명</p>
    <ul class="general-list">
      ${mine.map(g => `
        <li class="general-item">
          <img class="general-portrait" src="assets/generals/${g.id}.png" alt="" onerror="this.style.visibility='hidden'">
          <div class="general-info">
            <div>${g.name} ${g.isLord ? "👑" : ""} ${generalItemHtml(g)} <span class="gloc">@ ${state.cities[g.province].name}</span></div>
            <span class="gstat">통솔${g.leadership} 무력${g.war} 지력${g.intel} 정치${g.politics} 매력${g.charm} · 특기:${specialtyName(g.specialty)}${g.woundedUntilTurn && state.turn < g.woundedUntilTurn ? " · 부상중" : ""}</span>
            ${g.bio ? `<div class="gbio">${escapeHtml(g.bio)}</div>` : ""}
          </div>
          <button class="equip-btn" data-general="${g.id}">장비</button>
        </li>`).join("")}
    </ul>
  `;
  elAll(".equip-btn").forEach(btn => btn.addEventListener("click", () => openItemModal(btn.dataset.general)));
}

function renderRecruitTalent() {
  const mineCities = citiesOf(state.playerFaction);
  const neutralGenerals = Object.values(state.generals).filter(g => g.faction === "neutral");
  const candidates = neutralGenerals.map(g => {
    const nearby = mineCities.find(c => c.id === g.province || c.neighbors.includes(g.province));
    return { g, nearby };
  }).filter(c => c.nearby);

  if (candidates.length === 0) {
    el("#recruit-modal-body").innerHTML = `<p class="hint-text">인접한 곳에 등용 가능한 인재가 없습니다. 영토를 넓혀보세요.</p>`;
    return;
  }

  el("#recruit-modal-body").innerHTML = `
    <ul class="general-list">
      ${candidates.slice(0, 60).map(({ g, nearby }) => `
        <li class="general-item">
          <img class="general-portrait" src="assets/generals/${g.id}.png" alt="" onerror="this.style.visibility='hidden'">
          <div class="general-info">
            <div>${g.name} <span class="gloc">@ ${state.cities[g.province].name}</span></div>
            <span class="gstat">통솔${g.leadership} 무력${g.war} 지력${g.intel} 정치${g.politics} 매력${g.charm} · 특기:${specialtyName(g.specialty)}</span>
            ${g.bio ? `<div class="gbio">${escapeHtml(g.bio)}</div>` : ""}
          </div>
          <button class="recruit-btn" data-general="${g.id}" data-from="${nearby.id}">등용 (금300)</button>
        </li>`).join("")}
    </ul>
    ${candidates.length > 60 ? `<p class="hint-text">그 외 ${candidates.length - 60}명 더 있습니다.</p>` : ""}
  `;
  elAll(".recruit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const r = actionRecruitGeneral(btn.dataset.general, btn.dataset.from);
      if (!r.ok) { alert(r.msg); return; }
      alert(r.success ? "등용에 성공했습니다!" : "등용에 실패했습니다.");
      renderAll();
      renderRecruitTalent();
    });
  });
}

function showBattleReport(r) {
  const modal = el("#battle-modal");
  modal.hidden = false;
  let html = "";
  if (r.duelResult) {
    html += `<div class="duel-report">⚔️ ${escapeHtml(r.duelResult.log)}</div>`;
  }
  html += `<h3>전장 경과</h3><ul class="round-list">`;
  html += r.result.rounds.map(rd => `
    <li><b>${rd.n}회전</b> 아군 -${fmt(rd.atkLoss)} (잔여 ${fmt(rd.atkTroops)}) · 적군 -${fmt(rd.defLoss)} (잔여 ${fmt(rd.defTroops)})</li>
  `).join("");
  html += `</ul>`;
  html += `<div class="battle-result ${r.result.attackerWins ? "win" : "lose"}">${r.result.attackerWins ? "승리! 영지를 점령했습니다." : "패배... 병력을 잃고 물러났습니다."}</div>`;
  el("#battle-modal-body").innerHTML = html;
}

function showGameOverModal() {
  el("#gameover-modal").hidden = false;
  el("#gameover-title").textContent = state.gameOver === "victory" ? "천하통일!" : "세력 멸망...";
  el("#gameover-desc").textContent = state.gameOver === "victory"
    ? `${state.year}년, 마침내 천하를 평정하였다!`
    : `${state.year}년, 그대의 세력은 역사 속으로 사라졌다.`;
}

document.addEventListener("DOMContentLoaded", init);
