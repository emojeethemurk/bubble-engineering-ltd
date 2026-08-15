"use client";

import { motion } from "framer-motion";

/**
 * Elegant, subtle animated construction-site background for the login page.
 * A rotating tower crane, drifting dust particles, and a faint blueprint
 * grid overlay sit behind a city skyline silhouette. Kept low-contrast so
 * the glass login card in front stays the visual focus.
 */
export function ConstructionBackground() {
  const dustParticles = Array.from({ length: 24 });

  return (
    <div className="absolute inset-0 overflow-hidden bg-animated-gradient animate-gradientShift">
      {/* Blueprint grid overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* City skyline silhouette */}
      <svg
        viewBox="0 0 1440 300"
        className="absolute bottom-0 left-0 w-full opacity-30"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="#050f24"
          d="M0,300 L0,180 L60,180 L60,120 L120,120 L120,200 L180,200 L180,90 L240,90 L240,220 L300,220
             L300,140 L360,140 L360,60 L420,60 L420,210 L480,210 L480,150 L540,150 L540,100 L600,100
             L600,230 L660,230 L660,170 L720,170 L720,80 L780,80 L780,190 L840,190 L840,130 L900,130
             L900,240 L960,240 L960,110 L1020,110 L1020,180 L1080,180 L1080,70 L1140,70 L1140,200
             L1200,200 L1200,150 L1260,150 L1260,220 L1320,220 L1320,100 L1380,100 L1380,190 L1440,190 L1440,300 Z"
        />
      </svg>

      {/* Tower crane */}
      <motion.div
        className="absolute right-[12%] top-[8%] origin-[10%_100%]"
        initial={{ rotate: -8 }}
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="260" height="180" viewBox="0 0 260 180" aria-hidden>
          {/* mast */}
          <rect x="18" y="20" width="6" height="160" fill="#cfe0ff" opacity="0.35" />
          {/* jib */}
          <rect x="20" y="20" width="220" height="4" fill="#cfe0ff" opacity="0.35" />
          {/* counter-jib */}
          <rect x="-30" y="20" width="50" height="4" fill="#cfe0ff" opacity="0.35" />
          {/* cables */}
          <line x1="140" y1="24" x2="140" y2="70" stroke="#cfe0ff" strokeWidth="2" opacity="0.3" />
          <line x1="21" y1="24" x2="21" y2="45" stroke="#cfe0ff" strokeWidth="2" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Drifting dust particles */}
      {dustParticles.map((_, i) => {
        const size = 2 + (i % 4);
        const left = (i * 37) % 100;
        const delay = (i % 8) * 1.4;
        const duration = 18 + (i % 6) * 3;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: "-5%",
            }}
            animate={{
              y: ["0%", "-120vh"],
              opacity: [0, 0.5, 0],
              x: [0, i % 2 === 0 ? 40 : -40],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}

      {/* Dark vignette so the glass card stays readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
    </div>
  );
}
