'use strict';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d', { alpha: false });
const overlay = document.querySelector('#overlay');
const welcomeScreen = document.querySelector('#welcome-screen');
const selectionScreen = document.querySelector('#selection-screen');
const pauseScreen = document.querySelector('#pause-screen');
const stageScreen = document.querySelector('#stage-screen');
const resultScreen = document.querySelector('#result-screen');
const stageKicker = document.querySelector('#stage-kicker');
const stageTitle = document.querySelector('#stage-title');
const stageCopy = document.querySelector('#stage-copy');
const stageContinueButton = document.querySelector('#stage-continue');
const resultKicker = document.querySelector('#result-kicker');
const resultTitle = document.querySelector('#result-title');
const resultCopy = document.querySelector('#result-copy');
const resultScore = document.querySelector('#result-score');
const resultKeys = document.querySelector('#result-keys');
const resultTime = document.querySelector('#result-time');
const cornerLabel = document.querySelector('#corner-label');
const actionButton = document.querySelector('#action-button');
const rosterNode = document.querySelector('#roster');
const characterLabels = [document.querySelector('#character-one'), document.querySelector('#character-two')];
const musicToggle = document.querySelector('#music-toggle');
const scoreForm = document.querySelector('#score-form');
const scoreName = document.querySelector('#score-name');
const scoreFeedback = document.querySelector('#score-feedback');
const leaderboardList = document.querySelector('#leaderboard-list');
const LEADERBOARD_KEY = 'gta7-pipeline-panic-leaderboard';

const WIDTH = 960;
const HEIGHT = 540;
const FLOOR_Y = 458;
const GRAVITY = 1500;
const MAX_PLAYER_SPLIT = 720;
const roster = [
  { name: 'RICHARD 1', color: '#ff755d', trim: '#ffd56a', shirt: '#395a52', hair: '#39281d' },
  { name: 'RICHARD 2', color: '#70c8ff', trim: '#ff70b6', shirt: '#41536a', hair: '#2b2420' },
  { name: 'RICHARD 3', color: '#ff2e93', trim: '#ffa66c', shirt: '#59485f', hair: '#3b2521' }
];

const LEVELS = [
  { name: 'DISCOVERY', setting: 'OFFICE', theme: 'office', objective: 'Collect 3 documents to unlock the office exit.', collectibleLabel: 'DOCUMENTS', collectibleType: 'document', intro: 'Search the office for three project documents. Bring both Richards to the exit to move on.' },
  { name: 'ALPHA', setting: 'AZURE PIPELINE', theme: 'pipeline', objective: 'Collect 3 release keys and reach the gate together.', collectibleLabel: 'RELEASE KEYS', collectibleType: 'key', intro: 'The original pipeline run: collect release keys, dodge AGBs, and get both runners to SHIP.' },
  { name: 'PRIVATE BETA', setting: 'FOREST', theme: 'forest', objective: 'Stay outside the spotlights. Reach the forest exit.', collectibleLabel: 'STEALTH', collectibleType: null, intro: 'Stay in the shadows. Spotlights expose you, drain health, and send the swarm straight to your position.' },
  { name: 'PUBLIC BETA', setting: 'CLOUD', theme: 'cloud', objective: 'Cross the cloud test range. Jump the policy lasers.', collectibleLabel: 'POLICY LASERS', collectibleType: null, intro: 'Cross the cloud platform through the NPC crowd. Jump over active policy-team laser beams.' },
  { name: 'HLD REVIEW', setting: 'BOARDROOM', theme: 'boardroom', objective: 'Throw HLDs at the AGB. P1: F. P2: Down arrow.', collectibleLabel: 'HLD AMMO', collectibleType: null, intro: 'Final stage: throw HLDs at the giant AGB. P1 throws with F; P2 throws with Down arrow.' }
];

let world = createWorld(1);
const heldKeys = new Set();
const selectedCharacters = [0, 1];
const game = {
  state: 'intro',
  players: [],
  cameraX: 0,
  seals: 0,
  totalCollectibles: 0,
  levelIndex: 0,
  levelsCleared: 0,
  nextLevel: 1,
  projectiles: [],
  elapsed: 0,
  toast: '',
  toastColor: '#ff2e93',
    toastColor: '#ff2e93',
  toastTimer: 0,
  resultScore: 0,
  endKind: 'won',
  scoreSaved: false
};

const music = {
  enabled: true,
  audioContext: null,
  timer: null,
  step: 0,
  nextAt: 0
};

const melody = [392, 0, 523, 659, 0, 587, 440, 0, 523, 784, 0, 659, 494, 0, 587, 698];
const bassLine = [98, 0, 0, 0, 130, 0, 0, 0, 110, 0, 0, 0, 147, 0, 0, 0];

