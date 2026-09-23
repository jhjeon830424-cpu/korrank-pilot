// ============================================================
// 군웅쟁패 (Gunwoong Jaengpae) - Original strategy game data
// Historical figures/place names are public-domain history
// (and the public-domain 14th-century novel), not the IP of
// any commercial game. All stats/balance/code are original
// creations for this project.
// ============================================================

// ---- Factions (seed lords) ----
const FACTIONS = [
  { id: "cao",   name: "조위", lordName: "조조", color: "#c0392b" },
  { id: "liu",   name: "촉한", lordName: "유비", color: "#2980b9" },
  { id: "sun",   name: "동오", lordName: "손권", color: "#27ae60" },
  { id: "yuan",  name: "원가", lordName: "원소", color: "#8e44ad" },
  { id: "neutral", name: "군웅", lordName: null, color: "#7f8c8d" }
];

// ---- Regions: organizational grouping only (13 historical provinces + 사례) ----
const REGIONS = [
  { id: "youzhou", name: "유주" }, { id: "jizhou", name: "기주" }, { id: "qingzhou", name: "청주" },
  { id: "bingzhou", name: "병주" }, { id: "yanzhou", name: "연주" }, { id: "yuzhou", name: "예주" },
  { id: "xuzhou", name: "서주" }, { id: "sili", name: "사례" }, { id: "yongzhou", name: "옹주" },
  { id: "liangzhou", name: "양주(涼)" }, { id: "yizhou", name: "익주" }, { id: "jingzhou", name: "형주" },
  { id: "yangzhou", name: "양주(揚)" }, { id: "jiaozhou", name: "교주" }
];

// ---- Region anchor points for the schematic map (original layout, using real
// relative compass positions of the Han-era provinces; not traced from any
// copyrighted map image). viewBox is 0 0 640 760. ----
const REGION_ANCHORS = {
  youzhou:   { x: 460, y: 60 },
  jizhou:    { x: 370, y: 130 },
  bingzhou:  { x: 260, y: 140 },
  qingzhou:  { x: 470, y: 175 },
  yanzhou:   { x: 400, y: 250 },
  yuzhou:    { x: 320, y: 295 },
  xuzhou:    { x: 470, y: 295 },
  sili:      { x: 260, y: 260 },
  yongzhou:  { x: 165, y: 260 },
  liangzhou: { x: 75,  y: 225 },
  yizhou:    { x: 135, y: 400 },
  jingzhou:  { x: 285, y: 405 },
  yangzhou:  { x: 445, y: 405 },
  jiaozhou:  { x: 320, y: 540 }
};

