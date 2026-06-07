// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';

// --- GAME CONFIGURATION & DATA ---
const PLANES = [
  { 
    id: 'scrap', 
    name: 'Scrap Glider', 
    cost: 0, 
    color: '#9CA3AF', // Gray
    speed: 5, 
    fireRate: 40, // Frames between shots (lower is faster)
    hp: 3, 
    damage: 1, 
    bullets: 1,
    desc: 'Barely holding together. Single shot.'
  },
  { 
    id: 'planeshooter', 
    name: 'Plane Shooter', 
    cost: 75, 
    color: '#10B981', // Emerald Green
    speed: 8, 
    fireRate: 30, 
    hp: 4, 
    damage: 1, 
    bullets: 4,
    desc: 'Specialized barrel design. Fires 4 curving shots.'
  },
  {
    id: 'luckylight',
    name: 'Lucky Light',
    cost: 100,
    color: '#86EFAC', // Light Green
    speed: 8,
    fireRate: 20,
    hp: 5,
    damage: 1,
    bullets: 2,
    desc: '🍀 Event Skin! Fast and lucky double shot.'
  },
  { 
    id: 'fighter', 
    name: 'Sky Fighter', 
    cost: 150, 
    color: '#3B82F6', // Blue
    speed: 7, 
    fireRate: 25, 
    hp: 6, 
    damage: 1.5, 
    bullets: 2,
    desc: 'Reliable military surplus. Double shot.'
  },
  { 
    id: 'extremeshooter', 
    name: 'Extreme Shooter', 
    cost: 250, 
    color: '#DC2626', // Crimson Red
    speed: 12, 
    fireRate: 8, // Super fast fire rate
    hp: 9, 
    damage: 1, 
    bullets: 2,
    desc: 'Blistering speed and extreme rapid-fire capabilities.'
  },
  {
    id: 'shamrock',
    name: 'Shamrock Special',
    cost: 300,
    color: '#166534', // Special Green
    speed: 10,
    fireRate: 12,
    hp: 8,
    damage: 1.5,
    bullets: 3,
    desc: '🍀 Event Skin! Heavy hitting triple shot. Generates lucky extra scrap!'
  },
  {
    id: 'allyphantom',
    name: 'Ally Phantom',
    cost: 315,
    color: '#C084FC', // Purple
    speed: 9,
    fireRate: 20,
    hp: 11,
    damage: 2,
    bullets: 4,
    desc: 'Ghostly swarm! Starts with 1 ally. Spawns up to 23 allies on kill!'
  },
  { 
    id: 'ace', 
    name: 'Ace Phantom', 
    cost: 500, 
    color: '#F59E0B', // Gold/Orange
    speed: 9, 
    fireRate: 15, 
    hp: 12, 
    damage: 2, 
    bullets: 3,
    desc: 'State of the art technology. Triple spread shot.'
  },
  {
    id: 'april',
    name: 'April Plane',
    cost: 450,
    color: '#F472B6', // Pink
    speed: 7,
    fireRate: 20,
    hp: 8,
    damage: 1.5,
    bullets: 3,
    desc: 'Spring Special! Enemies drop eggs giving random powers (Speed, ATK, DEF, Multi-shot).'
  },
  {
    id: 'may',
    name: 'May Plane',
    cost: 600,
    color: '#F43F5E', // Rose
    speed: 10,
    fireRate: 25,
    hp: 10,
    damage: 5,
    bullets: 2,
    desc: "Mother's Day Special! Huge damage and spawns Motherships to protect you!"
  }
];

const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;

const SKILL_DEFS = {
  hp: { name: 'Reinforced Hull', desc: '+1 Max HP to all planes', baseCost: 500, maxLevel: 5, icon: '🛡️' },
  speed: { name: 'Engine Tuning', desc: '+1 Speed to all planes', baseCost: 600, maxLevel: 3, icon: '🚀' },
  scrap: { name: 'Salvage Scanner', desc: 'Bonus scrap from every bot', baseCost: 750, maxLevel: 5, icon: '📡' }
};

