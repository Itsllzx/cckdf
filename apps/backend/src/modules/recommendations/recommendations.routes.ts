import { Router } from 'express';
import { prisma } from '../../config/prisma';
import { AuthRequest, requireAuth } from '../../middleware/auth';

export const recommendationsRouter = Router();

recommendationsRouter.get('/home', requireAuth, async (req: AuthRequest, res) => {
  const topGenres = await prisma.rating.groupBy({
    by: ['movieId'],
    where: { userId: req.user!.sub, score: { gte: 7 } },
    _avg: { score: true },
    orderBy: { _avg: { score: 'desc' } },
    take: 20
  });

  const likedMovieIds = topGenres.map((item) => item.movieId);
  const likedMovies = await prisma.movie.findMany({ where: { id: { in: likedMovieIds } }, include: { genres: true } });
  const genreIds = [...new Set(likedMovies.flatMap((movie) => movie.genres.map((g) => g.genreId)))];

  const recommendations = await prisma.movie.findMany({
    where: {
      genres: genreIds.length ? { some: { genreId: { in: genreIds } } } : undefined,
      id: { notIn: likedMovieIds }
    },
    take: 24
  });

  res.json(recommendations);
});

recommendationsRouter.get('/similar/:movieId', async (req, res) => {
  const movie = await prisma.movie.findUnique({ where: { id: req.params.movieId }, include: { genres: true, cast: true } });
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  const genreIds = movie.genres.map((g) => g.genreId);
  const castPersonIds = movie.cast.map((c) => c.personId);

  const similar = await prisma.movie.findMany({
    where: {
      id: { not: movie.id },
      OR: [
        { genres: { some: { genreId: { in: genreIds } } } },
        { cast: { some: { personId: { in: castPersonIds } } } }
      ]
    },
    take: 20
  });

  res.json(similar);
});
