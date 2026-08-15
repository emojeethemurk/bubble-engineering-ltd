import { IsString, IsDateString, MaxLength } from "class-validator";

export class CreateMilestoneDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsDateString()
  dueDate!: string;
}
