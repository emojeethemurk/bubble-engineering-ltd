import { sessionFetch } from "./api-client";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export interface ProjectSummary {
  id: string;
  code: string;
  name: string;
  status: string;
  budget: string;
  startDate: string;
  endDate: string | null;
  progress: number;
  client: { id: string; companyName: string };
  _count: { tasks: number; milestones: number };
}

export interface ProjectsPage {
  items: ProjectSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskItem {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  dueDate: string | null;
  assignee: { id: string; jobTitle: string } | null;
}

export interface MilestoneItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectDetail extends ProjectSummary {
  description: string | null;
  address: string | null;
  tasks: TaskItem[];
  milestones: MilestoneItem[];
}

export async function fetchProjects(params: {
  status?: string;
  search?: string;
  page?: number;
}): Promise<ProjectsPage> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));

  const res = await sessionFetch(`/api/v1/projects?${qs.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });
  return handle<ProjectsPage>(res);
}

export async function fetchProject(id: string): Promise<ProjectDetail> {
  const res = await sessionFetch(`/api/v1/projects/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  return handle<ProjectDetail>(res);
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: TaskItem["status"],
) {
  const res = await sessionFetch(
    `/api/v1/projects/${projectId}/tasks/${taskId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
  );
  return handle<TaskItem>(res);
}