// ---- Cities: real Han-dynasty commandery/county seats (public-domain historical geography) ----
// plus a handful of famous strategic passes (관문) from history/the classic novel.
const CITIES = [
  // 유주
  { id: "c_ji",        name: "계",   region: "youzhou", owner: "yuan", pop: 45, gold: 350, food: 400, troops: 4500, defense: 35, neighbors: ["c_yuyang","c_liaodong","c_ye","c_taiyuan"] },
  { id: "c_yuyang",     name: "어양", region: "youzhou", owner: "yuan", pop: 30, gold: 200, food: 250, troops: 2500, defense: 25, neighbors: ["c_ji"] },
  { id: "c_liaodong",   name: "요동", region: "youzhou", owner: "yuan", pop: 25, gold: 180, food: 220, troops: 2000, defense: 20, neighbors: ["c_ji"] },
  // 기주
  { id: "c_ye",         name: "업",   region: "jizhou", owner: "yuan", pop: 60, gold: 600, food: 650, troops: 7000, defense: 45, neighbors: ["c_ji","c_changshan","c_julu","c_qinghe","c_henei"] },
  { id: "c_changshan",  name: "상산", region: "jizhou", owner: "yuan", pop: 35, gold: 250, food: 300, troops: 3000, defense: 25, neighbors: ["c_ye","c_julu"] },
  { id: "c_julu",       name: "거록", region: "jizhou", owner: "yuan", pop: 30, gold: 220, food: 280, troops: 2800, defense: 22, neighbors: ["c_ye","c_changshan"] },
  { id: "c_qinghe",     name: "청하", region: "jizhou", owner: "yuan", pop: 32, gold: 230, food: 280, troops: 2700, defense: 22, neighbors: ["c_ye","c_juancheng","c_linzi"] },
  // 청주
  { id: "c_linzi",      name: "임치", region: "qingzhou", owner: "neutral", pop: 38, gold: 280, food: 330, troops: 2600, defense: 22, neighbors: ["c_qinghe","c_beihai","c_jinan"] },
  { id: "c_beihai",     name: "북해", region: "qingzhou", owner: "neutral", pop: 28, gold: 200, food: 240, troops: 1800, defense: 18, neighbors: ["c_linzi","c_donghai"] },
  { id: "c_jinan",      name: "제남", region: "qingzhou", owner: "neutral", pop: 26, gold: 190, food: 230, troops: 1700, defense: 18, neighbors: ["c_linzi","c_shanyang"] },
  // 병주
  { id: "c_taiyuan",    name: "태원", region: "bingzhou", owner: "yuan", pop: 32, gold: 240, food: 260, troops: 2900, defense: 26, neighbors: ["c_ji","c_shangdang","c_yanmen","c_henei"] },
  { id: "c_shangdang",  name: "상당", region: "bingzhou", owner: "yuan", pop: 22, gold: 160, food: 190, troops: 1600, defense: 18, neighbors: ["c_taiyuan"] },
  { id: "c_yanmen",     name: "안문", region: "bingzhou", owner: "yuan", pop: 18, gold: 130, food: 160, troops: 1300, defense: 16, neighbors: ["c_taiyuan"] },
  // 연주
  { id: "c_juancheng",  name: "견성", region: "yanzhou", owner: "cao", pop: 40, gold: 350, food: 380, troops: 4200, defense: 30, neighbors: ["c_qinghe","c_chenliu","c_dongjun","c_shanyang"] },
  { id: "c_chenliu",    name: "진류", region: "yanzhou", owner: "cao", pop: 32, gold: 260, food: 290, troops: 2900, defense: 24, neighbors: ["c_juancheng","c_dongjun","c_hulaoguan"] },
  { id: "c_dongjun",    name: "동군", region: "yanzhou", owner: "cao", pop: 30, gold: 240, food: 270, troops: 2700, defense: 22, neighbors: ["c_juancheng","c_chenliu","c_xiapi"] },
  { id: "c_shanyang",   name: "산양", region: "yanzhou", owner: "cao", pop: 28, gold: 220, food: 250, troops: 2500, defense: 20, neighbors: ["c_juancheng","c_jinan","c_runan"] },
  // 예주
  { id: "c_runan",      name: "여남", region: "yuzhou", owner: "cao", pop: 45, gold: 380, food: 400, troops: 4400, defense: 30, neighbors: ["c_shanyang","c_yingchuan","c_peiguo","c_nanyang"] },
  { id: "c_yingchuan",  name: "영천", region: "yuzhou", owner: "cao", pop: 34, gold: 270, food: 300, troops: 3000, defense: 24, neighbors: ["c_runan","c_sishuiguan","c_shouchun"] },
  { id: "c_peiguo",     name: "패국", region: "yuzhou", owner: "cao", pop: 30, gold: 240, food: 260, troops: 2600, defense: 20, neighbors: ["c_runan","c_donghai"] },
  // 서주
  { id: "c_xiapi",      name: "하비", region: "xuzhou", owner: "neutral", pop: 36, gold: 300, food: 320, troops: 3100, defense: 24, neighbors: ["c_dongjun","c_langya","c_donghai"] },
  { id: "c_langya",     name: "낭야", region: "xuzhou", owner: "neutral", pop: 24, gold: 180, food: 210, troops: 1800, defense: 18, neighbors: ["c_xiapi","c_shouchun"] },
  { id: "c_donghai",    name: "동해", region: "xuzhou", owner: "neutral", pop: 26, gold: 190, food: 220, troops: 1900, defense: 18, neighbors: ["c_xiapi","c_beihai","c_peiguo"] },
  // 사례
  { id: "c_luoyang",    name: "낙양", region: "sili", owner: "neutral", pop: 55, gold: 700, food: 500, troops: 5000, defense: 45, neighbors: ["c_hongnong","c_henei","c_hedong"] },
  { id: "c_hongnong",   name: "홍농", region: "sili", owner: "neutral", pop: 28, gold: 220, food: 230, troops: 2200, defense: 26, neighbors: ["c_luoyang","c_hulaoguan","c_sishuiguan","c_tongguan","c_wuguan"] },
  { id: "c_henei",      name: "하내", region: "sili", owner: "neutral", pop: 30, gold: 240, food: 250, troops: 2400, defense: 24, neighbors: ["c_luoyang","c_ye","c_taiyuan"] },
  { id: "c_hedong",     name: "하동", region: "sili", owner: "neutral", pop: 24, gold: 190, food: 200, troops: 1900, defense: 20, neighbors: ["c_luoyang"] },
  // 옹주
  { id: "c_changan",    name: "장안", region: "yongzhou", owner: "neutral", pop: 42, gold: 400, food: 380, troops: 3800, defense: 32, neighbors: ["c_fufeng","c_beidi","c_tongguan"] },
  { id: "c_fufeng",     name: "부풍", region: "yongzhou", owner: "neutral", pop: 22, gold: 170, food: 190, troops: 1700, defense: 18, neighbors: ["c_changan","c_longxi","c_jiange"] },
  { id: "c_beidi",      name: "북지", region: "yongzhou", owner: "neutral", pop: 18, gold: 140, food: 160, troops: 1400, defense: 16, neighbors: ["c_changan"] },
  // 양주(涼)
  { id: "c_wuwei",      name: "무위", region: "liangzhou", owner: "neutral", pop: 20, gold: 150, food: 170, troops: 1600, defense: 18, neighbors: ["c_longxi","c_jincheng"] },
  { id: "c_longxi",     name: "농서", region: "liangzhou", owner: "neutral", pop: 18, gold: 130, food: 150, troops: 1400, defense: 16, neighbors: ["c_wuwei","c_fufeng","c_yangpingguan"] },
  { id: "c_jincheng",   name: "금성", region: "liangzhou", owner: "neutral", pop: 16, gold: 120, food: 140, troops: 1200, defense: 14, neighbors: ["c_wuwei"] },
  // 익주
  { id: "c_chengdu",    name: "성도", region: "yizhou", owner: "liu", pop: 60, gold: 650, food: 700, troops: 6500, defense: 40, neighbors: ["c_hanzhong","c_bajun","c_jianning"] },
  { id: "c_hanzhong",   name: "한중", region: "yizhou", owner: "liu", pop: 28, gold: 220, food: 260, troops: 2600, defense: 30, neighbors: ["c_chengdu","c_jiange","c_yangpingguan"] },
  { id: "c_bajun",      name: "파군", region: "yizhou", owner: "liu", pop: 26, gold: 210, food: 250, troops: 2400, defense: 24, neighbors: ["c_chengdu"] },
  { id: "c_jianning",   name: "건녕", region: "yizhou", owner: "liu", pop: 20, gold: 160, food: 190, troops: 1700, defense: 20, neighbors: ["c_chengdu"] },
  // 형주
  { id: "c_xiangyang",  name: "양양", region: "jingzhou", owner: "liu", pop: 45, gold: 400, food: 420, troops: 4300, defense: 32, neighbors: ["c_jiangling","c_changsha","c_nanyang"] },
  { id: "c_jiangling",  name: "강릉", region: "jingzhou", owner: "liu", pop: 32, gold: 260, food: 290, troops: 2800, defense: 24, neighbors: ["c_xiangyang"] },
  { id: "c_changsha",   name: "장사", region: "jingzhou", owner: "liu", pop: 30, gold: 240, food: 270, troops: 2600, defense: 22, neighbors: ["c_xiangyang","c_yuzhang","c_nanhai"] },
  { id: "c_nanyang",    name: "남양", region: "jingzhou", owner: "liu", pop: 34, gold: 270, food: 300, troops: 2900, defense: 24, neighbors: ["c_xiangyang","c_runan","c_wuguan"] },
  // 양주(揚)
  { id: "c_shouchun",   name: "수춘", region: "yangzhou", owner: "sun", pop: 40, gold: 380, food: 380, troops: 4000, defense: 30, neighbors: ["c_wujun","c_yuzhang","c_lujiang","c_langya","c_yingchuan"] },
  { id: "c_wujun",      name: "오군", region: "yangzhou", owner: "sun", pop: 34, gold: 300, food: 320, troops: 3100, defense: 26, neighbors: ["c_shouchun","c_yuzhang"] },
  { id: "c_yuzhang",    name: "예장", region: "yangzhou", owner: "sun", pop: 28, gold: 220, food: 250, troops: 2400, defense: 22, neighbors: ["c_shouchun","c_wujun","c_changsha","c_nanhai"] },
  { id: "c_lujiang",    name: "여강", region: "yangzhou", owner: "sun", pop: 24, gold: 190, food: 220, troops: 2000, defense: 20, neighbors: ["c_shouchun"] },
  // 교주
  { id: "c_nanhai",     name: "남해", region: "jiaozhou", owner: "sun", pop: 20, gold: 160, food: 190, troops: 1600, defense: 18, neighbors: ["c_jiaozhi","c_changsha","c_yuzhang"] },
  { id: "c_jiaozhi",    name: "교지", region: "jiaozhou", owner: "sun", pop: 16, gold: 120, food: 150, troops: 1200, defense: 14, neighbors: ["c_nanhai"] },

  // ---- 관문 (famous strategic passes; high defense chokepoints) ----
  { id: "c_hulaoguan",   name: "호로관", region: "sili", owner: "neutral", pop: 5, gold: 80, food: 100, troops: 1500, defense: 80, isPass: true, neighbors: ["c_henei","c_chenliu"] },
  { id: "c_sishuiguan",  name: "사수관", region: "sili", owner: "neutral", pop: 5, gold: 80, food: 100, troops: 1500, defense: 80, isPass: true, neighbors: ["c_hongnong","c_yingchuan"] },
  { id: "c_tongguan",    name: "동관",   region: "sili", owner: "neutral", pop: 5, gold: 80, food: 100, troops: 1500, defense: 85, isPass: true, neighbors: ["c_hongnong","c_changan"] },
  { id: "c_wuguan",      name: "무관",   region: "sili", owner: "neutral", pop: 5, gold: 70, food: 90,  troops: 1200, defense: 75, isPass: true, neighbors: ["c_hongnong","c_nanyang"] },
  { id: "c_jiange",      name: "검각",   region: "yizhou", owner: "neutral", pop: 5, gold: 70, food: 90, troops: 1400, defense: 90, isPass: true, neighbors: ["c_fufeng","c_hanzhong"] },
  { id: "c_yangpingguan",name: "양평관", region: "yizhou", owner: "neutral", pop: 5, gold: 70, food: 90, troops: 1300, defense: 85, isPass: true, neighbors: ["c_longxi","c_hanzhong"] }
];

// old 14-province id -> ordered list of new city ids in that region (used to migrate
// existing general placements and to group the map UI by region)
const REGION_CITIES = {
  youzhou: ["c_ji","c_yuyang","c_liaodong"],
  jizhou: ["c_ye","c_changshan","c_julu","c_qinghe"],
  qingzhou: ["c_linzi","c_beihai","c_jinan"],
  bingzhou: ["c_taiyuan","c_shangdang","c_yanmen"],
  yanzhou: ["c_juancheng","c_chenliu","c_dongjun","c_shanyang"],
  yuzhou: ["c_runan","c_yingchuan","c_peiguo"],
  xuzhou: ["c_xiapi","c_langya","c_donghai"],
  sili: ["c_luoyang","c_hongnong","c_henei","c_hedong"],
  yongzhou: ["c_changan","c_fufeng","c_beidi"],
  liangzhou: ["c_wuwei","c_longxi","c_jincheng"],
  yizhou: ["c_chengdu","c_hanzhong","c_bajun","c_jianning"],
  jingzhou: ["c_xiangyang","c_jiangling","c_changsha","c_nanyang"],
  yangzhou: ["c_shouchun","c_wujun","c_yuzhang","c_lujiang"],
  jiaozhou: ["c_nanhai","c_jiaozhi"]
};

const STARTING_YEAR = 190; // Late Han turmoil period

