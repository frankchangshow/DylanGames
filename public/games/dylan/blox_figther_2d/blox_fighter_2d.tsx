import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Map, Home, ShieldAlert, Zap, Sword, Save, Target, Scroll } from 'lucide-react';

// --- GAME DATA & CONFIG ---
const POWERS = {
  NONE: { name: 'Basic Punch', cost: 0, damage: 10, cooldown: 30, color: '#aaa', desc: 'A basic melee attack.' },
  ROCKET: { name: 'Rocket', cost: 100, damage: 15, cooldown: 40, color: '#ef4444', desc: 'Shoots a flying explosive.', type: 'projectile' },
  SPIN_KILLER: { name: 'Spin Killer', cost: 250, damage: 8, cooldown: 5, color: '#8b5cf6', desc: 'Rapid spinning AoE attack.', type: 'aoe' },
  BLADE_MASTER: { name: 'Blade Master', cost: 500, damage: 30, cooldown: 25, color: '#eab308', desc: 'Huge melee range and damage.', type: 'melee_large' },
  HIGH_HITTER: { name: 'High Hitter', cost: 1000, damage: 60, cooldown: 60, color: '#ec4899', desc: 'Slow, devastating heavy attacks.', type: 'melee_heavy' },
  HYPER_DRAGON: { name: 'Hyper Dragon', cost: 1750, damage: 35, cooldown: 15, color: '#10b981', desc: 'Super fast movement. Shoots dragon projectiles!', type: 'projectile_dragon' },
  LAVA_FIGHTER: { name: 'Lava Fighter', cost: 2000, damage: 25, cooldown: 20, color: '#f97316', desc: 'Shoots balls of magma.', type: 'projectile_lava' },
  VOID_TELEPORTER: { name: 'Void Teleporter', cost: 5000, damage: 50, cooldown: 45, color: '#1e1b4b', desc: 'Click to teleport and deal AoE damage.', type: 'teleport' },
  IRON_SWORD: { name: 'Iron Sword', cost: 999999, damage: 25, cooldown: 20, color: '#94a3b8', desc: 'Quest Weapon: A reliable iron blade.', type: 'melee_large', isQuestItem: true },
  BANANA_BLADE: { name: 'Banana Blade', cost: 999999, damage: 35, cooldown: 15, color: '#fde047', desc: 'Quest Weapon: Slices with monkey strength.', type: 'melee_large', isQuestItem: true },
  PIRATE_CUTLASS: { name: 'Pirate Cutlass', cost: 999999, damage: 45, cooldown: 10, color: '#cbd5e1', desc: 'Quest Weapon: Fast and deadly pirate sword.', type: 'melee_large', isQuestItem: true }
};

const QUESTS = [
  { id: 1, title: 'Slime Exterminator', desc: 'Defeat 15 enemies in the Green World.', type: 'kill', target: 15, worldId: 1, rewardText: 'Iron Sword', rewardPower: 'IRON_SWORD', rewardCoins: 100 },
  { id: 2, title: 'Ape King Fall', desc: 'Defeat the Gorilla King in the Jungle.', type: 'boss', target: 1, worldId: 2, rewardText: 'Banana Blade', rewardPower: 'BANANA_BLADE', rewardCoins: 300 },
  { id: 3, title: 'Pirate Scourge', desc: 'Defeat Captain Blackbeard in Pirate Village.', type: 'boss', target: 1, worldId: 3, rewardText: 'Pirate Cutlass', rewardPower: 'PIRATE_CUTLASS', rewardCoins: 500 },
];