function createAlphaWorld() {
  const solids = [
    { x: 0, y: FLOOR_Y, w: 760, h: 120, type: 'ground' },
    { x: 875, y: FLOOR_Y, w: 720, h: 120, type: 'ground' },
    { x: 1715, y: FLOOR_Y, w: 710, h: 120, type: 'ground' },
    { x: 2545, y: FLOOR_Y, w: 855, h: 120, type: 'ground' }
  ];
  const platforms = [
    { x: 250, y: 388, w: 140, h: 16, type: 'platform' },
    { x: 605, y: 344, w: 145, h: 16, type: 'platform' },
    { x: 1035, y: 382, w: 160, h: 16, type: 'platform' },
    { x: 1320, y: 322, w: 145, h: 16, type: 'platform' },
    { x: 1840, y: 388, w: 150, h: 16, type: 'platform' },
    { x: 2215, y: 338, w: 150, h: 16, type: 'platform' },
    { x: 2805, y: 383, w: 155, h: 16, type: 'platform' }
  ];
  solids.push(...platforms);

  const pipes = [
    { x: 430, w: 58, h: 66 },
    { x: 1075, w: 62, h: 90 },
    { x: 1442, w: 58, h: 73 },
    { x: 2015, w: 64, h: 82 },
    { x: 2988, w: 66, h: 94 }
  ];
  for (const pipe of pipes) {
    solids.push({ x: pipe.x, y: FLOOR_Y - pipe.h, w: pipe.w, h: pipe.h, type: 'pipe' });
    solids.push({ x: pipe.x - 8, y: FLOOR_Y - pipe.h, w: pipe.w + 16, h: 12, type: 'pipe-cap' });
  }

  return {
    levelIndex: 1,
    theme: 'pipeline',
    width: 3400,
    solids,
    pipes,
    checkpoints: [920, 1750, 2580],
    seals: [
      { x: 560, y: 348, collected: false },
      { x: 1450, y: 282, collected: false },
      { x: 2290, y: 298, collected: false }
    ],
    collectibleType: 'key',
    collectibleLabel: 'RELEASE KEYS',
    sealsRequired: 3,
    items: [
      { x: 335, y: 342, type: 'macbook', active: true },
      { x: 1235, y: 330, type: 'vm', active: true },
      { x: 1905, y: 336, type: 'ai', active: true },
      { x: 2810, y: 330, type: 'macbook', active: true }
    ],
    enemies: [
      { type: 'agb', x: 625, y: FLOOR_Y - 34, minX: 515, maxX: 735, speed: 48, alive: true },
      { type: 'agb', x: 1275, y: FLOOR_Y - 34, minX: 1160, maxX: 1535, speed: 54, alive: true },
      { type: 'agb', x: 2180, y: FLOOR_Y - 34, minX: 1960, maxX: 2385, speed: 62, alive: true },
      { type: 'agb', x: 2780, y: FLOOR_Y - 34, minX: 2630, maxX: 2940, speed: 58, alive: true }
    ],
    spotlights: [],
    lasers: [],
    boss: null,
    furniture: [],
    exitX: 3220
  };
}

function createWorld(levelIndex) {
  if (levelIndex === 1) return createAlphaWorld();

  const stage = LEVELS[levelIndex];
  const width = levelIndex === 0 ? 2150 : levelIndex === 2 ? 2600 : levelIndex === 3 ? 2800 : 1850;
  const groundSpans = levelIndex === 0
    ? [[0, 680], [800, 1390], [1505, width]]
    : levelIndex === 2
      ? [[0, 650], [770, 1500], [1630, width]]
      : levelIndex === 3
        ? [[0, 720], [850, 1560], [1690, 2350], [2480, width]]
        : [[0, width]];
  const solids = groundSpans.map(([start, end]) => ({ x: start, y: FLOOR_Y, w: end - start, h: 120, type: 'ground' }));
  const platformSets = {
    0: [[240, 392, 150], [500, 350, 130], [900, 380, 150], [1200, 330, 150], [1600, 375, 155]],
    2: [[250, 380, 135], [835, 348, 140], [1180, 395, 145], [1780, 350, 155], [2160, 385, 145]],
    3: [[300, 385, 145], [1010, 345, 150], [1360, 390, 150], [1900, 350, 155], [2570, 385, 150]],
    4: [[600, 390, 320]]
  }[levelIndex];
  solids.push(...platformSets.map(([x, y, w]) => ({ x, y, w, h: 16, type: 'platform' })));

  const seals = levelIndex === 0
    ? [{ x: 430, y: 423, collected: false }, { x: 1000, y: 423, collected: false }, { x: 1570, y: 423, collected: false }]
    : [];
  const items = levelIndex === 0
    ? [{ x: 540, y: 342, type: 'macbook', active: true }]
    : levelIndex === 2
      ? [{ x: 880, y: 300, type: 'ai', active: true }, { x: 1920, y: 335, type: 'macbook', active: true }]
      : levelIndex === 3
        ? [{ x: 1120, y: 300, type: 'ai', active: true }]
        : [];
  const enemies = levelIndex === 2
    ? [
      { type: 'swarm', behavior: 'hunt', x: 520, y: FLOOR_Y - 34, speed: 68, alive: true },
      { type: 'swarm', behavior: 'hunt', x: 1100, y: FLOOR_Y - 34, speed: 76, alive: true },
      { type: 'swarm', behavior: 'hunt', x: 1830, y: FLOOR_Y - 34, speed: 82, alive: true },
      { type: 'swarm', behavior: 'hunt', x: 2320, y: FLOOR_Y - 34, speed: 72, alive: true }
    ]
    : levelIndex === 3
      ? [
        { type: 'npc', behavior: 'patrol', x: 520, y: FLOOR_Y - 42, minX: 390, maxX: 690, speed: 42, alive: true },
        { type: 'npc', behavior: 'patrol', x: 1040, y: FLOOR_Y - 42, minX: 920, maxX: 1430, speed: 48, alive: true },
        { type: 'npc', behavior: 'patrol', x: 1830, y: FLOOR_Y - 42, minX: 1740, maxX: 2310, speed: 55, alive: true },
        { type: 'npc', behavior: 'patrol', x: 2530, y: FLOOR_Y - 42, minX: 2490, maxX: 2730, speed: 45, alive: true }
      ]
      : [];

  return {
    levelIndex,
    theme: stage.theme,
    width,
    solids,
    pipes: [],
    checkpoints: levelIndex === 0 ? [800, 1505] : levelIndex === 2 ? [770, 1630] : levelIndex === 3 ? [850, 1690] : [],
    seals,
    collectibleType: stage.collectibleType,
    collectibleLabel: stage.collectibleLabel,
    sealsRequired: seals.length,
    items,
    enemies,
    spotlights: levelIndex === 2
      ? [{ x: 510, y: 48, phase: 0 }, { x: 1350, y: 48, phase: 2.2 }, { x: 2150, y: 48, phase: 4.1 }]
      : [],
    lasers: levelIndex === 3
      ? [{ x: 635, y: FLOOR_Y - 12, w: 60, h: 12, phase: 0 }, { x: 1240, y: FLOOR_Y - 12, w: 64, h: 12, phase: 1.2 }, { x: 2030, y: FLOOR_Y - 12, w: 62, h: 12, phase: 2.1 }, { x: 2630, y: FLOOR_Y - 12, w: 58, h: 12, phase: 0.6 }]
      : [],
    boss: levelIndex === 4 ? { x: 1390, y: FLOOR_Y - 172, w: 126, h: 150, hp: 8, maxHp: 8 } : null,
    furniture: levelIndex === 0
      ? [{ x: 670, y: FLOOR_Y - 54, w: 90, h: 54, label: 'DESK' }, { x: 1320, y: FLOOR_Y - 48, w: 110, h: 48, label: 'FILES' }]
      : levelIndex === 4
        ? [{ x: 590, y: FLOOR_Y - 52, w: 330, h: 52, label: 'BOARDROOM TABLE' }]
        : [],
    exitX: levelIndex === 4 ? null : width - 150
  };
}

