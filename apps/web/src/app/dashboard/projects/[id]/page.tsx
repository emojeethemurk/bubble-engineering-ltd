"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusBadge, ProgressBar } from "@/components/dashboard/StatusUI";
import {
  fetchProject,
  updateTaskStatus,
  type ProjectDetail,
  type TaskItem,
} from "@/lib/projects-client";

const COLUMNS: { key: TaskItem["status"]; label: string }[] = [
  { key: "TODO", label: "To do" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "BLOCKED", label: "Blocked" },
  { key: "DONE", label: "Done" },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject(params.id)
      .then(setProject)
      .catch((err) => setError(err.message));
  }, [params.id]);

  const moveTask = async (taskId: string, status: TaskItem["status"]) => {
    if (!project) return;
    // optimistic update
    setProject({
      ...project,
      tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    });
    try {
      await updateTaskStatus(project.id, taskId, status);
    } catch {
      // revert on failure by refetching
      fetchProject(project.id).then(setProject);
    }
  };

  if (error) {
    return (
      <DashboardShell>
        <p className="text-sm text-red-300">{error}</p>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-white/10" />
          <div className="h-24 w-full rounded-2xl bg-white/5" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-white">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm text-white/50">
            {project.code} · {project.client.companyName}
          </p>
          {project.address && (
            <p className="text-xs text-white/40">{project.address}</p>
          )}
        </div>
        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between text-xs text-white/50">
            <span>Overall progress</span>
            <span>{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Task board */}
        <div className="glass-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Task board</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.key}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
                  {col.label}
                </p>
                <div className="space-y-2">
                  {project.tasks
                    .filter((t) => t.status === col.key)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/80"
                      >
                        <p className="mb-2 font-medium text-white">{task.title}</p>
                        {task.assignee && (
                          <p className="mb-2 text-white/40">{task.assignee.jobTitle}</p>
                        )}
                        <select
                          value={task.status}
                          onChange={(e) =>
                            moveTask(task.id, e.target.value as TaskItem["status"])
                          }
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.key} value={c.key} className="bg-[#0b1a3a]">
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  {project.tasks.filter((t) => t.status === col.key).length === 0 && (
                    <p className="text-[11px] text-white/30">No tasks</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones timeline */}
        <div className="glass-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Milestones</h2>
          <div className="space-y-4">
            {project.milestones.length === 0 && (
              <p className="text-xs text-white/40">No milestones yet.</p>
            )}
            {project.milestones.map((m) => (
              <div key={m.id} className="flex items-start gap-3">
                {m.completed ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                ) : new Date(m.dueDate) < new Date() ? (
                  <Clock size={18} className="mt-0.5 shrink-0 text-amber-400" />
                ) : (
                  <Circle size={18} className="mt-0.5 shrink-0 text-white/30" />
                )}
                <div>
                  <p className="text-sm text-white">{m.title}</p>
                  <p className="text-xs text-white/40">
                    Due {new Date(m.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
