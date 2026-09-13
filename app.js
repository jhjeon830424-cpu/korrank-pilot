/* =========================================================
   국어랭크 (KorRank) — 국어 읽기 파일럿
   - 콘텐츠: kor-passages.js(지문+어휘+독해문제), kor-grammar.js(맞춤법/문법, 속담·사자성어)
   - 퀴즈: 그 데이터에서 매번 다른 조합으로 자동 생성 (LLM 미사용)
   - 튜터링: 문제 풀기 전에 지문 읽기 + 오늘의 맞춤법/문법 + 오늘의 속담을 먼저 보여준다
   - 등급: 매쓰랭크/잉글리시랭크와 동일한 RP/티어 시스템 (시리즈 통일)
   ========================================================= */

/* ---------- 유틸 ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choice(arr) { return arr[randInt(0, arr.length - 1)]; }
function shuffleArr(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function daysBetween(a, b) {
  const d1 = new Date(a), d2 = new Date(b);
  return Math.round((d2 - d1) / 86400000);
}

/* ---------- 티어 시스템 (매쓰랭크/잉글리시랭크와 동일) ---------- */
const START_RATING = 120;
const TIER_DEFS = [
  { name: '별사탕', category: 'candy', count: 1, hex: '#ff7aa8' },
  { name: '별사탕', category: 'candy', count: 2, hex: '#ff7aa8' },
  { name: '별사탕', category: 'candy', count: 3, hex: '#ff7aa8' },
  { name: '별사탕', category: 'candy', count: 4, hex: '#ff7aa8' },
  { name: '반짝별', category: 'twinkle', count: 1, hex: '#ffd166' },
  { name: '반짝별', category: 'twinkle', count: 2, hex: '#ffd166' },
  { name: '반짝별', category: 'twinkle', count: 3, hex: '#ffd166' },
  { name: '반짝별', category: 'twinkle', count: 4, hex: '#ffd166' },
  { name: '빛나는별', category: 'shining', count: 1, hex: '#ffb703' },
  { name: '빛나는별', category: 'shining', count: 2, hex: '#ffb703' },
  { name: '빛나는별', category: 'shining', count: 3, hex: '#ffb703' },
  { name: '빛나는별', category: 'shining', count: 4, hex: '#ffb703' },
  { name: '별똥별', category: 'shooting', count: 1, hex: '#4cc9f0' },
  { name: '별똥별', category: 'shooting', count: 2, hex: '#4cc9f0' },
  { name: '별똥별', category: 'shooting', count: 3, hex: '#4cc9f0' },
  { name: '별똥별', category: 'shooting', count: 4, hex: '#4cc9f0' },
  { name: '은하수', category: 'galaxy', count: 1, hex: '#9d4edd' },
  { name: '은하수', category: 'galaxy', count: 2, hex: '#9d4edd' },
  { name: '은하수', category: 'galaxy', count: 3, hex: '#9d4edd' },
  { name: '은하수', category: 'galaxy', count: 4, hex: '#9d4edd' },
  { name: '슈퍼노바', category: 'supernova', count: 1, hex: '#f72585' },
];
const CATEGORY_IMG = {
  candy: 'assets/badge_candy.jpg',
  twinkle: 'assets/badge_twinkle.jpg',
  shining: 'assets/badge_shining.jpg',
  shooting: 'assets/badge_shooting.jpg',
  galaxy: 'assets/badge_galaxy.jpg',
  supernova: 'assets/badge_supernova.jpg',
};
const TIER_STEP = 100;
function tierForRating(rp) {
  const idx = Math.min(Math.floor(rp / TIER_STEP), TIER_DEFS.length - 1);
  const t = TIER_DEFS[Math.max(idx, 0)];
  const floor = idx * TIER_STEP;
  const ceil = idx === TIER_DEFS.length - 1 ? Infinity : floor + TIER_STEP;
  return { ...t, idx, floor, ceil, label: t.name, img: CATEGORY_IMG[t.category] };
}
function pipsHtml(count, hex) {
  let s = '';
  for (let i = 0; i < count; i++) s += `<span class="pip" style="background:${hex}"></span>`;
  return s;
}

/* ---------- 퀴즈 생성 엔진 ---------- */
const KOR_GRADE_TYPING = { 1: false, 2: false, 3: 'partial', 4: 'partial', 5: true, 6: true };
function canType(grade) {
  const mode = KOR_GRADE_TYPING[grade];
  if (mode === true) return true;
  if (mode === 'partial') return Math.random() < 0.4;
  return false;
}
function pickDistractors(pool, excludeValue, n) {
  // 여러 지문/어휘가 같은 값을 가질 수 있으므로, 중복 제거 후 뽑는다
  // (그렇지 않으면 같은 보기가 두 번 나올 수 있음).
  const unique = [...new Set(pool)].filter(v => v !== excludeValue);
  return shuffleArr(unique).slice(0, n);
}
function allCompForGrade(grade) {
  const units = KOR_UNITS[grade] || [];
  const list = [];
  units.forEach(u => u.comp.forEach(c => list.push(c)));
  return list;
}
function allVocabForGrade(grade) {
  const units = KOR_UNITS[grade] || [];
  const list = [];
  units.forEach(u => u.vocab.forEach(v => list.push(v)));
  return list;
}

