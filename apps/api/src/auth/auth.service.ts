import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() }, include: { role: { include: { permissions: true } } } });
    if (!user || !user.isActive) throw new UnauthorizedException("Invalid credentials");
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) throw new UnauthorizedException("Invalid credentials");

    if (user.twoFactorEnabled) {
      if (!dto.twoFactorCode) return { requiresTwoFactor: true };
      if (!this.verifyTwoFactorCode(user.twoFactorSecret ?? "", dto.twoFactorCode)) throw new UnauthorizedException("Invalid two-factor code");
    }

    const tokens = await this.issueTokens(user.id, user.email, user.roleId, user.role.name);
    await this.storeRefreshToken(user.id, tokens.refreshToken, dto.rememberMe);
    return { requiresTwoFactor: false, rememberMe: Boolean(dto.rememberMe), user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role.name, permissions: user.role.permissions.map((p: { key: string }) => p.key) }, ...tokens };
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findFirst({ where: { tokenHash, revoked: false, expiresAt: { gt: new Date() } }, include: { user: { include: { role: { include: { permissions: true } } } } } });
    if (!stored) throw new UnauthorizedException("Invalid or expired refresh token");
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
    const tokens = await this.issueTokens(stored.user.id, stored.user.email, stored.user.roleId, stored.user.role.name);
    await this.storeRefreshToken(stored.user.id, tokens.refreshToken, false);
    return tokens;
  }

  async logout(refreshToken?: string) {
    if (refreshToken) await this.prisma.refreshToken.updateMany({ where: { tokenHash: this.hashToken(refreshToken) }, data: { revoked: true } });
    return { success: true };
  }

  private async issueTokens(userId: string, email: string, roleId: string, roleName: string) {
    const accessToken = await this.jwt.signAsync({ sub: userId, email, roleId, roleName }, { secret: this.requireSecret("JWT_ACCESS_SECRET"), expiresIn: (this.config.get<string>("JWT_ACCESS_EXPIRES_IN") ?? "15m") as unknown as number });
    const refreshToken = await this.jwt.signAsync({ sub: userId, email, roleId, roleName }, { secret: this.requireSecret("JWT_REFRESH_SECRET"), expiresIn: (this.config.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d") as unknown as number });
    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string, rememberMe = false) {
    const days = rememberMe ? 30 : 7;
    await this.prisma.refreshToken.create({ data: { userId, tokenHash: this.hashToken(refreshToken), expiresAt: new Date(Date.now() + days * 86400000) } });
  }

  private hashToken(token: string) { return crypto.createHash("sha256").update(token).digest("hex"); }
  private requireSecret(name: string) { const value = this.config.get<string>(name); if (!value || value.length < 32) throw new Error(`${name} must be configured with at least 32 characters`); return value; }

  private verifyTwoFactorCode(secret: string, code: string) {
    if (!secret || !/^\d{6}$/.test(code)) return false;
    const normalized = secret.replace(/\s+/g, "").toUpperCase();
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    for (const char of normalized) { const index = alphabet.indexOf(char); if (index < 0) return false; bits += index.toString(2).padStart(5, "0"); }
    const bytes = Buffer.alloc(Math.floor(bits.length / 8));
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
    const counter = Math.floor(Date.now() / 1000 / 30);
    for (let drift = -1; drift <= 1; drift++) {
      const counterBuffer = Buffer.alloc(8);
      counterBuffer.writeBigInt64BE(BigInt(counter + drift));
      const digest = crypto.createHmac("sha1", bytes).update(counterBuffer).digest();
      const offset = digest[digest.length - 1] & 0xf;
      const value = ((digest[offset] & 0x7f) << 24) | ((digest[offset + 1] & 0xff) << 16) | ((digest[offset + 2] & 0xff) << 8) | (digest[offset + 3] & 0xff);
      if (String(value % 1_000_000).padStart(6, "0") === code) return true;
    }
    return false;
  }
}
