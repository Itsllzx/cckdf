import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AuthRequest, requireAuth } from '../../middleware/auth';

export const socialRouter = Router();

const reviewSchema = z.object({ movieId: z.string().uuid(), content: z.string().min(1).max(500) });
const commentSchema = z.object({ content: z.string().min(1).max(300) });

socialRouter.post('/reviews', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = reviewSchema.parse(req.body);
    const review = await prisma.review.create({ data: { ...data, userId: req.user!.sub } });
    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
});

socialRouter.get('/feed', async (_req, res) => {
  const feed = await prisma.review.findMany({
    include: {
      user: { select: { id: true, username: true, avatar: true } },
      movie: { select: { id: true, title: true } },
      likes: true,
      comments: { include: { user: { select: { id: true, username: true } } } }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(feed);
});

socialRouter.post('/reviews/:id/like', requireAuth, async (req: AuthRequest, res) => {
  const like = await prisma.like.upsert({
    where: { userId_reviewId: { userId: req.user!.sub, reviewId: req.params.id } },
    create: { userId: req.user!.sub, reviewId: req.params.id },
    update: {}
  });
  res.status(201).json(like);
});

socialRouter.post('/reviews/:id/comment', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = commentSchema.parse(req.body);
    const comment = await prisma.comment.create({ data: { reviewId: req.params.id, userId: req.user!.sub, content: data.content } });
    res.status(201).json(comment);
  } catch (error) {
    return next(error);
  }
});