function genCompQuiz(grade, item) {
  const pool = allCompForGrade(grade).map(c => c.a).filter(a => a !== item.a);
  const options = shuffleArr([item.a, ...pickDistractors(pool, item.a, 3)]);
  return {
    qType: 'comp', question: item.q, answerType: 'mc', options,
    check: (input) => input === item.a,
    reviewItem: { kind: 'comp', key: item.q, data: item },
    difficulty: 150 + (grade - 1) * 50,
  };
}
function genVocabMeaningQuiz(grade, v) {
  const pool = allVocabForGrade(grade).filter(x => x.word !== v.word).map(x => x.meaning);
  const options = shuffleArr([v.meaning, ...pickDistractors(pool, v.meaning, 3)]);
  return {
    qType: 'vocab_meaning', question: `"${v.word}"의 뜻은 무엇인가요?`, answerType: 'mc', options,
    check: (input) => input === v.meaning,
    reviewItem: { kind: 'vocab', key: v.word, data: v },
    difficulty: 150 + (grade - 1) * 50,
  };
}
function genVocabReverseQuiz(grade, v) {
  if (canType(grade)) {
    return {
      qType: 'vocab_reverse_type', question: `다음 뜻에 해당하는 낱말을 입력하세요.\n"${v.meaning}"`, answerType: 'text',
      check: (input) => input.trim() === v.word,
      reviewItem: { kind: 'vocab', key: v.word, data: v },
      difficulty: 350 + (grade - 1) * 50,
    };
  }
  const pool = allVocabForGrade(grade).filter(x => x.word !== v.word).map(x => x.word);
  const options = shuffleArr([v.word, ...pickDistractors(pool, v.word, 3)]);
  return {
    qType: 'vocab_reverse', question: `다음 뜻에 해당하는 낱말을 고르세요.\n"${v.meaning}"`, answerType: 'mc', options,
    check: (input) => input === v.word,
    reviewItem: { kind: 'vocab', key: v.word, data: v },
    difficulty: 200 + (grade - 1) * 50,
  };
}
function buildVocabQuiz(grade, v) {
  return Math.random() < 0.5 ? genVocabMeaningQuiz(grade, v) : genVocabReverseQuiz(grade, v);
}
function genGrammarQuiz(grade, g) {
  if (canType(grade)) {
    return {
      qType: 'grammar_type',
      question: `빈칸에 알맞은 말을 입력하세요.\n"${g.blank}"\n(힌트: ${g.tip})`,
      answerType: 'text',
      check: (input) => input.trim() === g.answer,
      reviewItem: { kind: 'grammar', key: g.id, data: g },
      difficulty: 400 + (grade - 1) * 50,
    };
  }
  const options = shuffleArr([g.answer, ...g.distractors.slice(0, 3)]);
  return {
    qType: 'grammar_select',
    question: `빈칸에 알맞은 말을 고르세요.\n"${g.blank}"`,
    answerType: 'mc', options,
    check: (input) => input === g.answer,
    reviewItem: { kind: 'grammar', key: g.id, data: g },
    difficulty: 250 + (grade - 1) * 50,
  };
}
function genIdiomMeaningQuiz(grade, idiom) {
  const pool = (IDIOMS[grade] || []).filter(x => x.id !== idiom.id).map(x => x.meaning);
  const options = shuffleArr([idiom.meaning, ...pickDistractors(pool, idiom.meaning, 3)]);
  return {
    qType: 'idiom_meaning', question: `"${idiom.text}"의 뜻은 무엇인가요?`, answerType: 'mc', options,
    check: (input) => input === idiom.meaning,
    reviewItem: { kind: 'idiom', key: idiom.id, data: idiom },
    difficulty: 200 + (grade - 1) * 50,
  };
}
function genIdiomReverseQuiz(grade, idiom) {
  const pool = (IDIOMS[grade] || []).filter(x => x.id !== idiom.id).map(x => x.text);
  const options = shuffleArr([idiom.text, ...pickDistractors(pool, idiom.text, 3)]);
  return {
    qType: 'idiom_reverse', question: `다음 뜻을 나타내는 표현을 고르세요.\n"${idiom.meaning}"`, answerType: 'mc', options,
    check: (input) => input === idiom.text,
    reviewItem: { kind: 'idiom', key: idiom.id, data: idiom },
    difficulty: 250 + (grade - 1) * 50,
  };
}
function buildIdiomQuiz(grade, idiom) {
  return Math.random() < 0.5 ? genIdiomMeaningQuiz(grade, idiom) : genIdiomReverseQuiz(grade, idiom);
}
function buildQuizFromReviewItem(grade, entry) {
  if (entry.kind === 'vocab') return buildVocabQuiz(grade, entry.data);
  if (entry.kind === 'grammar') return genGrammarQuiz(grade, entry.data);
  if (entry.kind === 'idiom') return buildIdiomQuiz(grade, entry.data);
  if (entry.kind === 'comp') return genCompQuiz(grade, entry.data);
  return genVocabMeaningQuiz(grade, choice(allVocabForGrade(grade)));
}

