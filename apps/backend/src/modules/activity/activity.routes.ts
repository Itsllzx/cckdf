import { Router } from 'express';
import { prisma } from '../../config/prisma';
import { AuthRequest, requireAuth } from '../../middleware/auth';

export const activityRouter = Router();

activityRouter.get('/', requireAuth, async (req: AuthRequest, res) => {
 codex/build-production-ready-ai-web-app-9asrgs
  const [watchlist, watched, ratings] = await Promise.all([
    prisma.watchlist.findMany({ where: { userId: req.user!.sub }, include: { movie: { select: { id: true, title: true } } }, take: 20 }),
    prisma.watched.findMany({ where: { userId: req.user!.sub }, include: { movie: { select: { id: true, title: true } } }, take: 20 }),
    prisma.rating.findMany({ where: { userId: req.user!.sub }, include: { movie: { select: { id: true, title: true } } }, take: 20 })
  ]);

  res.json({ watchlist, watched, ratings });
=======
  const data = await prisma.activity.findMany({ where: { userId: req.user!.sub }, orderBy: { createdAt: 'desc' }, take: 30 });
  res.json(data);
});

activityRouter.post('/', requireAuth, async (req: AuthRequest, res) => {
  const action = String(req.body.action ?? 'unknown-action');
  const activity = await prisma.activity.create({ data: { userId: req.user!.sub, action } });
  res.status(201).json(activity);
 main
});