const WORLDS = [
  { id: 1, name: 'Green World', bg: '#4ade80', floor: '#166534', enemyColor: '#22c55e', bossColor: '#14532d', bossName: 'Big Slime' },
  { id: 2, name: 'Jungle', bg: '#166534', floor: '#052e16', enemyColor: '#78350f', bossColor: '#451a03', bossName: 'Gorilla King' },
  { id: 3, name: 'Pirate Village', bg: '#38bdf8', floor: '#fde047', enemyColor: '#334155', bossColor: '#0f172a', bossName: 'Captain Blackbeard' },
  { id: 4, name: 'Desert', bg: '#fcd34d', floor: '#b45309', enemyColor: '#d97706', bossColor: '#78350f', bossName: 'Ancient Sphinx' },
  { id: 5, name: 'Ice Peak', bg: '#cffafe', floor: '#bae6fd', enemyColor: '#ffffff', bossColor: '#93c5fd', bossName: 'Giant Yeti' },
  { id: 6, name: 'Galaxy Universe', bg: '#020617', floor: '#3b0764', enemyColor: '#a855f7', bossColor: '#c084fc', bossName: 'UFO Mothership' },
  { id: 7, name: 'Lava Kingdom', bg: '#7f1d1d', floor: '#450a0a', enemyColor: '#f97316', bossColor: '#ea580c', bossName: 'Magma Dragon' },
  { id: 8, name: 'The Final Boss', bg: '#2e1065', floor: '#170530', enemyColor: '#000000', bossColor: '#dc2626', bossName: 'The Overlord' },
];

