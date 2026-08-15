import { Controller, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("dashboard")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("summary")
  @Permissions("projects:read")
  async summary(@CurrentUser() user: { userId: string; roleName: string }) {
    const now = new Date();
    const projectWhere = user.roleName === "CLIENT" ? { client: { userId: user.userId } } : {};
    const taskWhere = user.roleName === "CLIENT" ? { project: projectWhere } : {};
    const milestoneWhere = user.roleName === "CLIENT" ? { project: projectWhere } : {};
    const documentWhere = user.roleName === "CLIENT" ? { project: projectWhere } : {};
    const clientWhere = user.roleName === "CLIENT" ? { userId: user.userId } : {};
    const [total, active, completed, planning, taskTotal, taskOpen, overdueTasks, milestoneTotal, milestoneOpen, overdueMilestones, clients, documents, projects] = await this.prisma.$transaction([
      this.prisma.project.count({ where: projectWhere }),
      this.prisma.project.count({ where: { ...projectWhere, status: "IN_PROGRESS" } }),
      this.prisma.project.count({ where: { ...projectWhere, status: "COMPLETED" } }),
      this.prisma.project.count({ where: { ...projectWhere, status: "PLANNING" } }),
      this.prisma.task.count({ where: taskWhere }),
      this.prisma.task.count({ where: { ...taskWhere, status: { not: "DONE" } } }),
      this.prisma.task.count({ where: { ...taskWhere, status: { not: "DONE" }, dueDate: { lt: now } } }),
      this.prisma.milestone.count({ where: milestoneWhere }),
      this.prisma.milestone.count({ where: { ...milestoneWhere, completed: false } }),
      this.prisma.milestone.count({ where: { ...milestoneWhere, completed: false, dueDate: { lt: now } } }),
      this.prisma.client.count({ where: clientWhere }),
      this.prisma.document.count({ where: documentWhere }),
      this.prisma.project.findMany({ where: projectWhere, orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, code: true, name: true, status: true, tasks: { select: { status: true } } } }),
    ]);
    const recentProjects = projects.map((project: (typeof projects)[number]) => { const totalTasks = project.tasks.length; const done = project.tasks.filter((t: (typeof project.tasks)[number]) => t.status === "DONE").length; return { id: project.id, code: project.code, name: project.name, status: project.status, progress: totalTasks ? Math.round(done / totalTasks * 100) : 0 }; });
    return { projects: { total, active, completed, planning }, tasks: { total: taskTotal, open: taskOpen, overdue: overdueTasks }, milestones: { total: milestoneTotal, open: milestoneOpen, overdue: overdueMilestones }, clients, documents, recentProjects };
  }
}