function generateKorSession(grade, profile) {
  const pool = KOR_UNITS[grade] || [];
  const unitIdx = (profile.unitIndex || 0) % pool.length;
  const todayUnit = pool[unitIdx];

  const gPool = GRAMMAR_POINTS[grade] || [];
  const gIdx = (profile.grammarIndex || 0) % gPool.length;
  const todayGrammar = gPool[gIdx];

  const iPool = IDIOMS[grade] || [];
  const iIdx = (profile.idiomIndex || 0) % iPool.length;
  const todayIdiom = iPool[iIdx];

  const session = [];
  todayUnit.comp.forEach(c => session.push(genCompQuiz(grade, c)));
  const todayVocab = shuffleArr(todayUnit.vocab);
  for (let i = 0; i < Math.min(2, todayVocab.length); i++) session.push(buildVocabQuiz(grade, todayVocab[i]));
  if (todayGrammar) session.push(genGrammarQuiz(grade, todayGrammar));
  if (todayIdiom) session.push(buildIdiomQuiz(grade, todayIdiom));

  // 복습: 예전에 배운 어휘/문법/속담/독해를 다시 섞어서 낸다 (오답 확인 후 이해가 핵심)
  const reviewBank = (profile.reviewBank || []).filter(e => {
    if (e.kind === 'vocab') return !todayUnit.vocab.some(v => v.word === e.key);
    if (e.kind === 'grammar') return !(todayGrammar && todayGrammar.id === e.key);
    if (e.kind === 'idiom') return !(todayIdiom && todayIdiom.id === e.key);
    if (e.kind === 'comp') return !todayUnit.comp.some(c => c.q === e.key);
    return true;
  });
  while (session.length < 10) {
    if (reviewBank.length > 0) session.push(buildQuizFromReviewItem(grade, choice(reviewBank)));
    else session.push(buildVocabQuiz(grade, choice(todayUnit.vocab)));
  }

  return { session: shuffleArr(session.slice(0, 10)), todayUnit, todayGrammar, todayIdiom, unitIdx };
}

/* ---------- 프로필 저장 (매쓰랭크/잉글리시랭크와 동일한 로컬 다중 프로필 구조) ---------- */
const PROFILES_KEY = 'korrank_profiles_v1';
const ACTIVE_ID_KEY = 'korrank_active_profile_id_v1';
let storageAvailable = true;

function loadAllProfiles() {
  try { const raw = localStorage.getItem(PROFILES_KEY); return raw ? JSON.parse(raw) : []; }
  catch (e) { storageAvailable = false; return []; }
}
function saveAllProfiles(list) {
  if (!storageAvailable) return;
  try { localStorage.setItem(PROFILES_KEY, JSON.stringify(list)); }
  catch (e) { storageAvailable = false; }
}
function getActiveProfileId() { try { return localStorage.getItem(ACTIVE_ID_KEY); } catch (e) { return null; } }
function setActiveProfileId(id) { if (!storageAvailable) return; try { localStorage.setItem(ACTIVE_ID_KEY, id); } catch (e) {} }
function deleteProfile(id) {
  saveAllProfiles(loadAllProfiles().filter(p => p.id !== id));
  if (getActiveProfileId() === id) { try { localStorage.removeItem(ACTIVE_ID_KEY); } catch (e) {} }
}
function saveProfile(p) {
  if (!storageAvailable) return;
  const list = loadAllProfiles();
  const idx = list.findIndex(x => x.id === p.id);
  if (idx >= 0) list[idx] = p; else list.push(p);
  saveAllProfiles(list);
  setActiveProfileId(p.id);
}
function resolveInitialProfile() {
  const list = loadAllProfiles();
  if (list.length === 0) return { profile: null, mode: 'new' };
  const active = list.find(p => p.id === getActiveProfileId());
  if (active) return { profile: active, mode: 'home' };
  if (list.length === 1) { setActiveProfileId(list[0].id); return { profile: list[0], mode: 'home' }; }
  return { profile: null, mode: 'picker' };
}

const GRADE_ACCENT = { 1: '#ffb86b', 2: '#ff6b6b', 3: '#5ee7c0', 4: '#3ddc97', 5: '#6c8cff', 6: '#ff7ad9' };
function applyGradeAccent(grade) {
  document.documentElement.style.setProperty('--grade-accent', GRADE_ACCENT[grade] || '#6c8cff');
}
function newProfile(grade, nickname, id) {
  return {
    id: id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
    nickname, grade,
    rating: START_RATING,
    streak: 0,
    lastCompletedDate: null,
    dailySessionDate: null,
    dailySessionCount: 0,
    unitIndex: 0,
    grammarIndex: 0,
    idiomIndex: 0,
    reviewBank: [],
    itemStats: {},
    totalSessions: 0,
  };
}

const DAILY_SESSION_LIMIT = 5; // 하루 최대 5세션(지문 5개)까지 미리 읽을 수 있음
function sessionsCompletedToday() {
  if (!profile || profile.dailySessionDate !== todayStr()) return 0;
  return profile.dailySessionCount || 0;
}

