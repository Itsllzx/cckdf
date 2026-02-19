import dotenv from 'dotenv';

dotenv.config();

export const env = {
 codex/build-production-ready-ai-web-app-9asrgs
  nodeEnv: process.env.NODE_ENV ?? 'development',
=======
 main
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000'
};
