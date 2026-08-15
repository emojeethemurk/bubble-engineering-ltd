import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PermissionsGuard } from "./guards/permissions.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

function cookie(request: Request, name: string) {
  const raw = request.headers.cookie ?? "";
  const match = raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function setAuthCookies(response: Response, accessToken: string, refreshToken: string, rememberMe: boolean) {
  const secure = process.env.NODE_ENV === "production";
  response.cookie("bubble_access", accessToken, { httpOnly: true, secure, sameSite: "strict", path: "/", maxAge: 15 * 60 * 1000 });
  response.cookie("bubble_refresh", refreshToken, { httpOnly: true, secure, sameSite: "strict", path: "/api/v1/auth", maxAge: (rememberMe ? 30 : 7) * 86400000 });
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(dto);
    if (result.requiresTwoFactor) return result;
    if (!("accessToken" in result)) throw new UnauthorizedException("Authentication could not be completed");
    setAuthCookies(response, result.accessToken, result.refreshToken, result.rememberMe);
    return { requiresTwoFactor: false, user: result.user };
  }

  @Post("refresh")
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = cookie(request, "bubble_refresh");
    if (!refreshToken) throw new UnauthorizedException("No refresh session");
    const tokens = await this.authService.refresh(refreshToken);
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken, false);
    return { success: true };
  }

  @Post("logout")
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(cookie(request, "bubble_refresh"));
    const secure = process.env.NODE_ENV === "production";
    response.clearCookie("bubble_access", { httpOnly: true, secure, sameSite: "strict", path: "/" });
    response.clearCookie("bubble_refresh", { httpOnly: true, secure, sameSite: "strict", path: "/api/v1/auth" });
    return { success: true };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get("me")
  me(@CurrentUser() user: unknown) { return user; }
}
