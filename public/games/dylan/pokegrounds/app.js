/* ==========================================
   POKÉ BATTLE GROUNDS - APPLICATION ENGINE
   ========================================== */

// ------------------------------------------
// 1. GAME STATE & CONSTANTS
// ------------------------------------------
const STATE = {
  playerTeam: Array(6).fill(null),    // Player's 6 team slots
  opponentTeam: Array(6).fill(null),  // Opponent's 6 team slots
  activePlayerSlot: 0,                // Slot currently editing (0-5)
  activeOpponentSlot: 0,              // Slot currently editing (0-5)
  activePlayerIndex: 0,               // Active battle combatant (0-5)
  activeOpponentIndex: 0,             // Active battle opponent (0-5)
  isPlayerTurn: true,
  battleActive: false,
  soundEnabled: true,
  bgmInterval: null,
  isAudioInitialized: false,
  opponentMode: 'random',             // 'random' or 'manual'
  playerSelectedMoves: Array(6).fill(null),   // Array of movesets (4 moves) for player
  opponentSelectedMoves: Array(6).fill(null), // Array of movesets (4 moves) for opponent
  activeMap: 'default',               // Selected battle ground map
};

// Battlefield Maps Database
const MAPS_DATABASE = {
  default: {
    id: 'default',
    name: 'Neo Arena',
    type: 'normal',
    gradient: 'linear-gradient(180deg, rgba(8, 11, 17, 0.7) 0%, rgba(12, 18, 30, 0.3) 60%, rgba(8, 11, 17, 0.85) 100%)',
    particleColor: 'rgba(0, 242, 254, 0.2)',
    description: 'Championship battlefield. Neutral terrain.',
    boostType: null,
    reduceType: null
  },
  volcano: {
    id: 'volcano',
    name: 'Volcanic Crater',
    type: 'fire',
    gradient: 'linear-gradient(180deg, rgba(238, 129, 48, 0.25) 0%, rgba(18, 10, 10, 0.95) 100%)',
    particleColor: 'rgba(238, 129, 48, 0.5)',
    description: 'Boiling lava sea. Fire moves +20%, Water moves -20%.',
    boostType: 'fire',
    reduceType: 'water'
  },
  ocean: {
    id: 'ocean',
    name: 'Oceanic Abyss',
    type: 'water',
    gradient: 'linear-gradient(180deg, rgba(99, 144, 240, 0.25) 0%, rgba(8, 11, 20, 0.95) 100%)',
    particleColor: 'rgba(99, 144, 240, 0.4)',
    description: 'Sunken temple. Water moves +20%, Fire moves -20%.',
    boostType: 'water',
    reduceType: 'fire'
  },
  forest: {
    id: 'forest',
    name: 'Viridian Canopy',
    type: 'grass',
    gradient: 'linear-gradient(180deg, rgba(122, 199, 76, 0.25) 0%, rgba(8, 15, 11, 0.95) 100%)',
    particleColor: 'rgba(122, 199, 76, 0.45)',
    description: 'Sacred forest canopy. Grass moves +20%, Ground moves -20%.',
    boostType: 'grass',
    reduceType: 'ground'
  },
  powergrid: {
    id: 'powergrid',
    name: 'Lightning Ridge',
    type: 'electric',
    gradient: 'linear-gradient(180deg, rgba(247, 208, 44, 0.2) 0%, rgba(10, 10, 5, 0.95) 100%)',
    particleColor: 'rgba(247, 208, 44, 0.5)',
    description: 'Charged high voltage grid. Electric moves +20%, Flying moves -20%.',
    boostType: 'electric',
    reduceType: 'flying'
  },
  glacial: {
    id: 'glacial',
    name: 'Glacial Cavern',
    type: 'ice',
    gradient: 'linear-gradient(180deg, rgba(150, 217, 214, 0.25) 0%, rgba(8, 15, 20, 0.95) 100%)',
    particleColor: 'rgba(150, 217, 214, 0.5)',
    description: 'Frozen cave. Ice moves +20%, Grass moves -20%.',
    boostType: 'ice',
    reduceType: 'grass'
  },
  sky: {
    id: 'sky',
    name: 'Sky Pillar',
    type: 'dragon',
    gradient: 'linear-gradient(180deg, rgba(111, 53, 252, 0.2) 0%, rgba(8, 11, 17, 0.95) 100%)',
    particleColor: 'rgba(169, 143, 243, 0.4)',
    description: 'Soaring peak. Dragon & Flying moves +20%.',
    boostType: 'dragon',
    reduceType: null
  },
  graveyard: {
    id: 'graveyard',
    name: 'Haunted Cemetery',
    type: 'ghost',
    gradient: 'linear-gradient(180deg, rgba(112, 87, 70, 0.25) 0%, rgba(5, 5, 10, 0.95) 100%)',
    particleColor: 'rgba(163, 62, 161, 0.4)',
    description: 'Drifting mist graveyard. Ghost & Dark moves +20%, Normal moves -20%.',
    boostType: 'ghost',
    reduceType: 'normal'
  }
};

// Popular Pokémon Categories for Quick Select
const POPULAR_POKEMON_CATEGORIES = {
  stars: {
    name: 'All Stars',
    pokemon: ['pikachu', 'charizard', 'greninja', 'gengar', 'lucario', 'gardevoir', 'eevee', 'gyarados']
  },
  kanto: {
    name: 'Kanto Classics',
    pokemon: ['venusaur', 'blastoise', 'dragonite', 'snorlax', 'mew', 'mewtwo']
  },
  legend: {
    name: 'Legendaries',
    pokemon: ['rayquaza', 'arceus', 'kyogre', 'lugia', 'ho-oh']
  },
  beasts: {
    name: 'Powerhouses',
    pokemon: ['garchomp', 'blaziken', 'salamence', 'typhlosion', 'sceptile']
  }
};

// Official Pokémon level constant for standard combat
const LEVEL = 50;

// High-Res Showdown GIF base URL
const SPRITE_FALLBACK_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

// Popular move database for instant loading & styling
const ICONIC_MOVES_DATABASE = {
  // Fire
  'flamethrower': { name: 'Flamethrower', power: 90, accuracy: 100, type: 'fire', category: 'special', pp: 15 },
  'fire-blast': { name: 'Fire Blast', power: 110, accuracy: 85, type: 'fire', category: 'special', pp: 5 },
  'ember': { name: 'Ember', power: 40, accuracy: 100, type: 'fire', category: 'special', pp: 25 },
  'fire-punch': { name: 'Fire Punch', power: 75, accuracy: 100, type: 'fire', category: 'physical', pp: 15 },
  
  // Water
  'surf': { name: 'Surf', power: 90, accuracy: 100, type: 'water', category: 'special', pp: 15 },
  'hydro-pump': { name: 'Hydro Pump', power: 110, accuracy: 80, type: 'water', category: 'special', pp: 5 },
  'water-pulse': { name: 'Water Pulse', power: 60, accuracy: 100, type: 'water', category: 'special', pp: 20 },
  'water-shuriken': { name: 'Water Shuriken', power: 80, accuracy: 100, type: 'water', category: 'special', pp: 20 },

  // Grass
  'giga-drain': { name: 'Giga Drain', power: 75, accuracy: 100, type: 'grass', category: 'special', pp: 10 },
  'solar-beam': { name: 'Solar Beam', power: 120, accuracy: 100, type: 'grass', category: 'special', pp: 10 },
  'vine-whip': { name: 'Vine Whip', power: 45, accuracy: 100, type: 'grass', category: 'physical', pp: 25 },
  'leaf-blade': { name: 'Leaf Blade', power: 90, accuracy: 100, type: 'grass', category: 'physical', pp: 15 },

  // Electric
  'thunderbolt': { name: 'Thunderbolt', power: 90, accuracy: 100, type: 'electric', category: 'special', pp: 15 },
  'thunder': { name: 'Thunder', power: 110, accuracy: 70, type: 'electric', category: 'special', pp: 10 },
  'spark': { name: 'Spark', power: 65, accuracy: 100, type: 'electric', category: 'physical', pp: 20 },
  'thunder-shock': { name: 'Thunder Shock', power: 40, accuracy: 100, type: 'electric', category: 'special', pp: 30 },

  // Ice
  'ice-beam': { name: 'Ice Beam', power: 90, accuracy: 100, type: 'ice', category: 'special', pp: 10 },
  'blizzard': { name: 'Blizzard', power: 110, accuracy: 70, type: 'ice', category: 'special', pp: 5 },
  'ice-punch': { name: 'Ice Punch', power: 75, accuracy: 100, type: 'ice', category: 'physical', pp: 15 },

  // Fighting
  'close-combat': { name: 'Close Combat', power: 120, accuracy: 100, type: 'fighting', category: 'physical', pp: 5 },
  'aura-sphere': { name: 'Aura Sphere', power: 80, accuracy: 100, type: 'fighting', category: 'special', pp: 20 },
  'brick-break': { name: 'Brick Break', power: 75, accuracy: 100, type: 'fighting', category: 'physical', pp: 15 },

  // Poison
  'sludge-bomb': { name: 'Sludge Bomb', power: 90, accuracy: 100, type: 'poison', category: 'special', pp: 10 },
  'poison-jab': { name: 'Poison Jab', power: 80, accuracy: 100, type: 'poison', category: 'physical', pp: 20 },

  // Ground
  'earthquake': { name: 'Earthquake', power: 100, accuracy: 100, type: 'ground', category: 'physical', pp: 10 },
  'mud-slap': { name: 'Mud-Slap', power: 20, accuracy: 100, type: 'ground', category: 'special', pp: 10 },

  // Flying
  'air-slash': { name: 'Air Slash', power: 75, accuracy: 95, type: 'flying', category: 'special', pp: 15 },
  'hurricane': { name: 'Hurricane', power: 110, accuracy: 70, type: 'flying', category: 'special', pp: 10 },
  'wing-attack': { name: 'Wing Attack', power: 60, accuracy: 100, type: 'flying', category: 'physical', pp: 35 },

  // Psychic
  'psychic': { name: 'Psychic', power: 90, accuracy: 100, type: 'psychic', category: 'special', pp: 10 },
  'psybeam': { name: 'Psybeam', power: 65, accuracy: 100, type: 'psychic', category: 'special', pp: 20 },

  // Bug
  'bug-buzz': { name: 'Bug Buzz', power: 90, accuracy: 100, type: 'bug', category: 'special', pp: 10 },
  'x-scissor': { name: 'X-Scissor', power: 80, accuracy: 100, type: 'bug', category: 'physical', pp: 15 },

  // Rock
  'stone-edge': { name: 'Stone Edge', power: 100, accuracy: 80, type: 'rock', category: 'physical', pp: 5 },
  'rock-slide': { name: 'Rock Slide', power: 75, accuracy: 90, type: 'rock', category: 'physical', pp: 10 },

  // Ghost
  'shadow-ball': { name: 'Shadow Ball', power: 80, accuracy: 100, type: 'ghost', category: 'special', pp: 15 },
  'shadow-claw': { name: 'Shadow Claw', power: 70, accuracy: 100, type: 'ghost', category: 'physical', pp: 15 },

  // Dragon
  'outrage': { name: 'Outrage', power: 120, accuracy: 100, type: 'dragon', category: 'physical', pp: 10 },
  'dragon-pulse': { name: 'Dragon Pulse', power: 85, accuracy: 100, type: 'dragon', category: 'special', pp: 10 },
  'dragon-claw': { name: 'Dragon Claw', power: 80, accuracy: 100, type: 'dragon', category: 'physical', pp: 15 },

  // Dark
  'dark-pulse': { name: 'Dark Pulse', power: 80, accuracy: 100, type: 'dark', category: 'special', pp: 15 },
  'crunch': { name: 'Crunch', power: 80, accuracy: 100, type: 'dark', category: 'physical', pp: 15 },
  'bite': { name: 'Bite', power: 60, accuracy: 100, type: 'dark', category: 'physical', pp: 25 },

  // Steel
  'flash-cannon': { name: 'Flash Cannon', power: 80, accuracy: 100, type: 'steel', category: 'special', pp: 10 },
  'iron-head': { name: 'Iron Head', power: 80, accuracy: 100, type: 'steel', category: 'physical', pp: 15 },

  // Fairy
  'moonblast': { name: 'Moonblast', power: 95, accuracy: 100, type: 'fairy', category: 'special', pp: 15 },
  'dazzling-gleam': { name: 'Dazzling Gleam', power: 80, accuracy: 100, type: 'fairy', category: 'special', pp: 10 },

  // Normal
  'hyper-beam': { name: 'Hyper Beam', power: 150, accuracy: 90, type: 'normal', category: 'special', pp: 5 },
  'slash': { name: 'Slash', power: 70, accuracy: 100, type: 'normal', category: 'physical', pp: 20 },
  'quick-attack': { name: 'Quick Attack', power: 40, accuracy: 100, type: 'normal', category: 'physical', pp: 30 },
  'tackle': { name: 'Tackle', power: 40, accuracy: 100, type: 'normal', category: 'physical', pp: 35 },
  'body-slam': { name: 'Body Slam', power: 85, accuracy: 100, type: 'normal', category: 'physical', pp: 15 },
};