// ---- Troop types (병종): base per-soldier attack/defense weight + matchup bonuses ----
const TROOP_TYPES = [
  { id: "infantry", name: "보병", cost: 8,  atk: 1.0, def: 1.1, strongVs: [],           weakVs: [] },
  { id: "archer",   name: "궁병", cost: 10, atk: 1.15,def: 0.85,strongVs: ["infantry"], weakVs: ["cavalry"] },
  { id: "cavalry",  name: "기병", cost: 16, atk: 1.3, def: 0.9, strongVs: ["archer","infantry"], weakVs: ["crossbow"] },
  { id: "crossbow", name: "노병", cost: 13, atk: 1.2, def: 0.95,strongVs: ["cavalry"],  weakVs: ["infantry"] },
  { id: "navy",     name: "수군", cost: 12, atk: 1.1, def: 1.1, strongVs: [],           weakVs: [], coastalOnly: true }
];
const TROOP_MATCHUP_BONUS = 0.25; // +25% effective power vs a weak-to type

// coastal/riverine cities where 수군 can be trained and used
const COASTAL_CITIES = new Set([
  "c_wujun","c_yuzhang","c_lujiang","c_nanhai","c_jiaozhi","c_jiangling",
  "c_changsha","c_xiangyang","c_shouchun","c_donghai","c_beihai","c_liaodong"
]);

// ---- 특기 (specialties): original mechanic, tag-based combat/internal-affairs bonuses ----
const SPECIALTIES = [
  { id: "charge",   name: "돌격", desc: "기병 운용 시 전투력 상승" },
  { id: "archery",  name: "궁술", desc: "궁병 운용 시 전투력 상승" },
  { id: "navalcmd", name: "수전", desc: "수군 운용 시 전투력 상승" },
  { id: "siege",    name: "축성", desc: "수비 시 방어 보너스" },
  { id: "fireattk", name: "화공", desc: "공성 시 적 병력에 추가 피해" },
  { id: "duelist",  name: "간파", desc: "일기토 승률 상승" },
  { id: "logistics",name: "둔전", desc: "내정 중 식량 개발 효율 상승" },
  { id: "commerce", name: "이재", desc: "내정 중 상업 개발 효율 상승" },
  { id: "oratory",  name: "구변", desc: "인재 등용 성공률 상승" },
  { id: "none",     name: "-", desc: "특기 없음" }
];

// ---- Items (보물/장비): traditional public-domain artifact names from the
// centuries-old classical novel/history, mixed with original invented ones ----
const ITEMS = [
  { id: "i_red_hare",   name: "적토마",   slot: "horse",  bonus: { war: 10, leadership: 3 } },
  { id: "i_hualiu",      name: "화류마",   slot: "horse",  bonus: { war: 6, leadership: 2 } },
  { id: "i_jueying",     name: "절영마",   slot: "horse",  bonus: { war: 5, leadership: 3 } },
  { id: "i_fangtian",    name: "방천화극", slot: "weapon", bonus: { war: 9 } },
  { id: "i_qinggang",    name: "청강검",   slot: "weapon", bonus: { war: 6, intel: 2 } },
  { id: "i_gudingdao",   name: "고정도",   slot: "weapon", bonus: { war: 7 } },
  { id: "i_qilinbow",    name: "기린궁",   slot: "weapon", bonus: { war: 5, leadership: 3 } },
  { id: "i_lianhuan",    name: "연환갑",   slot: "armor",  bonus: { leadership: 5, war: 2 } },
  { id: "i_wutie",       name: "오철갑",   slot: "armor",  bonus: { leadership: 4 } },
  { id: "i_longtoushun", name: "용두순",   slot: "armor",  bonus: { leadership: 6 } },
  { id: "i_dunjia",      name: "둔갑천서", slot: "book",   bonus: { intel: 9 } },
  { id: "i_bingfa",      name: "병법요결", slot: "book",   bonus: { intel: 6, leadership: 3 } },
  { id: "i_zhengyao",    name: "치세요람", slot: "book",   bonus: { politics: 8 } },
  { id: "i_shanshui",    name: "산수화첩", slot: "book",   bonus: { charm: 6, politics: 2 } },
  { id: "i_yubi",        name: "옥벽",     slot: "book",   bonus: { charm: 8 } },
  { id: "i_jinyin",      name: "금인",     slot: "book",   bonus: { politics: 5, charm: 3 } }
];

const STARTING_ITEMS = ["i_qinggang", "i_bingfa"]; // items the player's inventory starts with

