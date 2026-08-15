import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateEnquiryDto {
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsEmail() @MaxLength(254) email!: string;
  @IsString() @MinLength(7) @MaxLength(40) phone!: string;
  @IsString() @MinLength(2) @MaxLength(80) projectType!: string;
  @IsString() @MinLength(2) @MaxLength(80) budgetRange!: string;
  @IsString() @MinLength(10) @MaxLength(5000) message!: string;
}