// Pokémon Type Chart Multipliers
const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// ------------------------------------------
// 2. RETRO SOUND SYNTHESIZER ENGINE (Web Audio)
// ------------------------------------------
let audioCtx = null;

function initAudio() {
  if (STATE.isAudioInitialized) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    STATE.isAudioInitialized = true;
    if (STATE.soundEnabled) {
      playBgmLoop();
    }
  } catch (e) {
    console.error("Failed to initialize audio context: ", e);
  }
}

function playBgmLoop() {
  if (!STATE.soundEnabled || !audioCtx) return;
  stopBgmLoop();

  let tempo = 120; // BPM
  let beatDuration = 60 / tempo;
  let currentBeat = 0;

  // Synthesize a retro 8-bit battle loop
  // Bass nodes
  const bassNotes = [36, 36, 43, 43, 39, 39, 41, 41]; // Midi values for C2, G2, D#2, F2
  
  STATE.bgmInterval = setInterval(() => {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    
    // Play a retro bass note
    let noteIndex = currentBeat % bassNotes.length;
    let freq = midiToFreq(bassNotes[noteIndex]);
    
    // Create oscillator
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beatDuration - 0.05);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + beatDuration);

    // Play a retro melody note occasionally
    if (currentBeat % 4 === 0 || currentBeat % 7 === 0) {
      let melodyNotes = [60, 63, 65, 67, 70, 72];
      let midiNote = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      let mFreq = midiToFreq(midiNote);

      let oscM = audioCtx.createOscillator();
      let gainM = audioCtx.createGain();

      oscM.type = 'square';
      oscM.frequency.setValueAtTime(mFreq, audioCtx.currentTime);
      gainM.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gainM.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beatDuration * 1.5);

      oscM.connect(gainM);
      gainM.connect(audioCtx.destination);

      oscM.start();
      oscM.stop(audioCtx.currentTime + beatDuration * 1.5);
    }
    
    currentBeat++;
  }, beatDuration * 1000);
}

function stopBgmLoop() {
  if (STATE.bgmInterval) {
    clearInterval(STATE.bgmInterval);
    STATE.bgmInterval = null;
  }
}

function midiToFreq(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// Combat Sound Effects
function playSfx(type) {
  if (!STATE.soundEnabled || !audioCtx) return;
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const now = audioCtx.currentTime;
  
  switch(type) {
    case 'select':
      let oscSel = audioCtx.createOscillator();
      let gainSel = audioCtx.createGain();
      oscSel.type = 'sine';
      oscSel.frequency.setValueAtTime(600, now);
      oscSel.frequency.exponentialRampToValueAtTime(900, now + 0.08);
      gainSel.gain.setValueAtTime(0.1, now);
      gainSel.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      oscSel.connect(gainSel);
      gainSel.connect(audioCtx.destination);
      oscSel.start();
      oscSel.stop(now + 0.1);
      break;

    case 'hit':
      // White noise explosion / sweep + triangle drop
      let oscHit = audioCtx.createOscillator();
      let gainHit = audioCtx.createGain();
      oscHit.type = 'sawtooth';
      oscHit.frequency.setValueAtTime(150, now);
      oscHit.frequency.linearRampToValueAtTime(40, now + 0.25);
      gainHit.gain.setValueAtTime(0.15, now);
      gainHit.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscHit.connect(gainHit);
      gainHit.connect(audioCtx.destination);
      oscHit.start();
      oscHit.stop(now + 0.3);
      break;
      
    case 'crit':
      // Retro chime + heavy explosion
      let oscC1 = audioCtx.createOscillator();
      let oscC2 = audioCtx.createOscillator();
      let gainC = audioCtx.createGain();
      
      oscC1.type = 'square';
      oscC1.frequency.setValueAtTime(880, now);
      oscC1.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      
      oscC2.type = 'sawtooth';
      oscC2.frequency.setValueAtTime(100, now);
      oscC2.frequency.linearRampToValueAtTime(20, now + 0.4);
      
      gainC.gain.setValueAtTime(0.2, now);
      gainC.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      oscC1.connect(gainC);
      oscC2.connect(gainC);
      gainC.connect(audioCtx.destination);
      
      oscC1.start();
      oscC2.start();
      oscC1.stop(now + 0.4);
      oscC2.stop(now + 0.4);
      break;
      
    case 'miss':
      // Soft whistle sliding down
      let oscMiss = audioCtx.createOscillator();
      let gainMiss = audioCtx.createGain();
      oscMiss.type = 'sine';
      oscMiss.frequency.setValueAtTime(400, now);
      oscMiss.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      gainMiss.gain.setValueAtTime(0.05, now);
      gainMiss.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscMiss.connect(gainMiss);
      gainMiss.connect(audioCtx.destination);
      oscMiss.start();
      oscMiss.stop(now + 0.25);
      break;
      
    case 'ultimate':
      // Epic synthesized beam followed by massive explosion noise
      let oscUlt = audioCtx.createOscillator();
      let gainUlt = audioCtx.createGain();
      oscUlt.type = 'sawtooth';
      oscUlt.frequency.setValueAtTime(50, now);
      oscUlt.frequency.linearRampToValueAtTime(800, now + 0.4);
      oscUlt.frequency.exponentialRampToValueAtTime(30, now + 0.8);
      
      gainUlt.gain.setValueAtTime(0.3, now);
      gainUlt.gain.setValueAtTime(0.3, now + 0.4);
      gainUlt.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      oscUlt.connect(gainUlt);
      gainUlt.connect(audioCtx.destination);
      oscUlt.start();
      oscUlt.stop(now + 0.9);
      break;

    case 'victory':
      // Retro Level Up / Victory fanfare
      stopBgmLoop();
      const notes = [52, 52, 52, 52, 55, 53, 55, 59]; // E, E, E, E, G, F, G, B
      const durs = [0.1, 0.1, 0.1, 0.2, 0.15, 0.15, 0.15, 0.4];
      let timeOffset = 0;
      notes.forEach((note, idx) => {
        let oscV = audioCtx.createOscillator();
        let gainV = audioCtx.createGain();
        oscV.type = 'square';
        oscV.frequency.setValueAtTime(midiToFreq(note + 12), now + timeOffset);
        gainV.gain.setValueAtTime(0.12, now + timeOffset);
        gainV.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + durs[idx] - 0.02);
        oscV.connect(gainV);
        gainV.connect(audioCtx.destination);
        oscV.start(now + timeOffset);
        oscV.stop(now + timeOffset + durs[idx]);
        timeOffset += durs[idx];
      });
      // Restart BGM loop after fanfare finishes
      setTimeout(() => {
        if (STATE.battleActive) playBgmLoop();
      }, timeOffset * 1000 + 500);
      break;
      
    case 'defeat':
      // Dissapointed minor chord descending fanfare
      stopBgmLoop();
      const notesD = [57, 56, 55, 52]; // A, G#, G, E
      const dursD = [0.2, 0.2, 0.2, 0.5];
      let tOffset = 0;
      notesD.forEach((note, idx) => {
        let oscD = audioCtx.createOscillator();
        let gainD = audioCtx.createGain();
        oscD.type = 'sawtooth';
        oscD.frequency.setValueAtTime(midiToFreq(note), now + tOffset);
        gainD.gain.setValueAtTime(0.1, now + tOffset);
        gainD.gain.exponentialRampToValueAtTime(0.001, now + tOffset + dursD[idx] - 0.02);
        oscD.connect(gainD);
        gainD.connect(audioCtx.destination);
        oscD.start(now + tOffset);
        oscD.stop(now + tOffset + dursD[idx]);
        tOffset += dursD[idx];
      });
      break;
  }
}

// ------------------------------------------
// 3. POKEAPI DATA UTILITIES & FORMULAS
// ------------------------------------------