function makePlayer(slot, characterIndex) {
  return {
    slot,
    characterIndex,
    x: 100 + slot * 62,
    y: FLOOR_Y - 46,
    w: 30,
    h: 46,
    vx: 0,
    vy: 0,
    grounded: true,
    facing: 1,
    lives: 3,
    health: 100,
    spotlighted: false,
    invulnerable: 0,
    slowTimer: 0,
    boostTimer: 0,
    flightTimer: 0,
    hldAmmo: 10,
    throwCooldown: 0,
    checkpoint: 80,
    jumpWasDown: false
  };
}

function syncRosterLabels() {
  characterLabels.forEach((label, index) => {
    label.textContent = roster[selectedCharacters[index]].name;
  });
}

function setOverlay(mode) {
  if (mode === 'hidden') {
    overlay.classList.add('is-hidden');
    return;
  }

  overlay.classList.remove('is-hidden');
  welcomeScreen.hidden = mode !== 'intro';
  selectionScreen.hidden = mode !== 'selection';
  pauseScreen.hidden = mode !== 'paused';
  stageScreen.hidden = mode !== 'stage-clear';
  resultScreen.hidden = mode !== 'ended';

  if (mode === 'stage-clear') {
    const nextStage = LEVELS[game.nextLevel];
    stageKicker.textContent = `NEXT STAGE / 0${game.nextLevel + 1}`;
    stageTitle.innerHTML = `${nextStage.name}<br><span>${nextStage.setting}</span>`;
    stageCopy.textContent = nextStage.intro;
    stageContinueButton.textContent = `ENTER ${nextStage.name}`;
  } else if (mode === 'ended') {
    const won = game.endKind === 'won';
    resultKicker.textContent = won ? 'DEPLOYMENT COMPLETE' : 'BUILD FAILED';
    resultTitle.innerHTML = won ? 'BUILD<br><span>SHIPPED</span>' : 'PIPELINE<br><span>DOWN</span>';
    resultCopy.textContent = won
      ? 'Both runners made it through all five stages. Post your score, then run it back.'
      : `The build ended in ${LEVELS[game.levelIndex].name}. Post this run or retry.`;
    resultScore.textContent = game.resultScore.toLocaleString();
    resultKeys.textContent = `${game.levelsCleared} / ${LEVELS.length}`;
    resultTime.textContent = formatTime(game.elapsed);
    scoreForm.hidden = game.scoreSaved;
    scoreFeedback.hidden = !game.scoreSaved;
    scoreFeedback.textContent = game.scoreSaved ? 'Score saved in this browser.' : '';
    renderLeaderboard();
  }
}

function cycleCharacter(playerIndex, step) {
  selectedCharacters[playerIndex] = (selectedCharacters[playerIndex] + step + roster.length) % roster.length;
  syncRosterLabels();
}

function startRun() {
  game.players = [makePlayer(0, selectedCharacters[0]), makePlayer(1, selectedCharacters[1])];
  game.totalCollectibles = 0;
  game.levelsCleared = 0;
  game.projectiles = [];
  game.elapsed = 0;
  game.toast = '';
  game.toastTimer = 0;
  game.resultScore = 0;
  game.scoreSaved = false;
  loadStage(0);
  game.state = 'playing';
  heldKeys.clear();
  setOverlay('hidden');
  startMusic();
}

function loadStage(levelIndex) {
  world = createWorld(levelIndex);
  game.levelIndex = levelIndex;
  game.seals = 0;
  game.cameraX = 0;
  game.projectiles = [];
  world.seals.forEach((seal) => { seal.collected = false; });
  world.items.forEach((item) => { item.active = true; });
  world.enemies.forEach((enemy) => { enemy.alive = true; });
  world.lasers.forEach((laser) => { laser.timer = laser.phase; });
  for (const player of game.players) {
    player.x = 110 + player.slot * 62;
    player.y = FLOOR_Y - player.h;
    player.vx = 0;
    player.vy = 0;
    player.grounded = true;
    player.facing = 1;
    player.health = 100;
    player.spotlighted = false;
    player.checkpoint = 80;
    player.hldAmmo = 10;
    player.throwCooldown = 0;
    player.invulnerable = 0;
    player.slowTimer = 0;
    player.boostTimer = 0;
    player.flightTimer = 0;
  }
  cornerLabel.innerHTML = `LEVEL 0${levelIndex + 1} <span>/</span> ${LEVELS[levelIndex].name}`;
}

function continueStage() {
  loadStage(game.nextLevel);
  game.state = 'playing';
  setOverlay('hidden');
  startMusic();
}

function clearStage() {
  game.levelsCleared = Math.max(game.levelsCleared, game.levelIndex + 1);
  if (game.levelIndex === LEVELS.length - 1) {
    finishRun(true);
    return;
  }
  game.nextLevel = game.levelIndex + 1;
  game.state = 'stage-clear';
  heldKeys.clear();
  stopMusic();
  setOverlay('stage-clear');
}

