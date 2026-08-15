import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  async check() {
    let database: "healthy" | "unavailable" = "healthy";
    try { await this.prisma.$queryRaw`SELECT 1`; } catch { database = "unavailable"; }
    return { status: database === "healthy" ? "healthy" : "degraded", application: "healthy", database, timestamp: new Date().toISOString() };
  }
}
