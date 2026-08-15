"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const CATEGORIES = ["All", "Commercial", "Residential", "Infrastructure", "Industrial"];

const PROJECTS = [
  { name: "Meridian Tower", location: "Nairobi CBD", category: "Commercial", year: 2025 },
  { name: "Riverside Residences", location: "Karen", category: "Residential", year: 2024 },
  { name: "Northgate Logistics Hub", location: "Ruiru", category: "Industrial", year: 2024 },
  { name: "Coastal Highway Bridge", location: "Mombasa Road", category: "Infrastructure", year: 2023 },
  { name: "Summit Business Park", location: "Westlands", category: "Commercial", year: 2023 },
  { name: "Greenfield Estate", location: "Kiambu", category: "Residential", year: 2022 },
];

export default function ProjectsShowcasePage() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-300">
          Portfolio
        </p>
        <h1 className="bg-gradient-to-b from-white to-sky-300 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
          Projects across every sector we build in
        </h1>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              filter === cat
                ? "bg-brand-500 text-white"
                : "border border-white/15 text-white/60 hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <div key={project.name} className="glass-card overflow-hidden">
            <div className="h-44 bg-gradient-to-br from-brand-700 to-brand-900" />
            <div className="p-5">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">{project.name}</h3>
                <span className="text-[11px] text-white/40">{project.year}</span>
              </div>
              <p className="flex items-center gap-1 text-xs text-white/50">
                <MapPin size={12} /> {project.location}
              </p>
              <span className="mt-3 inline-block rounded-full bg-brand-500/20 px-2.5 py-1 text-[11px] text-brand-300">
                {project.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
