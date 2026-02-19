import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AuthRequest, requireAuth } from '../../middleware/auth';

export const userRouter = Router();

 codex/build-production-ready-ai-web-app-9asrgs
const profileSchema = z.object({
  username: z.string().min(3).max(32).optional(),
  bio: z.string().max(200).optional(),
  avatar: z.string().url().optional()
});

const passwordSchema = z.object({ currentPassword: z.string().min(8), newPassword: z.string().min(8) });

userRouter.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.sub },
    select: { id: true, username: true, email: true, avatar: true, bio: true, role: true }
  });
=======
const profileSchema = z.object({ name: z.string().min(2) });
const passwordSchema = z.object({ currentPassword: z.string().min(8), newPassword: z.string().min(8) });

userRouter.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub }, select: { id: true, name: true, email: true, role: true } });
 main
  return res.json(user);
});

userRouter.patch('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = profileSchema.parse(req.body);
 codex/build-production-ready-ai-web-app-9asrgs
    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data,
      select: { id: true, username: true, email: true, avatar: true, bio: true, role: true }
    });
=======
    const user = await prisma.user.update({ where: { id: req.user!.sub }, data, select: { id: true, name: true, email: true, role: true } });
 main
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

userRouter.post('/change-password', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = passwordSchema.parse(req.body);
    const current = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!current) return res.status(404).json({ message: 'User not found' });

 codex/build-production-ready-ai-web-app-9asrgs
    const valid = await bcrypt.compare(data.currentPassword, current.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Current password incorrect' });

    const passwordHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({ where: { id: req.user!.sub }, data: { passwordHash } });
=======
    const valid = await bcrypt.compare(data.currentPassword, current.password);
    if (!valid) return res.status(400).json({ message: 'Current password incorrect' });

    const password = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({ where: { id: req.user!.sub }, data: { password } });
 main
    return res.json({ message: 'Password updated' });
  } catch (error) {
    return next(error);
  }
});
