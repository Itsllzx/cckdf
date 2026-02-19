import { Router } from 'express';
import { prisma } from '../../config/prisma';
import { AuthRequest, requireAuth } from '../../middleware/auth';

export const activityRouter = Router();

activityRouter.get('/', requireAuth, async (req: AuthRequest, res) => {
  const [watchlist, watched, ratings] = await Promise.all([
    prisma.watchlist.findMany({ where: { userId: req.user!.sub }, include: { movie: { select: { id: true, title: true } } }, take: 20 }),
    prisma.watched.findMany({ where: { userId: req.user!.sub }, include: { movie: { select: { id: true, title: true } } }, take: 20 }),
    prisma.rating.findMany({ where: { userId: req.user!.sub }, include: { movie: { select: { id: true, title: true } } }, take: 20 })
  ]);

  res.json({ watchlist, watched, ratings });
});
