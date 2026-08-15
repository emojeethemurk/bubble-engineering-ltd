"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusBadge, ProgressBar } from "@/components/dashboard/StatusUI";
import { fetchProjects, type ProjectSummary } from "@/lib/projects-client";

const STATUS_OPTIONS = [
  "",
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchProjects({ search, status: status || undefined })
        .then((res) => setProjects(res.items))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300); // debounce search input

    return () => clearTimeout(timeout);
  }, [search, status]);

  return (
    <DashboardShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-white/50">
            Track every active, planned, and completed site.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          <Plus size={16} /> New project
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or code…"
            className="glass-input pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="glass-input sm:w-48"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0b1a3a]">
              {opt || "All statuses"}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <div className="glass-card divide-y divide-white/10">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse p-5">
              <div className="mb-2 h-4 w-1/3 rounded bg-white/10" />
              <div className="h-1.5 w-full rounded bg-white/10" />
            </div>
          ))
        ) : projects.length === 0 ? (
          <p className="p-8 text-center text-sm text-white/50">
            No projects match those filters yet.
          </p>
        ) : (
          projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="flex flex-col gap-2 p-5 transition hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white">{project.name}</p>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs text-white/50">
                  {project.code} · {project.client.companyName}
                </p>
              </div>
              <div className="w-full sm:w-48">
                <div className="mb-1 flex justify-between text-xs text-white/50">
                  <span>{project.progress}% complete</span>
                  <span>{project._count.tasks} tasks</span>
                </div>
                <ProgressBar value={project.progress} />
              </div>
            </Link>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