// Fetch Pokémon basic and move details
async function fetchPokemonData(nameOrId) {
  const query = String(nameOrId).toLowerCase().trim();
  if (!query) return null;
  
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
  if (!response.ok) throw new Error("Pokémon not found");
  
  const raw = await response.json();
  return parsePokemon(raw);
}

// Parse Raw PokeAPI data into game structures
function parsePokemon(data) {
  // Extract Stats
  const hpBase = data.stats.find(s => s.stat.name === 'hp').base_stat;
  const atkBase = data.stats.find(s => s.stat.name === 'attack').base_stat;
  const defBase = data.stats.find(s => s.stat.name === 'defense').base_stat;
  const spatkBase = data.stats.find(s => s.stat.name === 'special-attack').base_stat;
  const spdefBase = data.stats.find(s => s.stat.name === 'special-defense').base_stat;
  const speedBase = data.stats.find(s => s.stat.name === 'speed').base_stat;

  // Calculate actual level 50 stats with full IVs (31) and average EVs (85)
  // HP formula: Floor(0.01 * (2*Base + IV + EV/4) * Lvl) + Lvl + 10
  const maxHP = Math.floor(0.01 * (2 * hpBase + 31 + Math.floor(85 / 4)) * LEVEL) + LEVEL + 10;
  
  // Other stats formula: Floor(0.01 * (2*Base + IV + EV/4) * Lvl + 5)
  const calculateStat = (base) => {
    return Math.floor(0.01 * (2 * base + 31 + Math.floor(85 / 4)) * LEVEL + 5);
  };

  // Sprites
  // Prefer showdown animated sprites, fall back to official artwork or normal static front
  const showdownSpriteFront = data.sprites?.other?.showdown?.front_default;
  const showdownSpriteBack = data.sprites?.other?.showdown?.back_default;
  const officialArt = data.sprites?.other?.['official-artwork']?.front_default;
  
  const frontSprite = showdownSpriteFront || officialArt || data.sprites?.front_default || `${SPRITE_FALLBACK_URL}${data.id}.png`;
  const backSprite = showdownSpriteBack || data.sprites?.back_default || frontSprite;

  // Collect all moves that this Pokémon can learn
  const learnableMoves = data.moves.map(m => m.move.name);

  return {
    id: data.id,
    name: data.name,
    types: data.types.map(t => t.type.name),
    stats: {
      hp: maxHP,
      attack: calculateStat(atkBase),
      defense: calculateStat(defBase),
      spAtk: calculateStat(spatkBase),
      spDef: calculateStat(spdefBase),
      speed: calculateStat(speedBase)
    },
    maxHP: maxHP,
    currentHP: maxHP,
    level: LEVEL,
    frontSprite: frontSprite,
    backSprite: backSprite,
    learnableMovesList: learnableMoves,
    ultimatePercent: 0
  };
}

// Generate Move specifications from Move Name
function getMoveDetails(moveName) {
  const normalized = moveName.toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  // If in database, return structured move
  if (ICONIC_MOVES_DATABASE[normalized]) {
    return { ...ICONIC_MOVES_DATABASE[normalized] };
  }
  
  // Procedural Generator fallback for unknown PokeAPI moves
  // This guarantees that ANY Pokémon moveset will resolve to playable actions immediately
  const hash = normalized.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const powerOptions = [50, 60, 75, 80, 90, 100];
  const power = powerOptions[hash % powerOptions.length];
  const accuracy = hash % 10 === 0 ? 80 : (hash % 10 === 1 ? 85 : 95);
  
  // Estimate category
  const category = hash % 2 === 0 ? 'physical' : 'special';
  
  // Standard typing pool guess
  const typesPool = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
  const type = typesPool[hash % typesPool.length];
  
  // Format readable title
  const formattedName = moveName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return {
    name: formattedName,
    power: power,
    accuracy: accuracy,
    type: type,
    category: category,
    pp: 15
  };
}

// Pick best 4 moves based on Power/Category
function selectAutoMoves(movesList) {
  const detailedMoves = movesList.map(name => {
    try {
      return getMoveDetails(name);
    } catch(e) {
      return null;
    }
  }).filter(m => m !== null);
  
  // Sort by power descending, prioritize higher damage moves
  detailedMoves.sort((a, b) => b.power - a.power);
  
  // Take top 4 unique types if possible, or just top 4
  const finalMoves = [];
  const typesUsed = new Set();
  
  for (let m of detailedMoves) {
    if (finalMoves.length >= 4) break;
    // Try to diversify move typings
    if (!typesUsed.has(m.type) || finalMoves.length >= 2) {
      finalMoves.push(m);
      typesUsed.add(m.type);
    }
  }
  
  // If we couldn't fill 4, repeat selection
  while (finalMoves.length < 4 && detailedMoves.length > 0) {
    const nextMove = detailedMoves.find(m => !finalMoves.some(f => f.name === m.name));
    if (nextMove) finalMoves.push(nextMove);
    else break;
  }
  
  // Hard fallback to tackle
  while (finalMoves.length < 4) {
    finalMoves.push({ ...ICONIC_MOVES_DATABASE['tackle'] });
  }

  return finalMoves.slice(0, 4);
}

// Get Ultimate Attack specification based on Primary Type
function getUltimateAttack(pokemon) {
  const primaryType = pokemon.types[0] || 'normal';
  
  // Unique customized signature ultimates for popular picks
  const customUltimates = {
    pikachu: { name: '10,000,000 Volt Thunderbolt', type: 'electric' },
    charizard: { name: 'G-Max Wildfire', type: 'fire' },
    greninja: { name: 'Giant Water Shuriken', type: 'water' },
    lucario: { name: 'Aura Storm Cataclysm', type: 'fighting' },
    mewtwo: { name: 'Psystrike Nova', type: 'psychic' },
    gengar: { name: 'Infinite G-Max Terror', type: 'ghost' },
    rayquaza: { name: 'Ascent of the Dragon Lord', type: 'dragon' },
    gardevoir: { name: 'Shattered Psyche Nova', type: 'psychic' },
    blastoise: { name: 'G-Max Cannonade', type: 'water' },
    venusaur: { name: 'G-Max Vine Lash', type: 'grass' },
    garchomp: { name: 'Tectonic Rage Slam', type: 'ground' },
    arceus: { name: 'Judgment of the Cosmos', type: 'normal' },
    eevee: { name: 'Extreme Evoboost Slam', type: 'normal' },
    gyarados: { name: 'Dragon Rage Tempest', type: 'water' },
    dragonite: { name: 'Draconic Cataclysm', type: 'dragon' },
    snorlax: { name: 'Pulverizing Pancake', type: 'normal' },
    mew: { name: 'Genesis Supernova', type: 'psychic' },
    kyogre: { name: 'Origin Pulse Flood', type: 'water' },
    lugia: { name: 'Aeroblast Tempest', type: 'flying' },
    hooh: { name: 'Sacred Fire Cleansing', type: 'fire' },
    'ho-oh': { name: 'Sacred Fire Cleansing', type: 'fire' },
    blaziken: { name: 'Blazing Kick Blast', type: 'fire' },
    typhlosion: { name: 'Inferno Eruption', type: 'fire' },
    sceptile: { name: 'Forest Frenzy Slash', type: 'grass' }
  };

  const normalizedName = pokemon.name.toLowerCase();
  if (customUltimates[normalizedName]) {
    return {
      name: customUltimates[normalizedName].name,
      power: 190,
      accuracy: 100, // Ultimates never miss
      type: customUltimates[normalizedName].type,
      category: 'special',
      isUltimate: true
    };
  }

  // Type-based fallback Ultimates
  const typeUltimates = {
    normal: 'Gigaton Crush',
    fire: 'Inferno Overdrive',
    water: 'Hydro Vortex',
    grass: 'Bloom Doom',
    electric: 'Gigavolt Havoc',
    ice: 'Subzero Slammer',
    fighting: 'All-Out Pummeling',
    poison: 'Acid Downpour',
    ground: 'Tectonic Rage',
    flying: 'Supersonic Skystrike',
    psychic: 'Shattered Psyche',
    bug: 'Savage Spin-Out',
    rock: 'Continental Crush',
    ghost: 'Never-Ending Nightmare',
    dragon: 'Devastating Drake',
    dark: 'Black Hole Eclipse',
    steel: 'Corkscrew Crash',
    fairy: 'Twinkle Tackle'
  };

  const capName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const fallbackMoveName = typeUltimates[primaryType] || 'Ultimate Strike';
  const customFallbackName = `${capName}'s ${fallbackMoveName}`;

  return {
    name: customFallbackName,
    power: 180,
    accuracy: 100,
    type: primaryType,
    category: 'special',
    isUltimate: true
  };
}

// Compute damage based on standard mechanics
function calculateDamage(attacker, defender, move) {
  // 1. Accuracy Check
  const rollAcc = Math.floor(Math.random() * 100);
  if (!move.isUltimate && rollAcc > move.accuracy) {
    return { damage: 0, isCrit: false, isMiss: true, multiplier: 1.0, mapMultiplier: 1.0 };
  }

  // 2. Critical Hit Roll (12.5% chance)
  const isCrit = Math.random() < 0.125;
  const critMultiplier = isCrit ? 1.5 : 1.0;

  // 3. Stats determination (Physical vs Special)
  const isSpecial = move.category === 'special';
  const atkValue = isSpecial ? attacker.stats.spAtk : attacker.stats.attack;
  const defValue = isSpecial ? defender.stats.spDef : defender.stats.defense;

  // 4. Type effectiveness logic
  let typeMultiplier = 1.0;
  defender.types.forEach(defType => {
    if (TYPE_CHART[move.type] && TYPE_CHART[move.type][defType] !== undefined) {
      typeMultiplier *= TYPE_CHART[move.type][defType];
    }
  });

  // 5. STAB (Same Type Attack Bonus)
  const hasStab = attacker.types.includes(move.type);
  const stabMultiplier = hasStab ? 1.2 : 1.0;

  // 5b. Battlefield Map Modifier
  let mapMultiplier = 1.0;
  const mapData = MAPS_DATABASE[STATE.activeMap || 'default'];
  if (mapData) {
    if (mapData.boostType && move.type === mapData.boostType) {
      mapMultiplier = 1.20; // 20% boost
    } else if (mapData.reduceType && move.type === mapData.reduceType) {
      mapMultiplier = 0.80; // 20% reduction
    }
    
    // Custom double-type boosts or special logic
    if (mapData.id === 'sky' && (move.type === 'dragon' || move.type === 'flying')) {
      mapMultiplier = 1.20;
    }
    if (mapData.id === 'graveyard' && (move.type === 'ghost' || move.type === 'dark')) {
      mapMultiplier = 1.20;
    }
  }

  // 6. Base damage compute
  const baseDmg = Math.floor(((2 * LEVEL / 5 + 2) * move.power * (atkValue / defValue) / 50 + 2));
  
  // 7. Random factor [0.85 - 1.0]
  const randomModifier = 0.85 + Math.random() * 0.15;

  // Final calculation
  let damage = Math.floor(baseDmg * randomModifier * critMultiplier * typeMultiplier * stabMultiplier * mapMultiplier);

  // Guarantee minimum 1 damage on hit
  if (damage <= 0 && typeMultiplier > 0) damage = 1;

  return {
    damage: damage,
    isCrit: isCrit,
    isMiss: false,
    multiplier: typeMultiplier,
    mapMultiplier: mapMultiplier
  };
}

