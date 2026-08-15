import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { QueryProjectsDto } from "./dto/query-projects.dto";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { CreateTaskDto, UpdateTaskStatusDto } from "./dto/create-task.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("projects")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Permissions("projects:read")
  findAll(@Query() query: QueryProjectsDto, @CurrentUser() user: { userId: string; roleName: string }) {
    return this.projectsService.findAll(query, user);
  }

  @Get(":id")
  @Permissions("projects:read")
  findOne(@Param("id") id: string, @CurrentUser() user: { userId: string; roleName: string }) {
    return this.projectsService.findOne(id, user);
  }

  @Post()
  @Permissions("projects:write")
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(":id")
  @Permissions("projects:write")
  update(@Param("id") id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(":id")
  @Permissions("projects:write")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(id);
  }

  @Post(":id/members")
  @Permissions("projects:write")
  addMember(
    @Param("id") id: string,
    @Body() body: { employeeId: string; roleOnSite: string },
  ) {
    return this.projectsService.addMember(id, body.employeeId, body.roleOnSite);
  }

  @Delete(":id/members/:employeeId")
  @Permissions("projects:write")
  removeMember(@Param("id") id: string, @Param("employeeId") employeeId: string) {
    return this.projectsService.removeMember(id, employeeId);
  }

  @Post(":id/milestones")
  @Permissions("projects:write")
  addMilestone(@Param("id") id: string, @Body() dto: CreateMilestoneDto) {
    return this.projectsService.addMilestone(id, dto);
  }

  @Patch(":id/milestones/:milestoneId/complete")
  @Permissions("projects:write")
  completeMilestone(
    @Param("id") id: string,
    @Param("milestoneId") milestoneId: string,
  ) {
    return this.projectsService.completeMilestone(id, milestoneId);
  }

  @Post(":id/tasks")
  @Permissions("projects:write")
  addTask(@Param("id") id: string, @Body() dto: CreateTaskDto) {
    return this.projectsService.addTask(id, dto);
  }

  @Patch(":id/tasks/:taskId/status")
  @Permissions("projects:write")
  updateTaskStatus(
    @Param("id") id: string,
    @Param("taskId") taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.projectsService.updateTaskStatus(id, taskId, dto);
  }
}
