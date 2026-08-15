import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PermissionsGuard } from "./guards/permissions.guard";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // PermissionsGuard is applied per-route via @UseGuards(JwtAuthGuard, PermissionsGuard),
    // not globally — it depends on JwtAuthGuard having already populated request.user,
    // and global guards run before route-level guards, so registering it globally here
    // would make every permission check fail with "Not authenticated".
    PermissionsGuard,
  ],
  exports: [AuthService, PermissionsGuard],
})
export class AuthModule {}
