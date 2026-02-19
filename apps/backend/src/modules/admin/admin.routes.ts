import { Router } from 'express';
import { prisma } from '../../config/prisma';
import { requireAdmin, requireAuth } from '../../middleware/auth';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  res.json(users);
});

adminRouter.patch('/users/:id/role', async (req, res) => {
  const role = req.body.role === 'admin' ? 'admin' : 'user';
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
  res.json(user);
});

adminRouter.get('/logs', async (_req, res) => {
  const latest = await prisma.activity.findMany({ include: { user: { select: { email: true } } }, orderBy: { createdAt: 'desc' }, take: 50 });
  res.json(latest);
});