// ------------------------------------------
// 4. PARTICLES & FLOATING TEXT RENDERING
// ------------------------------------------
const PARTICLE_BG_ELEMENT = document.getElementById('particle-bg');

// Generate static and drifting combat grid particles
function createBackgroundParticles() {
  if (!PARTICLE_BG_ELEMENT) return;
  PARTICLE_BG_ELEMENT.innerHTML = '';
  
  const activeMapKey = STATE.activeMap || 'default';
  const mapData = MAPS_DATABASE[activeMapKey] || MAPS_DATABASE.default;
  
  const count = 30;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = `bg-bubble map-particle-${mapData.id}`;
    
    const size = Math.random() * 4 + 1.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 8 + 8;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      background: ${mapData.particleColor};
      border-radius: 50%;
      animation: float-up ${duration}s infinite linear;
      animation-delay: -${delay}s;
      pointer-events: none;
    `;
    
    // Custom particle shapes for specific maps
    if (mapData.id === 'volcano') {
      particle.style.borderRadius = '2px';
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    } else if (mapData.id === 'glacial') {
      particle.style.borderRadius = '0';
      particle.style.clipPath = 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
    } else if (mapData.id === 'powergrid') {
      particle.style.width = '2px';
      particle.style.height = `${size * 2}px`;
      particle.style.borderRadius = '0';
    }
    
    PARTICLE_BG_ELEMENT.appendChild(particle);
  }
}

// Create custom floaty CSS animation for bubbles
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes float-up {
    0% { transform: translateY(100vh) scale(1); opacity: 0; }
    20% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);

// Spawn floaty damage text
function spawnDamageNumber(amount, isCrit, isMiss, isHeal, isPlayer) {
  const container = document.getElementById('damage-numbers-layer');
  if (!container) return;

  const num = document.createElement('div');
  num.className = `damage-number ${isCrit ? 'crit' : ''} ${isHeal ? 'heal' : 'normal'}`;
  
  // Decide position offset depending on which Pokémon was hit
  // Opponent is top-right, Player is bottom-left
  let xOffset = 0;
  let yOffset = 0;
  
  if (isPlayer) {
    // Player target offset
    xOffset = 30 + Math.random() * 20;
    yOffset = 60 + Math.random() * 15;
  } else {
    // Opponent target offset
    xOffset = 70 + Math.random() * 20;
    yOffset = 25 + Math.random() * 15;
  }

  num.style.left = `${xOffset}%`;
  num.style.top = `${yOffset}%`;
  
  if (isMiss) {
    num.textContent = 'Miss!';
    num.style.color = '#9ca3af';
  } else if (isHeal) {
    num.textContent = `+${amount}`;
  } else {
    num.textContent = amount;
  }

  container.appendChild(num);
  
  // Clean up element
  setTimeout(() => {
    num.remove();
  }, 1000);
}

// Create quick action slashes or impact explosions
function spawnCombatEffect(isPlayerTarget) {
  const layer = document.getElementById('visual-effects-layer');
  if (!layer) return;

  const effect = document.createElement('div');
  effect.className = 'v-effect v-slash';
  
  const x = isPlayerTarget ? 35 : 75;
  const y = isPlayerTarget ? 65 : 30;

  effect.style.left = `${x}%`;
  effect.style.top = `${y}%`;

  layer.appendChild(effect);
  setTimeout(() => {
    effect.remove();
  }, 400);
}

// ------------------------------------------
// 5. SELECTION SCREEN ACTIONS & POPULATIONS
// ------------------------------------------

// Check if teams meet criteria to unlock ready start button
function checkStartBattleValidity() {
  const startBtn = document.getElementById('start-battle-btn');
  const startWarning = document.getElementById('start-warning');
  if (!startBtn) return;
  
  const playerHasPokemon = STATE.playerTeam.some(p => p !== null);
  let valid = playerHasPokemon;
  
  if (STATE.opponentMode === 'manual') {
    const opponentHasPokemon = STATE.opponentTeam.some(p => p !== null);
    valid = playerHasPokemon && opponentHasPokemon;
    if (startWarning) {
      if (!playerHasPokemon) {
        startWarning.textContent = "Select at least 1 Pokémon for your team.";
      } else if (!opponentHasPokemon) {
        startWarning.textContent = "Select at least 1 Pokémon for the opponent team.";
      } else {
        startWarning.textContent = "";
      }
    }
  } else {
    if (startWarning) {
      if (!playerHasPokemon) {
        startWarning.textContent = "Select at least 1 Pokémon to unlock the battle arena.";
      } else {
        startWarning.textContent = "";
      }
    }
  }
  
  startBtn.disabled = !valid;
  if (valid && startWarning) startWarning.classList.add('hidden');
  else if (startWarning) startWarning.classList.remove('hidden');
}

// Update Slot button appearance in select screen
function updateSlotUI(side, slotIndex) {
  const team = side === 'player' ? STATE.playerTeam : STATE.opponentTeam;
  const pokemon = team[slotIndex];
  
  const slotBtn = document.querySelector(`#${side}-team-slots .slot-btn[data-slot="${slotIndex}"]`);
  if (!slotBtn) return;
  
  const ballSpan = slotBtn.querySelector('.slot-ball');
  const textSpan = slotBtn.querySelector('.slot-text');
  
  if (pokemon) {
    slotBtn.classList.add('loaded');
    if (ballSpan) ballSpan.textContent = '⚽';
    if (textSpan) textSpan.textContent = pokemon.name;
  } else {
    slotBtn.classList.remove('loaded');
    if (ballSpan) ballSpan.textContent = '🔴';
    if (textSpan) textSpan.textContent = 'Empty';
  }
}