export default function App() {
  const [gameState, setGameState] = useState('lobby'); // 'lobby', 'skillshop', 'cutscene', 'playing', 'gameover', 'hangar'
  const [cutsceneStep, setCutsceneStep] = useState(0);
  const [totalScrap, setTotalScrap] = useState(0);
  const [unlockedPlanes, setUnlockedPlanes] = useState(['scrap']);
  const [currentPlaneId, setCurrentPlaneId] = useState('scrap');
  const [lastScore, setLastScore] = useState({ kills: 0, scrap: 0 });
  const [skills, setSkills] = useState({ hp: 0, speed: 0, scrap: 0 });

  // --- LOBBY COMPONENT ---
  const Lobby = () => {
    return (
      <div className="relative w-full h-screen bg-gray-900 flex flex-col items-center justify-center text-white overflow-hidden font-sans">
        {/* Event background flair */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex justify-center items-center opacity-10">
          <span className="text-[40rem]">🍀</span>
        </div>
        
        <div className="z-10 text-center flex flex-col items-center gap-8">
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-300 to-gray-600 drop-shadow-lg mb-2">
            SCRAP FIGHTER
          </h1>
          
          <div className="bg-green-900/80 border-2 border-green-500 p-6 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-pulse mb-4">
            <h2 className="text-3xl font-bold text-green-300 mb-2">🍀 MARCH LUCKY EVENT 🍀</h2>
            <p className="text-green-100 text-lg">Special light green & dark green planes now in the Hangar!</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <button 
              onClick={() => setGameState('skillshop')}
              className="px-8 py-6 bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white text-2xl font-bold rounded shadow-[0_0_15px_rgba(168,85,247,0.5)] transform hover:scale-105 transition-all flex flex-col items-center justify-center gap-2 border-2 border-purple-400"
            >
              <span className="text-3xl">🧠</span>
              <span>SKILLS</span>
            </button>
            
            <button 
              onClick={() => setGameState('cutscene')}
              className="px-20 py-6 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white text-4xl font-bold rounded shadow-[0_0_25px_rgba(59,130,246,0.6)] transform hover:scale-105 transition-all"
            >
              PLAY
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- SKILL SHOP COMPONENT ---
  const SkillShop = () => {
    const buySkill = (skillKey) => {
      const currentLevel = skills[skillKey];
      const def = SKILL_DEFS[skillKey];
      const cost = def.baseCost * (currentLevel + 1);
      
      if (totalScrap >= cost && currentLevel < def.maxLevel) {
        setTotalScrap(prev => prev - cost);
        setSkills(prev => ({ ...prev, [skillKey]: currentLevel + 1 }));
      }
    };

    return (
      <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">SKILL ACADEMY</h1>
        <p className="text-gray-400 mb-6">Permanent upgrades for all your planes.</p>
        
        <div className="flex items-center gap-2 mb-8 bg-gray-800 px-6 py-2 rounded-full border border-gray-700 shadow-inner">
          <span className="text-2xl">⚙️</span>
          <span className="text-2xl font-bold text-yellow-400">{totalScrap} Scrap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-12">
          {Object.entries(SKILL_DEFS).map(([key, def]) => {
            const currentLevel = skills[key];
            const isMaxed = currentLevel >= def.maxLevel;
            const cost = def.baseCost * (currentLevel + 1);
            const canAfford = totalScrap >= cost;

            return (
              <div key={key} className="bg-gray-800 border-2 border-purple-900/50 rounded-xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                {isMaxed && <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">MAXED</div>}
                
                <div className="text-5xl mb-4 bg-gray-900 p-4 rounded-full border border-gray-700">{def.icon}</div>
                <h2 className="text-2xl font-bold text-purple-300 mb-2">{def.name}</h2>
                <p className="text-sm text-gray-400 h-12 mb-4">{def.desc}</p>
                
                <div className="w-full bg-gray-900 rounded-full h-4 mb-6 border border-gray-700 overflow-hidden flex">
                  {Array.from({ length: def.maxLevel }).map((_, i) => (
                    <div key={i} className={`flex-1 h-full border-r border-gray-800 last:border-0 ${i < currentLevel ? 'bg-purple-500' : 'bg-transparent'}`}></div>
                  ))}
                </div>

                <div className="mt-auto w-full">
                  {isMaxed ? (
                    <button disabled className="w-full py-3 bg-gray-700 text-gray-500 font-bold rounded border border-gray-600 cursor-not-allowed">FULLY UPGRADED</button>
                  ) : (
                    <button 
                      onClick={() => buySkill(key)}
                      disabled={!canAfford}
                      className={`w-full py-3 font-bold rounded transition-colors flex justify-center items-center gap-2 ${canAfford ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                      <span>⚙️ {cost}</span>
                      <span>UPGRADE</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => setGameState('lobby')}
          className="px-10 py-4 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold rounded transition-all border border-gray-500"
        >
          RETURN TO LOBBY
        </button>
      </div>
    );
  };

  // --- CUTSCENE COMPONENT ---
  const Cutscene = () => {
    useEffect(() => {
      if (cutsceneStep === 0) {
        const timer = setTimeout(() => setCutsceneStep(1), 2000); // Plane falls
        return () => clearTimeout(timer);
      } else if (cutsceneStep === 1) {
        const timer = setTimeout(() => setCutsceneStep(2), 1500); // Crash explosion
        return () => clearTimeout(timer);
      }
    }, [cutsceneStep]);

    return (
      <div className="relative w-full h-screen bg-sky-900 overflow-hidden flex flex-col items-center justify-center text-white font-sans">
        {/* Background elements */}
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-blue-900 to-sky-900"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-green-900 to-green-800 border-t-4 border-green-700"></div>

        {/* Falling Plane Animation */}
        <div 
          className="absolute transition-all duration-[2000ms] ease-in"
          style={{
            top: cutsceneStep >= 1 ? '50%' : '-20%',
            left: cutsceneStep >= 1 ? '50%' : '20%',
            transform: `translate(-50%, -50%) rotate(${cutsceneStep >= 1 ? 75 : 45}deg)`,
            opacity: cutsceneStep >= 2 ? 0 : 1
          }}
        >
          <div className="w-16 h-4 bg-gray-400 rounded-full relative">
            <div className="absolute top-[-10px] left-4 w-6 h-24 bg-gray-500 rounded-sm"></div> {/* Wings */}
            <div className="absolute top-1 left-[-8px] w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div> {/* Fire */}
          </div>
        </div>

        {/* Explosion */}
        {cutsceneStep >= 1 && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              transform: `translate(-50%, -50%) scale(${cutsceneStep === 2 ? 3 : 0.5})`,
              opacity: cutsceneStep === 2 ? 1 : 0
            }}
          >
            <div className="w-32 h-32 bg-orange-600 rounded-full mix-blend-screen blur-md animate-pulse"></div>
            <div className="absolute top-4 left-4 w-24 h-24 bg-yellow-400 rounded-full mix-blend-screen blur-sm"></div>
            <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-full mix-blend-screen"></div>
          </div>
        )}

        {/* Smoke after explosion */}
        {cutsceneStep >= 2 && (
           <div className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-gray-800 rounded-full blur-xl opacity-80"></div>
        )}

        {/* UI Overlay */}
        <div className="z-10 mt-64 text-center flex flex-col items-center">
          {cutsceneStep === 2 && (
            <div className="animate-fade-in bg-black/60 p-8 rounded-xl border border-gray-600 backdrop-blur-sm">
              <h1 className="text-3xl font-bold text-red-400 mb-2">CRASH LANDING</h1>
              <p className="text-gray-300 mb-6 max-w-md">
                An unknown pilot went down. The wreckage is smoking, but the engine is still humming. The bot swarm is approaching.
              </p>
              <button 
                onClick={() => setGameState('playing')}
                className="px-8 py-4 bg-gradient-to-b from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold rounded shadow-[0_0_15px_rgba(245,158,11,0.5)] transform hover:scale-105 transition-all text-xl"
              >
                REPAIR & BOARD PLANE
              </button>
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        `}} />
      </div>
    );
  };

  // --- HANGAR COMPONENT ---
  const Hangar = () => {
    const buyPlane = (plane) => {
      if (totalScrap >= plane.cost && !unlockedPlanes.includes(plane.id)) {
        setTotalScrap(prev => prev - plane.cost);
        setUnlockedPlanes(prev => [...prev, plane.id]);
        setCurrentPlaneId(plane.id);
      }
    };

    return (
      <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">HANGAR</h1>
        <div className="flex items-center gap-2 mb-8 bg-gray-800 px-6 py-2 rounded-full border border-gray-700 shadow-inner">
          <span className="text-2xl">⚙️</span>
          <span className="text-2xl font-bold text-yellow-400">{totalScrap} Scrap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {PLANES.map(plane => {
            const isUnlocked = unlockedPlanes.includes(plane.id);
            const isEquipped = currentPlaneId === plane.id;
            const canAfford = totalScrap >= plane.cost;

            return (
              <div 
                key={plane.id} 
                className={`flex flex-col p-6 rounded-xl border-2 transition-all ${
                  isEquipped ? 'border-green-500 bg-gray-800 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 
                  isUnlocked ? 'border-gray-600 bg-gray-800/80 hover:border-gray-400' : 
                  'border-red-900/50 bg-gray-900/80 opacity-80'
                }`}
              >
                <div className="h-24 flex items-center justify-center mb-4">
                  {/* Plane Icon based on type */}
                  <div className="relative" style={{ width: '60px', height: '60px' }}>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                         style={{
                           width: '0', height: '0',
                           borderTop: '20px solid transparent',
                           borderBottom: '20px solid transparent',
                           borderLeft: `40px solid ${plane.color}`,
                         }}
                    ></div>
                    {plane.bullets > 1 && (
                      <div className="absolute top-[10px] left-[10px] w-8 h-[40px] border-y-4 border-gray-400 rounded-sm"></div>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-1 text-center" style={{ color: plane.color }}>{plane.name}</h2>
                <p className="text-sm text-gray-400 mb-4 h-10 text-center">{plane.desc}</p>
                
                <div className="space-y-2 mb-6 text-sm bg-black/40 p-3 rounded">
                  <div className="flex justify-between"><span>HP:</span> <span className="text-green-400">{plane.hp}</span></div>
                  <div className="flex justify-between"><span>Speed:</span> <span className="text-blue-400">{plane.speed}</span></div>
                  <div className="flex justify-between"><span>Firepower:</span> <span className="text-red-400">{plane.bullets}x ({plane.damage} DMG)</span></div>
                </div>

                <div className="mt-auto">
                  {isEquipped ? (
                    <button className="w-full py-3 bg-green-600/50 text-green-300 font-bold rounded cursor-default border border-green-500/50">EQUIPPED</button>
                  ) : isUnlocked ? (
                    <button 
                      onClick={() => setCurrentPlaneId(plane.id)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors"
                    >
                      SELECT
                    </button>
                  ) : (
                    <button 
                      onClick={() => buyPlane(plane)}
                      disabled={!canAfford}
                      className={`w-full py-3 font-bold rounded transition-colors flex justify-center items-center gap-2 ${
                        canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span>⚙️ {plane.cost}</span>
                      <span>BUY</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => setGameState('playing')}
          className="mt-12 px-12 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-2xl font-black rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] transform hover:scale-105 transition-all"
        >
          LAUNCH MISSION
        </button>
      </div>
    );
  };

  // --- GAMEPLAY COMPONENT ---
  const GameCanvas = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [localScrap, setLocalScrap] = useState(0);
    const [localHp, setLocalHp] = useState(0);
    const [maxHp, setMaxHp] = useState(0);
    const [localShield, setLocalShield] = useState(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const currentPlaneDef = PLANES.find(p => p.id === currentPlaneId);
      
      // Apply Skill Upgrades
      const upgradedSpeed = currentPlaneDef.speed + skills.speed;
      const upgradedHp = currentPlaneDef.hp + skills.hp;

      // Update React UI state initially
      setLocalHp(upgradedHp);
      setMaxHp(upgradedHp);

      // --- GAME STATE ---
      let animationFrameId;
      let frameCount = 0;
      let isGameOver = false;

      // Inputs
      const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
      let touchPos = null;

      // Entities
      const player = {
        x: 100,
        y: GAME_HEIGHT / 2,
        width: 60,
        height: 40,
        speed: upgradedSpeed,
        hp: upgradedHp,
        maxHp: upgradedHp,
        cooldown: 0,
        def: currentPlaneDef,
        bonusSpeed: 0,
        bonusDamage: 0,
        bonusShield: 0,
        bonusBullets: 0
      };

      const bullets = [];
      const enemies = [];
      const enemyBullets = [];
      const particles = [];
      const scrapDrops = [];
      const allies = [];
      const eggs = [];
      const floatingTexts = [];
      
      // Ally Phantom starts with 1 little plane
      if (currentPlaneDef.id === 'allyphantom') {
         allies.push({ 
           angle: Math.random() * Math.PI * 2, 
           radius: 50,
           cooldown: Math.random() * 60,
           type: 'mini'
         });
      } else if (currentPlaneDef.id === 'may') {
         // May Plane starts with 1 Mothership
         allies.push({ 
           angle: Math.random() * Math.PI * 2, 
           radius: 80,
           cooldown: Math.random() * 60,
           type: 'mother'
         });
      }

      const clouds = Array.from({length: 10}).map(() => ({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 40 + 20
      }));

      // Stats
      let sessionScrap = 0;
      let sessionKills = 0;
      let enemySpawnRate = 100; // Frames between spawns

      // Boss State Tracking
      let activeBoss = null;
      let bossesSpawned = { mecha: false, thorn: false, fire: false };

      // --- EVENT LISTENERS ---
      const handleKeyDown = (e) => { if (keys.hasOwnProperty(e.key)) keys[e.key] = true; };
      const handleKeyUp = (e) => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; };
      
      const handleTouchStart = (e) => {
        e.preventDefault();
        updateTouchPos(e.touches[0]);
      };
      const handleTouchMove = (e) => {
        e.preventDefault();
        updateTouchPos(e.touches[0]);
      };
      const handleTouchEnd = () => { touchPos = null; };

      const updateTouchPos = (touch) => {
        const rect = canvas.getBoundingClientRect();
        // Scale touch position to canvas internal resolution
        const scaleX = GAME_WIDTH / rect.width;
        const scaleY = GAME_HEIGHT / rect.height;
        touchPos = {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY
        };
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);

      // --- HELPERS ---
      const checkCollision = (rect1, rect2) => {
        return (
          rect1.x < rect2.x + rect2.width &&
          rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height &&
          rect1.y + rect1.height > rect2.y
        );
      };

      const createExplosion = (x, y, color) => {
        for (let i = 0; i < 15; i++) {
          particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: Math.random() * 20 + 10,
            maxLife: 30,
            color: color || (Math.random() > 0.5 ? '#EF4444' : '#F59E0B'),
            size: Math.random() * 4 + 2
          });
        }
      };

      const spawnEnemy = () => {
        const type = Math.random();
        let hp = 1;
        let speed = 3;
        let width = 40;
        let height = 30;
        let color = '#EF4444'; // Red bot
        let canShoot = false;

        // Difficulty scaling
        if (frameCount > 1000 && type > 0.7) {
          // Heavy bot
          hp = 4; speed = 2; width = 50; height = 40; color = '#7F1D1D';
        } else if (frameCount > 2000 && type > 0.4) {
          // Shooter bot
          hp = 2; speed = 3; color = '#9333EA'; canShoot = true;
        }

        enemies.push({
          x: GAME_WIDTH + 50,
          y: Math.random() * (GAME_HEIGHT - height - 40) + 20,
          width, height, speed, hp, maxHp: hp, color, canShoot, cooldown: 60
        });
      };

      const spawnBoss = (type) => {
        let hp, width, height, color, name;
        if (type === 'mecha') {
            hp = 150; width = 120; height = 100; color = '#9CA3AF'; name = "MECHA MACH";
        } else if (type === 'thorn') {
            hp = 350; width = 140; height = 120; color = '#15803D'; name = "THORN HORNS";
        } else if (type === 'fire') {
            hp = 700; width = 140; height = 140; color = '#DC2626'; name = "FIRE LAVA FIGHTER";
        }

        const boss = {
            x: GAME_WIDTH + 50,
            y: GAME_HEIGHT / 2 - height / 2,
            width, height, speed: 2, hp, maxHp: hp, color,
            canShoot: true, cooldown: 60, isBoss: true, type, name,
            moveDir: 1 // Controls vertical floating direction
        };
        enemies.push(boss);
        activeBoss = boss;
      };

      // --- MAIN LOOP ---
      const gameLoop = () => {
        if (isGameOver) return;

        frameCount++;
        ctx.fillStyle = '#0F172A'; // Sky background
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Update & Draw Clouds (Parallax)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        clouds.forEach(cloud => {
          cloud.x -= cloud.speed;
          if (cloud.x < -cloud.size) cloud.x = GAME_WIDTH + cloud.size;
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Player Movement
        let moving = false;
        let currentSpeed = player.speed + player.bonusSpeed;
        if (touchPos) {
          // Move towards touch
          const dx = touchPos.x - player.x;
          const dy = touchPos.y - player.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist > currentSpeed) {
            player.x += (dx / dist) * currentSpeed;
            player.y += (dy / dist) * currentSpeed;
            moving = true;
          }
        } else {
          if (keys.w || keys.ArrowUp) { player.y -= currentSpeed; moving = true; }
          if (keys.s || keys.ArrowDown) { player.y += currentSpeed; moving = true; }
          if (keys.a || keys.ArrowLeft) { player.x -= currentSpeed; moving = true; }
          if (keys.d || keys.ArrowRight) { player.x += currentSpeed; moving = true; }
        }

        // Clamp player to screen
        player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x));
        player.y = Math.max(0, Math.min(GAME_HEIGHT - player.height, player.y));

        // Player Engine particles
        if (frameCount % 3 === 0) {
          particles.push({
            x: player.x,
            y: player.y + player.height / 2 + (Math.random() * 10 - 5),
            vx: -Math.random() * 5 - 2,
            vy: (Math.random() - 0.5) * 2,
            life: 15,
            maxLife: 15,
            color: moving ? '#60A5FA' : '#9CA3AF',
            size: Math.random() * 3 + 1
          });
        }

        // Auto Fire
        if (player.cooldown <= 0) {
          const bSpeed = 15;
          const spawnBullet = (yOffset, vy = 0, ay = 0) => {
             bullets.push({
               x: player.x + player.width,
               y: player.y + player.height / 2 + yOffset,
               width: 15, height: 4, speed: bSpeed, damage: player.def.damage + player.bonusDamage, color: '#FDE047',
               vy: vy, ay: ay
             });
          };

          if (player.def.id === 'planeshooter') {
            // Curving bullets: starting velocity (vy) and acceleration (ay) to curve them back
            spawnBullet(-10, -4, 0.2); 
            spawnBullet(-5, -2, 0.1);  
            spawnBullet(5, 2, -0.1);   
            spawnBullet(10, 4, -0.2);  
          } else if (player.def.id === 'allyphantom') {
            spawnBullet(-15);
            spawnBullet(-5);
            spawnBullet(5);
            spawnBullet(15);
          } else if (player.def.bullets === 1) {
            spawnBullet(0);
          } else if (player.def.bullets === 2) {
            spawnBullet(-10);
            spawnBullet(10);
          } else if (player.def.bullets === 3) {
            spawnBullet(0);
            spawnBullet(-15);
            spawnBullet(15);
          }
          
          // Bonus bullets from Egg Buff
          for (let i = 0; i < player.bonusBullets; i++) {
             spawnBullet((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 2);
          }

          player.cooldown = player.def.fireRate;
        } else {
          player.cooldown--;
        }

        // Update & Draw Player Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          let b = bullets[i];
          b.x += b.speed;
          
          if (b.vy !== undefined) {
             b.y += b.vy;
             b.vy += b.ay; // Apply acceleration to create the curve
          }
          
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.width, b.height);
          // glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = b.color;
          ctx.fillRect(b.x, b.y, b.width, b.height);
          ctx.shadowBlur = 0;

          if (b.x > GAME_WIDTH) bullets.splice(i, 1);
        }

        // Check for Boss Spawns
        if (sessionKills >= 25 && !bossesSpawned.mecha) {
           spawnBoss('mecha');
           bossesSpawned.mecha = true;
        } else if (sessionKills >= 75 && !bossesSpawned.thorn) {
           spawnBoss('thorn');
           bossesSpawned.thorn = true;
        } else if (sessionKills >= 150 && !bossesSpawned.fire) {
           spawnBoss('fire');
           bossesSpawned.fire = true;
        }

        // Update & Draw Enemies
        if (!activeBoss && frameCount % enemySpawnRate === 0) spawnEnemy();
        // Scale up the difficulty much faster (more enemies)
        if (!activeBoss && frameCount % 300 === 0 && enemySpawnRate > 15) enemySpawnRate -= 10;

        for (let i = enemies.length - 1; i >= 0; i--) {
          let e = enemies[i];
          
          if (e.isBoss) {
              // Boss Movement
              if (e.x > GAME_WIDTH - e.width - 50) {
                  e.x -= e.speed; // Slide into screen
              } else {
                  e.y += (e.speed * 1.5) * e.moveDir; // Hover up and down
                  if (e.y < 50 || e.y > GAME_HEIGHT - e.height - 50) e.moveDir *= -1;
              }
              
              // Boss Shooting Patterns
              if (e.cooldown <= 0) {
                  if (e.type === 'mecha') {
                      enemyBullets.push({x: e.x, y: e.y + e.height*0.2, width: 15, height: 6, speed: -12, damage: 1, color: '#FCD34D'});
                      enemyBullets.push({x: e.x, y: e.y + e.height*0.8, width: 15, height: 6, speed: -12, damage: 1, color: '#FCD34D'});
                      e.cooldown = 20;
                  } else if (e.type === 'thorn') {
                      for(let k=-1; k<=1; k++) {
                          enemyBullets.push({x: e.x, y: e.y + e.height/2, width: 12, height: 12, speed: -8, damage: 2, color: '#86EFAC', vy: k*3});
                      }
                      e.cooldown = 40;
                  } else if (e.type === 'fire') {
                      for(let k=0; k<6; k++) {
                          enemyBullets.push({
                              x: e.x, y: e.y + e.height/2 + (Math.random()*60-30),
                              width: 15, height: 15, speed: -10 + Math.random()*3, damage: 2, color: '#F97316', vy: (Math.random()-0.5)*6
                          });
                      }
                      e.cooldown = 50;
                  }
              } else {
                  e.cooldown--;
              }
          } else {
              e.x -= e.speed;

              // Normal Enemy shooting
              if (e.canShoot) {
                if (e.cooldown <= 0) {
                  enemyBullets.push({
                    x: e.x, y: e.y + e.height/2, width: 10, height: 4, speed: -8, damage: 1, color: '#A855F7'
                  });
                  e.cooldown = 80 + Math.random() * 40;
                } else {
                  e.cooldown--;
                }
              }
          }

          // Collision with player
          if (checkCollision(player, e)) {
            if (player.bonusShield > 0) { 
               player.bonusShield -= 1; 
            } else { 
               player.hp -= 1; 
            }
            setLocalShield(Math.max(0, player.bonusShield));
            setLocalHp(Math.max(0, player.hp));
            createExplosion(player.x + player.width/2, player.y + player.height/2, '#3B82F6');
            
            if (e.isBoss) {
               player.x -= 80; // Massive knockback from boss
            } else {
               enemies.splice(i, 1);
               continue;
            }
          }

          // Collision with bullets
          let hit = false;
          for (let j = bullets.length - 1; j >= 0; j--) {
            let b = bullets[j];
            if (checkCollision(b, e)) {
              e.hp -= b.damage;
              createExplosion(b.x, b.y, '#FCD34D'); // small spark
              bullets.splice(j, 1);
              hit = true;
              break; // bullet destroyed, check next enemy
            }
          }

          if (e.hp <= 0) {
            if (e.isBoss) {
               activeBoss = null; // Clear the boss state
               for(let b=0; b<15; b++) createExplosion(e.x + Math.random()*e.width, e.y + Math.random()*e.height);
            } else {
               createExplosion(e.x + e.width/2, e.y + e.height/2);
            }
            sessionKills++;
            
            // Drop heavily increased scrap
            let scrapAmount = Math.floor(Math.random() * 5) + 3 + (e.maxHp * 2);
            if (e.isBoss) scrapAmount += 80; // Boss loot bonus!
            
            // Shamrock Special Ability: Luck of Scrap
            if (player.def.id === 'shamrock') {
              scrapAmount += Math.floor(Math.random() * 8) + 4; // Bonus lucky scrap!
            }

            // Ally Phantom Ability: Swarm on kill (capped at 23)
            if (player.def.id === 'allyphantom' && allies.length < 23) {
              allies.push({
                angle: Math.random() * Math.PI * 2,
                radius: 40 + Math.random() * (Math.min(250, allies.length * 8 + 20)), // Swarm cloud expands outwards
                cooldown: Math.random() * 40,
                type: 'mini'
              });
            }

            // May Plane Ability: Spawn Mother on kill (capped at 10)
            if (player.def.id === 'may' && allies.length < 10) {
              allies.push({
                angle: Math.random() * Math.PI * 2,
                radius: 70 + Math.random() * 80, // Orbit further out
                cooldown: Math.random() * 60,
                type: 'mother'
              });
            }

            // April Plane Ability: Spawn Egg on kill
            if (player.def.id === 'april') {
              eggs.push({
                x: e.x + e.width/2,
                y: e.y + e.height/2,
                vx: -2, vy: (Math.random() - 0.5) * 2,
                color: ['#FCA5A5', '#FCD34D', '#86EFAC', '#93C5FD'][Math.floor(Math.random()*4)]
              });
            }

            for(let s=0; s<scrapAmount; s++) {
              scrapDrops.push({
                x: e.x + Math.random()*40 - 20,
                y: e.y + Math.random()*40 - 20,
                width: 10, height: 10,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10
              });
            }

            enemies.splice(i, 1);
            continue;
          }

          // Draw Enemy
          ctx.fillStyle = e.color;
          if (e.isBoss) {
             if (e.type === 'mecha') {
                 ctx.fillRect(e.x, e.y, e.width, e.height);
                 ctx.fillStyle = '#4B5563';
                 ctx.fillRect(e.x - 20, e.y + e.height*0.2, 20, 20); // Gun 1
                 ctx.fillRect(e.x - 20, e.y + e.height*0.8 - 20, 20, 20); // Gun 2
                 ctx.fillStyle = '#EF4444'; // Red Eye
                 ctx.fillRect(e.x + 20, e.y + 20, 40, 20);
             } else if (e.type === 'thorn') {
                 ctx.beginPath();
                 ctx.moveTo(e.x + e.width, e.y);
                 ctx.lineTo(e.x, e.y + e.height/2);
                 ctx.lineTo(e.x + e.width, e.y + e.height);
                 // Spiky Horns
                 ctx.lineTo(e.x + e.width - 40, e.y + e.height*0.8);
                 ctx.lineTo(e.x + e.width, e.y + e.height*0.6);
                 ctx.lineTo(e.x + e.width - 40, e.y + e.height*0.2);
                 ctx.closePath();
                 ctx.fill();
             } else if (e.type === 'fire') {
                 ctx.beginPath();
                 ctx.arc(e.x + e.width/2, e.y + e.height/2, e.width/2, 0, Math.PI*2);
                 ctx.fill();
                 ctx.strokeStyle = '#FCD34D';
                 ctx.lineWidth = 6;
                 ctx.stroke();
             }
          } else {
             ctx.beginPath();
             ctx.moveTo(e.x + e.width, e.y);
             ctx.lineTo(e.x, e.y + e.height / 2);
             ctx.lineTo(e.x + e.width, e.y + e.height);
             ctx.closePath();
             ctx.fill();
          }

          // Enemy HP bar if damaged
          if (e.hp < e.maxHp && !e.isBoss) {
             ctx.fillStyle = '#EF4444';
             ctx.fillRect(e.x, e.y - 10, e.width, 4);
             ctx.fillStyle = '#22C55E';
             ctx.fillRect(e.x, e.y - 10, e.width * (e.hp/e.maxHp), 4);
          }

          if (e.x + e.width < 0) enemies.splice(i, 1);
        }

        // Enemy Bullets
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
          let eb = enemyBullets[i];
          eb.x += eb.speed;
          if (eb.vy) eb.y += eb.vy; // Apply vertical velocity if exists
          
          ctx.fillStyle = eb.color;
          ctx.fillRect(eb.x, eb.y, eb.width, eb.height);

          if (checkCollision(player, eb)) {
            if (player.bonusShield > 0) { 
               player.bonusShield -= eb.damage; 
            } else { 
               player.hp -= eb.damage; 
            }
            setLocalShield(Math.max(0, player.bonusShield));
            setLocalHp(Math.max(0, player.hp));
            createExplosion(player.x + player.width/2, player.y + player.height/2, '#3B82F6');
            enemyBullets.splice(i, 1);
            continue;
          }

          if (eb.x < 0) enemyBullets.splice(i, 1);
        }

        // Scrap Drops
        for (let i = scrapDrops.length - 1; i >= 0; i--) {
          let s = scrapDrops[i];
          // Drift towards player slowly if close, otherwise just drift left
          const dx = player.x + player.width/2 - s.x;
          const dy = player.y + player.height/2 - s.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < 150) {
             s.vx += (dx / dist) * 0.5;
             s.vy += (dy / dist) * 0.5;
          } else {
             s.vx -= 0.05; // blow left
             s.vy *= 0.95; // friction
          }

          // Apply velocity limit
          const sSpeed = Math.sqrt(s.vx*s.vx + s.vy*s.vy);
          if (sSpeed > 8) {
            s.vx = (s.vx/sSpeed) * 8;
            s.vy = (s.vy/sSpeed) * 8;
          }

          s.x += s.vx;
          s.y += s.vy;

          ctx.fillStyle = '#94A3B8'; // Silver/gray
          ctx.fillRect(s.x, s.y, s.width, s.height);
          ctx.strokeStyle = '#F1F5F9';
          ctx.strokeRect(s.x, s.y, s.width, s.height);

          if (checkCollision(player, s)) {
             sessionScrap++;
             setLocalScrap(sessionScrap);
             scrapDrops.splice(i, 1);
             continue;
          }

          if (s.x < -20 || s.x > GAME_WIDTH + 20 || s.y < -20 || s.y > GAME_HEIGHT + 20) {
            scrapDrops.splice(i, 1);
          }
        }

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          let p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          
          ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;

          if (p.life <= 0) particles.splice(i, 1);
        }

        // Eggs Update
        for (let i = eggs.length - 1; i >= 0; i--) {
          let egg = eggs[i];
          egg.x += egg.vx;
          egg.y += egg.vy;

          // Drift left slowly
          egg.vx -= 0.02;

          ctx.fillStyle = egg.color;
          ctx.beginPath();
          ctx.ellipse(egg.x, egg.y, 10, 14, 0, 0, Math.PI * 2);
          ctx.fill();

          // Egg pattern decor
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(egg.x - 8, egg.y);
          ctx.lineTo(egg.x + 8, egg.y);
          ctx.stroke();

          // Collection
          if (checkCollision(player, {x: egg.x-10, y: egg.y-14, width: 20, height: 28})) {
             const buffType = Math.floor(Math.random() * 4);
             let text = "";
             if (buffType === 0) { player.bonusSpeed += 1; text = "+SPEED"; }
             else if (buffType === 1) { player.bonusDamage += 0.5; text = "+ATTACK"; }
             else if (buffType === 2) { 
                 player.bonusShield += 1; 
                 setLocalShield(Math.max(0, player.bonusShield));
                 text = "+DEFENSE"; 
             }
             else if (buffType === 3) { player.bonusBullets += 1; text = "+MULTISHOT"; }

             floatingTexts.push({ x: player.x, y: player.y - 20, text: text, life: 60, maxLife: 60 });
             eggs.splice(i, 1);
             continue;
          }

          if (egg.x < -30) eggs.splice(i, 1);
        }

        // Floating Texts Update
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
           let ft = floatingTexts[i];
           ft.y -= 1;
           ft.life--;
           
           ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
           ctx.fillStyle = '#FFFFFF';
           ctx.font = 'bold 16px sans-serif';
           ctx.fillText(ft.text, ft.x, ft.y);
           ctx.globalAlpha = 1.0;

           if (ft.life <= 0) floatingTexts.splice(i, 1);
        }

        // Draw Player
        if (player.hp > 0) {
          ctx.save();
          ctx.translate(player.x, player.y);
          
          // Tilt up/down slightly based on movement
          let tilt = 0;
          if (keys.w || keys.ArrowUp) tilt = -0.1;
          if (keys.s || keys.ArrowDown) tilt = 0.1;
          ctx.rotate(tilt);

          ctx.fillStyle = player.def.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(player.width, player.height / 2);
          ctx.lineTo(0, player.height);
          ctx.closePath();
          ctx.fill();

          // Cockpit
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.ellipse(player.width * 0.4, player.height / 2, 10, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Wings based on plane
          ctx.fillStyle = '#4B5563';
          if (player.def.id === 'scrap') {
             ctx.fillRect(10, -5, 10, player.height + 10);
          } else if (player.def.id === 'planeshooter') {
             ctx.fillStyle = '#059669'; // Custom wing color
             ctx.beginPath();
             ctx.moveTo(15, player.height/2);
             ctx.lineTo(25, -15);
             ctx.lineTo(35, -5);
             ctx.lineTo(15, player.height/2);
             ctx.lineTo(25, player.height + 15);
             ctx.lineTo(35, player.height + 5);
             ctx.fill();
          } else if (player.def.id === 'luckylight') {
             ctx.fillStyle = '#22C55E';
             ctx.beginPath();
             ctx.moveTo(10, player.height/2);
             ctx.lineTo(30, -10);
             ctx.lineTo(20, player.height/2);
             ctx.lineTo(30, player.height + 10);
             ctx.fill();
          } else if (player.def.id === 'fighter') {
             ctx.beginPath();
             ctx.moveTo(10, player.height/2);
             ctx.lineTo(30, -10);
             ctx.lineTo(20, player.height/2);
             ctx.lineTo(30, player.height + 10);
             ctx.fill();
          } else if (player.def.id === 'extremeshooter') {
             ctx.fillStyle = '#991B1B'; // Darker red wings
             ctx.beginPath();
             ctx.moveTo(15, player.height/2);
             ctx.lineTo(20, -15);
             ctx.lineTo(40, -5);
             ctx.lineTo(25, player.height/2);
             ctx.lineTo(40, player.height + 5);
             ctx.lineTo(20, player.height + 15);
             ctx.fill();
          } else if (player.def.id === 'shamrock') {
             ctx.fillStyle = '#14532D';
             ctx.beginPath();
             ctx.moveTo(15, player.height/2);
             ctx.lineTo(40, -15);
             ctx.lineTo(10, player.height/2);
             ctx.lineTo(40, player.height + 15);
             ctx.fill();
          } else if (player.def.id === 'allyphantom') {
             ctx.fillStyle = '#7E22CE';
             ctx.beginPath();
             ctx.moveTo(15, player.height/2);
             ctx.lineTo(5, -15);
             ctx.lineTo(35, -5);
             ctx.lineTo(25, player.height/2);
             ctx.lineTo(35, player.height + 5);
             ctx.lineTo(5, player.height + 15);
             ctx.fill();
          } else if (player.def.id === 'april') {
             // Egg-shaped plane
             ctx.fillStyle = '#F472B6';
             ctx.beginPath();
             ctx.ellipse(25, player.height/2, 20, 15, 0, 0, Math.PI * 2);
             ctx.fill();
             
             // Wings
             ctx.fillStyle = '#BE185D';
             ctx.beginPath();
             ctx.moveTo(15, player.height/2);
             ctx.lineTo(25, -10);
             ctx.lineTo(35, player.height/2);
             ctx.lineTo(25, player.height + 10);
             ctx.fill();
          } else if (player.def.id === 'may') {
             ctx.fillStyle = '#E11D48'; // Darker rose for wings
             ctx.beginPath();
             ctx.moveTo(10, player.height/2);
             ctx.lineTo(25, -20);
             ctx.lineTo(40, -10);
             ctx.lineTo(20, player.height/2);
             ctx.lineTo(40, player.height + 10);
             ctx.lineTo(25, player.height + 20);
             ctx.fill();
          } else {
             ctx.fillStyle = '#D97706';
             ctx.beginPath();
             ctx.moveTo(15, player.height/2);
             ctx.lineTo(40, -15);
             ctx.lineTo(10, player.height/2);
             ctx.lineTo(40, player.height + 15);
             ctx.fill();
          }
          
          ctx.restore();

          // Draw & Update Allies (Ally Phantom & May Plane)
          for (let i = 0; i < allies.length; i++) {
             let ally = allies[i];
             let isMother = ally.type === 'mother';
             
             ally.angle += isMother ? 0.02 : 0.05; // Orbit speed (mothers orbit slower)
             let ax = player.x + player.width/2 + Math.cos(ally.angle) * ally.radius;
             let ay = player.y + player.height/2 + Math.sin(ally.angle) * ally.radius;
             
             // Ally shooting
             if (ally.cooldown <= 0) {
                 bullets.push({
                   x: ax + (isMother ? 20 : 10), y: ay,
                   width: isMother ? 15 : 10, height: isMother ? 6 : 3,
                   speed: 15, damage: isMother ? 3 : 1,
                   color: isMother ? '#FDA4AF' : '#D8B4FE'
                 });
                 ally.cooldown = (isMother ? 60 : 40) + Math.random() * 20; // Own fire cooldown
             } else {
                 ally.cooldown--;
             }

             // Draw ally plane
             ctx.fillStyle = isMother ? '#F43F5E' : '#C084FC';
             ctx.beginPath();
             if (isMother) {
                // Thicker, larger Mothership model
                ctx.moveTo(ax + 20, ay);
                ctx.lineTo(ax - 10, ay - 15);
                ctx.lineTo(ax - 5, ay);
                ctx.lineTo(ax - 10, ay + 15);
             } else {
                ctx.moveTo(ax + 10, ay);
                ctx.lineTo(ax - 5, ay - 5);
                ctx.lineTo(ax - 5, ay + 5);
             }
             ctx.closePath();
             ctx.fill();
          }
        } else {
          // Death sequence
          if (!isGameOver) {
            isGameOver = true;
            createExplosion(player.x + player.width/2, player.y + player.height/2);
            createExplosion(player.x, player.y);
            createExplosion(player.x + player.width, player.y + player.height);
            
            setTimeout(() => {
              setTotalScrap(prev => prev + sessionScrap);
              setLastScore({ kills: sessionKills, scrap: sessionScrap });
              setGameState('gameover');
            }, 2000);
          }
        }

        // Draw Boss UI
        if (activeBoss) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(GAME_WIDTH/2 - 250, 60, 500, 30);
            ctx.fillStyle = '#EF4444';
            ctx.fillRect(GAME_WIDTH/2 - 248, 62, 496 * Math.max(0, activeBoss.hp / activeBoss.maxHp), 26);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(activeBoss.name, GAME_WIDTH/2, 75);
            ctx.textAlign = 'left'; // reset back to normal
            ctx.textBaseline = 'alphabetic';
        }

        if (!isGameOver || particles.length > 0) {
          animationFrameId = requestAnimationFrame(gameLoop);
        }
      };

      // Start loop
      animationFrameId = requestAnimationFrame(gameLoop);

      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (canvas) {
          canvas.removeEventListener('touchstart', handleTouchStart);
          canvas.removeEventListener('touchmove', handleTouchMove);
          canvas.removeEventListener('touchend', handleTouchEnd);
        }
      };
    }, []);

    return (
      <div ref={containerRef} className="relative w-full h-screen bg-black flex justify-center items-center overflow-hidden touch-none select-none">
        {/* The Game Canvas scales to fit container while maintaining aspect ratio via CSS */}
        <canvas 
          ref={canvasRef} 
          width={GAME_WIDTH} 
          height={GAME_HEIGHT}
          className="w-full h-full object-contain max-h-screen"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* HUD UI overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          {/* Health Bar */}
          <div className="flex flex-col gap-1 w-48">
             <span className="text-white font-bold tracking-wider text-sm drop-shadow-md text-shadow">HULL INTEGRITY</span>
             <div className="w-full h-6 bg-gray-800 border-2 border-gray-600 rounded overflow-hidden relative">
               <div 
                 className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300 absolute top-0 left-0" 
                 style={{ width: `${Math.max(0, (localHp / maxHp) * 100)}%` }}
               ></div>
               {localShield > 0 && (
                 <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50 flex items-center justify-center text-xs font-bold text-white shadow-[inset_0_0_10px_#60A5FA]">
                   +{localShield} SHIELD
                 </div>
               )}
             </div>
             <span className="text-white text-xs drop-shadow">{localHp} / {maxHp}</span>
          </div>

          {/* Scrap Counter */}
          <div className="bg-gray-800/80 px-4 py-2 border-2 border-gray-600 rounded-lg flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <span className="text-white font-black text-2xl tracking-widest">{localScrap}</span>
          </div>
        </div>

        {/* Mobile controls hint */}
        <div className="absolute bottom-10 text-white/40 text-sm font-bold tracking-widest pointer-events-none text-center w-full">
           WASD / ARROWS TO MOVE <br className="md:hidden" /> (DRAG ON TOUCH) <br/> AUTO-FIRE ENGAGED
        </div>
      </div>
    );
  };

  // --- GAME OVER COMPONENT ---
  const GameOver = () => (
    <div className="w-full h-screen bg-black/90 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-6xl font-black text-red-600 mb-2 animate-pulse">DESTROYED</h1>
      <p className="text-xl text-gray-400 mb-8">The bots overwhelmed you.</p>

      <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl flex flex-col items-center gap-4 mb-10 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold border-b border-gray-600 w-full text-center pb-4 mb-2">RUN REPORT</h2>
        
        <div className="flex justify-between w-full text-lg">
          <span className="text-gray-400">Enemies Destroyed:</span>
          <span className="font-bold text-red-400">{lastScore.kills}</span>
        </div>
        
        <div className="flex justify-between w-full text-lg">
          <span className="text-gray-400">Scrap Salvaged:</span>
          <span className="font-bold text-yellow-400">+{lastScore.scrap} ⚙️</span>
        </div>

        <div className="w-full h-px bg-gray-600 my-2"></div>

        <div className="flex justify-between w-full text-xl font-bold">
          <span>Total Scrap Vault:</span>
          <span className="text-yellow-500">{totalScrap} ⚙️</span>
        </div>
      </div>

      <button 
        onClick={() => setGameState('hangar')}
        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold rounded shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all"
      >
        RETURN TO HANGAR
      </button>
    </div>
  );

  // --- ROUTER ---
  return (
    <>
      {gameState === 'lobby' && <Lobby />}
      {gameState === 'skillshop' && <SkillShop />}
      {gameState === 'cutscene' && <Cutscene />}
      {gameState === 'hangar' && <Hangar />}
      {gameState === 'playing' && <GameCanvas />}
      {gameState === 'gameover' && <GameOver />}
    </>
  );
}
