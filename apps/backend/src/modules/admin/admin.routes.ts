import { Router } from 'express';
import { prisma } from '../../config/prisma';
import { requireAdmin, requireAuth } from '../../middleware/auth';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});

adminRouter.patch('/users/:id/role', async (req, res) => {
  const role = req.body.role === 'admin' ? 'admin' : 'user';
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
  res.json(user);
});

adminRouter.get('/analytics/overview', async (_req, res) => {
  const [userCount, movieCount, reviewCount, ratingCount] = await Promise.all([
    prisma.user.count(),
    prisma.movie.count(),
    prisma.review.count(),
    prisma.rating.count()
  ]);
  res.json({ userCount, movieCount, reviewCount, ratingCount });
});
