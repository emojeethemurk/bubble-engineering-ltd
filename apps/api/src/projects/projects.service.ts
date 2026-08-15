import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { QueryProjectsDto } from "./dto/query-projects.dto";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { CreateTaskDto, UpdateTaskStatusDto } from "./dto/create-task.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProjectsDto, user?: { userId: string; roleName: string }) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);

    const where: Prisma.ProjectWhereInput = {
      ...(user?.roleName === "CLIENT" ? { client: { userId: user.userId } } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
              { code: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { id: true, companyName: true } },
          _count: { select: { tasks: true, milestones: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    const withProgress = await Promise.all(
      items.map(async (project: (typeof items)[number]) => ({
        ...project,
        progress: await this.calculateProgress(project.id),
      })),
    );

    return {
      items: withProgress,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string, user?: { userId: string; roleName: string }) {
    const project = await this.prisma.project.findFirst({
      where: { id, ...(user?.roleName === "CLIENT" ? { client: { userId: user.userId } } : {}) },
      include: {
        client: { select: { id: true, companyName: true, contactName: true, email: true, phone: true } },
        members: { include: { employee: { select: { id: true, employeeCode: true, jobTitle: true, department: true } } } },
        milestones: { orderBy: { dueDate: "asc" } },
        tasks: { include: { assignee: true }, orderBy: { createdAt: "desc" } },
        documents: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    const progress = await this.calculateProgress(id);
    return { ...project, progress };
  }

  async create(dto: CreateProjectDto) {
    const existing = await this.prisma.project.findUnique({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Project code "${dto.code}" is already in use`);
    }

    return this.prisma.project.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        clientId: dto.clientId,
        budget: dto.budget,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: dto.status,
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }

  async addMember(projectId: string, employeeId: string, roleOnSite: string) {
    await this.findOne(projectId);
    return this.prisma.projectMember.create({
      data: { projectId, employeeId, roleOnSite },
    });
  }

  async removeMember(projectId: string, employeeId: string) {
    await this.prisma.projectMember.delete({
      where: { projectId_employeeId: { projectId, employeeId } },
    });
    return { success: true };
  }

  async addMilestone(projectId: string, dto: CreateMilestoneDto) {
    await this.findOne(projectId);
    return this.prisma.milestone.create({
      data: {
        projectId,
        title: dto.title,
        dueDate: new Date(dto.dueDate),
      },
    });
  }

  async completeMilestone(projectId: string, milestoneId: string) {
    const milestone = await this.prisma.milestone.findFirst({
      where: { id: milestoneId, projectId },
    });
    if (!milestone) throw new NotFoundException("Milestone not found");

    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { completed: true },
    });
  }

  async addTask(projectId: string, dto: CreateTaskDto) {
    await this.findOne(projectId);
    return this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        milestoneId: dto.milestoneId,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        status: dto.status,
      },
    });
  }

  async updateTaskStatus(projectId: string, taskId: string, dto: UpdateTaskStatusDto) {
    const task = await this.prisma.task.findFirst({ where: { id: taskId, projectId } });
    if (!task) throw new NotFoundException("Task not found");

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status: dto.status },
    });
  }

  /**
   * Progress is derived from task completion rather than stored directly,
   * so it can never drift out of sync with the actual task board.
   */
  private async calculateProgress(projectId: string): Promise<number> {
    const [total, done] = await this.prisma.$transaction([
      this.prisma.task.count({ where: { projectId } }),
      this.prisma.task.count({ where: { projectId, status: "DONE" } }),
    ]);

    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  }
}
