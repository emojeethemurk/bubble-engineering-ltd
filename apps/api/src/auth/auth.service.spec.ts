import { Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";

describe("AuthService", () => {
  let authService: AuthService;
  let prisma: { user: any; refreshToken: any };

  beforeEach(async () => {
    process.env.JWT_ACCESS_SECRET = "test_access_secret_012345678901234567890123456789";
    process.env.JWT_REFRESH_SECRET = "test_refresh_secret_012345678901234567890123456789";
    prisma = {
      user: { findUnique: jest.fn() },
      refreshToken: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: { get: (key: string) => process.env[key] } },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue("signed.jwt.token") },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it("rejects login for unknown user", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login({ email: "nobody@example.com", password: "irrelevant" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rejects login with wrong password", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      passwordHash,
      isActive: true,
      twoFactorEnabled: false,
      roleId: "role-1",
      role: { name: "OWNER", permissions: [] },
    });

    await expect(
      authService.login({ email: "user@example.com", password: "wrong-password" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("issues tokens on valid login without 2FA", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      passwordHash,
      isActive: true,
      twoFactorEnabled: false,
      roleId: "role-1",
      role: { name: "OWNER", permissions: [] },
    });
    prisma.refreshToken.create.mockResolvedValue({});

    const result = await authService.login({
      email: "user@example.com",
      password: "correct-password",
    });

    expect(result.requiresTwoFactor).toBe(false);
    expect(result.accessToken).toBe("signed.jwt.token");
    expect(prisma.refreshToken.create).toHaveBeenCalled();
  });

  it("flags requiresTwoFactor when 2FA is enabled and no code supplied", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      passwordHash,
      isActive: true,
      twoFactorEnabled: true,
      twoFactorSecret: "SECRET",
      roleId: "role-1",
      role: { name: "OWNER", permissions: [] },
    });

    const result = await authService.login({
      email: "user@example.com",
      password: "correct-password",
    });

    expect(result).toEqual({ requiresTwoFactor: true });
  });
});