let profile = null;
let onboardingMode = 'new';
let currentSession = null;
let currentIndex = 0;
let sessionCorrect = 0;
let ratingBefore = 0;
let todayUnit = null;
let todayGrammar = null;
let todayIdiom = null;

/* ---------- 화면 전환 ---------- */
function showScreen(id) {
  $$('.screen').forEach(s => s.setAttribute('hidden', ''));
  $(`#${id}`).removeAttribute('hidden');
}
function isDoneToday() { return sessionsCompletedToday() >= DAILY_SESSION_LIMIT; }

/* ---------- 홈 화면 ---------- */
function renderHome() {
  const t = tierForRating(profile.rating);
  const badgeImg = $('#home-badge');
  badgeImg.src = t.img;
  badgeImg.alt = t.label;
  $('#home-nickname').textContent = profile.nickname ? `${profile.nickname}님` : '';
  $('#home-tier-name').textContent = t.label;
  $('#home-rating').textContent = profile.rating;
  $('#home-streak').textContent = profile.streak;
  document.documentElement.style.setProperty('--tier-color', t.hex);
  applyGradeAccent(profile.grade);

  const span = t.ceil === Infinity ? 1 : (t.ceil - t.floor);
  const progressPct = t.ceil === Infinity ? 100 : Math.round(((profile.rating - t.floor) / span) * 100);
  $('#home-progress').style.width = `${progressPct}%`;
  $('#home-progress-label').textContent = t.ceil === Infinity
    ? '최고 등급 슈퍼노바 달성!'
    : `다음 등급까지 ${t.ceil - profile.rating} RP`;
  $('#home-pips').innerHTML = pipsHtml(t.count, t.hex);

  const unitsRead = profile.unitIndex || 0;
  $('#home-stories-read').textContent = `지금까지 읽은 글: ${unitsRead}개 · 복습 목록: ${(profile.reviewBank || []).length}개`;

  const doneCount = sessionsCompletedToday();
  const done = doneCount >= DAILY_SESSION_LIMIT;
  $('#btn-start-reading').toggleAttribute('hidden', done);
  $('#home-done-msg').toggleAttribute('hidden', !done);
  $('#home-session-count').textContent = done ? '' : `오늘 ${doneCount}/${DAILY_SESSION_LIMIT}회 완료 (하루 최대 ${DAILY_SESSION_LIMIT}회까지 미리 읽을 수 있어요)`;
  $('#btn-change-grade').removeAttribute('hidden');
  $('#btn-switch-profile').removeAttribute('hidden');
  showScreen('screen-home');
}

/* ---------- 프로필 선택 화면 ---------- */
function renderProfilePicker() {
  const list = loadAllProfiles();
  const wrap = $('#profile-list');
  wrap.innerHTML = '';
  list.forEach(p => {
    const t = tierForRating(p.rating);
    const row = document.createElement('div');
    row.className = 'profile-card';
    row.innerHTML = `
      <img src="${t.img}" alt="">
      <div class="profile-card-info">
        <div class="profile-card-name">${p.nickname || '이름없음'}</div>
        <div class="profile-card-sub">초${p.grade} · ${t.label} · ${p.rating} RP</div>
      </div>
      <button class="profile-card-del" aria-label="삭제">✕</button>
    `;
    row.addEventListener('click', () => { profile = p; setActiveProfileId(p.id); renderHome(); });
    row.querySelector('.profile-card-del').addEventListener('click', (e) => {
      e.stopPropagation();
      if (!confirm(`"${p.nickname}" 프로필을 삭제할까요? 되돌릴 수 없어요.`)) return;
      deleteProfile(p.id);
      renderProfilePicker();
    });
    wrap.appendChild(row);
  });
  showScreen('screen-profile-picker');
}

/* ---------- 백업/이어하기 ---------- */
function encodeProfileCode(p) { return 'KR1:' + btoa(unescape(encodeURIComponent(JSON.stringify(p)))); }
function decodeProfileCode(code) {
  const trimmed = code.trim();
  if (!trimmed.startsWith('KR1:')) throw new Error('형식이 올바르지 않아요');
  const obj = JSON.parse(decodeURIComponent(escape(atob(trimmed.slice(4)))));
  if (!obj || typeof obj.rating !== 'number' || !obj.grade || !obj.id) throw new Error('올바른 백업 코드가 아니에요');
  return obj;
}
function renderBackupScreen() {
  const exportWrap = $('#backup-export-code').closest('.backup-section');
  if (profile) { exportWrap.removeAttribute('hidden'); $('#backup-export-code').value = encodeProfileCode(profile); }
  else exportWrap.setAttribute('hidden', '');
  $('#backup-import-code').value = '';
  showScreen('screen-backup');
}
function importProfileFromCode(code) {
  let obj;
  try { obj = decodeProfileCode(code); }
  catch (e) { alert('코드를 읽을 수 없어요. 코드를 정확히 복사했는지 확인해주세요.'); return; }
  const list = loadAllProfiles();
  const existing = list.find(p => p.id === obj.id);
  if (existing && !confirm(`"${obj.nickname}" 프로필이 이미 있어요. 가져온 기록으로 덮어쓸까요?`)) return;
  profile = obj;
  saveProfile(profile);
  setActiveProfileId(profile.id);
  alert(`"${obj.nickname}" 프로필을 가져왔어요!`);
  renderHome();
}

