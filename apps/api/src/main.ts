import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";

function requireEnvironment() {
  for (const name of ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"]) {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is required`);
    if (name.includes("SECRET") && value.length < 32) throw new Error(`${name} must be at least 32 characters`);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  requireEnvironment();
  app.enableShutdownHooks();
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({ origin: (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(",").map(v => v.trim()), credentials: true, methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, transformOptions: { enableImplicitConversion: true } }));
  app.setGlobalPrefix("api/v1");
  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
  console.log(`BUBBLE API listening on http://localhost:${port}/api/v1`);
}
bootstrap();
