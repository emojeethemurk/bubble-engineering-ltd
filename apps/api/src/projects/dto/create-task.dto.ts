import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, MaxLength } from "class-validator";

export enum TaskStatusDto {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  BLOCKED = "BLOCKED",
  DONE = "DONE",
}

export class CreateTaskDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  milestoneId?: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(TaskStatusDto)
  status?: TaskStatusDto;
}

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatusDto)
  status!: TaskStatusDto;
}
