import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsString as IsOtp } from "class-validator";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  @IsOptional()
  @IsOtp()
  twoFactorCode?: string;
}
