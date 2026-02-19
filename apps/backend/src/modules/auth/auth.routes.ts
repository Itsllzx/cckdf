import { Router } from 'express';
import bcrypt from 'bcrypt';
 codex/build-production-ready-ai-web-app-9asrgs
import crypto from 'crypto';
=======
 main
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
 codex/build-production-ready-ai-web-app-9asrgs
import { requireAuth, AuthRequest } from '../../middleware/auth';

const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const refreshSchema = z.object({ refreshToken: z.string().min(20).optional() });

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

const issueTokens = (user: { id: string; role: string }) => {
  const payload = { sub: user.id, role: user.role };
  const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
=======

const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
 main

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
 codex/build-production-ready-ai-web-app-9asrgs
    const existing = await prisma.user.findFirst({ where: { OR: [{ email: data.email }, { username: data.username }] } });
    if (existing) return res.status(409).json({ message: 'Email or username already exists' });

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { username: data.username, email: data.email, passwordHash, role: 'user' },
      select: { id: true, email: true, username: true, role: true }
=======
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const password = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password, role: 'user' },
      select: { id: true, email: true, role: true, name: true }
 main
    });

    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

 codex/build-production-ready-ai-web-app-9asrgs
    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const tokens = issueTokens({ id: user.id, role: user.role });
    const decoded = jwt.decode(tokens.refreshToken) as { exp?: number } | null;

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(tokens.refreshToken),
        expiresAt: new Date((decoded?.exp ?? 0) * 1000)
      }
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      accessToken: tokens.accessToken,
      user: { id: user.id, email: user.email, username: user.username, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const parsed = refreshSchema.parse(req.body);
    const providedToken = parsed.refreshToken ?? req.cookies.refreshToken;
    if (!providedToken) return res.status(401).json({ message: 'Missing refresh token' });

    const payload = jwt.verify(providedToken, env.jwtRefreshSecret) as { sub: string; role: string };
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(providedToken) } });
    if (!stored || stored.expiresAt < new Date()) return res.status(401).json({ message: 'Refresh token invalid or expired' });

    await prisma.refreshToken.delete({ where: { id: stored.id } });

    const tokens = issueTokens({ id: payload.sub, role: payload.role });
    const decoded = jwt.decode(tokens.refreshToken) as { exp?: number } | null;
    await prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        tokenHash: hashToken(tokens.refreshToken),
        expiresAt: new Date((decoded?.exp ?? 0) * 1000)
      }
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/logout', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { tokenHash: hashToken(refreshToken), userId: req.user!.sub } });
    }

    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out' });
=======
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { sub: user.id, role: user.role };
    const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: '7d' });

    return res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
 main
  } catch (error) {
    return next(error);
  }
});