/* ---------- 등급표 화면 ---------- */
function renderTierTable() {
  const wrap = $('#tier-table');
  wrap.innerHTML = '';
  const currentIdx = tierForRating(profile.rating).idx;
  TIER_DEFS.slice().reverse().forEach((t) => {
    const idx = TIER_DEFS.indexOf(t);
    const floor = idx * TIER_STEP;
    const ceil = idx === TIER_DEFS.length - 1 ? null : floor + TIER_STEP;
    const img = CATEGORY_IMG[t.category];
    const row = document.createElement('div');
    row.className = 'tier-row' + (idx === currentIdx ? ' current' : '');
    row.innerHTML = `
      <div class="tr-badge"><img src="${img}" alt="${t.name}"><div class="pip-row">${pipsHtml(t.count, t.hex)}</div></div>
      <div class="tr-name">${t.name}</div>
      <div class="tr-range">${floor} ~ ${ceil ? ceil - 1 : '∞'} RP</div>
    `;
    wrap.appendChild(row);
  });
  showScreen('screen-tiers');
}

/* ---------- 복습 목록 화면 ---------- */
const KIND_LABEL = { vocab: '어휘', grammar: '맞춤법·문법', idiom: '속담·사자성어', comp: '독해' };
function renderReviewList() {
  const wrap = $('#vocab-list');
  wrap.innerHTML = '';
  const bank = profile.reviewBank || [];
  const stats = profile.itemStats || {};
  if (bank.length === 0) {
    wrap.innerHTML = '<div class="weak-empty">아직 배운 내용이 없어요. 오늘의 글을 읽어보세요!</div>';
  } else {
    const rows = bank.map(e => {
      const statKey = `${e.kind}:${e.key}`;
      const st = stats[statKey] || { correct: 0, total: 0 };
      const label = e.kind === 'vocab' ? `${e.data.word} — ${e.data.meaning}`
        : e.kind === 'grammar' ? `${e.data.blank} → ${e.data.answer}`
        : e.kind === 'idiom' ? `${e.data.text} — ${e.data.meaning}`
        : `${e.data.q}`;
      return { label, tag: KIND_LABEL[e.kind] || e.kind, ...st, acc: st.total ? st.correct / st.total : null };
    }).sort((a, b) => (a.acc === null ? -1 : a.acc) - (b.acc === null ? -1 : b.acc));
    rows.forEach(r => {
      const pct = r.acc === null ? null : Math.round(r.acc * 100);
      const cls = pct === null ? '' : pct < 50 ? 'low' : pct < 80 ? 'mid' : 'high';
      const row = document.createElement('div');
      row.className = 'weak-row';
      row.innerHTML = `
        <div class="weak-row-top"><span><span class="review-tag">${r.tag}</span> ${r.label}</span><span>${pct === null ? '아직 안 풀어봄' : `${pct}% (${r.correct}/${r.total})`}</span></div>
        <div class="weak-bar-bg"><div class="weak-bar-fill ${cls}" style="width:${pct || 0}%"></div></div>
      `;
      wrap.appendChild(row);
    });
  }
  showScreen('screen-vocab');
}

/* ---------- 튜터링(읽기) 화면: 지문 읽기 + 오늘의 어휘/문법/속담 ---------- */
function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) { /* 음성 지원 안 되면 그냥 무시 */ }
}
function renderReading() {
  const pool = KOR_UNITS[profile.grade] || [];
  const unitIdx = (profile.unitIndex || 0) % pool.length;
  todayUnit = pool[unitIdx];

  const gPool = GRAMMAR_POINTS[profile.grade] || [];
  todayGrammar = gPool[(profile.grammarIndex || 0) % gPool.length];
  const iPool = IDIOMS[profile.grade] || [];
  todayIdiom = iPool[(profile.idiomIndex || 0) % iPool.length];

  $('#reading-title').textContent = todayUnit.title;
  const wrap = $('#reading-sentences');
  wrap.innerHTML = '';
  todayUnit.sentences.forEach((s) => {
    const row = document.createElement('div');
    row.className = 'reading-sentence';
    row.innerHTML = `<div class="reading-text">${s}</div>`;
    const btn = document.createElement('button');
    btn.className = 'reading-speak-btn';
    btn.textContent = '🔊 듣기';
    btn.addEventListener('click', () => speak(s));
    row.appendChild(btn);
    wrap.appendChild(row);
  });

  const vocabWrap = $('#reading-vocab');
  vocabWrap.innerHTML = '';
  todayUnit.vocab.forEach(v => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'vocab-chip vocab-chip-guess';
    chip.innerHTML = `<b>${v.word}</b><span class="vocab-guess-label">뜻이 뭘까요? 눌러서 확인</span>`;
    chip.addEventListener('click', () => {
      chip.innerHTML = `<b>${v.word}</b><span>${v.meaning}</span>`;
      chip.classList.add('revealed');
      chip.disabled = true;
    }, { once: true });
    vocabWrap.appendChild(chip);
  });

  const grammarWrap = $('#reading-grammar');
  if (todayGrammar) {
    grammarWrap.innerHTML = `
      <h3 class="lesson-heading">📝 오늘의 맞춤법·문법</h3>
      <div class="lesson-card"><p>${todayGrammar.tip}</p><p class="lesson-example">${todayGrammar.example}</p></div>
    `;
  } else grammarWrap.innerHTML = '';

  const idiomWrap = $('#reading-idiom');
  if (todayIdiom) {
    idiomWrap.innerHTML = `
      <h3 class="lesson-heading">💬 오늘의 속담·사자성어</h3>
      <div class="lesson-card"><p class="lesson-idiom-text">${todayIdiom.text}</p><p class="lesson-example">${todayIdiom.meaning}</p></div>
    `;
  } else idiomWrap.innerHTML = '';

  showScreen('screen-reading');
}

