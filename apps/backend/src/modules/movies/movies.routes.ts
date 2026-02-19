import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';

export const moviesRouter = Router();

const filterSchema = z.object({
  genres: z.array(z.string()).default([]),
  countries: z.array(z.string()).default([]),
  fromYear: z.number().int().optional(),
  toYear: z.number().int().optional(),
  minImdbRating: z.number().min(0).max(10).optional(),
  actor: z.string().optional(),
  director: z.string().optional()
});

moviesRouter.get('/', async (_req, res) => {
  const movies = await prisma.movie.findMany({
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: { genres: { include: { genre: true } }, countries: { include: { country: true } } }
  });
  res.json(movies);
});

moviesRouter.get('/search', async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  if (!q) return res.status(400).json({ message: 'q is required' });

  const movies = await prisma.movie.findMany({
    where: {
      OR: [{ title: { contains: q, mode: 'insensitive' } }, { originalTitle: { contains: q, mode: 'insensitive' } }]
    },
    take: 50
  });
  res.json(movies);
});

moviesRouter.get('/filter', async (req, res, next) => {
  try {
    const parsed = filterSchema.parse({
      genres: req.query.genres ? String(req.query.genres).split(',') : [],
      countries: req.query.countries ? String(req.query.countries).split(',') : [],
      fromYear: req.query.fromYear ? Number(req.query.fromYear) : undefined,
      toYear: req.query.toYear ? Number(req.query.toYear) : undefined,
      minImdbRating: req.query.minImdbRating ? Number(req.query.minImdbRating) : undefined,
      actor: req.query.actor ? String(req.query.actor) : undefined,
      director: req.query.director ? String(req.query.director) : undefined
    });

    const movies = await prisma.movie.findMany({
      where: {
        releaseYear: { gte: parsed.fromYear, lte: parsed.toYear },
        imdbRating: parsed.minImdbRating ? { gte: parsed.minImdbRating } : undefined,
        genres: parsed.genres.length ? { some: { genre: { name: { in: parsed.genres } } } } : undefined,
        countries: parsed.countries.length ? { some: { country: { name: { in: parsed.countries } } } } : undefined,
        cast: parsed.actor ? { some: { person: { name: { contains: parsed.actor, mode: 'insensitive' } } } } : undefined,
        crew: parsed.director
          ? { some: { job: 'director', person: { name: { contains: parsed.director, mode: 'insensitive' } } } }
          : undefined
      },
      take: 100
    });

    return res.json(movies);
  } catch (error) {
    return next(error);
  }
});

moviesRouter.get('/:id', async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id },
    include: {
      genres: { include: { genre: true } },
      countries: { include: { country: true } },
      cast: { include: { person: true } },
      crew: { include: { person: true } }
    }
  });

  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  return res.json(movie);
});
