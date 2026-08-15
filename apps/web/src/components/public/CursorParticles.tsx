"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  hue: "white" | "blue" | "gray";
}

const MAX_PARTICLES = 70;

/**
 * Subtle atmospheric "construction dust" particle trail.
 *
 * - Single <canvas>, one requestAnimationFrame loop, mutable particle pool.
 * - No React state, no per-frame re-renders, no per-particle DOM nodes.
 * - Desktop: gentle smoke/mist puffs follow the cursor.
 * - Touch devices: very light puffs on touch/scroll only (no cursor trail).
 * - Fully paused when `prefers-reduced-motion: reduce` is set, and paused
 *   while the tab is hidden.
 */
export function CursorParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    // Object pool — reused instead of reallocated to avoid GC pressure.
    const particles: Particle[] = [];
    let pool: Particle[] = [];

    function spawn(x: number, y: number, kind: "cursor" | "scroll" | "touch") {
      if (particles.length >= MAX_PARTICLES) return;

      const reused = pool.pop();
      const isSmall = kind !== "cursor" || Math.random() > 0.4;
      const size = isSmall ? 2 + Math.random() * 4 : 4 + Math.random() * 7;
      const life = 500 + Math.random() * 1000; // 500ms - 1500ms
      const hueRoll = Math.random();
      const hue: Particle["hue"] = hueRoll > 0.75 ? "blue" : hueRoll > 0.5 ? "gray" : "white";

      const p: Particle = reused ?? ({} as Particle);
      p.x = x + (Math.random() - 0.5) * 6;
      p.y = y + (Math.random() - 0.5) * 6;
      p.vx = (Math.random() - 0.5) * (kind === "scroll" ? 0.25 : 0.4);
      p.vy = -0.15 - Math.random() * 0.35; // slight upward drift
      p.size = size * 0.4;
      p.maxSize = size;
      p.alpha = 0;
      p.maxAlpha = kind === "cursor" ? 0.28 + Math.random() * 0.18 : 0.16 + Math.random() * 0.12;
      p.life = 0;
      p.maxLife = life;
      p.hue = hue;
      particles.push(p);
    }

    function particleColor(hue: Particle["hue"], alpha: number) {
      if (hue === "blue") return `rgba(150, 190, 255, ${alpha})`;
      if (hue === "gray") return `rgba(200, 208, 220, ${alpha})`;
      return `rgba(255, 255, 255, ${alpha})`;
    }

    // ---- Canvas sizing -----------------------------------------------
    function resize() {
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = "100%";
      canvas!.style.height = "100%";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // ---- Input handling (cursor) --------------------------------------
    let lastSpawnX = -1000;
    let lastSpawnY = -1000;

    function handlePointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const dx = e.clientX - lastSpawnX;
      const dy = e.clientY - lastSpawnY;
      if (dx * dx + dy * dy < 220) return; // distance-throttled, not per-pixel
      lastSpawnX = e.clientX;
      lastSpawnY = e.clientY;
      spawn(e.clientX, e.clientY, "cursor");
      if (Math.random() > 0.6) spawn(e.clientX, e.clientY, "cursor");
    }

    // ---- Input handling (scroll) ---------------------------------------
    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    function handleScroll() {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const delta = Math.abs(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;
        if (delta > 4 && Math.random() > 0.55) {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2;
          spawn(x, y, "scroll");
        }
        scrollTicking = false;
      });
    }

    // ---- Input handling (touch) -----------------------------------------
    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch || Math.random() > 0.5) return;
      spawn(touch.clientX, touch.clientY, "touch");
    }

    if (!isCoarsePointer) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (isCoarsePointer) {
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    // ---- Visibility handling ---------------------------------------------
    let isVisible = true;
    function handleVisibilityChange() {
      isVisible = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ---- Animation loop ----------------------------------------------------
    let rafId = 0;
    let lastFrame = performance.now();

    function animate(now: number) {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) {
        lastFrame = now;
        return;
      }
      const dt = Math.min(now - lastFrame, 48);
      lastFrame = now;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          // Swap-pop removal — no array shifting, particle returned to pool.
          particles[i] = particles[particles.length - 1];
          particles.pop();
          pool.push(p);
          continue;
        }

        const t = p.life / p.maxLife; // 0 -> 1
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.size = p.size + (p.maxSize - p.size) * 0.06;
        // fade in quickly, hold, then fade out
        p.alpha = t < 0.15 ? (t / 0.15) * p.maxAlpha : p.maxAlpha * (1 - (t - 0.15) / 0.85);

        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, particleColor(p.hue, p.alpha));
        gradient.addColorStop(1, particleColor(p.hue, 0));
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      if (pool.length > 200) pool = pool.slice(0, 200);
    }
    rafId = requestAnimationFrame(animate);

    // ---- Cleanup -----------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (!isCoarsePointer) window.removeEventListener("pointermove", handlePointerMove);
      if (isCoarsePointer) window.removeEventListener("touchmove", handleTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 ${className}`}
      style={{ filter: "blur(0.4px)" }}
    />
  );
}
