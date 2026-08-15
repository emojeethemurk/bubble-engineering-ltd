import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { join } from "path";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProjectsModule } from "./projects/projects.module";
import { HealthModule } from "./health/health.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { EnquiriesModule } from "./enquiries/enquiries.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // npm workspaces run this script with cwd=apps/api, not the repo root,
      // so point explicitly at the root .env (and still allow real env vars
      // set some other way, e.g. in production, to take precedence).
      envFilePath: [join(__dirname, "../../../.env"), join(process.cwd(), ".env")],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    HealthModule,
    DashboardModule,
    EnquiriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
