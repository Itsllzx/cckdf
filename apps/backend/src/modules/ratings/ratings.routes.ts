import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AuthRequest, requireAuth } from '../../middleware/auth';

export const ratingsRouter = Router();

const ratingSchema = z.object({ movieId: z.string().uuid(), score: z.number().int().min(1).max(10) });

ratingsRouter.post('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = ratingSchema.parse(req.body);
    const rating = await prisma.rating.upsert({
      where: { userId_movieId: { userId: req.user!.sub, movieId: data.movieId } },
      create: { userId: req.user!.sub, movieId: data.movieId, score: data.score },
      update: { score: data.score }
    });
    return res.status(201).json(rating);
  } catch (error) {
    return next(error);
  }
});

ratingsRouter.get('/users/:id/ratings', async (req, res) => {
  const ratings = await prisma.rating.findMany({
    where: { userId: req.params.id },
    include: { movie: { select: { id: true, title: true, releaseYear: true } } },
    orderBy: { createdAt: 'desc' }
  });

  res.json(ratings);
});