// Change active slot editor
function selectSlot(side, slotIndex) {
  const targetIndex = parseInt(slotIndex);
  if (isNaN(targetIndex)) return;

  if (side === 'player') {
    STATE.activePlayerSlot = targetIndex;
    
    document.querySelectorAll('#player-team-slots .slot-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`#player-team-slots .slot-btn[data-slot="${targetIndex}"]`);
    if (btn) btn.classList.add('active');
    
    const pokemon = STATE.playerTeam[targetIndex];
    const preview = document.getElementById('player-preview');
    const previewContent = preview ? preview.querySelector('.preview-content') : null;
    const movesSection = document.getElementById('player-moves-section');
    
    if (pokemon) {
      renderPokemonPreview(pokemon, preview, 'player');
      renderMovesCheckboxes(STATE.playerSelectedMoves[targetIndex], pokemon.learnableMovesList, 'player');
    } else {
      if (preview) preview.classList.add('empty');
      if (previewContent) {
        previewContent.innerHTML = `<p class="placeholder-text">Search or choose a popular Pokémon to fill Slot ${targetIndex + 1}</p>`;
      }
      if (movesSection) movesSection.classList.add('hidden');
    }
  } else {
    STATE.activeOpponentSlot = targetIndex;
    
    document.querySelectorAll('#opponent-team-slots .slot-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`#opponent-team-slots .slot-btn[data-slot="${targetIndex}"]`);
    if (btn) btn.classList.add('active');
    
    const pokemon = STATE.opponentTeam[targetIndex];
    const preview = document.getElementById('opponent-preview');
    const previewContent = preview ? preview.querySelector('.preview-content') : null;
    const movesSection = document.getElementById('opponent-moves-section');
    
    if (pokemon) {
      renderPokemonPreview(pokemon, preview, 'opponent');
      renderMovesCheckboxes(STATE.opponentSelectedMoves[targetIndex], pokemon.learnableMovesList, 'opponent');
    } else {
      if (preview) preview.classList.add('empty');
      if (previewContent) {
        previewContent.innerHTML = `<p class="placeholder-text">Search or choose a popular Pokémon to fill Slot ${targetIndex + 1}</p>`;
      }
      if (movesSection) movesSection.classList.add('hidden');
    }
  }
}

// Fetch Player Pokémon details
async function selectPlayerPokemon(name) {
  const loader = document.getElementById('player-loader');
  const preview = document.getElementById('player-preview');
  const previewContent = preview ? preview.querySelector('.preview-content') : null;
  const movesSection = document.getElementById('player-moves-section');
  
  if (loader) loader.classList.remove('hidden');
  if (preview) preview.classList.add('empty');
  if (previewContent) previewContent.innerHTML = '';
  if (movesSection) movesSection.classList.add('hidden');
  checkStartBattleValidity();

  try {
    const data = await fetchPokemonData(name);
    const slot = STATE.activePlayerSlot;
    STATE.playerTeam[slot] = data;
    
    // Default select top 4 moves automatically
    STATE.playerSelectedMoves[slot] = selectAutoMoves(data.learnableMovesList);
    
    updateSlotUI('player', slot);
    renderPokemonPreview(data, preview, 'player');
    renderMovesCheckboxes(STATE.playerSelectedMoves[slot], data.learnableMovesList, 'player');
    
    checkStartBattleValidity();
    playSfx('select');
  } catch(err) {
    if (previewContent) {
      previewContent.innerHTML = `<p class="warning-text">Error: ${err.message}. Try another search!</p>`;
    }
    console.error(err);
  } finally {
    if (loader) loader.classList.add('hidden');
  }
}

// Fetch Opponent Pokémon details
async function selectOpponentPokemon(name) {
  const loader = document.getElementById('opponent-loader');
  const preview = document.getElementById('opponent-preview');
  const previewContent = preview ? preview.querySelector('.preview-content') : null;
  const movesSection = document.getElementById('opponent-moves-section');
  
  if (loader) loader.classList.remove('hidden');
  if (preview) preview.classList.add('empty');
  if (previewContent) previewContent.innerHTML = '';
  if (movesSection) movesSection.classList.add('hidden');
  checkStartBattleValidity();

  try {
    const data = await fetchPokemonData(name);
    const slot = STATE.activeOpponentSlot;
    STATE.opponentTeam[slot] = data;
    
    STATE.opponentSelectedMoves[slot] = selectAutoMoves(data.learnableMovesList);
    
    updateSlotUI('opponent', slot);
    renderPokemonPreview(data, preview, 'opponent');
    renderMovesCheckboxes(STATE.opponentSelectedMoves[slot], data.learnableMovesList, 'opponent');
    
    checkStartBattleValidity();
    playSfx('select');
  } catch(err) {
    if (previewContent) {
      previewContent.innerHTML = `<p class="warning-text">Error: ${err.message}. Try another search!</p>`;
    }
    console.error(err);
  } finally {
    if (loader) loader.classList.add('hidden');
  }
}

// Render Preview details cards
function renderPokemonPreview(pokemon, element, side) {
  if (!element) return;
  element.classList.remove('empty');
  
  const previewContent = element.querySelector('.preview-content');
  const target = previewContent || element;
  
  const typePills = pokemon.types.map(t => `<span class="type-pill" style="background-color: var(--type-${t})">${t}</span>`).join('');
  
  target.innerHTML = `
    <div class="preview-card-inner">
      <div class="preview-avatar-side">
        <img class="preview-sprite" src="${pokemon.frontSprite}" alt="${pokemon.name}">
      </div>
      <div class="preview-info-side">
        <div class="preview-title-row">
          <span class="preview-name">${pokemon.name}</span>
          <span class="preview-id">#${pokemon.id}</span>
        </div>
        <div class="type-pills">
          ${typePills}
        </div>
        <div class="stats-grid">
          <div class="stat-row">
            <span class="stat-label">HP</span>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${Math.min(100, (pokemon.stats.hp/300)*100)}%; background-color: var(--color-green)"></div></div>
            <span class="stat-value">${pokemon.stats.hp}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">ATK</span>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${Math.min(100, (pokemon.stats.attack/200)*100)}%; background-color: var(--color-red)"></div></div>
            <span class="stat-value">${pokemon.stats.attack}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">DEF</span>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${Math.min(100, (pokemon.stats.defense/200)*100)}%; background-color: var(--color-gold)"></div></div>
            <span class="stat-value">${pokemon.stats.defense}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">SPD</span>
            <div class="stat-bar-outer"><div class="stat-bar-inner" style="width: ${Math.min(100, (pokemon.stats.speed/200)*100)}%; background-color: var(--color-blue)"></div></div>
            <span class="stat-value">${pokemon.stats.speed}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render dynamic moves checklist (maximum 4)
function renderMovesCheckboxes(selectedMoves, fullMovesList, side) {
  const section = document.getElementById(`${side}-moves-section`);
  const grid = document.getElementById(`${side}-moves-grid`);
  const selectedCountSpan = document.getElementById(`${side}-move-selected-count`);
  
  if (!section || !grid) return;
  section.classList.remove('hidden');
  grid.innerHTML = '';
  
  // Show up to 16 possible learnable moves to choose from
  const maxToDisplay = 20;
  const filteredMoves = [...new Set([...selectedMoves.map(m => m.name.toLowerCase().replace(/ /g, '-')), ...fullMovesList])].slice(0, maxToDisplay);
  
  let currentSelectionNames = selectedMoves.map(m => m.name.toLowerCase().replace(/ /g, '-'));
  selectedCountSpan.textContent = currentSelectionNames.length;

  filteredMoves.forEach(moveKey => {
    const move = getMoveDetails(moveKey);
    const wrapper = document.createElement('div');
    wrapper.className = 'move-checkbox-wrapper';
    
    const isChecked = currentSelectionNames.includes(move.name.toLowerCase().replace(/ /g, '-'));
    
    wrapper.innerHTML = `
      <input type="checkbox" id="${side}-move-chk-${moveKey}" class="move-checkbox-input" data-side="${side}" data-move="${moveKey}" ${isChecked ? 'checked' : ''}>
      <label for="${side}-move-chk-${moveKey}" class="move-checkbox-label">
        <div class="move-title-row">
          <span class="move-name">${move.name}</span>
          <span class="move-type-badge" style="background-color: var(--type-${move.type})">${move.type}</span>
        </div>
        <div class="move-stats-row">
          <span>Pwr: ${move.power || '--'}</span>
          <span>Acc: ${move.accuracy || '--'}</span>
          <span>${move.category}</span>
        </div>
      </label>
    `;
    
    grid.appendChild(wrapper);
  });

  // Bind checkbox events
  grid.querySelectorAll('.move-checkbox-input').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const activeSide = e.target.getAttribute('data-side');
      const moveName = e.target.getAttribute('data-move');
      const isChecked = e.target.checked;
      
      const slot = activeSide === 'player' ? STATE.activePlayerSlot : STATE.activeOpponentSlot;
      let movesets = activeSide === 'player' ? STATE.playerSelectedMoves : STATE.opponentSelectedMoves;
      
      if (!movesets[slot]) {
        movesets[slot] = [];
      }
      let list = movesets[slot];
      
      if (isChecked) {
        if (list.length >= 4) {
          e.target.checked = false;
          alert("You can select up to 4 moves only.");
          return;
        }
        list.push(getMoveDetails(moveName));
      } else {
        if (list.length <= 1) {
          e.target.checked = true;
          alert("You must keep at least 1 active move.");
          return;
        }
        list = list.filter(m => m.name.toLowerCase().replace(/ /g, '-') !== moveName);
      }
      
      movesets[slot] = list;
      selectedCountSpan.textContent = list.length;
      
      playSfx('select');
    });
  });
}

// ------------------------------------------
// 6. BATTLE LOOPS & MECHANICS
// ------------------------------------------

// Initialize Arena state
// Initialize Arena state
async function startBattle() {
  initAudio();
  
  // Filter selected team members
  STATE.playerActiveTeam = STATE.playerTeam.filter(p => p !== null);
  if (STATE.playerActiveTeam.length === 0) {
    alert("Please select at least 1 Pokémon for your team!");
    return;
  }
  
  // Prepare Opponent team
  if (STATE.opponentMode === 'random') {
    STATE.opponentActiveTeam = [];
    const popularCPU = ['blastoise', 'venusaur', 'garchomp', 'arceus', 'eevee', 'gyarados'];
    const loader = document.getElementById('opponent-loader');
    if (loader) loader.classList.remove('hidden');
    
    try {
      // Pick 6 random ids
      for (let i = 0; i < 6; i++) {
        let randomId = Math.floor(Math.random() * 800) + 1;
        let data = await fetchPokemonData(randomId);
        STATE.opponentActiveTeam.push(data);
        STATE.opponentSelectedMoves[i] = selectAutoMoves(data.learnableMovesList);
      }
    } catch (e) {
      // Offline / rate-limit fallback
      STATE.opponentActiveTeam = [];
      for (let i = 0; i < popularCPU.length; i++) {
        let data = await fetchPokemonData(popularCPU[i]);
        STATE.opponentActiveTeam.push(data);
        STATE.opponentSelectedMoves[i] = selectAutoMoves(data.learnableMovesList);
      }
    } finally {
      if (loader) loader.classList.add('hidden');
    }
  } else {
    STATE.opponentActiveTeam = STATE.opponentTeam.filter(p => p !== null);
    if (STATE.opponentActiveTeam.length === 0) {
      alert("Please select at least 1 Pokémon for the Opponent team!");
      return;
    }
  }

  // Reset health and stats for active teams
  STATE.playerActiveTeam.forEach((p, idx) => {
    p.currentHP = p.maxHP;
    p.ultimatePercent = 0;
  });
  STATE.opponentActiveTeam.forEach((p, idx) => {
    p.currentHP = p.maxHP;
    p.ultimatePercent = 0;
  });

  // Find first alive Pokémon index
  STATE.activePlayerIndex = STATE.playerActiveTeam.findIndex(p => p.currentHP > 0);
  STATE.activeOpponentIndex = STATE.opponentActiveTeam.findIndex(p => p.currentHP > 0);

  STATE.battleActive = true;
  STATE.isPlayerTurn = true;
  
  // Transition Screens
  document.getElementById('selection-screen').classList.add('hidden');
  document.getElementById('battle-screen').classList.remove('hidden');
  
  // Initialize Arena graphics
  renderBattlefieldHud();
  renderPartyHUD('player');
  renderPartyHUD('opponent');
  updateArenaBackdrop();
  
  // Print initial state
  const log = document.getElementById('battle-log');
  const playerActivePoke = STATE.playerActiveTeam[STATE.activePlayerIndex];
  const opponentActivePoke = STATE.opponentActiveTeam[STATE.activeOpponentIndex];
  log.innerHTML = `<p class="log-entry system-log">An arena battle begins! Go, <strong>${playerActivePoke.name.toUpperCase()}</strong>!</p>`;
  logBattleMsg(`Opponent sent out <strong>${opponentActivePoke.name.toUpperCase()}</strong>!`, 'opponent-log');
  
  playSfx('select');
  
  if (STATE.soundEnabled && audioCtx) {
    playBgmLoop();
  }
  
  enableBattleActions(true);
}

// Dynamically style the battleground based on Pokémon types or active selected map
function updateArenaBackdrop() {
  const arena = document.getElementById('battle-field');
  const activeMapKey = STATE.activeMap || 'default';
  const mapData = MAPS_DATABASE[activeMapKey] || MAPS_DATABASE.default;
  
  // Remove existing type backdrops
  arena.className = `battle-field map-${mapData.id}`;
  arena.style.background = `${mapData.gradient}, linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)`;
  arena.style.backgroundSize = 'cover, 40px 40px, 40px 40px';
  
  // Re-generate custom particles matching map theme
  createBackgroundParticles();
}

// Render active player details in Battle Arena
function renderBattlefieldHud() {
  const activePlayerPoke = STATE.playerActiveTeam[STATE.activePlayerIndex];
  const activeOpponentPoke = STATE.opponentActiveTeam[STATE.activeOpponentIndex];
  
  if (!activePlayerPoke || !activeOpponentPoke) return;

  // Player
  document.getElementById('bt-player-name').textContent = activePlayerPoke.name;
  document.getElementById('bt-player-level').textContent = LEVEL;
  document.getElementById('bt-player-sprite').src = activePlayerPoke.backSprite || activePlayerPoke.frontSprite;
  document.getElementById('bt-player-types').innerHTML = activePlayerPoke.types.map(t => `<span class="type-pill" style="background-color: var(--type-${t})">${t}</span>`).join('');
  
  // Opponent
  document.getElementById('bt-opponent-name').textContent = activeOpponentPoke.name;
  document.getElementById('bt-opponent-level').textContent = LEVEL;
  document.getElementById('bt-opponent-sprite').src = activeOpponentPoke.frontSprite;
  document.getElementById('bt-opponent-types').innerHTML = activeOpponentPoke.types.map(t => `<span class="type-pill" style="background-color: var(--type-${t})">${t}</span>`).join('');
  
  // Reset sprites fainted states
  document.getElementById('bt-player-sprite').classList.remove('fade-in-faint');
  document.getElementById('bt-opponent-sprite').classList.remove('fade-in-faint');

  // Update Stats values
  updateHpBar('player', activePlayerPoke.currentHP, activePlayerPoke.maxHP);
  updateHpBar('opponent', activeOpponentPoke.currentHP, activeOpponentPoke.maxHP);
  
  updateUltMeter('player', activePlayerPoke.ultimatePercent);
  updateUltMeter('opponent', activeOpponentPoke.ultimatePercent);
  
  // Populate Player active combat moves
  const movesGrid = document.getElementById('battle-moves-grid');
  movesGrid.innerHTML = '';
  
  // Map index of activePlayerSlot
  const originalSlot = STATE.playerTeam.indexOf(activePlayerPoke);
  const activeMoves = STATE.playerSelectedMoves[originalSlot] || [];
  
  activeMoves.slice(0, 4).forEach((move, index) => {
    const btn = document.createElement('button');
    btn.className = `move-btn move-accent-${move.type}`;
    btn.id = `bt-move-btn-${index}`;
    btn.innerHTML = `
      <span class="move-btn-name">${move.name}</span>
      <div class="move-btn-meta">
        <span>${move.type.toUpperCase()}</span>
        <span>Pwr: ${move.power}</span>
      </div>
    `;
    btn.addEventListener('click', () => executePlayerTurn(move));
    movesGrid.appendChild(btn);
  });
  
  // Ultimate Button setup
  const ultBtn = document.getElementById('ultimate-move-btn');
  const ultAttack = getUltimateAttack(activePlayerPoke);
  ultBtn.querySelector('.ult-label').textContent = ultAttack.name;
}

// Render party Pokeballs row in battle HUD
function renderPartyHUD(side) {
  const team = side === 'player' ? STATE.playerActiveTeam : STATE.opponentActiveTeam;
  const activeIndex = side === 'player' ? STATE.activePlayerIndex : STATE.activeOpponentIndex;
  
  const balls = document.querySelectorAll(`#bt-${side}-party .hud-party-ball`);
  
  balls.forEach((ball, idx) => {
    ball.className = 'hud-party-ball';
    
    if (idx >= team.length) {
      ball.classList.add('empty');
      ball.style.display = 'none';
    } else {
      ball.style.display = 'block';
      const pokemon = team[idx];
      if (pokemon.currentHP <= 0) {
        ball.classList.add('fainted');
      } else if (idx === activeIndex) {
        ball.classList.add('active');
      } else {
        ball.classList.add('ready');
      }
    }
  });
}

// Update specific HP meters in UI
function updateHpBar(side, current, max) {
  const pct = Math.max(0, Math.floor((current / max) * 100));
  const bar = document.getElementById(`bt-${side}-hp-bar`);
  const num = document.getElementById(`bt-${side}-hp-num`);
  
  bar.style.width = `${pct}%`;
  num.textContent = `${current}/${max}`;
  
  bar.className = 'hud-bar-inner';
  if (pct > 50) {
    bar.classList.add('hp-bar-green');
  } else if (pct > 20) {
    bar.classList.add('hp-bar-yellow');
  } else {
    bar.classList.add('hp-bar-red');
  }
}

// Update Ultimate meter HUD
function updateUltMeter(side, pct) {
  const percent = Math.min(100, Math.max(0, pct));
  const bar = document.getElementById(`bt-${side}-ult-bar`);
  const num = document.getElementById(`bt-${side}-ult-num`);
  
  bar.style.width = `${percent}%`;
  num.textContent = `${percent}%`;
  
  if (side === 'player') {
    const btn = document.getElementById('ultimate-move-btn');
    const label = document.getElementById('ult-charge-percent');
    label.textContent = `${percent}% Charged`;
    
    if (percent >= 100) {
      btn.classList.add('charged');
      btn.disabled = false;
      btn.classList.remove('btn-locked');
    } else {
      btn.classList.remove('charged');
      btn.disabled = true;
      btn.classList.add('btn-locked');
    }
  }
}

// Lock/Unlock control inputs during moves execution
function enableBattleActions(enable) {
  const moveButtons = document.querySelectorAll('.battle-moves-grid button');
  moveButtons.forEach(btn => {
    btn.disabled = !enable;
    if (enable) btn.classList.remove('btn-locked');
    else btn.classList.add('btn-locked');
  });

  const ultBtn = document.getElementById('ultimate-move-btn');
  const activePlayerPoke = STATE.playerActiveTeam[STATE.activePlayerIndex];
  if (!enable || !activePlayerPoke) {
    ultBtn.disabled = true;
    ultBtn.classList.remove('charged');
    ultBtn.classList.add('btn-locked');
  } else {
    if (activePlayerPoke.ultimatePercent >= 100) {
      ultBtn.disabled = false;
      ultBtn.classList.add('charged');
      ultBtn.classList.remove('btn-locked');
    } else {
      ultBtn.disabled = true;
      ultBtn.classList.remove('charged');
      ultBtn.classList.add('btn-locked');
    }
  }
  
  document.getElementById('switch-menu-btn').disabled = !enable;
  document.getElementById('forfeit-btn').disabled = !enable;
}

// Print customized messages to log feed
function logBattleMsg(msg, cssClass = 'system-log') {
  const logContent = document.getElementById('battle-log');
  const p = document.createElement('p');
  p.className = `log-entry ${cssClass}`;
  p.innerHTML = msg;
  logContent.appendChild(p);
  logContent.scrollTop = logContent.scrollHeight;
}

// ------------------------------------------
// 7. BATTLE EXECUTION ENGINE
// ------------------------------------------

// Main player combat trigger
async function executePlayerTurn(playerMove) {
  if (!STATE.battleActive || !STATE.isPlayerTurn) return;
  
  enableBattleActions(false);
  
  const playerPoke = STATE.playerActiveTeam[STATE.activePlayerIndex];
  const cpuPoke = STATE.opponentActiveTeam[STATE.activeOpponentIndex];
  
  // 2. Select CPU Opponent Move
  let cpuMove = null;
  if (cpuPoke.ultimatePercent >= 100 && Math.random() < 0.8) {
    cpuMove = getUltimateAttack(cpuPoke);
  } else {
    const oppOriginalSlot = STATE.opponentTeam.indexOf(cpuPoke);
    const cpuMoves = STATE.opponentSelectedMoves[oppOriginalSlot] || [];
    cpuMove = cpuMoves[Math.floor(Math.random() * cpuMoves.length)] || { ...ICONIC_MOVES_DATABASE['tackle'] };
  }

  // 3. Determine Speed Turn priority
  const playerSpeed = playerPoke.stats.speed;
  const opponentSpeed = cpuPoke.stats.speed;
  
  let firstActor, firstMove, secondActor, secondMove, firstSide, secondSide;
  
  if (playerSpeed > opponentSpeed || (playerSpeed === opponentSpeed && Math.random() < 0.5)) {
    firstActor = playerPoke;
    firstMove = playerMove;
    firstSide = 'player';
    
    secondActor = cpuPoke;
    secondMove = cpuMove;
    secondSide = 'opponent';
  } else {
    firstActor = cpuPoke;
    firstMove = cpuMove;
    firstSide = 'opponent';
    
    secondActor = playerPoke;
    secondMove = playerMove;
    secondSide = 'player';
  }

  // Execute First attack
  await runMoveExecution(firstActor, secondActor, firstMove, firstSide, secondSide);
  
  // Check for death before second actor acts
  if (secondActor.currentHP <= 0) {
    await handleFaintTransition(secondSide);
    return;
  }
  
  // Execute Second attack
  await runMoveExecution(secondActor, firstActor, secondMove, secondSide, firstSide);
  
  if (firstActor.currentHP <= 0) {
    await handleFaintTransition(firstSide);
    return;
  }

  // If both alive, prepare next turn
  enableBattleActions(true);
}

// Play Cinematic Fullscreen Overlay for Super Ultimate Attacks
function playUltimateCinematic(attacker, ultimateMove) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('ultimate-cinematic-overlay');
    const pokeNameSpan = document.getElementById('cinematic-poke-name');
    const moveNameSpan = document.getElementById('cinematic-move-name');
    const spriteImg = document.getElementById('cinematic-sprite');
    
    if (!overlay) {
      resolve();
      return;
    }
    
    // Set text contents
    pokeNameSpan.textContent = attacker.name;
    moveNameSpan.textContent = ultimateMove.name;
    spriteImg.src = attacker.frontSprite || attacker.backSprite;
    
    // Update border color based on type
    const banner = overlay.querySelector('.cinematic-banner');
    if (banner) {
      const typeColor = `var(--type-${ultimateMove.type})`;
      banner.style.borderColor = typeColor;
      moveNameSpan.style.color = typeColor;
      moveNameSpan.style.textShadow = `0 0 15px ${typeColor}`;
      if (spriteImg) {
        spriteImg.style.filter = `drop-shadow(0 0 25px ${typeColor})`;
      }
    }
    
    overlay.classList.remove('hidden');
    playSfx('ultimate');
    
    setTimeout(() => {
      overlay.classList.add('hidden');
      resolve();
    }, 1500);
  });
}