/* ---------- 퀴즈 진행 ---------- */
function startQuizFromReading() {
  const { session } = generateKorSession(profile.grade, profile);
  currentSession = session;
  currentIndex = 0;
  sessionCorrect = 0;
  ratingBefore = profile.rating;
  showScreen('screen-quiz');
  renderQuestion();
}
function renderQuestion() {
  const p = currentSession[currentIndex];
  $('#quiz-index').textContent = currentIndex + 1;
  $('#quiz-progress-fill').style.width = `${(currentIndex / 10) * 100}%`;
  $('#quiz-question').textContent = p.question;
  $('#quiz-feedback').setAttribute('hidden', '');
  $('#quiz-explain').setAttribute('hidden', '');

  const inputWrap = $('#quiz-input-wrap');
  const mcWrap = $('#quiz-mc-wrap');
  if (p.answerType === 'mc') {
    inputWrap.setAttribute('hidden', '');
    mcWrap.removeAttribute('hidden');
    mcWrap.innerHTML = '';
    p.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'mc-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => submitAnswer(opt));
      mcWrap.appendChild(btn);
    });
  } else {
    mcWrap.setAttribute('hidden', '');
    inputWrap.removeAttribute('hidden');
    $('#quiz-input').value = '';
    $('#quiz-input').removeAttribute('disabled');
    setTimeout(() => $('#quiz-input').focus(), 50);
  }
  $('#btn-next-question').setAttribute('hidden', '');
}
function recordItemStat(reviewItem, correct) {
  if (!reviewItem) return;
  const key = `${reviewItem.kind}:${reviewItem.key}`;
  if (!profile.itemStats) profile.itemStats = {};
  if (!profile.itemStats[key]) profile.itemStats[key] = { correct: 0, total: 0 };
  profile.itemStats[key].total++;
  if (correct) profile.itemStats[key].correct++;
}
function explainFor(p) {
  const item = p.reviewItem;
  if (!item) return null;
  const { kind, data } = item;
  if (kind === 'vocab') return { tip: `"${data.word}"의 뜻: ${data.meaning}`, example: '' };
  if (kind === 'grammar') return { tip: data.tip, example: data.example };
  if (kind === 'idiom') return { tip: `"${data.text}"의 뜻: ${data.meaning}`, example: '' };
  if (kind === 'comp') return { tip: `정답: ${data.a}`, example: '지문을 다시 천천히 읽어보면 답을 찾을 수 있어요.' };
  return null;
}
function submitAnswer(mcValue) {
  const p = currentSession[currentIndex];
  const input = p.answerType === 'mc' ? mcValue : $('#quiz-input').value;
  if (p.answerType === 'text' && input.trim() === '') return;
  const correct = p.check(input);
  if (correct) sessionCorrect++;
  recordItemStat(p.reviewItem, correct);

  const expected = 1 / (1 + Math.pow(10, (p.difficulty - profile.rating) / 400));
  const K = 40;
  const delta = Math.round(K * ((correct ? 1 : 0) - expected));
  profile.rating = Math.max(0, profile.rating + delta);

  $$('.mc-btn').forEach(b => b.setAttribute('disabled', ''));
  $('#quiz-input').setAttribute('disabled', '');
  $('#quiz-feedback').removeAttribute('hidden');
  const ft = $('#quiz-feedback-text');
  const fbMascot = $('#quiz-feedback-mascot');
  fbMascot.className = 'feedback-mascot';
  void fbMascot.offsetWidth;
  if (correct) {
    ft.textContent = `정답이에요! (${delta >= 0 ? '+' : ''}${delta} RP)`;
    ft.className = 'feedback-correct';
    fbMascot.src = 'assets/char_correct.jpg';
    fbMascot.classList.add('fb-correct');
  } else {
    const answerText = p.answerType === 'mc'
      ? (p.options.find(o => p.check(o)) || '')
      : '';
    ft.textContent = answerText ? `아쉬워요. 정답: ${answerText} (${delta >= 0 ? '+' : ''}${delta} RP)` : `아쉬워요. (${delta >= 0 ? '+' : ''}${delta} RP)`;
    ft.className = 'feedback-wrong';
    fbMascot.src = 'assets/char_wrong.jpg';
    fbMascot.classList.add('fb-wrong');
  }

  const explain = $('#quiz-explain');
  if (!correct) {
    const concept = explainFor(p);
    if (concept) {
      $('#quiz-explain-tip').textContent = concept.tip;
      $('#quiz-explain-example').textContent = concept.example;
      explain.removeAttribute('hidden');
    }
  } else {
    explain.setAttribute('hidden', '');
  }

  $('#btn-next-question').removeAttribute('hidden');
  saveProfile(profile);
}
function nextQuestion() {
  currentIndex++;
  if (currentIndex >= currentSession.length) finishSession();
  else renderQuestion();
}
function finishSession() {
  const today = todayStr();
  if (profile.lastCompletedDate) {
    const gap = daysBetween(profile.lastCompletedDate, today);
    if (gap === 1) profile.streak += 1;
    else if (gap > 1) profile.streak = 1;
  } else profile.streak = 1;
  profile.lastCompletedDate = today;
  // 하루 세션 횟수는 스트릭과 별개로 관리 (하루 최대 DAILY_SESSION_LIMIT회까지 미리 읽기 허용)
  if (profile.dailySessionDate === today) {
    profile.dailySessionCount = (profile.dailySessionCount || 0) + 1;
  } else {
    profile.dailySessionDate = today;
    profile.dailySessionCount = 1;
  }
  profile.totalSessions = (profile.totalSessions || 0) + 1;

  if (!profile.reviewBank) profile.reviewBank = [];
  const addReview = (kind, key, data) => {
    if (!profile.reviewBank.some(e => e.kind === kind && e.key === key)) profile.reviewBank.push({ kind, key, data });
  };
  todayUnit.comp.forEach(c => addReview('comp', c.q, c));
  todayUnit.vocab.forEach(v => addReview('vocab', v.word, v));
  if (todayGrammar) addReview('grammar', todayGrammar.id, todayGrammar);
  if (todayIdiom) addReview('idiom', todayIdiom.id, todayIdiom);
  if (profile.reviewBank.length > 100) profile.reviewBank = profile.reviewBank.slice(-100);

  profile.unitIndex = (profile.unitIndex || 0) + 1;
  profile.grammarIndex = (profile.grammarIndex || 0) + 1;
  profile.idiomIndex = (profile.idiomIndex || 0) + 1;
  saveProfile(profile);

  const tierBefore = tierForRating(ratingBefore);
  const tierAfter = tierForRating(profile.rating);

  $('#result-score').textContent = `${sessionCorrect}/${currentSession.length}`;
  const delta = profile.rating - ratingBefore;
  $('#result-delta').textContent = `${delta >= 0 ? '+' : ''}${delta}`;
  $('#result-delta').style.color = delta >= 0 ? 'var(--good)' : 'var(--bad)';
  $('#result-streak').textContent = `${profile.streak}일`;
  $('#result-story-title').textContent = `오늘의 글: ${todayUnit.title}`;

  const headline = $('#result-headline');
  const mascot = $('#result-mascot');
  mascot.classList.remove('celebrate');
  if (sessionCorrect >= 9) { headline.textContent = '완벽해요! 오늘의 결과'; void mascot.offsetWidth; mascot.classList.add('celebrate'); }
  else if (sessionCorrect >= 7) headline.textContent = '아주 잘했어요! 오늘의 결과';
  else if (sessionCorrect >= 4) headline.textContent = '수고했어요! 오늘의 결과';
  else headline.textContent = '오늘의 결과 (내일 다시 도전!)';

  const levelup = $('#result-levelup');
  if (tierAfter.idx > tierBefore.idx) { levelup.removeAttribute('hidden'); $('#levelup-tier').textContent = `✨ ${tierAfter.label}`; }
  else levelup.setAttribute('hidden', '');

  showScreen('screen-result');
}

