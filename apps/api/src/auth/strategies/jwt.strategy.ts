import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";

export interface JwtPayload { sub: string; email: string; roleId: string; roleName: string; }
function cookieToken(request: Request) { const raw = request.headers.cookie ?? ""; const match = raw.split(";").map(p => p.trim()).find(p => p.startsWith("bubble_access=")); return match ? decodeURIComponent(match.slice("bubble_access=".length)) : null; }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly prisma: PrismaService, config: ConfigService) {
    const secret = config.get<string>("JWT_ACCESS_SECRET");
    if (!secret || secret.length < 32) throw new Error("JWT_ACCESS_SECRET must be configured with at least 32 characters");
    super({ jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieToken]), ignoreExpiration: false, secretOrKey: secret });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub }, include: { role: { include: { permissions: true } } } });
    if (!user || !user.isActive) throw new UnauthorizedException("User is inactive or no longer exists");
    return { userId: user.id, email: user.email, roleId: user.roleId, roleName: user.role.name, permissions: user.role.permissions.map((p: { key: string }) => p.key) };
  }
}
