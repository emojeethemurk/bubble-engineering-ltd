"use client";

import { motion } from "framer-motion";

export function EngineeringScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="blueprint-grid absolute inset-0 opacity-25" />
      <div className="absolute left-1/2 top-1/2 h-[70vw] w-[70vw] max-h-[900px] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      <motion.div className="absolute right-[8%] top-[16%] h-56 w-[2px] bg-gradient-to-b from-transparent via-blue-300/60 to-transparent" animate={{ opacity: [0.25, 0.8, 0.25] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.div className="absolute right-[5%] top-[16%] h-[2px] w-64 origin-right bg-gradient-to-l from-blue-300/70 to-transparent" animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute right-[19%] top-[22%] h-48 w-24 border-x border-t border-blue-400/30" animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity }} />
      <div className="absolute bottom-[-8%] left-1/2 h-[48%] w-[58%] -translate-x-1/2 border-x border-blue-400/20 bg-gradient-to-t from-blue-500/10 to-transparent [clip-path:polygon(20%_100%,20%_30%,37%_30%,37%_12%,51%_12%,51%_42%,67%_42%,67%_0,82%_0,82%_100%)]" />
      <motion.div className="absolute bottom-[22%] left-[12%] h-1 w-1 rounded-full bg-blue-300 shadow-[0_0_16px_5px_rgba(67,165,255,.5)]" animate={{ x: [0, 220, 0], opacity: [0, 1, 0] }} transition={{ duration: 7, repeat: Infinity }} />
      <motion.div className="absolute bottom-[29%] right-[13%] h-1 w-1 rounded-full bg-blue-300 shadow-[0_0_16px_5px_rgba(67,165,255,.5)]" animate={{ x: [0, -180, 0], opacity: [0, 1, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1.5 }} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020407] via-[#020407]/70 to-transparent" />
    </div>
  );
}