// Execute combat damage computation, animations, sounds, and states
function runMoveExecution(attacker, defender, move, attackerSide, defenderSide) {
  return new Promise(async (resolve) => {
    const isUlt = move.isUltimate;
    if (isUlt) {
      await playUltimateCinematic(attacker, move);
    }
    const moveGlowClass = isUlt ? 'crit-log' : (attackerSide === 'player' ? 'player-log' : 'opponent-log');
    const moveDecor = isUlt ? '⭐ ULTIMATE: ' : '';
    
    logBattleMsg(`<strong>${attacker.name.toUpperCase()}</strong> used ${moveDecor}<strong>${move.name.toUpperCase()}</strong>!`, moveGlowClass);
    
    // Play attack animation
    const attackerSprite = document.getElementById(`bt-${attackerSide}-sprite`);
    attackerSprite.classList.add(`sprite-attack-${attackerSide}`);
    
    if (isUlt) {
      playSfx('ultimate');
      const field = document.getElementById('battle-field');
      field.style.boxShadow = 'inset 0 0 100px rgba(255, 183, 3, 0.8)';
      setTimeout(() => {
        field.style.boxShadow = '';
      }, 800);
    }
    
    setTimeout(() => {
      attackerSprite.classList.remove(`sprite-attack-${attackerSide}`);
    }, 450);

    setTimeout(() => {
      const outcome = calculateDamage(attacker, defender, move);
      
      if (outcome.isMiss) {
        logBattleMsg(`The attack missed!`, 'system-log');
        playSfx('miss');
        spawnDamageNumber(0, false, true, false, defenderSide === 'player');
        
        chargeUltimatePercent(attacker, 10);
        updateUltMeter(attackerSide, attacker.ultimatePercent);
        resolve();
      } else {
        defender.currentHP = Math.max(0, defender.currentHP - outcome.damage);
        updateHpBar(defenderSide, defender.currentHP, defender.maxHP);
        renderPartyHUD(defenderSide);
        
        spawnCombatEffect(defenderSide === 'player');
        const defenderSprite = document.getElementById(`bt-${defenderSide}-sprite`);
        const defenderHud = document.querySelector(`.hud-${defenderSide}`);
        
        defenderSprite.classList.add('sprite-hit');
        defenderHud.classList.add('shake-hud');
        
        setTimeout(() => {
          defenderSprite.classList.remove('sprite-hit');
          defenderHud.classList.remove('shake-hud');
        }, 300);

        if (outcome.isCrit) {
          playSfx('crit');
        } else {
          playSfx('hit');
        }

        spawnDamageNumber(outcome.damage, outcome.isCrit, false, false, defenderSide === 'player');

        if (outcome.isCrit) logBattleMsg(`Critical hit!`, 'crit-log');
        if (outcome.mapMultiplier > 1.0) {
          logBattleMsg(`The battlefield boosted the attack's power!`, 'crit-log');
        } else if (outcome.mapMultiplier < 1.0) {
          logBattleMsg(`The battlefield weakened the attack's power...`, 'system-log');
        }
        if (outcome.multiplier > 1) {
          logBattleMsg(`It's super effective!`, 'crit-log');
        } else if (outcome.multiplier > 0 && outcome.multiplier < 1) {
          logBattleMsg(`It's not very effective...`, 'system-log');
        } else if (outcome.multiplier === 0) {
          logBattleMsg(`It has no effect on <strong>${defender.name.toUpperCase()}</strong>.`, 'system-log');
        }

        logBattleMsg(`<strong>${defender.name.toUpperCase()}</strong> took ${outcome.damage} damage!`, defenderSide === 'player' ? 'opponent-log' : 'player-log');

        const attackCharge = isUlt ? 0 : (20 + (outcome.isCrit ? 15 : 0));
        chargeUltimatePercent(attacker, attackCharge, isUlt);
        
        const defenseCharge = Math.floor((outcome.damage / defender.maxHP) * 55);
        chargeUltimatePercent(defender, defenseCharge);

        updateUltMeter(attackerSide, attacker.ultimatePercent);
        updateUltMeter(defenderSide, defender.ultimatePercent);
        resolve();
      }
    }, 300);
  });
}

