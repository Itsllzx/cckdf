# AI Glass Platform

Production-oriented monorepo with:
- **Frontend**: Next.js 14 + TypeScript + TailwindCSS + Framer Motion + Zustand + React Hook Form + Zod
- **Backend**: Express + TypeScript + Prisma + PostgreSQL + JWT auth + Winston logging

## Quick start

```bash
npm install
cp apps/backend/.env.example apps/backend/.env
npm run dev
```

## Architecture

- `apps/frontend`: glassmorphism UI, auth flows, dashboard, profile, admin pages
- `apps/backend`: REST API, role-based auth, rate limiting, centralized error handling
- `prisma/schema.prisma`: database schema for User + Activity

## Security

Helmet, CORS, rate limiting, JWT access + refresh tokens, bcrypt password hashing.
