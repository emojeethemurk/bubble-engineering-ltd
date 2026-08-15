"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, FileText, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { meRequest, sessionFetch } from "@/lib/api-client";

interface Me { userId: string; email: string; roleName: string; permissions: string[]; }
interface Summary { projects: { total: number; active: number; completed: number; planning: number }; tasks: { total: number; open: number; overdue: number }; milestones: { total: number; open: number; overdue: number }; clients: number; documents: number; recentProjects: { id: string; code: string; name: string; status: string; progress: number; }[]; }

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      meRequest<Me>(),
      sessionFetch("/api/v1/dashboard/summary").then(async r => { if (!r.ok) throw new Error("Unable to load dashboard"); return r.json(); }),
    ]).then(([user, data]) => { setMe(user); setSummary(data); }).catch(() => { setError("Your secure session could not be loaded."); router.replace("/login"); });
  }, [router]);

  const cards = summary ? [
    [BriefcaseBusiness, "Active projects", summary.projects.active, "blue"],
    [CheckCircle2, "Completed projects", summary.projects.completed, "green"],
    [Clock3, "Open tasks", summary.tasks.open, "amber"],
    [AlertTriangle, "Overdue items", summary.tasks.overdue + summary.milestones.overdue, "red"],
  ] as const : [];

  return <DashboardShell>
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[9px] font-bold uppercase tracking-[.28em] text-blue-300/60">Construction command center</p><h1 className="mt-2 text-3xl font-black tracking-tight">Good to see you{me ? `, ${me.email.split("@")[0]}` : ""}.</h1><p className="mt-2 text-sm text-white/35">Live operational visibility across your construction portfolio.</p></div><div className="flex items-center gap-2 rounded-full border border-blue-300/10 bg-blue-500/5 px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-blue-200"><Activity size={13} /> System online</div></div>
      {error && <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-xs text-red-200">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([Icon,label,value], i) => <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }} className="rounded-3xl border border-white/8 bg-white/[.03] p-5"><div className="flex items-center justify-between"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300"><Icon size={17}/></div><ArrowUpRight size={14} className="text-white/20"/></div><p className="mt-7 text-3xl font-black">{value}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[.18em] text-white/30">{label}</p></motion.div>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_.7fr]">
        <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5"><div className="mb-5 flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.22em] text-blue-300/55">Portfolio</p><h2 className="mt-1 text-lg font-semibold">Project pulse</h2></div><BriefcaseBusiness size={18} className="text-white/20"/></div>{summary?.recentProjects?.map(project => <div key={project.id} className="mb-3 rounded-2xl border border-white/6 bg-black/20 p-4 last:mb-0"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">{project.name}</p><p className="mt-1 text-[9px] uppercase tracking-[.14em] text-white/30">{project.code} · {project.status.replaceAll("_", " ")}</p></div><span className="text-sm font-bold text-blue-300">{project.progress}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-300" style={{ width: `${project.progress}%` }} /></div></div>)}{!summary && <div className="space-y-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5"/>)}</div>}</section>
        <section className="rounded-3xl border border-white/8 bg-gradient-to-b from-blue-500/[.08] to-white/[.02] p-5"><p className="text-[9px] font-bold uppercase tracking-[.22em] text-blue-300/55">Workspace</p><h2 className="mt-1 text-lg font-semibold">At a glance</h2><div className="mt-6 space-y-3">{[[Users,"Clients",summary?.clients ?? "—"],[FileText,"Documents",summary?.documents ?? "—"],[Clock3,"Milestones open",summary?.milestones.open ?? "—"],[AlertTriangle,"Milestones overdue",summary?.milestones.overdue ?? "—"]].map(([Icon,label,value])=>{const C=Icon as typeof Users; return <div key={label as string} className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/15 p-3"><div className="flex items-center gap-3"><C size={15} className="text-blue-300"/><span className="text-xs text-white/50">{label as string}</span></div><span className="text-sm font-bold">{value as string|number}</span></div>})}</div></section>
      </div>
    </div>
  </DashboardShell>;
}