// Adjust Ultimate power percent values
function chargeUltimatePercent(pokemon, amount, isReset = false) {
  if (isReset) {
    pokemon.ultimatePercent = 0;
  } else {
    pokemon.ultimatePercent = Math.min(100, pokemon.ultimatePercent + amount);
  }
}

// Handle faint states and force switches or check match end
async function handleFaintTransition(faintedSide) {
  const team = faintedSide === 'player' ? STATE.playerActiveTeam : STATE.opponentActiveTeam;
  const faintedIndex = faintedSide === 'player' ? STATE.activePlayerIndex : STATE.activeOpponentIndex;
  const faintedPoke = team[faintedIndex];

  logBattleMsg(`<strong>${faintedPoke.name.toUpperCase()}</strong> fainted!`, faintedSide === 'player' ? 'opponent-log' : 'player-log');
  
  // Play faint sprite animation
  const sprite = document.getElementById(`bt-${faintedSide}-sprite`);
  sprite.classList.add('fade-in-faint');
  playSfx('defeat');
  
  renderPartyHUD(faintedSide);
  
  // Check if survivors exist
  const hasSurvivors = team.some(p => p.currentHP > 0);
  
  if (!hasSurvivors) {
    // Game Over
    handleBattleOver();
    return;
  }

  if (faintedSide === 'player') {
    // Force Player teammate select
    openForcedSwitchOverlay();
  } else {
    // CPU Autoselect next survivor index
    setTimeout(() => {
      const nextIndex = team.findIndex(p => p.currentHP > 0);
      STATE.activeOpponentIndex = nextIndex;
      const nextPoke = team[nextIndex];
      
      logBattleMsg(`CPU sent out <strong>${nextPoke.name.toUpperCase()}</strong>!`, 'opponent-log');
      
      renderBattlefieldHud();
      renderPartyHUD('opponent');
      playSfx('select');
      
      // Allow player input for next turn
      enableBattleActions(true);
    }, 1200);
  }
}

// Open sliding party tray for manual switch
function togglePartySwitchPanel(show) {
  const panel = document.getElementById('party-switch-panel');
  if (!panel) return;
  
  if (show) {
    populatePartyListHTML('party-members-list', false);
    panel.classList.remove('hidden');
    playSfx('select');
  } else {
    panel.classList.add('hidden');
  }
}

// Open Forced Switch overlay modal
function openForcedSwitchOverlay() {
  const overlay = document.getElementById('forced-switch-overlay');
  populatePartyListHTML('forced-party-list', true);
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
  }
}

// Populate switch panels party cards list
function populatePartyListHTML(containerId, isForced = false) {
  const listContainer = document.getElementById(containerId);
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  STATE.playerActiveTeam.forEach((pokemon, idx) => {
    const card = document.createElement('div');
    card.className = 'party-card';
    
    const isFainted = pokemon.currentHP <= 0;
    const isActive = idx === STATE.activePlayerIndex;
    
    if (isFainted) card.classList.add('disabled');
    if (isActive) card.classList.add('active-combatant');
    
    const hpPct = Math.floor((pokemon.currentHP / pokemon.maxHP) * 100);
    
    card.innerHTML = `
      <img class="party-card-sprite" src="${pokemon.frontSprite}" alt="${pokemon.name}">
      <span class="party-card-name">${pokemon.name}</span>
      <div class="party-card-hp">
        <div class="party-card-hp-label">
          <span>HP</span>
          <span>${pokemon.currentHP}/${pokemon.maxHP}</span>
        </div>
        <div class="stat-bar-outer" style="height:4px; margin:0;">
          <div class="stat-bar-inner" style="width: ${hpPct}%; background-color: ${hpPct > 50 ? 'var(--color-green)' : (hpPct > 20 ? 'var(--color-gold)' : 'var(--color-red)')}"></div>
        </div>
      </div>
    `;
    
    if (!isFainted && !isActive) {
      card.addEventListener('click', () => {
        if (isForced) {
          executeForcedSwitch(idx);
        } else {
          executeManualSwitch(idx);
        }
      });
    }
    
    listContainer.appendChild(card);
  });
}

// Process manual swap turn spending
async function executeManualSwitch(targetIndex) {
  togglePartySwitchPanel(false);
  enableBattleActions(false);
  
  const oldPoke = STATE.playerActiveTeam[STATE.activePlayerIndex];
  STATE.activePlayerIndex = targetIndex;
  const newPoke = STATE.playerActiveTeam[targetIndex];
  
  logBattleMsg(`You withdrew <strong>${oldPoke.name.toUpperCase()}</strong> and sent out <strong>${newPoke.name.toUpperCase()}</strong>!`, 'player-log');
  
  // Swap HUD, types, sprites
  renderBattlefieldHud();
  renderPartyHUD('player');
  updateArenaBackdrop();
  playSfx('select');
  
  // Let CPU take a free attack on incoming teammate
  setTimeout(async () => {
    if (!STATE.battleActive) return;
    
    const cpuPoke = STATE.opponentActiveTeam[STATE.activeOpponentIndex];
    let cpuMove = null;
    if (cpuPoke.ultimatePercent >= 100 && Math.random() < 0.8) {
      cpuMove = getUltimateAttack(cpuPoke);
    } else {
      const oppOriginalSlot = STATE.opponentTeam.indexOf(cpuPoke);
      const cpuMoves = STATE.opponentSelectedMoves[oppOriginalSlot] || [];
      cpuMove = cpuMoves[Math.floor(Math.random() * cpuMoves.length)] || { ...ICONIC_MOVES_DATABASE['tackle'] };
    }
    
    await runMoveExecution(cpuPoke, newPoke, cpuMove, 'opponent', 'player');
    
    if (newPoke.currentHP <= 0) {
      await handleFaintTransition('player');
      return;
    }
    
    enableBattleActions(true);
  }, 1200);
}

// Process faint swap restart turn
function executeForcedSwitch(targetIndex) {
  const overlay = document.getElementById('forced-switch-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('visible');
  }
  
  STATE.activePlayerIndex = targetIndex;
  const newPoke = STATE.playerActiveTeam[targetIndex];
  
  logBattleMsg(`Go! <strong>${newPoke.name.toUpperCase()}</strong>!`, 'player-log');
  
  renderBattlefieldHud();
  renderPartyHUD('player');
  updateArenaBackdrop();
  playSfx('select');
  
  enableBattleActions(true);
}

