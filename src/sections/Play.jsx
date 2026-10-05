import { useEffect, useRef, useState } from "react";
import SectionHeading from "../components/SectionHeading";

const BUG_COLORS = ["#2ee6d6", "#8b5cf6", "#ff5fa2"];
const GOLD = "#ffc53d";
const LIVES = 3;
const BEST_KEY = "av-bug-best";

function readBest() {
  try {
    return parseInt(window.localStorage.getItem(BEST_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(v) {
  try {
    window.localStorage.setItem(BEST_KEY, String(v));
  } catch {
    return;
  }
}

export default function Play() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const game = useRef(null);
  const [status, setStatus] = useState("idle");
  const [hud, setHud] = useState({ score: 0, lives: LIVES, combo: 1 });
  const [best, setBest] = useState(0);

  useEffect(() => {
    setBest(readBest());
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const g = {
      w: 0,
      h: 0,
      bugs: [],
      sparks: [],
      score: 0,
      lives: LIVES,
      combo: 1,
      lastHit: 0,
      spawnIn: 0,
      elapsed: 0,
      running: false,
      visible: true,
      raf: 0,
      last: 0,
      shake: 0,
      pulse: 0,
    };
    game.current = g;

    const resize = () => {
      g.w = wrap.clientWidth;
      g.h = wrap.clientHeight;
      canvas.width = g.w * dpr;
      canvas.height = g.h * dpr;
      canvas.style.width = `${g.w}px`;
      canvas.style.height = `${g.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!g.running) draw(0);
    };

    const core = () => ({ x: g.w / 2, y: g.h / 2, r: Math.max(26, Math.min(g.w, g.h) * 0.08) });

    const spawn = () => {
      const edge = Math.floor(Math.random() * 4);
      const m = 20;
      let x = Math.random() * g.w;
      let y = Math.random() * g.h;
      if (edge === 0) y = -m;
      if (edge === 1) x = g.w + m;
      if (edge === 2) y = g.h + m;
      if (edge === 3) x = -m;
      const gold = Math.random() < 0.08;
      const level = Math.min(g.elapsed / 60, 1);
      g.bugs.push({
        x,
        y,
        size: gold ? 13 : 11 + Math.random() * 5,
        speed: (34 + Math.random() * 26) * (1 + level * 1.4) * (gold ? 1.35 : 1),
        wobble: Math.random() * Math.PI * 2,
        color: gold ? GOLD : BUG_COLORS[Math.floor(Math.random() * BUG_COLORS.length)],
        gold,
        t: 0,
      });
    };

    const burst = (x, y, color, n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 60 + Math.random() * 220;
        g.sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5 + Math.random() * 0.5, max: 1, color, r: 1 + Math.random() * 2.4 });
      }
    };

    const drawBug = (b) => {
      const c = core();
      const ang = Math.atan2(c.y - b.y, c.x - b.x);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(ang);
      const leg = Math.sin(b.t * 18) * 3;
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      for (const side of [-1, 1]) {
        for (const off of [-0.5, 0, 0.5]) {
          ctx.beginPath();
          ctx.moveTo(off * b.size, side * b.size * 0.4);
          ctx.lineTo(off * b.size + (off === 0 ? leg : -leg) * side, side * b.size * 1.05);
          ctx.stroke();
        }
      }
      ctx.shadowColor = b.color;
      ctx.shadowBlur = b.gold ? 22 : 14;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, b.size, b.size * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(5,6,15,0.85)";
      ctx.beginPath();
      ctx.arc(b.size * 0.75, 0, b.size * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(5,6,15,0.6)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-b.size * 0.7, 0);
      ctx.lineTo(b.size * 0.45, 0);
      ctx.stroke();
      ctx.restore();
    };

    const draw = (dt) => {
      const c = core();
      ctx.save();
      if (g.shake > 0) ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
      ctx.clearRect(-20, -20, g.w + 40, g.h + 40);

      ctx.strokeStyle = "rgba(139,147,189,0.08)";
      ctx.lineWidth = 1;
      const step = 36;
      for (let x = (g.w / 2) % step; x < g.w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, g.h);
        ctx.stroke();
      }
      for (let y = (g.h / 2) % step; y < g.h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(g.w, y);
        ctx.stroke();
      }

      g.pulse += dt;
      for (let i = 0; i < 3; i++) {
        const k = ((g.pulse * 0.5 + i / 3) % 1);
        ctx.strokeStyle = `rgba(46,230,214,${0.35 * (1 - k)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r + k * c.r * 2.2, 0, Math.PI * 2);
        ctx.stroke();
      }
      const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      grad.addColorStop(0, "#2ee6d6");
      grad.addColorStop(0.6, "#8b5cf6");
      grad.addColorStop(1, "#ff5fa2");
      ctx.shadowColor = "#8b5cf6";
      ctx.shadowBlur = 30;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#05060f";
      ctx.font = `600 ${Math.round(c.r * 0.5)}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("prod", c.x, c.y + 1);

      for (const b of g.bugs) drawBug(b);

      for (const s of g.sparks) {
        ctx.globalAlpha = Math.max(s.life / s.max, 0);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const end = () => {
      g.running = false;
      cancelAnimationFrame(g.raf);
      setStatus("over");
      const prev = readBest();
      if (g.score > prev) {
        saveBest(g.score);
        setBest(g.score);
      }
      const tick = (now) => {
        const dt = Math.min((now - g.last) / 1000, 0.05);
        g.last = now;
        stepSparks(dt);
        draw(dt);
        if (g.sparks.length && !g.running) g.raf = requestAnimationFrame(tick);
      };
      g.last = performance.now();
      g.raf = requestAnimationFrame(tick);
    };

    const stepSparks = (dt) => {
      for (const s of g.sparks) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.life -= dt;
      }
      g.sparks = g.sparks.filter((s) => s.life > 0);
      g.shake = Math.max(0, g.shake - dt * 30);
    };

    const loop = (now) => {
      if (!g.running) return;
      const dt = Math.min((now - g.last) / 1000, 0.05);
      g.last = now;
      if (!g.visible) {
        g.raf = requestAnimationFrame(loop);
        return;
      }
      g.elapsed += dt;
      g.spawnIn -= dt;
      if (g.spawnIn <= 0) {
        spawn();
        g.spawnIn = Math.max(0.32, 1.15 - g.elapsed * 0.012);
      }
      const c = core();
      for (const b of g.bugs) {
        b.t += dt;
        const dx = c.x - b.x;
        const dy = c.y - b.y;
        const d = Math.hypot(dx, dy) || 1;
        const side = Math.sin(b.t * 4 + b.wobble) * 0.5;
        b.x += ((dx / d) - (dy / d) * side) * b.speed * dt;
        b.y += ((dy / d) + (dx / d) * side) * b.speed * dt;
        if (d < c.r + b.size * 0.4) b.hit = true;
      }
      const hits = g.bugs.filter((b) => b.hit);
      if (hits.length) {
        g.lives -= hits.length;
        g.shake = 14;
        g.combo = 1;
        for (const b of hits) burst(b.x, b.y, "#ff5fa2", 22);
        g.bugs = g.bugs.filter((b) => !b.hit);
        setHud({ score: g.score, lives: Math.max(g.lives, 0), combo: g.combo });
        if (g.lives <= 0) {
          draw(dt);
          end();
          return;
        }
      }
      stepSparks(dt);
      draw(dt);
      g.raf = requestAnimationFrame(loop);
    };

    g.start = () => {
      g.bugs = [];
      g.sparks = [];
      g.score = 0;
      g.lives = LIVES;
      g.combo = 1;
      g.elapsed = 0;
      g.spawnIn = 0.4;
      g.running = true;
      g.last = performance.now();
      setHud({ score: 0, lives: LIVES, combo: 1 });
      setStatus("playing");
      cancelAnimationFrame(g.raf);
      g.raf = requestAnimationFrame(loop);
    };

    const onDown = (e) => {
      if (!g.running) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      let hit = null;
      let bestD = Infinity;
      for (const b of g.bugs) {
        const d = Math.hypot(b.x - x, b.y - y);
        const reach = b.size + (e.pointerType === "mouse" ? 10 : 18);
        if (d < reach && d < bestD) {
          hit = b;
          bestD = d;
        }
      }
      if (!hit) {
        g.combo = 1;
        setHud({ score: g.score, lives: g.lives, combo: 1 });
        return;
      }
      const now = performance.now();
      g.combo = now - g.lastHit < 900 ? Math.min(g.combo + 1, 5) : 1;
      g.lastHit = now;
      g.score += (hit.gold ? 5 : 1) * g.combo;
      burst(hit.x, hit.y, hit.color, hit.gold ? 40 : 24);
      g.bugs = g.bugs.filter((b) => b !== hit);
      setHud({ score: g.score, lives: g.lives, combo: g.combo });
    };

    const io = new IntersectionObserver(([entry]) => {
      g.visible = entry.isIntersecting;
    });
    io.observe(wrap);
    const onVis = () => {
      if (document.hidden) g.visible = false;
    };
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    canvas.addEventListener("pointerdown", onDown);
    return () => {
      g.running = false;
      cancelAnimationFrame(g.raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const start = () => {
    if (game.current && game.current.start) game.current.start();
  };

  return (
    <section id="play" className="section">
      <div className="container-x">
        <SectionHeading
          index="07"
          eyebrow="Play"
          title="Squash the Bugs"
          intro="A mini game I built for this site. Bugs crawl toward production. Tap or click them before they get there. Quick hits stack a combo, and gold bugs are worth five."
        />

        <div className="reveal glass grad-border relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3 pt-1 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-4">
              <span className="text-mist-400">
                Score <span className="text-grad text-base font-semibold sm:text-lg">{hud.score}</span>
              </span>
              <span className={`text-mist-400 transition-opacity ${hud.combo > 1 ? "opacity-100" : "opacity-40"}`}>
                Combo <span className="text-amber">x{hud.combo}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-mist-400" aria-label={`${hud.lives} lives left`}>
                Uptime
                {Array.from({ length: LIVES }, (_, i) => (
                  <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < hud.lives ? "bg-teal shadow-[0_0_10px_#2ee6d6]" : "bg-ink-600"}`} />
                ))}
              </span>
              <span className="text-mist-400">
                Best <span className="text-mist-50">{best}</span>
              </span>
            </div>
          </div>

          <div ref={wrapRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-ink-950/80 sm:aspect-[16/9]">
            <canvas ref={canvasRef} className="block h-full w-full touch-manipulation" data-cursor="Squash" />
            {status !== "playing" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-ink-950/60 px-6 text-center backdrop-blur-[2px]">
                {status === "over" ? (
                  <>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-pink">Production is down</p>
                    <p className="text-4xl font-semibold tracking-tight sm:text-5xl">
                      You scored <span className="text-grad">{hud.score}</span>
                    </p>
                    <p className="text-sm text-mist-400">Best: {best}</p>
                  </>
                ) : (
                  <p className="max-w-sm text-lg text-mist-200">Protect prod. Three bugs get through and the server goes down.</p>
                )}
                <button type="button" onClick={start} className="btn btn-primary">
                  {status === "over" ? "Ship a hotfix and retry" : "Start the game"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
