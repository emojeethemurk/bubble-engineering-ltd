"use client";

import { motion } from "framer-motion";
import { Blocks, BrainCircuit, Compass, HardHat, ShieldCheck } from "lucide-react";

const STEPS = [
  { title: "DESIGN", text: "Blueprints become coordinated, buildable decisions.", icon: Compass },
  { title: "ENGINEER", text: "Structure, systems and site realities are resolved early.", icon: Blocks },
  { title: "INNOVATE", text: "AI, digital workflows and data sharpen execution.", icon: BrainCircuit },
  { title: "BUILD", text: "People, plant and materials move with discipline.", icon: HardHat },
  { title: "DELIVER", text: "Quality, safety and handover close the loop.", icon: ShieldCheck },
];

export function BrandProcess() {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {STEPS.map(({ title, text, icon: Icon }, index) => (
        <motion.div key={title} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="group relative overflow-hidden rounded-3xl border border-blue-300/10 bg-white/[0.035] p-5 backdrop-blur-md">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition duration-500 group-hover:bg-blue-400/20" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/10 text-blue-200">
            <Icon size={20} />
          </div>
          <p className="relative mt-7 text-[10px] font-bold tracking-[0.32em] text-blue-300/70">0{index + 1}</p>
          <h3 className="relative mt-2 text-sm font-bold tracking-[0.18em] text-white">{title}</h3>
          <p className="relative mt-3 text-xs leading-6 text-white/45">{text}</p>
        </motion.div>
      ))}
    </div>
  );
}