function finishRun(won) {
  game.state = 'ended';
  game.endKind = won ? 'won' : 'failed';
  game.scoreSaved = false;
  const remainingLives = game.players.reduce((total, player) => total + Math.max(0, player.lives), 0);
  const timeBonus = won ? Math.max(0, 3600 - Math.floor(game.elapsed)) : 0;
  game.resultScore = game.totalCollectibles * 1000 + game.levelsCleared * 500 + remainingLives * 250 + timeBonus;
  heldKeys.clear();
  stopMusic();
  setOverlay('ended');
}

function togglePause() {
  if (game.state === 'playing') {
    game.state = 'paused';
    heldKeys.clear();
    stopMusic();
    setOverlay('paused');
  } else if (game.state === 'paused') {
    game.state = 'playing';
    setOverlay('hidden');
    startMusic();
  }
}

function readLeaderboard() {
  try {
    const records = JSON.parse(window.localStorage.getItem(LEADERBOARD_KEY) || '[]');
    if (!Array.isArray(records)) return [];
    return records
      .filter((record) => record && typeof record.name === 'string' && Number.isFinite(record.score))
      .sort((first, second) => second.score - first.score || first.time - second.time)
      .slice(0, 5);
  } catch {
    return [];
  }
}

function renderLeaderboard() {
  leaderboardList.replaceChildren();
  const records = readLeaderboard();
  if (records.length === 0) {
    const emptyRow = document.createElement('li');
    emptyRow.className = 'leaderboard-empty';
    emptyRow.textContent = 'No runs posted yet. Set the first score.';
    leaderboardList.append(emptyRow);
    return;
  }

  records.forEach((record, index) => {
    const row = document.createElement('li');
    const rank = document.createElement('span');
    const name = document.createElement('span');
    const score = document.createElement('span');
    rank.className = 'leaderboard-rank';
    name.className = 'leaderboard-name';
    score.className = 'leaderboard-score';
    rank.textContent = String(index + 1).padStart(2, '0');
    name.textContent = record.name;
    score.textContent = Number(record.score).toLocaleString();
    row.append(rank, name, score);
    leaderboardList.append(row);
  });
}

function saveScore(event) {
  event.preventDefault();
  if (game.state !== 'ended' || game.scoreSaved) return;
  const name = scoreName.value.trim().replace(/\s+/g, ' ').slice(0, 18);
  if (!name) {
    scoreName.focus();
    return;
  }

  const records = readLeaderboard();
  records.push({ name, score: game.resultScore, time: Math.floor(game.elapsed) });
  records.sort((first, second) => second.score - first.score || first.time - second.time);
  try {
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(records.slice(0, 5)));
  } catch {
    scoreFeedback.hidden = false;
    scoreFeedback.textContent = 'This browser could not save the score.';
    return;
  }

  game.scoreSaved = true;
  setOverlay('ended');
}