// Triggers end of combat win/loss states
function handleBattleOver() {
  STATE.battleActive = false;
  enableBattleActions(false);
  
  const playerWon = STATE.playerActiveTeam.some(p => p.currentHP > 0);
  
  const overlay = document.getElementById('battle-overlay');
  const title = document.getElementById('overlay-title');
  const msg = document.getElementById('overlay-message');
  const sprite = document.getElementById('overlay-sprite');

  if (overlay) overlay.classList.add('visible');
  
  if (playerWon) {
    if (title) {
      title.textContent = 'VICTORY!';
      title.style.color = 'var(--color-gold)';
      title.style.textShadow = '0 0 20px rgba(255, 183, 3, 0.6)';
    }
    const survivor = STATE.playerActiveTeam.find(p => p.currentHP > 0);
    if (msg) msg.innerHTML = `Your team defeated all opponent Pokémon!`;
    if (sprite && survivor) sprite.src = survivor.frontSprite;
    playSfx('victory');
  } else {
    if (title) {
      title.textContent = 'DEFEAT!';
      title.style.color = 'var(--color-red)';
      title.style.textShadow = '0 0 20px rgba(255, 51, 102, 0.6)';
    }
    const cpuSurvivor = STATE.opponentActiveTeam.find(p => p.currentHP > 0);
    if (msg) msg.innerHTML = `All your Pokémon fainted. CPU wins.`;
    if (sprite && cpuSurvivor) sprite.src = cpuSurvivor.frontSprite;
    playSfx('defeat');
  }
}

// Restart match using current Pokemon selections
function restartMatch() {
  document.getElementById('battle-overlay').classList.remove('visible');
  startBattle();
}

// Return to character custom select screens
function exitToSelectionScreen() {
  document.getElementById('battle-overlay').classList.remove('visible');
  document.getElementById('battle-screen').classList.add('hidden');
  document.getElementById('selection-screen').classList.remove('hidden');
  document.getElementById('selection-screen').classList.add('visible');
  
  // Re-enable Slot UIs
  STATE.playerTeam.forEach((p, idx) => updateSlotUI('player', idx));
  if (STATE.opponentMode === 'manual') {
    STATE.opponentTeam.forEach((p, idx) => updateSlotUI('opponent', idx));
  }
  
  checkStartBattleValidity();
  stopBgmLoop();
  playSfx('select');
}

// Forfeit/Flee current battle
function forfeitMatch() {
  if (confirm("Are you sure you want to forfeit this battle?")) {
    logBattleMsg(`You withdrew your team and fled the battle grounds!`);
    STATE.playerActiveTeam.forEach(p => p.currentHP = 0);
    renderPartyHUD('player');
    handleBattleOver();
  }
}

// Render dynamic tabs and chips for popular selection
function renderQuickSelectTabs(side) {
  const tabsContainer = document.getElementById(`${side}-quick-tabs`);
  const chipsContainer = document.getElementById(`${side}-quick-chips`);
  if (!tabsContainer || !chipsContainer) return;

  tabsContainer.innerHTML = '';
  
  Object.keys(POPULAR_POKEMON_CATEGORIES).forEach((catKey, idx) => {
    const cat = POPULAR_POKEMON_CATEGORIES[catKey];
    const btn = document.createElement('button');
    btn.className = `tab-btn ${idx === 0 ? 'active' : ''}`;
    btn.setAttribute('data-category', catKey);
    btn.textContent = cat.name;
    
    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderChipsForCategory(side, catKey);
      playSfx('select');
    });
    
    tabsContainer.appendChild(btn);
  });
  
  renderChipsForCategory(side, Object.keys(POPULAR_POKEMON_CATEGORIES)[0]);
}

function renderChipsForCategory(side, catKey) {
  const chipsContainer = document.getElementById(`${side}-quick-chips`);
  if (!chipsContainer) return;
  
  chipsContainer.innerHTML = '';
  const pokemonList = POPULAR_POKEMON_CATEGORIES[catKey].pokemon;
  
  pokemonList.forEach(pokeName => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.setAttribute('data-name', pokeName);
    btn.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
    
    btn.addEventListener('click', () => {
      chipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      btn.classList.add('selected');
      if (side === 'player') {
        selectPlayerPokemon(pokeName);
      } else {
        selectOpponentPokemon(pokeName);
      }
    });
    
    chipsContainer.appendChild(btn);
  });
}

// ------------------------------------------
// 8. DOM BINDINGS & LISTENERS
// ------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  createBackgroundParticles();

  // Pre-populate teams on load to allow immediate play
  const defaultPlayerNames = ['pikachu', 'charizard', 'greninja', 'gengar', 'lucario', 'gardevoir'];
  const defaultOpponentNames = ['blastoise', 'venusaur', 'garchomp', 'arceus', 'eevee', 'gyarados'];
  
  // Load default Teams in slots
  const loadInitialTeams = async () => {
    // Show spinner during initial setup load
    const pLoader = document.getElementById('player-loader');
    if (pLoader) pLoader.classList.remove('hidden');
    
    try {
      for (let i = 0; i < 6; i++) {
        const pData = await fetchPokemonData(defaultPlayerNames[i]);
        STATE.playerTeam[i] = pData;
        STATE.playerSelectedMoves[i] = selectAutoMoves(pData.learnableMovesList);
        updateSlotUI('player', i);
        
        const oData = await fetchPokemonData(defaultOpponentNames[i]);
        STATE.opponentTeam[i] = oData;
        STATE.opponentSelectedMoves[i] = selectAutoMoves(oData.learnableMovesList);
        updateSlotUI('opponent', i);
      }
      
      // Default select Slot 0
      selectSlot('player', 0);
      selectSlot('opponent', 0);
      
      checkStartBattleValidity();
    } catch (e) {
      console.error("Error preloading initial teams:", e);
    } finally {
      if (pLoader) pLoader.classList.add('hidden');
    }
  };
  
  await loadInitialTeams();

  // Bind Slot selector button click handlers
  document.getElementById('player-team-slots').addEventListener('click', (e) => {
    const btn = e.target.closest('.slot-btn');
    if (btn) {
      const slot = btn.getAttribute('data-slot');
      selectSlot('player', slot);
      playSfx('select');
    }
  });

  document.getElementById('opponent-team-slots').addEventListener('click', (e) => {
    const btn = e.target.closest('.slot-btn');
    if (btn) {
      const slot = btn.getAttribute('data-slot');
      selectSlot('opponent', slot);
      playSfx('select');
    }
  });

  // Search input Player bind
  document.getElementById('player-search-btn').addEventListener('click', () => {
    const query = document.getElementById('player-search-input').value;
    if (query) selectPlayerPokemon(query);
  });
  
  document.getElementById('player-search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = document.getElementById('player-search-input').value;
      if (query) selectPlayerPokemon(query);
    }
  });

  // Search input Opponent bind
  document.getElementById('opponent-search-btn').addEventListener('click', () => {
    const query = document.getElementById('opponent-search-input').value;
    if (query) selectOpponentPokemon(query);
  });
  
  document.getElementById('opponent-search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = document.getElementById('opponent-search-input').value;
      if (query) selectOpponentPokemon(query);
    }
  });

  // Render popular selection category tabs and chips
  renderQuickSelectTabs('player');
  renderQuickSelectTabs('opponent');

  // Opponent mode toggle selectors
  document.getElementById('opt-random-btn').addEventListener('click', (e) => {
    document.getElementById('opt-random-btn').classList.add('active');
    document.getElementById('opt-manual-btn').classList.remove('active');
    
    document.getElementById('opponent-manual-search').classList.add('hidden');
    document.getElementById('opponent-quick-select').classList.add('hidden');
    document.getElementById('opponent-moves-section').classList.add('hidden');
    document.getElementById('opponent-team-wrapper').classList.add('hidden');
    
    const preview = document.getElementById('opponent-preview');
    if (preview) {
      preview.classList.add('empty');
      const previewContent = preview.querySelector('.preview-content');
      if (previewContent) {
        previewContent.innerHTML = `
          <div class="random-opponent-card">
            <span class="mystery-symbol">?</span>
            <p>Opponent team will be selected randomly when the battle starts.</p>
          </div>
        `;
      }
    }
    
    STATE.opponentMode = 'random';
    playSfx('select');
    checkStartBattleValidity();
  });

  document.getElementById('opt-manual-btn').addEventListener('click', (e) => {
    document.getElementById('opt-manual-btn').classList.add('active');
    document.getElementById('opt-random-btn').classList.remove('active');
    
    document.getElementById('opponent-manual-search').classList.remove('hidden');
    document.getElementById('opponent-quick-select').classList.remove('hidden');
    document.getElementById('opponent-team-wrapper').classList.remove('hidden');
    
    STATE.opponentMode = 'manual';
    selectSlot('opponent', STATE.activeOpponentSlot);
    playSfx('select');
    checkStartBattleValidity();
  });

  // Map selector click bindings
  const mapGrid = document.getElementById('map-options-grid');
  if (mapGrid) {
    mapGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.map-card');
      if (card) {
        mapGrid.querySelectorAll('.map-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        STATE.activeMap = card.getAttribute('data-map');
        playSfx('select');
      }
    });
  }

  // Ready battle start action
  document.getElementById('start-battle-btn').addEventListener('click', () => {
    startBattle();
  });

  // Ultimate activation action
  document.getElementById('ultimate-move-btn').addEventListener('click', () => {
    const activePlayerPoke = STATE.playerActiveTeam[STATE.activePlayerIndex];
    if (activePlayerPoke && activePlayerPoke.ultimatePercent >= 100) {
      const ultimateAttack = getUltimateAttack(activePlayerPoke);
      executePlayerTurn(ultimateAttack);
    }
  });

  // Switch Teammate actions panel triggers
  document.getElementById('switch-menu-btn').addEventListener('click', () => {
    togglePartySwitchPanel(true);
  });
  
  document.getElementById('close-switch-panel-btn').addEventListener('click', () => {
    togglePartySwitchPanel(false);
  });

  // End Overlays Actions
  document.getElementById('overlay-restart-btn').addEventListener('click', () => {
    restartMatch();
  });
  
  document.getElementById('overlay-select-screen-btn').addEventListener('click', () => {
    exitToSelectionScreen();
  });

  // Mute / Sound control toggle
  document.getElementById('sound-toggle-btn').addEventListener('click', (e) => {
    STATE.soundEnabled = !STATE.soundEnabled;
    const soundLabel = document.getElementById('sound-toggle-btn');
    
    if (STATE.soundEnabled) {
      soundLabel.innerHTML = `<span class="sound-icon">🔊</span> SOUND ON`;
      initAudio();
      if (STATE.battleActive) {
        playBgmLoop();
      }
    } else {
      soundLabel.innerHTML = `<span class="sound-icon">🔇</span> SOUND OFF`;
      stopBgmLoop();
    }
  });

  // Forfeit button
  document.getElementById('forfeit-btn').addEventListener('click', () => {
    forfeitMatch();
  });
});
