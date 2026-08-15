import { Type } from "class-transformer";
import { IsOptional, IsEnum, IsInt, Min, IsString, Max } from "class-validator";
import { ProjectStatusDto } from "./create-project.dto";

export class QueryProjectsDto {
  @IsOptional()
  @IsEnum(ProjectStatusDto)
  status?: ProjectStatusDto;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
