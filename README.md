# CinemaYar Platform (IMDb + Letterboxd style)

A modular monorepo implementing a production-oriented baseline for a movie discovery + social recommendation platform.

## Stack

- Frontend: Next.js 14 + TypeScript + Tailwind + glassmorphism UI
- Backend API: Express + TypeScript + Prisma + PostgreSQL
- Auth: JWT access token (15m) + rotating refresh token (7d, httpOnly cookie)
- Data model: Social graph, playlists, watchlist, ratings, reviews, comments, likes

## Quick start

```bash
npm install
npm run db:generate
npm run dev
```

Backend default URL: `http://localhost:4000`
Frontend default URL: `http://localhost:3000`

## Production-grade API surface

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Movies
- `GET /movies`
- `GET /movies/:id`
- `GET /movies/search?q=...`
- `GET /movies/filter?genres=Drama,Thriller&fromYear=2010&toYear=2022&minImdbRating=7.5&actor=...&director=...`

### Ratings
- `POST /ratings`
- `GET /users/:id/ratings`

### Recommendations
- `GET /recommendations/home`
- `GET /recommendations/similar/:movieId`

### Playlists
- `POST /playlists`
- `GET /playlists/:id`
- `POST /playlists/:id/add`

### Social
- `POST /reviews`
- `GET /feed`
- `POST /reviews/:id/like`
- `POST /reviews/:id/comment`

## Architecture roadmap alignment

- Expanded Prisma schema to include core entities (`Movie`, `Genre`, `Country`, `Person`) and social entities (`Rating`, `Review`, `Comment`, `Like`, `Playlist`, `Watchlist`, `Watched`).
- Introduced recommendation endpoints with hybrid similarity signals (genre overlap + shared cast fallback).
- Added secure refresh-token rotation persisted in DB (`RefreshToken`) to support session invalidation.
- Preserved modular route structure so migration to NestJS modules/microservices can be incremental.
