"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, BrainCircuit, Building2, CheckCircle2, ChevronRight, MapPin, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { EngineeringScene } from "@/components/public/EngineeringScene";
import { BrandProcess } from "@/components/public/BrandProcess";

const STATS = [
  ["180+", "projects delivered"],
  ["22", "years of experience"],
  ["640+", "site personnel"],
  ["94%", "client retention"],
];

const PROJECTS = [
  { name: "Meridian Tower", location: "Nairobi CBD", type: "Commercial · 32 floors", progress: 78 },
  { name: "Riverside Residences", location: "Karen, Nairobi", type: "Residential · 210 units", progress: 61 },
  { name: "Northgate Logistics Hub", location: "Ruiru", type: "Industrial · 48,000 m²", progress: 92 },
];

const SERVICES = [
  [Building2, "Commercial Construction", "Complex commercial buildings delivered from feasibility through handover."],
  [Workflow, "Project & Engineering Management", "One command layer for schedules, people, documents, milestones and site delivery."],
  [BrainCircuit, "Digital Construction", "BIM-ready workflows, AI-assisted intelligence and progress visibility."],
];

export default function HomePage() {
  return (
    <main className="overflow-hidden text-white">
      <section className="relative min-h-[calc(100vh-68px)] overflow-hidden border-b border-blue-300/10">
        <EngineeringScene />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-68px)] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-500/[0.07] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-300 shadow-[0_0_12px_rgba(67,165,255,.8)]" /> Engineering the next generation of the built environment
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }} className="max-w-4xl bg-gradient-to-b from-white to-sky-300 bg-clip-text text-5xl font-black leading-[.94] tracking-[-0.05em] text-transparent sm:text-7xl lg:text-[7.2rem]">
              BUILDING
              <span className="block bg-gradient-to-b from-white to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]">WHAT&apos;S NEXT.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .3 }} className="mt-8 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              BUBBLE Engineering Company Limited combines construction discipline with digital intelligence — giving clients a clearer view from first drawing to final handover.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .45 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/projects" className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_40px_rgba(22,119,255,.25)] transition hover:-translate-y-0.5">
                Explore projects <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </Link>
              <Link href="/contact#quote" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white/80 transition hover:border-blue-300/30 hover:bg-blue-500/10">
                Start a project
              </Link>
            </motion.div>
            <div className="mt-12 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/30">
              <span className="h-px w-12 bg-blue-400/30" />
              <span>DESIGN · ENGINEER · INNOVATE · BUILD · DELIVER</span>
            </div>
          </div>
        </div>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-blue-200/50">
          <ArrowDown size={18} />
        </motion.div>
      </section>

      <section className="relative border-b border-white/5 bg-[#03070d]/30 backdrop-blur-md py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-7 px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
          {STATS.map(([value, label]) => <div key={label} className="border-l border-blue-300/10 pl-4"><p className="text-3xl font-black tracking-tight text-white sm:text-4xl">{value}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200/45">{label}</p></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300/70">The BUBBLE method</p><h2 className="mt-3 max-w-2xl bg-gradient-to-b from-white to-sky-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">A construction workflow designed like an engineering system.</h2></div>
          <p className="max-w-md text-sm leading-6 text-white/40">The five ideas embedded in our identity become the way the digital experience works too: visible, measurable and connected.</p>
        </div>
        <BrandProcess />
      </section>

      <section className="border-y border-white/5 bg-gradient-to-b from-blue-950/20 to-transparent py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300/70">Digital command layer</p>
              <h2 className="mt-3 bg-gradient-to-b from-white to-sky-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">See the build before you walk the site.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/45">Projects, milestones, tasks, documents and progress belong in one secure system. The public experience shows the story; the command center runs the operation.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Live project progress", "Milestone tracking", "Secure client portal", "AI-assisted enquiries"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs text-white/70"><CheckCircle2 size={16} className="text-blue-300" />{item}</div>)}
              </div>
              <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300 hover:text-white">Open the command center <ChevronRight size={15} /></Link>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute inset-10 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="relative rounded-[2rem] border border-blue-300/15 bg-[#050b14]/90 p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
                <div className="rounded-[1.5rem] border border-white/8 bg-black/40 p-5">
                  <div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-blue-300/60">Project command</p><p className="mt-1 text-sm font-semibold">Meridian Tower</p></div><span className="rounded-full bg-blue-500/10 px-3 py-1 text-[9px] font-bold text-blue-200">LIVE</span></div>
                  <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/5"><motion.div initial={{ width: 0 }} whileInView={{ width: "78%" }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-300" /></div>
                  <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[.15em] text-white/35"><span>Overall progress</span><span>78%</span></div>
                  <div className="mt-8 grid grid-cols-3 gap-3">{[["08","active tasks"],["14","milestones"],["03","alerts"]].map(([v,l]) => <div key={l} className="rounded-2xl border border-white/7 bg-white/[0.03] p-4"><p className="text-xl font-bold">{v}</p><p className="mt-1 text-[8px] uppercase tracking-[.15em] text-white/35">{l}</p></div>)}</div>
                  <div className="mt-5 space-y-2">{["Structure level 18 complete", "MEP coordination underway", "Client report published"].map((x,i) => <div key={x} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-3 text-[10px] text-white/55"><span className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-blue-300 animate-pulse" : "bg-blue-500"}`} />{x}</div>)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mb-10 flex items-end justify-between gap-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300/70">Selected work</p><h2 className="mt-3 bg-gradient-to-b from-white to-sky-300 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl">Projects in motion.</h2></div><Link href="/projects" className="hidden text-xs font-bold uppercase tracking-[0.15em] text-blue-300 sm:block">All projects →</Link></div>
        <div className="grid gap-5 lg:grid-cols-3">
          {PROJECTS.map((project, index) => <motion.article key={project.name} whileHover={{ y: -7 }} className="group relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03]">
            <div className="relative h-64 overflow-hidden bg-[#050b13]/30 backdrop-blur-md">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(22,119,255,.25),transparent_45%)]" />
              <div className="absolute bottom-0 left-1/2 h-[72%] w-[48%] -translate-x-1/2 border-x border-t border-blue-300/25 bg-gradient-to-t from-blue-500/10 to-transparent [clip-path:polygon(15%_100%,15%_20%,32%_20%,32%_8%,48%_8%,48%_28%,67%_28%,67%_0,86%_0,86%_100%)] transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent" />
              <span className="absolute left-5 top-5 rounded-full border border-blue-300/15 bg-black/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[.15em] text-blue-200">0{index + 1}</span>
            </div>
            <div className="p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">{project.name}</h3><p className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-[.12em] text-white/35"><MapPin size={11} /> {project.location}</p></div><span className="text-sm font-bold text-blue-300">{project.progress}%</span></div><p className="mt-3 text-xs text-white/40">{project.type}</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5"><div style={{ width: `${project.progress}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-300" /></div></div>
          </motion.article>)}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#03070d]/30 backdrop-blur-md py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div className="mb-10 max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300/70">Capabilities</p><h2 className="mt-3 bg-gradient-to-b from-white to-sky-300 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl">Built around the realities of construction.</h2></div><div className="grid gap-4 md:grid-cols-3">{SERVICES.map(([Icon, title, text]) => { const C = Icon as typeof Building2; return <motion.div key={title as string} whileHover={{ y: -6 }} className="rounded-[2rem] border border-white/8 bg-white/[0.025] p-7"><C size={24} className="text-blue-300" /><h3 className="mt-8 text-lg font-semibold">{title as string}</h3><p className="mt-3 text-sm leading-6 text-white/40">{text as string}</p><Link href="/services" className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-blue-300">Explore <ArrowRight size={13} /></Link></motion.div> })}</div></div>
      </section>

      <section className="relative overflow-hidden px-5 py-28 text-center sm:px-8 lg:px-10"><div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" /><div className="relative mx-auto max-w-3xl"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/10 text-blue-200"><ShieldCheck size={24} /></div><h2 className="mt-7 bg-gradient-to-b from-white to-sky-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">LET&apos;S BUILD<br /><span className="text-blue-300">WHAT&apos;S NEXT.</span></h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/40">Tell us what you are building, where it is and when you want to move. Our team can take the conversation from enquiry to engineered delivery.</p><Link href="/contact#quote" className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-black uppercase tracking-[.15em] text-black transition hover:bg-blue-100"><Sparkles size={14} /> Start a project</Link></div></section>
    </main>
  );
}