// ---- Procedural general generation (파워키드 스타일 대량 재야 장수) ----
const NAME_SURNAMES = ["왕","이","장","유","진","조","양","오","서","주","황","임","한","풍","여","마","고","곽","두","정","심","봉","전","공","손","엄","등","감","위","포","동","맹","반","동곽","사마","제갈","황보","공손"];
const NAME_GIVEN_CLEAN = ["문","무","덕","의","성","현","준","강","민","철","용","호","진","규","건","석","경","원","유","창","보","광","기","윤","산","해","웅","림","춘","일"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateRandomStatBlock() {
  const roll = Math.random();
  // tiered rarity: common / elite / renowned
  let lo, hi;
  if (roll < 0.70) { lo = 25; hi = 58; }
  else if (roll < 0.95) { lo = 50; hi = 78; }
  else { lo = 72; hi = 94; }
  const stat = () => lo + Math.floor(Math.random() * (hi - lo));
  return { leadership: stat(), war: stat(), intel: stat(), politics: stat(), charm: stat() };
}

function generateProceduralGeneral(index, faction, cityId) {
  const surname = pick(NAME_SURNAMES);
  const given = pick(NAME_GIVEN_CLEAN) + (Math.random() < 0.4 ? pick(NAME_GIVEN_CLEAN) : "");
  const stats = generateRandomStatBlock();
  const specialty = pick(SPECIALTIES.filter(s => s.id !== "none").map(s => s.id));
  return {
    id: `g_rand_${index}`,
    name: surname + given,
    faction, province: cityId,
    isLord: false,
    specialty,
    item: null,
    ...stats
  };
}

// ---- Generals: stats are original balancing (0-100), tied to historical role ----
// leadership(통솔) war(무력) intel(지력) politics(정치) charm(매력)
const GENERALS = [
  { id: "g_cao_cao",   name: "조조", faction: "cao",  province: "yanzhou",  leadership: 96, war: 72, intel: 91, politics: 92, charm: 96, isLord: true, specialty: "logistics", bio: "후한 말 최고의 실권자. 문무를 겸비한 효웅으로 화북을 평정했다." },
  { id: "g_xiahou_dun",name: "하후돈", faction: "cao", province: "yanzhou",  leadership: 82, war: 90, intel: 55, politics: 45, charm: 65, specialty: "charge", bio: "조조의 최측근 맹장. 눈에 화살을 맞고도 전장을 떠나지 않았다는 일화로 유명하다." },
  { id: "g_xun_yu",    name: "순욱", faction: "cao",   province: "yuzhou",   leadership: 70, war: 30, intel: 96, politics: 95, charm: 82, specialty: "commerce", bio: "조조 진영 최고의 내정가로, 원정 내내 후방을 굳건히 지탱했다." },
  { id: "g_zhang_liao",name: "장료", faction: "cao",   province: "yanzhou",  leadership: 88, war: 93, intel: 68, politics: 50, charm: 75, specialty: "charge", bio: "소수 병력으로 대군을 물리친 것으로 이름을 떨친 용장." },

  { id: "g_liu_bei",   name: "유비", faction: "liu",   province: "yizhou",   leadership: 78, war: 68, intel: 60, politics: 78, charm: 98, isLord: true, specialty: "oratory", bio: "한실의 후예를 자처하며 인덕으로 사람을 모은 촉한의 시조." },
  { id: "g_guan_yu",   name: "관우", faction: "liu",   province: "jingzhou", leadership: 92, war: 97, intel: 75, politics: 62, charm: 90, specialty: "duelist", bio: "의리와 충절의 상징으로, 후대에 무신으로까지 추앙받았다." },
  { id: "g_zhang_fei", name: "장비", faction: "liu",   province: "yizhou",   leadership: 85, war: 98, intel: 40, politics: 30, charm: 60, specialty: "charge", bio: "불같은 성정과 압도적 완력을 지닌 유비의 의형제." },
  { id: "g_zhuge_liang",name:"제갈량",faction: "liu",  province: "jingzhou", leadership: 93, war: 45, intel: 100, politics: 96, charm: 92, specialty: "fireattk", bio: "천하삼분지계를 설계한 불세출의 지략가." },

  { id: "g_sun_quan",  name: "손권", faction: "sun",   province: "yangzhou", leadership: 82, war: 55, intel: 78, politics: 85, charm: 88, isLord: true, specialty: "commerce", bio: "강동을 물려받아 오랜 세월 동오를 지켜낸 군주." },
  { id: "g_zhou_yu",   name: "주유", faction: "sun",   province: "yangzhou", leadership: 95, war: 80, intel: 95, politics: 80, charm: 93, specialty: "navalcmd", bio: "적벽에서 조조의 대군을 화공으로 격파한 명장." },
  { id: "g_lu_su",     name: "노숙", faction: "sun",   province: "jiaozhou", leadership: 75, war: 45, intel: 90, politics: 88, charm: 80, specialty: "oratory", bio: "손권과 유비의 동맹을 이끌어낸 신중한 외교가." },
  { id: "g_gan_ning",  name: "감녕", faction: "sun",   province: "jiaozhou", leadership: 80, war: 92, intel: 55, politics: 35, charm: 60, specialty: "navalcmd", bio: "백 명의 기병으로 조조의 진영을 야습했다는 용장." },

  { id: "g_yuan_shao", name: "원소", faction: "yuan",  province: "jizhou",   leadership: 75, war: 62, intel: 65, politics: 70, charm: 85, isLord: true, specialty: "siege", bio: "명문가 출신으로, 한때 화북 최대 세력을 이룬 군웅." },
  { id: "g_yan_liang", name: "안량", faction: "yuan",  province: "jizhou",   leadership: 78, war: 94, intel: 40, politics: 30, charm: 55, specialty: "charge", bio: "원소 휘하의 용장이었으나 관우에게 목숨을 잃었다." },
  { id: "g_ju_shou",   name: "저수", faction: "yuan",  province: "youzhou",  leadership: 72, war: 40, intel: 92, politics: 85, charm: 65, specialty: "logistics", bio: "원소에게 여러 차례 옳은 계책을 올렸으나 받아들여지지 않았다." },

  { id: "g_ma_teng",   name: "마등", faction: "neutral", province: "liangzhou", leadership: 80, war: 88, intel: 50, politics: 55, charm: 78, specialty: "charge", bio: "서량을 근거지로 한 용맹한 변방의 군벌." },
  { id: "g_gongsun_zan",name:"공손찬",faction: "neutral", province: "youzhou",  leadership: 76, war: 85, intel: 45, politics: 40, charm: 62, specialty: "archery", bio: "백마의종을 이끌고 북방 이민족을 상대한 맹장." },

  // ---- Expanded roster (additional historical figures) ----
  { id: "g_guo_jia",   name: "곽가", faction: "cao", province: "yanzhou",  leadership: 65, war: 25, intel: 97, politics: 75, charm: 70, specialty: "duelist", bio: "조조가 가장 신뢰한 젊은 책사. 그의 요절을 조조는 두고두고 아쉬워했다." },
  { id: "g_sima_yi",   name: "사마의", faction: "cao", province: "yuzhou", leadership: 90, war: 55, intel: 98, politics: 90, charm: 75, specialty: "siege", bio: "인내와 지략으로 훗날 진나라 건국의 초석을 놓은 책사." },
  { id: "g_xu_chu",    name: "허저", faction: "cao", province: "yanzhou",  leadership: 75, war: 96, intel: 35, politics: 25, charm: 55, specialty: "duelist", bio: "맨몸으로 맹수를 때려잡았다는 일화가 있는 조조의 호위 맹장." },
  { id: "g_dian_wei",  name: "전위", faction: "cao", province: "yanzhou",  leadership: 70, war: 97, intel: 30, politics: 20, charm: 50, specialty: "duelist", bio: "조조를 지키다 장렬히 전사한 충직한 맹장." },
  { id: "g_yu_jin",    name: "우금", faction: "cao", province: "yuzhou",   leadership: 78, war: 82, intel: 55, politics: 50, charm: 60, specialty: "siege", bio: "오랜 세월 조조를 섬긴 노련한 장수." },
  { id: "g_yue_jin",   name: "악진", faction: "cao", province: "yuzhou",   leadership: 76, war: 84, intel: 50, politics: 40, charm: 55, specialty: "archery", bio: "작은 체구에도 선봉에서 용맹을 떨친 장수." },
  { id: "g_xun_you",   name: "순유", faction: "cao", province: "yanzhou",  leadership: 68, war: 30, intel: 93, politics: 88, charm: 72, specialty: "commerce", bio: "순욱의 조카로, 뛰어난 임기응변을 보인 책사." },

  { id: "g_zhao_yun",  name: "조운", faction: "liu", province: "yizhou",   leadership: 90, war: 96, intel: 70, politics: 60, charm: 88, specialty: "charge", bio: "장판파에서 어린 주군을 품고 홀로 적진을 돌파한 명장." },
  { id: "g_ma_chao",   name: "마초", faction: "liu", province: "yizhou",   leadership: 85, war: 97, intel: 45, politics: 35, charm: 75, specialty: "charge", bio: "서량의 맹장으로, 한때 조조를 크게 위협했다." },
  { id: "g_huang_zhong",name:"황충", faction: "liu", province: "jingzhou", leadership: 80, war: 93, intel: 50, politics: 40, charm: 70, specialty: "archery", bio: "노년에도 녹슬지 않은 궁술로 이름을 떨친 노장." },
  { id: "g_pang_tong", name: "방통", faction: "liu", province: "jingzhou", leadership: 80, war: 40, intel: 97, politics: 85, charm: 65, specialty: "fireattk", bio: "제갈량과 나란히 봉추로 불린 재사." },
  { id: "g_jiang_wei", name: "강유", faction: "liu", province: "yizhou",   leadership: 82, war: 88, intel: 85, politics: 65, charm: 68, specialty: "siege", bio: "촉한 말기 홀로 북벌을 이어간 마지막 기둥." },
  { id: "g_wei_yan",   name: "위연", faction: "liu", province: "jingzhou", leadership: 78, war: 90, intel: 55, politics: 40, charm: 55, specialty: "charge", bio: "뛰어난 용맹을 지녔으나 대인관계로 아쉬움을 남긴 장수." },

  { id: "g_sun_ce",    name: "손책", faction: "sun", province: "yangzhou", leadership: 90, war: 92, intel: 68, politics: 70, charm: 92, specialty: "duelist", bio: "강동을 평정하며 소패왕이라 불린 손권의 형." },
  { id: "g_taishi_ci", name: "태사자", faction: "sun", province: "yangzhou", leadership: 80, war: 91, intel: 55, politics: 40, charm: 70, specialty: "archery", bio: "신의를 중시한 강동의 용장." },
  { id: "g_cheng_pu",  name: "정보", faction: "sun", province: "jiaozhou", leadership: 75, war: 78, intel: 60, politics: 55, charm: 65, specialty: "navalcmd", bio: "손씨 삼대를 섬긴 강동의 원로 장수." },
  { id: "g_huang_gai", name: "황개", faction: "sun", province: "jiaozhou", leadership: 74, war: 80, intel: 55, politics: 50, charm: 68, specialty: "fireattk", bio: "고육계로 적벽대전 승리에 기여한 노장." },
  { id: "g_lu_xun",    name: "육손", faction: "sun", province: "yangzhou", leadership: 88, war: 65, intel: 95, politics: 82, charm: 78, specialty: "fireattk", bio: "이릉에서 유비의 대군을 화공으로 무너뜨린 지장." },
  { id: "g_lu_meng",   name: "여몽", faction: "sun", province: "jiaozhou", leadership: 84, war: 78, intel: 85, politics: 65, charm: 70, specialty: "navalcmd", bio: "백의종군 계책으로 형주를 되찾은 지장." },

  { id: "g_wen_chou",  name: "문추", faction: "yuan", province: "jizhou",  leadership: 76, war: 93, intel: 38, politics: 28, charm: 52, specialty: "charge", bio: "원소 진영의 용장으로 안량과 함께 명성을 떨쳤다." },
  { id: "g_zhang_he",  name: "장합", faction: "yuan", province: "jizhou",  leadership: 82, war: 90, intel: 68, politics: 45, charm: 60, specialty: "siege", bio: "병법에 능해 여러 주군을 거치며 명장으로 남았다." },
  { id: "g_gao_lan",   name: "고람", faction: "yuan", province: "youzhou", leadership: 65, war: 82, intel: 40, politics: 30, charm: 45, specialty: "charge", bio: "원소 휘하의 맹장." },
  { id: "g_shen_pei",  name: "심배", faction: "yuan", province: "jizhou",  leadership: 70, war: 45, intel: 85, politics: 80, charm: 55, specialty: "siege", bio: "원소 사후까지 업성을 지킨 충신." },
  { id: "g_feng_ji",   name: "봉기", faction: "yuan", province: "bingzhou",leadership: 60, war: 40, intel: 78, politics: 70, charm: 50, specialty: "logistics", bio: "원소의 책사 중 한 사람." },

  { id: "g_dong_zhuo", name: "동탁", faction: "neutral", province: "sili",      leadership: 85, war: 75, intel: 60, politics: 50, charm: 30, specialty: "siege", bio: "낙양을 장악하고 폭정을 펼쳐 반동탁 연합을 불러왔다." },
  { id: "g_lu_bu",     name: "여포", faction: "neutral", province: "yongzhou",  leadership: 70, war: 100, intel: 30, politics: 15, charm: 45, specialty: "duelist", bio: "당대 최고의 무력을 지녔으나 신의가 없다는 평을 들었다." },
  { id: "g_chen_gong", name: "진궁", faction: "neutral", province: "xuzhou",    leadership: 65, war: 35, intel: 92, politics: 75, charm: 60, specialty: "fireattk", bio: "여포를 보좌한 지략가." },
  { id: "g_hua_xiong", name: "화웅", faction: "neutral", province: "sili",      leadership: 55, war: 85, intel: 30, politics: 20, charm: 40, specialty: "duelist", bio: "동탁 진영의 선봉장." },
  { id: "g_li_jue",    name: "이각", faction: "neutral", province: "liangzhou", leadership: 60, war: 78, intel: 35, politics: 30, charm: 30, specialty: "charge", bio: "동탁 사후 장안을 장악했던 군벌." },
  { id: "g_guo_si",    name: "곽사", faction: "neutral", province: "liangzhou", leadership: 58, war: 76, intel: 33, politics: 28, charm: 28, specialty: "charge", bio: "이각과 함께 장안을 어지럽힌 군벌." },
  { id: "g_zhang_ji",  name: "장제", faction: "neutral", province: "qingzhou",  leadership: 55, war: 70, intel: 40, politics: 35, charm: 35, specialty: "archery", bio: "동탁 잔당 출신의 군벌." },
  { id: "g_liu_biao",  name: "유표", faction: "neutral", province: "xuzhou",    leadership: 70, war: 40, intel: 65, politics: 78, charm: 82, specialty: "oratory", bio: "형주를 오래 다스리며 안정을 지킨 군주." },
  { id: "g_liu_zhang", name: "유장", faction: "neutral", province: "yongzhou",  leadership: 50, war: 30, intel: 45, politics: 60, charm: 65, specialty: "commerce", bio: "익주를 다스리다 유비에게 자리를 내준 군주." },
  { id: "g_zhang_lu",  name: "장로", faction: "neutral", province: "liangzhou", leadership: 60, war: 45, intel: 60, politics: 70, charm: 72, specialty: "oratory", bio: "한중에서 오두미도로 백성을 다스린 종교 지도자." },
  { id: "g_tao_qian",  name: "도겸", faction: "neutral", province: "xuzhou",    leadership: 62, war: 40, intel: 60, politics: 75, charm: 80, specialty: "commerce", bio: "서주를 다스리며 유비에게 자리를 물려준 군주." },
  { id: "g_gongsun_du",name: "공손도", faction: "neutral", province: "qingzhou",leadership: 68, war: 60, intel: 55, politics: 60, charm: 55, specialty: "logistics", bio: "요동을 독자적으로 다스린 군벌." },
  { id: "g_wang_yun",  name: "왕윤", faction: "neutral", province: "sili",      leadership: 55, war: 20, intel: 82, politics: 88, charm: 75, specialty: "oratory", bio: "계책으로 동탁을 제거한 한실의 충신." },
  { id: "g_tian_feng", name: "전풍", faction: "neutral", province: "qingzhou",  leadership: 65, war: 35, intel: 90, politics: 82, charm: 58, specialty: "siege", bio: "원소에게 직언을 올렸으나 받아들여지지 않은 책사." },
  { id: "g_wen_pin",   name: "문빙", faction: "neutral", province: "yongzhou",  leadership: 72, war: 80, intel: 55, politics: 45, charm: 60, specialty: "navalcmd", bio: "형주 출신으로, 이후 조위에서 활약한 장수." },

  // ---- Additional 100 historical figures (further expanded roster) ----
  // 조위 추가 (25)
  { id: "g_xiahou_yuan", name: "하후연", faction: "cao", province: "yanzhou", leadership: 84, war: 91, intel: 55, politics: 40, charm: 62, specialty: "charge", bio: "신속한 용병술로 서방 전선을 누빈 조조의 명장." },
  { id: "g_cao_ren",     name: "조인",   faction: "cao", province: "yuzhou",  leadership: 86, war: 88, intel: 60, politics: 55, charm: 65, specialty: "siege", bio: "조조의 사촌으로, 여러 요충지를 굳게 지킨 수비의 명수." },
  { id: "g_cao_hong",    name: "조홍",   faction: "cao", province: "yanzhou", leadership: 75, war: 85, intel: 45, politics: 35, charm: 55, specialty: "charge", bio: "위기에 빠진 조조를 자신의 말을 내주고 구한 조씨 일족의 맹장." },
  { id: "g_cao_zhang",   name: "조창",   faction: "cao", province: "yuzhou",  leadership: 78, war: 89, intel: 40, politics: 30, charm: 58, specialty: "charge", bio: "뛰어난 무예로 북방 이민족을 정벌한 조조의 아들." },
  { id: "g_cao_xiu",     name: "조휴",   faction: "cao", province: "yanzhou", leadership: 76, war: 74, intel: 62, politics: 55, charm: 60, specialty: "siege", bio: "조씨 일족의 장수로 동오 방면을 오래 맡았다." },
  { id: "g_cao_zhen",    name: "조진",   faction: "cao", province: "yuzhou",  leadership: 80, war: 76, intel: 65, politics: 58, charm: 62, specialty: "siege", bio: "조씨 일족을 대표해 촉한의 북벌을 막아낸 장수." },
  { id: "g_cheng_yu",    name: "정욱",   faction: "cao", province: "yanzhou", leadership: 72, war: 35, intel: 93, politics: 82, charm: 68, specialty: "logistics", bio: "조조 진영의 노련한 책사." },
  { id: "g_jia_xu",      name: "가후",   faction: "cao", province: "yuzhou",  leadership: 75, war: 30, intel: 97, politics: 85, charm: 70, specialty: "oratory", bio: "여러 주군을 거치면서도 뛰어난 계책으로 살아남은 지략가." },
  { id: "g_man_chong",   name: "만총",   faction: "cao", province: "yanzhou", leadership: 74, war: 55, intel: 82, politics: 80, charm: 65, specialty: "siege", bio: "법을 엄정히 집행한 조위의 관리이자 장수." },
  { id: "g_li_dian",     name: "이전",   faction: "cao", province: "yuzhou",  leadership: 76, war: 78, intel: 65, politics: 55, charm: 62, specialty: "logistics", bio: "청렴하기로 이름난 조위의 장수." },
  { id: "g_pang_de",     name: "방덕",   faction: "cao", province: "yanzhou", leadership: 78, war: 93, intel: 45, politics: 30, charm: 58, specialty: "duelist", bio: "관을 짊어지고 출전할 만큼 결사의 각오를 보인 맹장." },
  { id: "g_zang_ba",     name: "장패",   faction: "cao", province: "yuzhou",  leadership: 74, war: 85, intel: 42, politics: 35, charm: 56, specialty: "charge", bio: "태산 일대를 근거지로 활약한 장수." },
  { id: "g_lu_qian",     name: "여건",   faction: "cao", province: "yanzhou", leadership: 70, war: 80, intel: 50, politics: 40, charm: 55, specialty: "archery", bio: "조위의 여러 전투에서 꾸준히 활약한 장수." },
  { id: "g_xu_huang",    name: "서황",   faction: "cao", province: "yuzhou",  leadership: 85, war: 92, intel: 60, politics: 45, charm: 68, specialty: "siege", bio: "번성 전투에서 관우의 포위를 풀어낸 명장." },
  { id: "g_zhong_yao",   name: "종요",   faction: "cao", province: "yanzhou", leadership: 60, war: 25, intel: 88, politics: 92, charm: 72, specialty: "commerce", bio: "뛰어난 서예와 행정 능력을 겸비한 조위의 중신." },
  { id: "g_hua_xin",     name: "화흠",   faction: "cao", province: "yuzhou",  leadership: 55, war: 20, intel: 78, politics: 85, charm: 60, specialty: "commerce", bio: "후한 조정에서 조위로 전향한 문관." },
  { id: "g_wang_lang",   name: "왕랑",   faction: "cao", province: "yanzhou", leadership: 52, war: 18, intel: 80, politics: 84, charm: 66, specialty: "oratory", bio: "학식이 깊은 조위의 원로 문관." },
  { id: "g_chen_qun",    name: "진군",   faction: "cao", province: "yuzhou",  leadership: 65, war: 25, intel: 85, politics: 90, charm: 70, specialty: "commerce", bio: "인재 등용 제도를 정비한 조위의 명신." },
  { id: "g_liu_ye",      name: "유엽",   faction: "cao", province: "yanzhou", leadership: 68, war: 30, intel: 92, politics: 78, charm: 65, specialty: "siege", bio: "예리한 통찰로 여러 계책을 올린 책사." },
  { id: "g_dong_zhao",   name: "동소",   faction: "cao", province: "yuzhou",  leadership: 62, war: 28, intel: 84, politics: 80, charm: 62, specialty: "logistics", bio: "조조의 위공 즉위를 도운 책사." },
  { id: "g_tian_yu",     name: "전예",   faction: "cao", province: "yanzhou", leadership: 70, war: 60, intel: 75, politics: 65, charm: 58, specialty: "siege", bio: "북방 변경을 오래 지킨 장수." },
  { id: "g_jian_zhao",   name: "견초",   faction: "cao", province: "yuzhou",  leadership: 66, war: 58, intel: 70, politics: 60, charm: 55, specialty: "navalcmd", bio: "조위의 여러 전역에서 활약한 장수." },
  { id: "g_xiahou_shang",name: "하후상", faction: "cao", province: "yanzhou", leadership: 68, war: 78, intel: 48, politics: 38, charm: 56, specialty: "charge", bio: "하후씨 일족의 젊은 장수." },
  { id: "g_li_tong",     name: "이통",   faction: "cao", province: "yuzhou",  leadership: 65, war: 76, intel: 45, politics: 35, charm: 52, specialty: "archery", bio: "지역 호족 출신으로 조조에게 귀순한 장수." },
  { id: "g_tian_chou",   name: "전주",   faction: "cao", province: "yanzhou", leadership: 60, war: 40, intel: 72, politics: 68, charm: 60, specialty: "logistics", bio: "지리에 밝아 원정에 크게 기여한 인물." },

  // 촉한 추가 (20)
  { id: "g_sun_qian",   name: "손건", faction: "liu", province: "yizhou",   leadership: 55, war: 20, intel: 70, politics: 75, charm: 68, specialty: "oratory", bio: "유비를 오래 보좌한 신하." },
  { id: "g_mi_zhu",     name: "미축", faction: "liu", province: "jingzhou", leadership: 50, war: 15, intel: 62, politics: 80, charm: 66, specialty: "commerce", bio: "사재를 털어 어려울 때 유비를 도운 공신." },
  { id: "g_mi_fang",    name: "미방", faction: "liu", province: "yizhou",   leadership: 58, war: 55, intel: 50, politics: 55, charm: 50, specialty: "logistics", bio: "미축의 동생으로 형주를 지키던 장수." },
  { id: "g_jian_yong",  name: "간옹", faction: "liu", province: "jingzhou", leadership: 52, war: 18, intel: 68, politics: 72, charm: 70, specialty: "oratory", bio: "유비와 오랜 친분을 나눈 신하." },
  { id: "g_ma_liang",   name: "마량", faction: "liu", province: "yizhou",   leadership: 70, war: 30, intel: 88, politics: 82, charm: 74, specialty: "logistics", bio: "눈썹에 흰 털이 섞여 백미로 불린 재사." },
  { id: "g_ma_su",      name: "마속", faction: "liu", province: "jingzhou", leadership: 68, war: 35, intel: 85, politics: 65, charm: 62, specialty: "siege", bio: "병법에 밝았으나 가정 전투의 패배로 이름이 남았다." },
  { id: "g_li_yan",     name: "이엄", faction: "liu", province: "yizhou",   leadership: 72, war: 60, intel: 75, politics: 72, charm: 58, specialty: "commerce", bio: "촉한의 중신이었으나 훗날 과실로 실각했다." },
  { id: "g_fa_zheng",   name: "법정", faction: "liu", province: "jingzhou", leadership: 74, war: 40, intel: 93, politics: 80, charm: 65, specialty: "fireattk", bio: "유비가 익주를 얻는 데 결정적 계책을 낸 책사." },
  { id: "g_dong_yun",   name: "동윤", faction: "liu", province: "yizhou",   leadership: 60, war: 20, intel: 82, politics: 88, charm: 72, specialty: "commerce", bio: "성실하고 강직한 촉한의 재상." },
  { id: "g_fei_yi",     name: "비의", faction: "liu", province: "jingzhou", leadership: 65, war: 25, intel: 85, politics: 85, charm: 75, specialty: "oratory", bio: "촉한 후기를 이끈 온건한 재상." },
  { id: "g_jiang_wan",  name: "장완", faction: "liu", province: "yizhou",   leadership: 78, war: 35, intel: 88, politics: 90, charm: 76, specialty: "commerce", bio: "제갈량의 뒤를 이어 촉한을 안정시킨 재상." },
  { id: "g_liao_hua",   name: "요화", faction: "liu", province: "jingzhou", leadership: 70, war: 75, intel: 55, politics: 45, charm: 60, specialty: "charge", bio: "촉한 말기까지 오래 활약한 노장." },
  { id: "g_wang_ping",  name: "왕평", faction: "liu", province: "yizhou",   leadership: 78, war: 80, intel: 60, politics: 45, charm: 55, specialty: "siege", bio: "글을 몰랐으나 엄정한 군율로 이름을 남긴 장수." },
  { id: "g_guan_ping",  name: "관평", faction: "liu", province: "jingzhou", leadership: 70, war: 82, intel: 55, politics: 45, charm: 65, specialty: "duelist", bio: "관우를 곁에서 보좌한 아들." },
  { id: "g_guan_xing",  name: "관흥", faction: "liu", province: "yizhou",   leadership: 72, war: 85, intel: 50, politics: 40, charm: 68, specialty: "duelist", bio: "관우의 아들로 아버지의 뒤를 이었다." },
  { id: "g_zhang_bao",  name: "장포", faction: "liu", province: "jingzhou", leadership: 70, war: 84, intel: 45, politics: 35, charm: 62, specialty: "charge", bio: "장비의 아들로 촉한 후기에 활약했다." },
  { id: "g_ma_dai",     name: "마대", faction: "liu", province: "yizhou",   leadership: 74, war: 83, intel: 50, politics: 40, charm: 58, specialty: "charge", bio: "마초의 사촌으로 촉한 말기까지 활약했다." },
  { id: "g_yang_yi",    name: "양의", faction: "liu", province: "jingzhou", leadership: 62, war: 25, intel: 80, politics: 78, charm: 55, specialty: "logistics", bio: "뛰어난 행정 능력을 지녔으나 인화가 부족했던 신하." },
  { id: "g_wu_yi",      name: "오의", faction: "liu", province: "yizhou",   leadership: 66, war: 62, intel: 55, politics: 50, charm: 58, specialty: "archery", bio: "촉한의 장수로 여러 전역에 참여했다." },
  { id: "g_chen_dao",   name: "진도", faction: "liu", province: "jingzhou", leadership: 68, war: 75, intel: 50, politics: 40, charm: 56, specialty: "archery", bio: "유비를 오래 수행한 노장." },

  // 동오 추가 (20)
  { id: "g_zhang_zhao", name: "장소", faction: "sun", province: "yangzhou", leadership: 68, war: 20, intel: 85, politics: 92, charm: 80, specialty: "commerce", bio: "손씨 정권 초기를 지탱한 강동의 원로 문신." },
  { id: "g_gu_yong",    name: "고옹", faction: "sun", province: "jiaozhou", leadership: 62, war: 18, intel: 82, politics: 88, charm: 74, specialty: "commerce", bio: "온후하고 청렴한 동오의 재상." },
  { id: "g_bu_zhi",     name: "보즐", faction: "sun", province: "yangzhou", leadership: 65, war: 30, intel: 84, politics: 82, charm: 72, specialty: "oratory", bio: "손권을 오래 보좌한 문신." },
  { id: "g_kan_ze",     name: "감택", faction: "sun", province: "jiaozhou", leadership: 55, war: 22, intel: 88, politics: 70, charm: 68, specialty: "fireattk", bio: "학식이 뛰어나 여러 계책에 참여한 책사." },
  { id: "g_zhuge_jin",  name: "제갈근", faction: "sun", province: "yangzhou", leadership: 70, war: 30, intel: 85, politics: 82, charm: 78, specialty: "oratory", bio: "제갈량의 형으로 동오를 섬긴 문신." },
  { id: "g_lu_fan",     name: "여범", faction: "sun", province: "jiaozhou", leadership: 68, war: 55, intel: 72, politics: 65, charm: 62, specialty: "navalcmd", bio: "손권을 오래 보좌한 문무겸비의 신하." },
  { id: "g_dong_xi",    name: "동습", faction: "sun", province: "yangzhou", leadership: 66, war: 70, intel: 55, politics: 45, charm: 58, specialty: "navalcmd", bio: "수전에 능한 동오의 장수." },
  { id: "g_pan_zhang",  name: "반장", faction: "sun", province: "jiaozhou", leadership: 72, war: 86, intel: 45, politics: 35, charm: 55, specialty: "duelist", bio: "형주 전투에서 활약한 동오의 맹장." },
  { id: "g_xu_sheng",   name: "서성", faction: "sun", province: "yangzhou", leadership: 78, war: 84, intel: 60, politics: 50, charm: 62, specialty: "fireattk", bio: "위나라의 침공을 여러 차례 막아낸 명장." },
  { id: "g_ding_feng",  name: "정봉", faction: "sun", province: "jiaozhou", leadership: 76, war: 88, intel: 55, politics: 45, charm: 60, specialty: "charge", bio: "동오 말기까지 오래 활약한 노장." },
  { id: "g_zhou_tai",   name: "주태", faction: "sun", province: "yangzhou", leadership: 74, war: 89, intel: 45, politics: 35, charm: 64, specialty: "duelist", bio: "손권을 위기에서 여러 차례 구한 맹장." },
  { id: "g_han_dang",   name: "한당", faction: "sun", province: "jiaozhou", leadership: 72, war: 82, intel: 50, politics: 40, charm: 58, specialty: "archery", bio: "손씨 삼대를 섬긴 원로 장수." },
  { id: "g_jiang_qin",  name: "장흠", faction: "sun", province: "yangzhou", leadership: 70, war: 80, intel: 52, politics: 42, charm: 60, specialty: "navalcmd", bio: "동오의 여러 전투에서 활약한 장수." },
  { id: "g_ling_tong",  name: "능통", faction: "sun", province: "jiaozhou", leadership: 75, war: 90, intel: 48, politics: 38, charm: 65, specialty: "duelist", bio: "손권을 구하다 크게 다쳤던 맹장." },
  { id: "g_chen_wu",    name: "진무", faction: "sun", province: "yangzhou", leadership: 73, war: 85, intel: 46, politics: 36, charm: 60, specialty: "charge", bio: "동오 초기의 용맹한 장수." },
  { id: "g_yu_fan",     name: "우번", faction: "sun", province: "jiaozhou", leadership: 58, war: 25, intel: 86, politics: 75, charm: 62, specialty: "oratory", bio: "직언을 서슴지 않은 동오의 문신." },
  { id: "g_quan_zong",  name: "전종", faction: "sun", province: "yangzhou", leadership: 74, war: 78, intel: 62, politics: 55, charm: 60, specialty: "siege", bio: "동오 후기를 지탱한 명장." },
  { id: "g_zhu_huan",   name: "주환", faction: "sun", province: "jiaozhou", leadership: 76, war: 80, intel: 65, politics: 50, charm: 62, specialty: "siege", bio: "위나라의 대군을 막아낸 동오의 장수." },
  { id: "g_hu_zong",    name: "호종", faction: "sun", province: "yangzhou", leadership: 60, war: 30, intel: 78, politics: 70, charm: 58, specialty: "logistics", bio: "손권을 보좌한 문신." },
  { id: "g_yang_dao",   name: "양도", faction: "sun", province: "jiaozhou", leadership: 55, war: 45, intel: 65, politics: 60, charm: 55, specialty: "commerce", bio: "동오의 여러 임무를 수행한 장수." },

  // 원가 및 북방 세력 추가 (15)
  { id: "g_xun_chen",   name: "순심", faction: "yuan", province: "jizhou",  leadership: 62, war: 25, intel: 80, politics: 75, charm: 65, specialty: "oratory", bio: "원소 진영의 책사로, 순욱의 친족이었다." },
  { id: "g_guo_tu",     name: "곽도", faction: "yuan", province: "jizhou",  leadership: 58, war: 30, intel: 75, politics: 68, charm: 55, specialty: "commerce", bio: "원소 진영의 책사였으나 판단이 자주 어긋났다." },
  { id: "g_gao_gan",    name: "고간", faction: "yuan", province: "bingzhou",leadership: 72, war: 78, intel: 58, politics: 50, charm: 60, specialty: "charge", bio: "원소의 조카로 병주를 다스렸다." },
  { id: "g_han_fu",     name: "한복", faction: "yuan", province: "jizhou",  leadership: 50, war: 20, intel: 55, politics: 60, charm: 50, specialty: "commerce", bio: "원래 기주를 다스리다 원소에게 자리를 내주었다." },
  { id: "g_zhang_yang", name: "장양", faction: "yuan", province: "bingzhou",leadership: 60, war: 65, intel: 50, politics: 45, charm: 55, specialty: "logistics", bio: "병주 일대에서 활동한 군벌." },
  { id: "g_zhang_yan",  name: "장연", faction: "yuan", province: "bingzhou",leadership: 68, war: 75, intel: 45, politics: 35, charm: 52, specialty: "charge", bio: "흑산적을 이끌던 우두머리." },
  { id: "g_gongsun_kang",name:"공손강", faction: "yuan", province: "youzhou", leadership: 65, war: 62, intel: 55, politics: 50, charm: 52, specialty: "navalcmd", bio: "공손도의 아들로 요동을 이어받았다." },
  { id: "g_tian_kai",   name: "전해", faction: "yuan", province: "youzhou", leadership: 60, war: 68, intel: 42, politics: 35, charm: 48, specialty: "archery", bio: "청주 일대에서 활동한 장수." },
  { id: "g_yuan_tan",   name: "원담", faction: "yuan", province: "jizhou",  leadership: 65, war: 60, intel: 50, politics: 48, charm: 58, specialty: "charge", bio: "원소의 장남으로 후계 다툼을 벌였다." },
  { id: "g_yuan_shang", name: "원상", faction: "yuan", province: "jizhou",  leadership: 62, war: 58, intel: 48, politics: 45, charm: 60, specialty: "duelist", bio: "원소의 막내아들로 아버지의 총애를 받았다." },
  { id: "g_yuan_xi",    name: "원희", faction: "yuan", province: "youzhou", leadership: 55, war: 50, intel: 45, politics: 42, charm: 52, specialty: "logistics", bio: "원소의 차남." },
  { id: "g_ma_yan",     name: "마연", faction: "yuan", province: "bingzhou",leadership: 55, war: 60, intel: 40, politics: 35, charm: 45, specialty: "archery", bio: "원가 진영의 장수." },
  { id: "g_zhang_yi2",  name: "장기", faction: "yuan", province: "jizhou",  leadership: 52, war: 58, intel: 38, politics: 32, charm: 45, specialty: "archery", bio: "원가 진영의 장수." },
  { id: "g_jiao_chu",   name: "초촉", faction: "yuan", province: "youzhou", leadership: 50, war: 55, intel: 35, politics: 30, charm: 42, specialty: "charge", bio: "원가 진영의 장수." },
  { id: "g_lv_xiang",   name: "여상", faction: "yuan", province: "bingzhou",leadership: 54, war: 57, intel: 40, politics: 34, charm: 46, specialty: "charge", bio: "원가 진영의 장수." },

  // 기타 재야 군웅 추가 (20)
  { id: "g_liu_yao",    name: "유요", faction: "neutral", province: "xuzhou",   leadership: 62, war: 45, intel: 60, politics: 65, charm: 68, specialty: "oratory", bio: "강동 일대를 다스리다 손책에게 패한 군주." },
  { id: "g_yan_baihu",  name: "엄백호", faction: "neutral", province: "qingzhou", leadership: 58, war: 65, intel: 40, politics: 35, charm: 48, specialty: "charge", bio: "강동 일대의 군소 세력을 이끌었다." },
  { id: "g_xue_li",     name: "설례", faction: "neutral", province: "xuzhou",   leadership: 50, war: 55, intel: 38, politics: 32, charm: 42, specialty: "archery", bio: "서주 일대의 군소 세력을 이끌었다." },
  { id: "g_zuo_rong",   name: "착융", faction: "neutral", province: "yongzhou", leadership: 48, war: 50, intel: 42, politics: 38, charm: 40, specialty: "commerce", bio: "종교를 명분으로 세력을 키웠던 인물." },
  { id: "g_chen_deng",  name: "진등", faction: "neutral", province: "xuzhou",   leadership: 68, war: 40, intel: 82, politics: 78, charm: 70, specialty: "oratory", bio: "서주의 명사로 여러 세력 사이를 오갔다." },
  { id: "g_chen_gui",   name: "진규", faction: "neutral", province: "xuzhou",   leadership: 60, war: 25, intel: 72, politics: 75, charm: 65, specialty: "commerce", bio: "진등의 아버지로 서주의 명망가였다." },
  { id: "g_zhang_xiu",  name: "장수", faction: "neutral", province: "liangzhou",leadership: 70, war: 78, intel: 55, politics: 45, charm: 55, specialty: "charge", bio: "완성을 근거지로 조조에게 맞섰다가 훗날 귀순했다." },
  { id: "g_kong_rong",  name: "공융", faction: "neutral", province: "qingzhou", leadership: 55, war: 20, intel: 78, politics: 70, charm: 82, specialty: "oratory", bio: "강직한 언행으로 이름난 후한의 명사." },
  { id: "g_yuan_yi",    name: "원유", faction: "neutral", province: "qingzhou", leadership: 50, war: 40, intel: 55, politics: 50, charm: 48, specialty: "logistics", bio: "원씨 일족의 인물." },
  { id: "g_qiao_mao",   name: "교모", faction: "neutral", province: "sili",     leadership: 52, war: 45, intel: 50, politics: 48, charm: 50, specialty: "commerce", bio: "반동탁 연합에 참여했던 자사." },
  { id: "g_liu_dai",    name: "유대", faction: "neutral", province: "qingzhou", leadership: 55, war: 48, intel: 52, politics: 50, charm: 52, specialty: "logistics", bio: "청주를 다스리던 자사." },
  { id: "g_wang_kuang", name: "왕광", faction: "neutral", province: "sili",     leadership: 53, war: 55, intel: 45, politics: 40, charm: 46, specialty: "charge", bio: "반동탁 연합에 참여했던 태수." },
  { id: "g_bao_xin",    name: "포신", faction: "neutral", province: "qingzhou", leadership: 62, war: 60, intel: 58, politics: 50, charm: 58, specialty: "duelist", bio: "반동탁 연합에서 조조를 도운 의인." },
  { id: "g_zhang_miao", name: "장막", faction: "neutral", province: "yongzhou", leadership: 58, war: 42, intel: 60, politics: 55, charm: 60, specialty: "oratory", bio: "조조와 오랜 친분이 있었으나 훗날 등을 돌렸다." },
  { id: "g_zhang_chao", name: "장초", faction: "neutral", province: "yongzhou", leadership: 54, war: 58, intel: 45, politics: 38, charm: 48, specialty: "archery", bio: "장막의 동생." },
  { id: "g_yuan_shu",   name: "원술", faction: "neutral", province: "xuzhou",   leadership: 60, war: 50, intel: 48, politics: 55, charm: 62, specialty: "commerce", bio: "원소의 이복동생으로 회남에서 세력을 떨쳤다." },
  { id: "g_ji_ling",    name: "기령", faction: "neutral", province: "xuzhou",   leadership: 65, war: 82, intel: 42, politics: 32, charm: 50, specialty: "duelist", bio: "원술 휘하의 맹장." },
  { id: "g_lei_bo",     name: "뇌박", faction: "neutral", province: "liangzhou",leadership: 50, war: 62, intel: 35, politics: 30, charm: 40, specialty: "charge", bio: "군소 세력의 장수." },
  { id: "g_chen_lan",   name: "진란", faction: "neutral", province: "liangzhou",leadership: 48, war: 60, intel: 33, politics: 28, charm: 38, specialty: "archery", bio: "군소 세력의 장수." },
  { id: "g_sun_fen",    name: "손분", faction: "neutral", province: "sili",     leadership: 56, war: 50, intel: 55, politics: 52, charm: 54, specialty: "commerce", bio: "손씨 일족의 인물." }
];

// ---- Story mode: original narrative interludes triggered by turn count ----
// All prose below is original writing for this project, not quoted from any novel/game.
const STORY_CHAPTERS = [
  {
    id: "ch1_awakening",
    title: "제1장 · 흩어진 천하",
    turn: 1,
    text: "조정의 위엄은 땅에 떨어지고, 각지의 태수와 자사들이 저마다 병사를 길러 스스로를 지키기 시작했다. 백성들은 어느 깃발 아래 서야 평온할지 알 수 없었다. 그대의 첫 결정이 앞으로의 민심을 가른다.",
    choices: [
      { label: "먼저 백성을 안심시킨다", desc: "즉시 얻는 것은 적지만 내정 기반이 튼튼해진다", effect: "food" },
      { label: "서둘러 군세를 갖춘다", desc: "당장 병력은 늘지만 식량이 줄어든다", effect: "troops" }
    ]
  },
  {
    id: "ch2_neighbors",
    title: "제2장 · 이웃의 그림자",
    turn: 5,
    text: "인접한 고을들의 동향이 심상치 않다. 어떤 세력은 벌써 이웃을 집어삼키며 세를 불리고 있다는 소식이 들려온다. 참모들은 지금이 힘을 기를 때인지, 나설 때인지를 놓고 갑론을박한다.",
    choices: [
      { label: "내실을 다지며 때를 기다린다", desc: "모든 영지의 금과 식량이 소폭 늘어난다", effect: "gold" },
      { label: "정찰대를 늘려 정세를 살핀다", desc: "병력이 소폭 늘고 사건 기록에 주변 세력 동향이 표시된다", effect: "troops" }
    ]
  },
  {
    id: "ch3_famine",
    title: "제3장 · 마른 들녘",
    turn: 10,
    text: "가뭄이 들어 곳곳에서 굶주림을 호소하는 목소리가 커진다. 곳간을 열어 백성을 구제할 것인가, 훗날의 전쟁을 위해 비축분을 지킬 것인가.",
    choices: [
      { label: "곳간을 열어 구제한다", desc: "식량이 크게 줄지만 인구와 민심이 오른다", effect: "pop" },
      { label: "비축분을 지킨다", desc: "식량은 그대로지만 얻는 것은 없다", effect: "none" }
    ]
  },
  {
    id: "ch4_envoy",
    title: "제4장 · 사신의 방문",
    turn: 15,
    text: "낯선 사신이 찾아와 동맹을 제안한다. 그의 말이 진심인지, 시간을 벌기 위한 술수인지는 알 수 없다. 다만 지금 손을 잡으면 당장의 위협 하나는 줄어들 것이다.",
    choices: [
      { label: "동맹을 받아들인다", desc: "금을 소모하지만 병력 손실 없이 위기를 넘긴다", effect: "gold" },
      { label: "정중히 거절한다", desc: "아무 변화도 없지만 훗날의 빚도 없다", effect: "none" }
    ]
  },
  {
    id: "ch5_veteran",
    title: "제5장 · 노장의 진언",
    turn: 20,
    text: "오랜 세월 전장을 누빈 노장이 찾아와 진언한다. '이제는 결단을 내려야 할 때입니다.' 그의 눈빛에는 오랜 전란에 지친 기색이 역력하다.",
    choices: [
      { label: "전군을 정비해 대비한다", desc: "모든 영지의 병력이 크게 늘어난다", effect: "troops" },
      { label: "백성의 삶을 먼저 돌본다", desc: "모든 영지의 식량과 금이 늘어난다", effect: "gold" }
    ]
  }
];