function formatTime(seconds) {
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function updateMusicButton() {
  musicToggle.textContent = music.enabled ? 'MUSIC ON' : 'MUSIC OFF';
  musicToggle.setAttribute('aria-pressed', String(music.enabled));
}

function playTone(frequency, startAt, duration, waveform, volume) {
  if (!music.audioContext || frequency <= 0) return;
  const oscillator = music.audioContext.createOscillator();
  const envelope = music.audioContext.createGain();
  oscillator.type = waveform;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  envelope.gain.setValueAtTime(0.0001, startAt);
  envelope.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(envelope);
  envelope.connect(music.audioContext.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function scheduleMusic() {
  if (!music.audioContext || music.audioContext.state !== 'running') return;
  const stepDuration = 60 / 172 / 2;
  while (music.nextAt < music.audioContext.currentTime + 0.18) {
    const step = music.step % melody.length;
    playTone(melody[step], music.nextAt, stepDuration * 0.72, 'triangle', 0.055);
    playTone(bassLine[step], music.nextAt, stepDuration * 0.8, 'square', 0.026);
    music.nextAt += stepDuration;
    music.step += 1;
  }
}

function startMusic() {
  if (!music.enabled || game.state !== 'playing') return;
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) {
    music.enabled = false;
    updateMusicButton();
    return;
  }
  if (!music.audioContext) music.audioContext = new AudioContextType();
  music.audioContext.resume().catch(() => {});
  if (music.timer !== null) return;
  music.nextAt = music.audioContext.currentTime + 0.05;
  music.timer = window.setInterval(scheduleMusic, 25);
}

function stopMusic() {
  if (music.timer !== null) {
    window.clearInterval(music.timer);
    music.timer = null;
  }
}

function toggleMusic() {
  music.enabled = !music.enabled;
  updateMusicButton();
  if (music.enabled) startMusic();
  else stopMusic();
}

document.querySelector('#choose-button').addEventListener('click', () => {
  game.state = 'selection';
  setOverlay('selection');
});

actionButton.addEventListener('click', () => {
  startRun();
});

document.querySelector('#resume-button').addEventListener('click', togglePause);
stageContinueButton.addEventListener('click', continueStage);
document.querySelector('#retry-button').addEventListener('click', startRun);
musicToggle.addEventListener('click', toggleMusic);
scoreForm.addEventListener('submit', saveScore);

document.querySelectorAll('.cycle-button').forEach((button) => {
  button.addEventListener('click', () => {
    cycleCharacter(Number(button.dataset.player), Number(button.dataset.step));
  });
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
  if (!typing && (key.startsWith('arrow') || key === ' ')) event.preventDefault();
  if (event.repeat) return;
  if (typing && key !== 'enter' && key !== 'escape') return;

  if (game.state === 'selection') {
    if (key === 'q') cycleCharacter(0, -1);
    if (key === 'e') cycleCharacter(0, 1);
    if (key === ',') cycleCharacter(1, -1);
    if (key === '.') cycleCharacter(1, 1);
  }

  if (key === 'm') {
    toggleMusic();
    return;
  }

  if (key === 'enter') {
    if (game.state === 'intro') {
      game.state = 'selection';
      setOverlay('selection');
    } else if (game.state === 'selection') {
      startRun();
    } else if (game.state === 'paused') {
      togglePause();
    } else if (game.state === 'stage-clear') {
      continueStage();
    }
    return;
  }

  if (key === 'p' || key === 'escape') {
    togglePause();
    return;
  }

  if (key === 'r' && game.state === 'playing') {
    startRun();
    return;
  }

  heldKeys.add(key);
});

window.addEventListener('keyup', (event) => heldKeys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => heldKeys.clear());

function update(dt) {
  game.elapsed += dt;
  if (game.toastTimer > 0) game.toastTimer -= dt;

  for (const enemy of world.enemies) {
    if (!enemy.alive) continue;
    enemy.x += enemy.speed * dt;
    if (enemy.x < enemy.minX || enemy.x + 36 > enemy.maxX) {
      enemy.speed *= -1;
      enemy.x = Math.max(enemy.minX, Math.min(enemy.x, enemy.maxX - 36));
    }
  }

  for (const player of game.players) {
    updatePlayer(player, dt);
    collectForPlayer(player);
    checkEnemies(player);
    if (player.y > HEIGHT + 90) damagePlayer(player, 'FELL OFF THE PIPELINE');
    if (game.state !== 'playing') break;
  }

  keepPlayersTogether();
  const midpoint = (game.players[0].x + game.players[1].x) / 2 + 15;
  const cameraTarget = Math.max(0, Math.min(world.width - WIDTH, midpoint - WIDTH * 0.48));
  game.cameraX += (cameraTarget - game.cameraX) * Math.min(1, dt * 5);

  if (game.state === 'playing' && game.seals === 3 && game.players.every((player) => player.x >= world.exitX)) {
    finishRun(true);
  }
}

function updatePlayer(player, dt) {
  const leftKey = player.slot === 0 ? 'a' : 'arrowleft';
  const rightKey = player.slot === 0 ? 'd' : 'arrowright';
  const jumpKey = player.slot === 0 ? 'w' : 'arrowup';
  const left = heldKeys.has(leftKey);
  const right = heldKeys.has(rightKey);
  const jumpDown = heldKeys.has(jumpKey);
  const direction = Number(right) - Number(left);
  const baseSpeed = 220;
  const speed = baseSpeed * (player.slowTimer > 0 ? 0.58 : 1) * (player.boostTimer > 0 ? 1.55 : 1);

  player.vx = direction * speed;
  if (direction !== 0) player.facing = direction;
  if (jumpDown && !player.jumpWasDown && player.grounded) {
    player.vy = -590;
    player.grounded = false;
  }
  if (player.flightTimer > 0 && jumpDown && !player.grounded) {
    player.vy = -205;
  } else {
    player.vy = Math.min(850, player.vy + GRAVITY * (player.flightTimer > 0 ? 0.48 : 1) * dt);
  }
  player.jumpWasDown = jumpDown;
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.slowTimer = Math.max(0, player.slowTimer - dt);
  player.boostTimer = Math.max(0, player.boostTimer - dt);
  player.flightTimer = Math.max(0, player.flightTimer - dt);

  player.x += player.vx * dt;
  for (const solid of world.solids) {
    if (!overlaps(player, solid)) continue;
    if (player.vx > 0) player.x = solid.x - player.w;
    else if (player.vx < 0) player.x = solid.x + solid.w;
  }
  player.x = Math.max(0, Math.min(world.width - player.w, player.x));

  const previousBottom = player.y + player.h;
  player.y += player.vy * dt;
  player.grounded = false;
  for (const solid of world.solids) {
    if (!overlaps(player, solid)) continue;
    if (player.vy > 0 && previousBottom <= solid.y + 10) {
      player.y = solid.y - player.h;
      player.vy = 0;
      player.grounded = true;
    } else if (player.vy < 0) {
      player.y = solid.y + solid.h;
      player.vy = 0;
    }
  }

  for (const checkpoint of world.checkpoints) {
    if (player.x >= checkpoint && player.checkpoint < checkpoint) {
      player.checkpoint = checkpoint + 22;
      showToast(`CHECKPOINT / R${player.slot + 1}`);
    }
  }
}

function keepPlayersTogether() {
  const [first, second] = game.players;
  if (first.x < second.x - MAX_PLAYER_SPLIT && first.vx < 0) first.vx = 0;
  if (second.x < first.x - MAX_PLAYER_SPLIT && second.vx < 0) second.vx = 0;
  if (first.x > second.x + MAX_PLAYER_SPLIT && first.vx > 0) first.vx = 0;
  if (second.x > first.x + MAX_PLAYER_SPLIT && second.vx > 0) second.vx = 0;
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function collectForPlayer(player) {
  for (const seal of world.seals) {
    if (seal.collected) continue;
    const pickup = { x: seal.x - 12, y: seal.y - 14, w: 24, h: 28 };
    if (!overlaps(player, pickup)) continue;
    seal.collected = true;
    game.seals += 1;
    showToast(`RELEASE KEY ${game.seals} / 3`);
  }

  for (const item of world.items) {
    if (!item.active) continue;
    const pickup = { x: item.x - 17, y: item.y - 18, w: 34, h: 36 };
    if (!overlaps(player, pickup)) continue;
    item.active = false;
    if (item.type === 'vm') {
      player.slowTimer = 4.5;
      showToast('POWER APPS / VM SLOW FOR 4.5 SECONDS', '#ff9a68');
    } else if (item.type === 'macbook') {
      player.boostTimer = 6;
      showToast('MACBOOK / SPEED BOOST FOR 6 SECONDS', '#70c8ff');
    } else {
      player.flightTimer = 6;
      showToast('AI FLIGHT FOR 6 SECONDS / HOLD JUMP TO FLY', '#ff2e93');
    }
  }
}

function checkEnemies(player) {
  for (const enemy of world.enemies) {
    if (!enemy.alive) continue;
    const bird = { x: enemy.x, y: enemy.y, w: 36, h: 30 };
    if (!overlaps(player, bird)) continue;
    if (player.vy > 70 && player.y + player.h - 14 < enemy.y + 9) {
      enemy.alive = false;
      player.vy = -390;
      player.grounded = false;
      showToast('AGB DOWN / NICE STOMP');
    } else {
      damagePlayer(player, 'AGB HIT / RETRY');
    }
  }
}

function damagePlayer(player, message) {
  if (player.invulnerable > 0 || game.state !== 'playing') return;
  player.lives -= 1;
  player.x = player.checkpoint;
  player.y = FLOOR_Y - player.h;
  player.vx = 0;
  player.vy = 0;
  player.grounded = true;
  player.invulnerable = 1.7;
  player.slowTimer = 0;
  player.boostTimer = 0;
  player.flightTimer = 0;
  showToast(message, '#ff755d');
  if (player.lives <= 0) finishRun(false);
}

function showToast(message, color = '#ff2e93') {
  game.toast = message;
  game.toastColor = color;
  game.toastTimer = 2.6;
}

function draw(time) {
  drawBackdrop();
  ctx.save();
  ctx.translate(-game.cameraX, 0);
  drawWorld(time);
  ctx.restore();
  drawHud(time);
}

function drawBackdrop() {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#21151e');
  sky.addColorStop(0.65, '#291823');
  sky.addColorStop(1, '#191319');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-game.cameraX * 0.18, 0);
  for (let index = -1; index < 8; index += 1) {
    const x = index * 190 + 20;
    const height = 88 + ((index * 47 + 192) % 95);
    ctx.fillStyle = index % 2 === 0 ? '#301a29' : '#38202f';
    ctx.fillRect(x, 355 - height, 108, height);
    ctx.fillStyle = '#ed86b8';
    ctx.globalAlpha = 0.2;
    for (let row = 0; row < Math.floor(height / 22); row += 1) {
      for (let column = 0; column < 4; column += 1) {
        ctx.fillRect(x + 13 + column * 22, 370 - height + row * 22, 5, 7);
      }
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  ctx.strokeStyle = 'rgba(255, 46, 147, 0.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x < WIDTH; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
}

function drawWorld(time) {
  for (const solid of world.solids) {
    if (solid.x + solid.w < game.cameraX - 20 || solid.x > game.cameraX + WIDTH + 20) continue;
    if (solid.type === 'ground') drawGround(solid);
    else if (solid.type === 'platform') drawPlatform(solid);
    else drawPipePart(solid);
  }

  for (const checkpoint of world.checkpoints) drawCheckpoint(checkpoint);
  for (const seal of world.seals) if (!seal.collected) drawSeal(seal, time);
  for (const item of world.items) if (item.active) drawPowerup(item, time);
  for (const enemy of world.enemies) if (enemy.alive) drawBird(enemy, time);
  drawExit(time);
  for (const player of game.players) drawPlayer(player, time);
}

function drawGround(ground) {
  const fill = ctx.createLinearGradient(0, ground.y, 0, ground.y + ground.h);
  fill.addColorStop(0, '#55233c');
  fill.addColorStop(0.14, '#321b29');
  fill.addColorStop(0.14, '#321b29');
  fill.addColorStop(1, '#191319');
  ctx.fillStyle = fill;
  ctx.fillRect(ground.x, ground.y, ground.w, ground.h);
  ctx.fillStyle = '#ff2e93';
    ctx.fillStyle = '#ff2e93';
  ctx.fillRect(ground.x, ground.y, ground.w, 4);
  ctx.fillStyle = 'rgba(255, 153, 206, 0.12)';
  for (let x = ground.x + 22; x < ground.x + ground.w; x += 48) {
    ctx.fillRect(x, ground.y + 28, 18, 2);
    ctx.fillRect(x + 10, ground.y + 51, 8, 2);
  }
}

function drawPlatform(platform) {
  ctx.fillStyle = '#71304f';
    ctx.fillStyle = '#71304f';
  ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
  ctx.fillStyle = '#ff9bce';
    ctx.fillStyle = '#ff9bce';
  ctx.fillRect(platform.x, platform.y, platform.w, 3);
  ctx.fillStyle = '#52213d';
    ctx.fillStyle = '#52213d';
    ctx.fillStyle = '#ff2e93';
  ctx.fillRect(platform.x + 8, platform.y + 8, platform.w - 16, 3);
}

function drawPipePart(part) {
  if (part.type === 'pipe') {
    const pipeFill = ctx.createLinearGradient(part.x, 0, part.x + part.w, 0);
    pipeFill.addColorStop(0, '#2876b5');
    pipeFill.addColorStop(0.45, '#52b9ef');
    pipeFill.addColorStop(1, '#1d6096');
    ctx.fillStyle = pipeFill;
    ctx.fillRect(part.x, part.y, part.w, part.h);
    ctx.fillStyle = 'rgba(222, 247, 255, 0.54)';
    ctx.fillRect(part.x + 8, part.y + 12, 4, part.h - 14);
    ctx.fillStyle = 'rgba(10, 54, 91, 0.46)';
    ctx.fillRect(part.x + part.w - 10, part.y + 10, 5, part.h - 12);
    ctx.fillStyle = '#e8f4eb';
    ctx.font = '700 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('AZURE', part.x + part.w / 2 + 4, part.y + part.h / 2 + 2);
  } else {
    ctx.fillStyle = '#74d2ff';
    ctx.fillRect(part.x, part.y, part.w, part.h);
    ctx.fillStyle = '#b7ecff';
    ctx.fillRect(part.x + 4, part.y + 2, part.w - 8, 3);
    ctx.fillStyle = '#1c659a';
    ctx.fillRect(part.x + 5, part.y + part.h - 4, part.w - 10, 3);
  }
}

function drawCheckpoint(x) {
  ctx.fillStyle = '#ff2e93';
  ctx.fillRect(x, FLOOR_Y - 74, 3, 74);
  ctx.fillStyle = '#29151f';
    ctx.fillStyle = '#29151f';
  ctx.fillRect(x + 3, FLOOR_Y - 72, 52, 18);
  ctx.strokeStyle = '#ff2e93';
    ctx.strokeStyle = '#ff2e93';
  ctx.strokeRect(x + 3.5, FLOOR_Y - 71.5, 51, 17);
  ctx.fillStyle = '#edf4df';
  ctx.font = '700 8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('CHECK', x + 8, FLOOR_Y - 60);
}

function drawSeal(seal, time) {
  const bob = Math.sin(time * 4 + seal.x) * 4;
  const pulse = 1 + Math.sin(time * 5 + seal.x) * 0.08;
  ctx.save();
  ctx.translate(seal.x, seal.y + bob);
  ctx.scale(pulse, pulse);
  ctx.shadowColor = '#ffdb69';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ffd45c';
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(12, 0);
  ctx.lineTo(0, 14);
  ctx.lineTo(-12, 0);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#4d4825';
  ctx.fillRect(-3, -6, 6, 12);
  ctx.fillRect(-6, -2, 12, 4);
  ctx.restore();
}

function drawPowerup(item, time) {
  const colors = { vm: '#ff9a68', macbook: '#70c8ff', ai: '#ff2e93' };
  const labels = { vm: 'VM', macbook: 'MB', ai: 'AI' };
  const names = { vm: 'POWER APPS / SLOW', macbook: 'MACBOOK / SPEED', ai: 'AI / FLY' };
  const color = colors[item.type];
  const bob = Math.sin(time * 4 + item.x) * 3;
  ctx.save();
  ctx.translate(item.x, item.y + bob);
  ctx.shadowColor = color;
  ctx.shadowBlur = 13;
  ctx.fillStyle = '#16251b';
  ctx.fillRect(-15, -14, 30, 28);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(-15, -14, 30, 28);
  ctx.fillStyle = color;
  ctx.font = '800 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labels[item.type], 0, 0);
  ctx.fillStyle = '#e9f1e8';
  ctx.font = '700 7px monospace';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(names[item.type], 0, 27);
  ctx.restore();
}

function drawBird(enemy, time) {
  const flap = Math.sin(time * 12 + enemy.x) * 3;
  ctx.save();
  ctx.translate(enemy.x + 18, enemy.y + 15);
  ctx.scale(enemy.speed >= 0 ? 1 : -1, 1);
  ctx.fillStyle = '#ff4da6';
    ctx.fillStyle = '#ff4da6';
  ctx.beginPath();
  ctx.ellipse(0, 1, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c62873';
    ctx.fillStyle = '#c62873';
  ctx.beginPath();
  ctx.ellipse(-3, 5 + flap, 9, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff9a48';
  ctx.beginPath();
  ctx.moveTo(13, -2);
  ctx.lineTo(26, 2);
  ctx.lineTo(13, 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f6f5dc';
  ctx.beginPath();
  ctx.arc(7, -6, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#172016';
  ctx.fillRect(8, -8, 2, 5);
  ctx.strokeStyle = '#76264d';
    ctx.strokeStyle = '#76264d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(2, -13);
  ctx.lineTo(12, -11);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#f0f4e3';
  ctx.font = '800 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AGB', enemy.x + 18, enemy.y - 7);
}

function drawExit(time) {
  const x = world.exitX;
  const unlocked = game.seals >= 3;
  const glow = 0.5 + Math.sin(time * 3) * 0.15;
  ctx.fillStyle = unlocked ? `rgba(255, 46, 147, ${glow})` : 'rgba(255, 117, 93, 0.28)';
    ctx.fillStyle = unlocked ? `rgba(255, 46, 147, ${glow})` : 'rgba(255, 117, 93, 0.28)';
  ctx.fillRect(x - 5, FLOOR_Y - 93, 5, 93);
  ctx.fillRect(x + 63, FLOOR_Y - 93, 5, 93);
  ctx.fillRect(x - 5, FLOOR_Y - 93, 73, 7);
  ctx.fillStyle = unlocked ? '#3f1b30' : '#4b3832';
    ctx.fillStyle = unlocked ? '#3f1b30' : '#4b3832';
  ctx.fillRect(x + 4, FLOOR_Y - 84, 50, 84);
  ctx.fillStyle = unlocked ? '#ff2e93' : '#ff755d';
    ctx.fillStyle = unlocked ? '#ff2e93' : '#ff755d';
  ctx.fillRect(x + 12, FLOOR_Y - 74, 3, 61);
  ctx.fillStyle = '#f1f3df';
  ctx.font = '800 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(unlocked ? 'SHIP' : 'LOCKED', x + 29, FLOOR_Y - 98);
}

function drawPlayer(player, time) {
  if (player.invulnerable > 0 && Math.floor(time * 12) % 2 === 0) return;
  const character = roster[player.characterIndex];
  const centerX = player.x + player.w / 2;
  const centerY = player.y;
  ctx.save();
  ctx.globalAlpha = 0.26;
  ctx.fillStyle = '#09100c';
  ctx.beginPath();
  ctx.ellipse(centerX, player.y + player.h + 3, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(player.facing, 1);
  const effect = getPlayerEffect(player);
  if (effect) {
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 12;
    ctx.strokeRect(-15, -12, 30, 61);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  if (player.flightTimer > 0 && !player.grounded) {
    ctx.fillStyle = '#ffbd5b';
    ctx.beginPath();
    ctx.moveTo(-7, 42);
    ctx.lineTo(-2, 55 + Math.sin(time * 24) * 3);
    ctx.lineTo(4, 42);
    ctx.fill();
  }

  drawLaptop(-16, 16, '#9de3ff');
  drawLaptop(-16, 27, '#ffd56a');

  ctx.fillStyle = character.shirt;
  ctx.fillRect(-10, 18, 20, 20);
  ctx.fillStyle = character.color;
  ctx.fillRect(-11, 16, 22, 7);
  ctx.fillStyle = '#29352f';
  ctx.fillRect(-9, 37, 7, 8);
  ctx.fillRect(3, 37, 7, 8);
  ctx.fillStyle = '#e7c7a6';
  ctx.fillRect(-8, 8, 16, 4);

  ctx.fillStyle = '#f2d2ae';
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = character.hair;
  ctx.beginPath();
  ctx.arc(0, -3, 10, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-10, -3, 5, 6);
  ctx.fillStyle = '#18221c';
  ctx.fillRect(3, -1, 2, 3);
  ctx.fillStyle = character.trim;
  ctx.fillRect(7, 2, 4, 3);

  ctx.fillStyle = '#101a13';
  ctx.fillRect(-8, 1, 22, 11);
  ctx.fillStyle = character.color;
  ctx.font = '800 7px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`R${player.characterIndex + 1}`, 3, 6.5);
  ctx.restore();
}

function drawLaptop(x, y, screenColor) {
  ctx.fillStyle = '#131b1c';
  ctx.fillRect(x, y, 12, 8);
  ctx.fillStyle = screenColor;
  ctx.fillRect(x + 2, y + 2, 8, 4);
  ctx.fillStyle = '#a8b7b2';
  ctx.fillRect(x - 1, y + 8, 14, 2);
}

function getPlayerEffect(player) {
  if (player.flightTimer > 0) return { label: 'AI / FLIGHT', color: '#ff2e93', timer: player.flightTimer, max: 6 };
    if (player.flightTimer > 0) return { label: 'AI / FLIGHT', color: '#ff2e93', timer: player.flightTimer, max: 6 };
    ctx.fillStyle = '#ff2e93';
  if (player.boostTimer > 0) return { label: 'MACBOOK / SPEED', color: '#70c8ff', timer: player.boostTimer, max: 6 };
  if (player.slowTimer > 0) return { label: 'POWER APPS / SLOW', color: '#ff9a68', timer: player.slowTimer, max: 4.5 };
  return null;
}

function drawHud(time) {
  ctx.fillStyle = 'rgba(12, 20, 15, 0.82)';
  ctx.fillRect(16, 14, WIDTH - 32, 52);
  ctx.strokeStyle = 'rgba(204, 229, 197, 0.28)';
  ctx.strokeRect(16.5, 14.5, WIDTH - 33, 51);

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ff2e93';
  ctx.font = '900 17px Impact, sans-serif';
  ctx.fillText('GTA7', 30, 40);
  ctx.fillStyle = '#aab9a9';
  ctx.font = '700 8px monospace';
  ctx.fillText('PIPELINE PANIC', 31, 55);

  ctx.fillStyle = '#e9f1e8';
  ctx.font = '700 9px monospace';
  ctx.fillText('RELEASE KEYS', 190, 34);
  for (let index = 0; index < 3; index += 1) {
    ctx.fillStyle = index < game.seals ? '#ffd45c' : '#526053';
    ctx.beginPath();
    ctx.moveTo(198 + index * 25, 45);
    ctx.lineTo(207 + index * 25, 53);
    ctx.lineTo(198 + index * 25, 61);
    ctx.lineTo(189 + index * 25, 53);
    ctx.closePath();
    ctx.fill();
  }

  for (let index = 0; index < game.players.length; index += 1) {
    const player = game.players[index];
    const x = 650 + index * 132;
    ctx.fillStyle = roster[player.characterIndex].color;
    ctx.fillRect(x, 25, 27, 27);
    ctx.fillStyle = '#172019';
    ctx.font = '800 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`P${index + 1}`, x + 13.5, 39);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e9f1e8';
    ctx.font = '700 10px monospace';
    ctx.fillText(`${player.lives} RETRIES`, x + 34, 34);
    const effect = getPlayerEffect(player);
    if (effect) {
      ctx.fillStyle = effect.color;
      ctx.font = '700 7px monospace';
      ctx.fillText(`${effect.label} ${effect.timer.toFixed(1)}s`, x + 34, 48);
      ctx.fillStyle = 'rgba(230, 242, 222, 0.18)';
      ctx.fillRect(x + 34, 56, 96, 3);
      ctx.fillStyle = effect.color;
      ctx.fillRect(x + 34, 56, 96 * (effect.timer / effect.max), 3);
    }
  }

  if (game.state === 'playing' && game.toastTimer > 0) {
    const width = Math.min(560, 48 + game.toast.length * 8);
    ctx.fillStyle = 'rgba(11, 17, 12, 0.88)';
    ctx.fillRect((WIDTH - width) / 2, 78, width, 34);
    ctx.fillStyle = game.toastColor;
    ctx.fillRect((WIDTH - width) / 2, 78, 4, 34);
    ctx.strokeStyle = game.toastColor;
    ctx.strokeRect((WIDTH - width) / 2 + 0.5, 78.5, width - 1, 33);
    ctx.fillStyle = '#edf4e5';
    ctx.font = '800 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(game.toast, WIDTH / 2, 98);
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(WIDTH * scale);
  canvas.height = Math.round(HEIGHT * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

let lastFrame = 0;
function frame(timestamp) {
  const dt = lastFrame === 0 ? 0 : Math.min((timestamp - lastFrame) / 1000, 0.04);
  lastFrame = timestamp;
  if (game.state === 'playing') update(dt);
  draw(timestamp / 1000);
  window.requestAnimationFrame(frame);
}

game.players = [makePlayer(0, selectedCharacters[0]), makePlayer(1, selectedCharacters[1])];
syncRosterLabels();
updateMusicButton();
renderLeaderboard();
setOverlay('intro');
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.requestAnimationFrame(frame);