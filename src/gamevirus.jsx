import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const ORGANISM_DATA = [
  { level: 1, r: 14, color: '#e53e3e', label: 'O1' },
  { level: 2, r: 20, color: '#d53f8c', label: 'O2' },
  { level: 3, r: 28, color: '#00b5d8', label: 'O3' },
  { level: 4, r: 37, color: '#38a169', label: 'O4' },
  { level: 5, r: 47, color: '#d69e2e', label: 'O5' },
  { level: 6, r: 58, color: '#dd6b20', label: 'O6' },
  { level: 7, r: 70, color: '#c53030', label: 'O7' },
];
const VIRUS_DATA = { r: 14, color: '#1a202c', label: 'V' };
const SPAWNABLE_LEVELS = [1, 2, 3, 4];

const CANVAS_W = 340;
const CANVAS_H = 520;
const WALL_T = 20;
const BOWL_L = 30;
const BOWL_R = CANVAS_W - 30;
const BOWL_TOP = 80;
const BOWL_BOT = CANVAS_H - 20;
const BOWL_W = BOWL_R - BOWL_L;
const DROP_Y = 50;
const DEATH_LINE_Y = BOWL_TOP + 10;

export default function GameVirus() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const requestRef = useRef(null);

  // UI State
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [nextItem, setNextItem] = useState({ isVirus: false, level: 1 });

  // Game Mutable State (Bypassing React state for physics performance)
  const gameState = useRef({
    score: 0,
    best: 0,
    gameOver: false,
    nextIsVirus: false,
    nextLevel: 1,
    cursorX: CANVAS_W / 2,
    canDrop: true,
    dropCooldown: false,
    bodies: [],
    viruses: [],
    mergeQueue: [],
    lastTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1. Init Physics
    const engine = Matter.Engine.create({ gravity: { y: 1.5 } });
    engineRef.current = engine;
    const world = engine.world;

    const wallOpts = { isStatic: true, friction: 0.3, restitution: 0.2, render: { visible: false } };
    const floor = Matter.Bodies.rectangle(CANVAS_W / 2, BOWL_BOT + WALL_T / 2, BOWL_W, WALL_T, wallOpts);
    const wallL = Matter.Bodies.rectangle(BOWL_L - WALL_T / 2, (BOWL_TOP + BOWL_BOT) / 2, WALL_T, BOWL_BOT - BOWL_TOP, wallOpts);
    const wallR = Matter.Bodies.rectangle(BOWL_R + WALL_T / 2, (BOWL_TOP + BOWL_BOT) / 2, WALL_T, BOWL_BOT - BOWL_TOP, wallOpts);
    Matter.World.add(world, [floor, wallL, wallR]);

    // 2. Helper Functions
    const pickNext = () => {
      const isVirus = Math.random() < 0.15;
      const level = isVirus ? null : SPAWNABLE_LEVELS[Math.floor(Math.random() * SPAWNABLE_LEVELS.length)];
      gameState.current.nextIsVirus = isVirus;
      gameState.current.nextLevel = level;
      setNextItem({ isVirus, level });
    };

    const createOrganism = (x, y, level, isVirus) => {
      const od = isVirus ? VIRUS_DATA : ORGANISM_DATA[level - 1];
      const body = Matter.Bodies.circle(x, y, od.r, {
        restitution: 0.3,
        friction: 0.5,
        frictionAir: 0.01,
        density: 0.002,
        label: isVirus ? 'virus' : 'organism',
      });
      body._level = level;
      body._isVirus = isVirus || false;
      body._merging = false;
      body._toRemove = false;
      body._spawnTime = Date.now();
      Matter.World.add(world, body);
      gameState.current.bodies.push(body);
      return body;
    };

    const triggerGameOver = () => {
      gameState.current.gameOver = true;
      setIsGameOver(true);
    };

    // 3. Game Loop Logic
    const gameLoop = (ts) => {
      const state = gameState.current;
      const dt = Math.min(ts - state.lastTime, 50);
      state.lastTime = ts;

      if (!state.gameOver) {
        Matter.Engine.update(engine, dt);

        // Check Merges
        const orgs = state.bodies.filter((b) => !b._isVirus && !b._merging && !b._toRemove && b._level < 7);
        for (let i = 0; i < orgs.length; i++) {
          for (let j = i + 1; j < orgs.length; j++) {
            const a = orgs[i], b = orgs[j];
            if (a._level !== b._level) continue;
            const dx = a.position.x - b.position.x;
            const dy = a.position.y - b.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ra = ORGANISM_DATA[a._level - 1].r;
            const rb = ORGANISM_DATA[b._level - 1].r;
            if (dist < ra + rb + 2) {
              a._merging = true; b._merging = true;
              const mx = (a.position.x + b.position.x) / 2;
              const my = (a.position.y + b.position.y) / 2;
              const newLevel = a._level + 1;
              state.mergeQueue.push({ x: mx, y: my, level: newLevel, scoreAdd: newLevel * 10 });
              a._toRemove = true; b._toRemove = true;
            }
          }
        }

        // Check Virus Collisions
        const vs = state.bodies.filter((b) => b._isVirus && !b._toRemove);
        const os = state.bodies.filter((b) => !b._isVirus && !b._toRemove && !b._merging);
        for (const v of vs) {
          for (const o of os) {
            const dx = v.position.x - o.position.x;
            const dy = v.position.y - o.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < VIRUS_DATA.r + ORGANISM_DATA[o._level - 1].r + 1) {
              v._toRemove = true;
              if (o._level === 1) {
                o._toRemove = true;
              } else {
                const newLevel = o._level - 1;
                o._toRemove = true;
                state.mergeQueue.push({ x: o.position.x, y: o.position.y, level: newLevel, scoreAdd: 0 });
              }
            }
          }
        }

        // Process Removals & Merges
        const toRemove = state.bodies.filter((b) => b._toRemove);
        toRemove.forEach((b) => Matter.World.remove(world, b));
        state.bodies = state.bodies.filter((b) => !b._toRemove);

        state.mergeQueue.forEach((m) => {
          createOrganism(m.x, m.y, m.level, false);
          if (m.scoreAdd > 0) {
            state.score += m.scoreAdd;
            if (state.score > state.best) state.best = state.score;
            setScore(state.score);
            setBestScore(state.best);
          }
        });
        state.mergeQueue = [];

        // Check Game Over
        const danger = state.bodies.filter((b) => !b._isVirus && !b._toRemove && b._spawnTime < Date.now() - 1500);
        for (const b of danger) {
          if (b.position.y < DEATH_LINE_Y) {
            triggerGameOver();
            break;
          }
        }
      }

      // Draw Scene
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#1a3a7c';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Draw Bowl
      ctx.save();
      ctx.beginPath();
      const r = 24;
      ctx.moveTo(BOWL_L, BOWL_TOP);
      ctx.lineTo(BOWL_R, BOWL_TOP);
      ctx.lineTo(BOWL_R, BOWL_BOT - r);
      ctx.quadraticCurveTo(BOWL_R, BOWL_BOT, BOWL_R - r, BOWL_BOT);
      ctx.lineTo(BOWL_L + r, BOWL_BOT);
      ctx.quadraticCurveTo(BOWL_L, BOWL_BOT, BOWL_L, BOWL_BOT - r);
      ctx.lineTo(BOWL_L, BOWL_TOP);
      ctx.closePath();
      ctx.fillStyle = 'rgba(100,130,220,0.25)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(180,200,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Draw Death Line
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(BOWL_L, DEATH_LINE_Y);
      ctx.lineTo(BOWL_R, DEATH_LINE_Y);
      ctx.stroke();
      ctx.restore();

      // Draw Prediction Line & Next Item
      if (!state.gameOver) {
        const od = state.nextIsVirus ? VIRUS_DATA : ORGANISM_DATA[state.nextLevel - 1];
        const cx = Math.max(BOWL_L + od.r + 2, Math.min(BOWL_R - od.r - 2, state.cursorX));

        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.moveTo(BOWL_L + 10, DROP_Y);
        ctx.lineTo(BOWL_R - 10, DROP_Y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, DROP_Y, od.r, 0, Math.PI * 2);
        ctx.fillStyle = od.color;
        ctx.fill();

        if (state.nextIsVirus) {
          ctx.fillStyle = 'white';
          ctx.font = `${od.r}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✶', cx, DROP_Y);
        }
        ctx.restore();
      }

      // Draw Bodies
      for (const body of state.bodies) {
        const pos = body.position;
        const od = body._isVirus ? VIRUS_DATA : ORGANISM_DATA[body._level - 1];
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, od.r, 0, Math.PI * 2);
        ctx.fillStyle = od.color;
        ctx.fill();
        if (body._isVirus) {
          ctx.fillStyle = 'white';
          ctx.font = `${od.r * 1.2}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✶', pos.x, pos.y);
        }
        ctx.restore();
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    // 4. Event Listeners
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      gameState.current.cursorX = (clientX - rect.left) * (CANVAS_W / rect.width);
    };

    const handleDrop = (e) => {
      if (e?.type === 'touchend') e.preventDefault();
      const state = gameState.current;
      if (!state.canDrop || state.gameOver || state.dropCooldown) return;

      const od = state.nextIsVirus ? VIRUS_DATA : ORGANISM_DATA[state.nextLevel - 1];
      const clampedX = Math.max(BOWL_L + od.r + 2, Math.min(BOWL_R - od.r - 2, state.cursorX));

      createOrganism(clampedX, DROP_Y, state.nextLevel, state.nextIsVirus);
      pickNext();

      state.dropCooldown = true;
      setTimeout(() => { state.dropCooldown = false; }, 500);
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('click', handleDrop);
    canvas.addEventListener('touchend', handleDrop, { passive: false });

    // Start
    pickNext();
    requestRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      cancelAnimationFrame(requestRef.current);
      Matter.Engine.clear(engine);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('click', handleDrop);
      canvas.removeEventListener('touchend', handleDrop);
    };
  }, []);

  // Restart Handler
  const handleRestart = () => {
    const state = gameState.current;
    state.bodies.forEach((b) => Matter.World.remove(engineRef.current.world, b));
    state.bodies = [];
    state.mergeQueue = [];
    state.score = 0;
    state.gameOver = false;
    state.dropCooldown = false;
    
    setScore(0);
    setIsGameOver(false);
    
    // Pick new initial item
    const isVirus = Math.random() < 0.15;
    const level = isVirus ? null : SPAWNABLE_LEVELS[Math.floor(Math.random() * SPAWNABLE_LEVELS.length)];
    state.nextIsVirus = isVirus;
    state.nextLevel = level;
    setNextItem({ isVirus, level });
  };

  return (
    <div className="flex gap-6 p-4 min-h-[600px] font-sans bg-transparent relative w-fit mx-auto">
      
      {/* Sidebar Kiri */}
      <div className="flex flex-col gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 px-4 min-w-[120px] shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Score</div>
          <div className="text-2xl font-medium text-white">{score}</div>
          <div className="text-[11px] text-gray-500 mt-1">Best: {bestScore}</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3 px-4 shadow-sm">
          <div className="text-xs text-gray-400 mb-2">Next up</div>
          <div className="w-[60px] h-[60px] flex items-center justify-center">
            {nextItem.isVirus ? (
              <div
                className="rounded-full flex items-center justify-center text-white"
                style={{ width: VIRUS_DATA.r * 2, height: VIRUS_DATA.r * 2, backgroundColor: VIRUS_DATA.color }}
              >
                ✶
              </div>
            ) : (
              <div
                className="rounded-full"
                style={{
                  width: ORGANISM_DATA[(nextItem.level || 1) - 1].r * 2,
                  height: ORGANISM_DATA[(nextItem.level || 1) - 1].r * 2,
                  backgroundColor: ORGANISM_DATA[(nextItem.level || 1) - 1].color,
                }}
              />
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3 px-4 shadow-sm">
          <div className="text-xs text-gray-400 mb-2">hierarki</div>
          <div className="flex flex-col gap-1.5 items-center">
            {[...ORGANISM_DATA].reverse().map((od) => (
              <div key={od.level} className="flex items-center gap-2 w-full">
                <div className="rounded-full shrink-0" style={{ width: od.r * 1.1, height: od.r * 1.1, backgroundColor: od.color }} />
                <span className="text-[10px] text-gray-400">O{od.level}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 w-full mt-1 border-t border-white/10 pt-1">
              <div className="rounded-full shrink-0 flex items-center justify-center text-white text-[10px]" style={{ width: VIRUS_DATA.r * 1.1, height: VIRUS_DATA.r * 1.1, backgroundColor: VIRUS_DATA.color }}>✶</div>
              <span className="text-[10px] text-gray-400">virus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Area Canvas */}
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl block cursor-crosshair touch-none shadow-lg"
        />
        <div className="text-[13px] text-gray-400 mt-2 text-center">
          kiri kanan, tap buat drop
        </div>
      </div>

      {/* Modal Game Over */}
      {isGameOver && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-50 flex items-center justify-center rounded-xl backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-8 text-center min-w-[220px] shadow-2xl">
            <div className="text-xl font-medium text-white mb-2">game over tetot!</div>
            <div className="text-[13px] text-gray-400 mb-1">score:</div>
            <div className="text-4xl font-medium text-white mb-4">{score}</div>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-lg border border-gray-600 bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors"
            >
              lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}