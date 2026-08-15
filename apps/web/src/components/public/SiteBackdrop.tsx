"use client";

import { StarField } from "@/components/public/StarField";
import { CursorParticles } from "@/components/public/CursorParticles";

/**
 * Global, fixed, full-viewport cinematic backdrop mounted once in the root
 * layout so it covers every route (public pages, dashboard, login) with a
 * consistent BUBBLE Engineering visual identity:
 *
 *   layer 0  fixed construction photograph (same image everywhere)
 *   layer 1  dark navy/blue atmospheric gradients + vignette
 *   layer 2  starfield (existing Three.js implementation)
 *   layer 3  cursor/scroll smoke particles
 *
 * Everything here is `pointer-events: none` and `position: fixed`, so it
 * never intercepts clicks, never scrolls with the page, and never causes
 * horizontal overflow. Individual route layouts/shells are responsible for
 * adding translucent glass panels above this backdrop where a surface needs
 * stronger contrast (dashboard chrome, login card, etc.) rather than this
 * component changing per route.
 *
 * Mounted exactly once at the root layout — never remount this per-route,
 * or it will spawn duplicate Three.js canvases and animation loops.
 */
export function SiteBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020407]">
      {/* Layer 0 — the supplied BUBBLE construction photograph */}
      <div
        className="absolute inset-0 bg-construction-backdrop"
        aria-hidden="true"
      />

      {/* Layer 1 — atmospheric overlay: keeps the building visible while
         giving the image a premium, cinematic, enterprise-grade wash */}
      <div className="absolute inset-0 bg-[#020407]/15" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_18%,rgba(37,99,235,0.16),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_85%,rgba(96,165,250,0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020407]/25 via-transparent to-[#020407]/35" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_45%,transparent_55%,rgba(2,4,7,0.3)_100%)]" />

      {/* Layer 2 — stars */}
      <StarField starCount={200} speed={0.05} mouseInteraction twinkle />

      {/* Layer 3 — cursor / scroll smoke particles */}
      <CursorParticles />
    </div>
  );
}