/* ---------- 인앱 브라우저(카카오톡 등) 감지 ---------- */
function isInAppBrowser() { return /KAKAOTALK|NAVER|Line\/|FBAN|FBAV|Instagram/i.test(navigator.userAgent); }
function openExternalBrowser() {
  if (/Android/i.test(navigator.userAgent)) {
    const urlNoScheme = location.href.replace(/^https?:\/\//, '');
    location.href = `intent://${urlNoScheme}#Intent;scheme=https;package=com.android.chrome;end;`;
  } else {
    alert('화면 아래쪽이나 오른쪽 위의 브라우저 아이콘을 눌러 "다른 브라우저로 열기"를 선택해주세요.');
  }
}

/* ---------- 홈 화면 설치(PWA install) 유도 ---------- */
let deferredInstallPrompt = null;
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  maybeShowInstallBanner();
});
function maybeShowInstallBanner() {
  if (isStandalone() || isInAppBrowser()) return;
  try { if (sessionStorage.getItem('install_banner_dismissed')) return; } catch (e) {}
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!deferredInstallPrompt && !isIOS) return;
  $('#install-banner-text').textContent = isIOS
    ? '하단 공유 버튼을 누르고 "홈 화면에 추가"를 선택하면 앱처럼 바로 열 수 있어요!'
    : '홈 화면에 설치하면 다음부터 링크 없이 아이콘으로 바로 열 수 있어요!';
  $('#btn-install-app').toggleAttribute('hidden', !deferredInstallPrompt);
  $('#install-banner').removeAttribute('hidden');
}