export default function App() {
  const [view, setView] = useState('TOWN');
  const [coins, setCoins] = useState(0);
  const [currentPower, setCurrentPower] = useState('NONE');
  const [unlockedPowers, setUnlockedPowers] = useState(['NONE']);
  const [unlockedWorlds, setUnlockedWorlds] = useState([1]);
  const [activeWorld, setActiveWorld] = useState(1);
  const [showSaveMsg, setShowSaveMsg] = useState(false);
  const [activeQuest, setActiveQuest] = useState(null);
  const [questProgress, setQuestProgress] = useState(0);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [notification, setNotification] = useState(null);

  const handleSave = () => {
    setShowSaveMsg(true);
    setTimeout(() => setShowSaveMsg(false), 3000);
  };

  const buyPower = (powerKey, cost) => {
    if (coins >= cost && !unlockedPowers.includes(powerKey)) {
      setCoins(coins - cost);
      setUnlockedPowers([...unlockedPowers, powerKey]);
      setCurrentPower(powerKey);
    }
  };

  const equipPower = (powerKey) => {
    if (unlockedPowers.includes(powerKey)) setCurrentPower(powerKey);
  };

  const advanceQuest = (type, wId) => {
    if (!activeQuest) return;
    const q = QUESTS.find(x => x.id === activeQuest);
    if (!q) return;
    if (q.type === type && q.worldId === wId) {
      setQuestProgress(prev => {
        const next = prev + 1;
        if (next >= q.target) {
          completeQuest(q);
          return 0;
        }
        return next;
      });
    }
  };

  const completeQuest = (q) => {
    setCompletedQuests(prev => [...prev, q.id]);
    setActiveQuest(null);
    setCoins(prev => prev + q.rewardCoins);
    if (q.rewardPower && !unlockedPowers.includes(q.rewardPower)) {
      setUnlockedPowers(prev => [...prev, q.rewardPower]);
    }
    setNotification(`Quest Complete: ${q.title}! Reward: ${q.rewardText} & ${q.rewardCoins} Coins`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 relative">
      <header className="bg-slate-800 p-4 shadow-md flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Sword className="text-blue-400" />
          <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">BLOX FIGHTER 2D</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-yellow-400 font-bold text-lg">{coins} Coins</span>
            <span className="text-xs text-slate-400">Power: {POWERS[currentPower].name}</span>
          </div>
          {view !== 'TOWN' && (
             <button onClick={() => setView('TOWN')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-1">
               <Home size={18} /> Town
             </button>
          )}
        </div>
      </header>

      {notification && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-950 px-8 py-4 rounded-xl shadow-2xl font-black z-50 animate-bounce">{notification}</div>}

      <main className="p-6 flex justify-center">
        {view === 'TOWN' && <TownView setView={setView} handleSave={handleSave} showSaveMsg={showSaveMsg} />}
        {view === 'SHOP' && <ShopView coins={coins} unlockedPowers={unlockedPowers} currentPower={currentPower} buyPower={buyPower} equipPower={equipPower} setView={setView} />}
        {view === 'WORLD_SELECT' && <WorldSelectView unlockedWorlds={unlockedWorlds} setActiveWorld={setActiveWorld} setView={setView} />}
        {view === 'QUESTS' && <QuestView activeQuest={activeQuest} questProgress={questProgress} completedQuests={completedQuests} setActiveQuest={(id) => { setActiveQuest(id); setQuestProgress(0); }} setView={setView} />}
        {view === 'PLAYING' && (
          <GameEngine 
            worldId={activeWorld} powerKey={currentPower}
            addCoins={(amt) => setCoins(prev => prev + amt)}
            unlockNextWorld={() => { if (activeWorld < 8 && !unlockedWorlds.includes(activeWorld + 1)) setUnlockedWorlds(prev => [...prev, activeWorld + 1]); }}
            onExit={() => setView('TOWN')}
            onKillEnemy={() => advanceQuest('kill', activeWorld)}
            onKillBoss={() => advanceQuest('boss', activeWorld)}
            activeQuestData={activeQuest ? QUESTS.find(q => q.id === activeQuest) : null}
            questProgress={questProgress}
          />
        )}
      </main>
    </div>
  );
}

function TownView({ setView, handleSave, showSaveMsg }) {
  return (
    <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
      <div className="bg-blue-900/40 p-8 rounded-2xl border border-blue-500/30 relative overflow-hidden">
        <h2 className="text-4xl font-black mb-4 relative z-10 text-blue-200">Welcome to Water Town</h2>
        <p className="text-blue-100/80 mb-8 max-w-lg mx-auto relative z-10">Rest up, buy new powers, and prepare for your journey across the 8 worlds!</p>
        <div className="flex justify-center gap-6 relative z-10">
          <button onClick={() => setView('WORLD_SELECT')} className="flex flex-col items-center p-6 bg-gradient-to-b from-green-500 to-green-700 rounded-xl shadow-lg hover:scale-105 group"><Map size={48} className="mb-2" /><span className="font-bold text-xl">Explore</span></button>
          <button onClick={() => setView('QUESTS')} className="flex flex-col items-center p-6 bg-gradient-to-b from-amber-500 to-amber-700 rounded-xl shadow-lg hover:scale-105 group"><Scroll size={48} className="mb-2" /><span className="font-bold text-xl">Quests</span></button>
          <button onClick={() => setView('SHOP')} className="flex flex-col items-center p-6 bg-gradient-to-b from-purple-500 to-purple-700 rounded-xl shadow-lg hover:scale-105 group"><ShoppingCart size={48} className="mb-2" /><span className="font-bold text-xl">Shop</span></button>
        </div>
      </div>
      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-full text-slate-300 mx-auto"><Save size={20} /> Save Progress</button>
    </div>
  );
}

function ShopView({ coins, unlockedPowers, currentPower, buyPower, equipPower, setView }) {
  return (
    <div className="max-w-4xl w-full">
      <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-black flex items-center gap-3"><Zap className="text-yellow-400" /> Power Shop</h2><div className="text-xl font-bold text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-lg">Coins: {coins}</div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(POWERS).map(([key, power]) => {
          if (power.isQuestItem && !unlockedPowers.includes(key)) return null;
          const isUnlocked = unlockedPowers.includes(key);
          const isEquipped = currentPower === key;
          return (
            <div key={key} className={`p-5 rounded-xl border-2 flex flex-col justify-between ${isEquipped ? 'border-green-500 bg-green-900/20' : 'border-slate-700 bg-slate-800'}`}>
              <div><h3 className="text-xl font-bold" style={{ color: power.color }}>{power.name}</h3>{!isUnlocked && !power.isQuestItem && <span className="text-yellow-400 font-bold">{power.cost} c</span>}<p className="text-slate-400 text-sm mb-4">{power.desc}</p></div>
              {isEquipped ? <button disabled className="w-full py-2 bg-green-600/50 rounded font-bold">Equipped</button> : isUnlocked ? <button onClick={() => equipPower(key)} className="w-full py-2 bg-blue-600 rounded font-bold">Equip</button> : <button onClick={() => buyPower(key, power.cost)} disabled={coins < power.cost} className="w-full py-2 bg-yellow-600 rounded font-bold disabled:bg-slate-700">Buy</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorldSelectView({ unlockedWorlds, setActiveWorld, setView }) {
  return (
    <div className="max-w-4xl w-full">
      <h2 className="text-3xl font-black mb-8 text-center">Select World</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {WORLDS.map(world => {
          const isUnlocked = unlockedWorlds.includes(world.id);
          return (
            <button key={world.id} disabled={!isUnlocked} onClick={() => { setActiveWorld(world.id); setView('PLAYING'); }} className={`relative h-32 rounded-xl border-2 flex flex-col items-center justify-center p-4 transition-all ${isUnlocked ? 'hover:scale-105' : 'opacity-50 grayscale cursor-not-allowed'}`} style={{ background: isUnlocked ? world.bg : '#334155' }}>
              <span className="font-black text-lg">{world.id}. {world.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestView({ activeQuest, questProgress, completedQuests, setActiveQuest, setView }) {
  return (
    <div className="max-w-4xl w-full space-y-4">
      {QUESTS.map(q => {
        const isCompleted = completedQuests.includes(q.id);
        const isActive = activeQuest === q.id;
        return (
          <div key={q.id} className={`p-6 rounded-xl border-2 flex items-center justify-between ${isActive ? 'border-amber-500 bg-amber-900/20' : 'border-slate-700 bg-slate-800'}`}>
            <div><h3 className="text-xl font-bold">{q.title}</h3><p className="text-slate-400">{q.desc}</p></div>
            {!isCompleted && !isActive && <button onClick={() => setActiveQuest(q.id)} className="px-6 py-2 bg-blue-600 rounded font-bold">Accept</button>}
            {isActive && <span className="text-amber-400 font-bold">({questProgress}/{q.target})</span>}
          </div>
        );
      })}
    </div>
  );
}

function GameEngine({ worldId, powerKey, addCoins, unlockNextWorld, onExit, onKillEnemy, onKillBoss, activeQuestData, questProgress }) {
  const canvasRef = useRef(null);
  const worldData = WORLDS.find(w => w.id === worldId);
  const powerData = POWERS[powerKey];
  const [gameState, setGameState] = useState('PLAYING');
  const [hp, setHp] = useState(100);
  const [bossHp, setBossHp] = useState(0);
  const [bossMaxHp, setBossMaxHp] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isRunning = true;
    canvas.width = 800;
    canvas.height = 500;
    const keys = { a: false, d: false, ' ': false };
    const mouse = { x: 0, y: 0, down: false };
    const player = { x: 400, y: 100, width: 30, height: 40, vx: 0, vy: 0, grounded: false, facingRight: true, cooldown: 0, hp: 100 };
    let enemies = []; let projectiles = []; let particles = []; let floatingTexts = []; let bossSpawned = false; let spawnTimer = 0;

    const handleKeyDown = (e) => { if (keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { if (keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = false; };
    const handleMouseMove = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * (800 / r.width); mouse.y = (e.clientY - r.top) * (500 / r.height); };
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove); canvas.addEventListener('mousedown', () => mouse.down = true); window.addEventListener('mouseup', () => mouse.down = false);

    const spawnEnemy = () => {
      const isLeft = Math.random() > 0.5;
      enemies.push({ x: isLeft ? -40 : 840, y: 360, width: 30, height: 30, vx: 0, vy: 0, hp: 50, maxHp: 50, color: worldData.enemyColor, isBoss: false });
    };

    const spawnBoss = () => {
      bossSpawned = true; const bHP = 200 + (worldId * 100); setBossMaxHp(bHP); setBossHp(bHP);
      enemies.push({ x: 700, y: 320, width: 80, height: 80, vx: 0, vy: 0, hp: bHP, maxHp: bHP, color: worldData.bossColor, isBoss: true });
    };

    const rectIntersect = (r1, r2) => !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);

    const loop = () => {
      if (!isRunning) return;
      const speedMult = powerKey === 'HYPER_DRAGON' ? 2.5 : 1;
      if (keys.a) { player.vx -= 1 * speedMult; player.facingRight = false; }
      if (keys.d) { player.vx += 1 * speedMult; player.facingRight = true; }
      player.vx *= 0.8; player.vy += 0.6; player.x += player.vx; player.y += player.vy;
      if (player.y > 360) { player.y = 360; player.vy = 0; player.grounded = true; } else player.grounded = false;
      if (keys[' '] && player.grounded) player.vy = -12;

      if (player.cooldown > 0) player.cooldown--;
      if (mouse.down && player.cooldown <= 0) {
        player.cooldown = powerData.cooldown;
        const angle = Math.atan2(mouse.y - (player.y + 20), mouse.x - (player.x + 15));
        if (powerData.type?.includes('projectile')) {
          projectiles.push({ x: player.x + 15, y: player.y + 20, vx: Math.cos(angle) * (powerData.type.includes('dragon') ? 15 : 10), vy: Math.sin(angle) * (powerData.type.includes('dragon') ? 15 : 10), width: powerData.type.includes('dragon') ? 25 : 15, height: 15, color: powerData.color, life: 100, damage: powerData.damage, isDragon: powerData.type.includes('dragon') });
        } else if (powerData.type === 'teleport') {
          player.x = mouse.x; player.y = Math.min(mouse.y, 360);
          enemies.forEach(e => { if (Math.hypot(e.x - player.x, e.y - player.y) < 100) { e.hp -= powerData.damage; } });
        } else {
          const hitbox = { x: player.facingRight ? player.x + 30 : player.x - 50, y: player.y, width: 50, height: 40 };
          enemies.forEach(e => { if (rectIntersect(hitbox, e)) { e.hp -= powerData.damage; e.vx = player.facingRight ? 5 : -5; } });
        }
      }

      if (enemies.length === 0 && !bossSpawned) { spawnTimer--; if (spawnTimer <= 0) { spawnEnemy(); spawnTimer = 90; } }
      enemies.forEach((e, i) => {
        e.vx += (e.x < player.x ? 0.1 : -0.1); e.vx *= 0.9; e.x += e.vx;
        if (rectIntersect(player, e) && Math.random() < 0.1) { player.hp -= 5; setHp(Math.max(0, player.hp)); if (player.hp <= 0) { setGameState('LOST'); isRunning = false; } }
        if (e.hp <= 0) { 
          if (e.isBoss) { onKillBoss(); unlockNextWorld(); setGameState('WON'); isRunning = false; } 
          else { onKillEnemy(); addCoins(10 * worldId); if (Math.random() < 0.2 && !bossSpawned) spawnBoss(); }
          enemies.splice(i, 1);
        }
      });

      projectiles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life--; 
        if (p.isDragon) for(let j=0; j<2; j++) particles.push({x: p.x, y: p.y, vx: 0, vy: 0, life: 20, color: '#10b981'});
        enemies.forEach(e => { if (rectIntersect(p, e)) { e.hp -= p.damage; p.life = 0; } });
        if (p.life <= 0) projectiles.splice(i, 1);
      });
      particles.forEach((p, i) => { p.life--; if (p.life <= 0) particles.splice(i, 1); });

      ctx.fillStyle = worldData.bg; ctx.fillRect(0, 0, 800, 500);
      ctx.fillStyle = worldData.floor; ctx.fillRect(0, 400, 800, 100);
      ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.width, player.height);
      enemies.forEach(e => { ctx.fillStyle = e.color; ctx.fillRect(e.x, e.y, e.width, e.height); });
      projectiles.forEach(p => { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.width, p.height); });
      particles.forEach(p => { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 4, 4); });

      if (isRunning) animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [worldId, powerKey]);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="w-full flex justify-between p-2">
        <div className="bg-slate-800 p-2 rounded border border-slate-600"><div className="w-48 h-4 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${hp}%` }} /></div></div>
        <div className="text-center font-black">{worldData.name.toUpperCase()} {activeQuestData && activeQuestData.worldId === worldId && `(${questProgress}/${activeQuestData.target})`}</div>
        <button onClick={onExit} className="bg-slate-700 px-4 py-1 rounded">Flee</button>
      </div>
      <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700 bg-black">
        <canvas ref={canvasRef} />
        {gameState !== 'PLAYING' && <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center"><h2>{gameState === 'WON' ? 'VICTORY!' : 'DEFEATED'}</h2><button onClick={onExit} className="bg-blue-600 px-8 py-4 rounded font-bold">Return</button></div>}
      </div>
    </div>
  );
}