/* ---------- 이벤트 바인딩 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (isInAppBrowser() && !sessionStorage.getItem('inapp_banner_dismissed')) $('#inapp-banner').removeAttribute('hidden');
  } catch (e) { if (isInAppBrowser()) $('#inapp-banner').removeAttribute('hidden'); }

  $('#btn-share-app').addEventListener('click', async () => {
    const shareUrl = location.origin + location.pathname;
    const shareData = { title: '국어랭크 - 국어 읽기 등급전', text: '짧은 글 읽고 어휘·맞춤법·속담 익히면서 국어 등급 올리기! 같이 해봐요.', url: shareUrl };
    if (navigator.share) { try { await navigator.share(shareData); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(shareUrl); alert('링크가 복사됐어요! 카톡 등에 붙여넣어 보내주세요.'); }
    catch (e) { prompt('아래 링크를 복사해서 보내주세요:', shareUrl); }
  });

  $('#btn-open-external').addEventListener('click', openExternalBrowser);
  $('#btn-dismiss-banner').addEventListener('click', () => {
    $('#inapp-banner').setAttribute('hidden', '');
    try { sessionStorage.setItem('inapp_banner_dismissed', '1'); } catch (e) {}
  });
  $('#btn-install-app').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $('#install-banner').setAttribute('hidden', '');
  });
  $('#btn-dismiss-install').addEventListener('click', () => {
    $('#install-banner').setAttribute('hidden', '');
    try { sessionStorage.setItem('install_banner_dismissed', '1'); } catch (e) {}
  });

  $$('.grade-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const grade = parseInt(btn.dataset.grade, 10);
      if (onboardingMode === 'new') {
        const nickname = $('#nickname-input').value.trim();
        if (!nickname) { $('#nickname-error').removeAttribute('hidden'); $('#nickname-input').focus(); return; }
        profile = newProfile(grade, nickname);
      } else {
        profile = newProfile(grade, profile.nickname, profile.id);
      }
      saveProfile(profile);
      renderHome();
    });
  });

  function showOnboarding(mode) {
    onboardingMode = mode;
    const wrap = $('#nickname-wrap');
    if (mode === 'new') { wrap.removeAttribute('hidden'); $('#nickname-input').value = ''; $('#nickname-error').setAttribute('hidden', ''); }
    else wrap.setAttribute('hidden', '');
    showScreen('screen-onboarding');
  }
  $('#btn-change-grade').addEventListener('click', () => showOnboarding('change-grade'));
  $('#btn-add-profile').addEventListener('click', () => showOnboarding('new'));
  $('#btn-switch-profile').addEventListener('click', renderProfilePicker);
  $('#btn-goto-restore-onboarding').addEventListener('click', renderBackupScreen);
  $('#btn-goto-restore-picker').addEventListener('click', renderBackupScreen);

  $('#btn-start-reading').addEventListener('click', renderReading);
  $('#btn-start-quiz-from-reading').addEventListener('click', startQuizFromReading);

  $('#btn-submit-answer').addEventListener('click', () => submitAnswer());
  $('#quiz-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if ($('#btn-next-question').hasAttribute('hidden')) submitAnswer();
      else nextQuestion();
    }
  });
  $('#btn-next-question').addEventListener('click', nextQuestion);

  $('#btn-back-home').addEventListener('click', renderHome);
  $('#btn-view-tiers').addEventListener('click', renderTierTable);
  $('#btn-view-vocab').addEventListener('click', renderReviewList);
  $('#btn-view-backup').addEventListener('click', renderBackupScreen);
  $$('[data-back="home"]').forEach(btn => btn.addEventListener('click', renderHome));

  $('#btn-copy-backup').addEventListener('click', async () => {
    const code = $('#backup-export-code').value;
    try { await navigator.clipboard.writeText(code); alert('복사됐어요! 카톡 같은 곳에 붙여넣어 보관하세요.'); }
    catch (e) { $('#backup-export-code').select(); alert('자동 복사가 안 돼서 코드를 직접 선택해뒀어요. 길게 눌러 복사하세요.'); }
  });
  $('#btn-import-backup').addEventListener('click', () => {
    const code = $('#backup-import-code').value;
    if (!code.trim()) { alert('붙여넣은 코드가 없어요.'); return; }
    importProfileFromCode(code);
  });

  const init = resolveInitialProfile();
  profile = init.profile;
  if (init.mode === 'home') renderHome();
  else if (init.mode === 'picker') renderProfilePicker();
  else showOnboarding('new');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then((reg) => reg.update().catch(() => {}))
      .catch(() => {});
  }
  setTimeout(maybeShowInstallBanner, 1500);
});
