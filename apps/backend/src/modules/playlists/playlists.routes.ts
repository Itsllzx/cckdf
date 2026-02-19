import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AuthRequest, requireAuth } from '../../middleware/auth';

export const playlistsRouter = Router();

const createPlaylistSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().max(300).optional(),
  isPublic: z.boolean().default(true)
});

const addMovieSchema = z.object({ movieId: z.string().uuid() });

playlistsRouter.post('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = createPlaylistSchema.parse(req.body);
    const playlist = await prisma.playlist.create({ data: { ...data, userId: req.user!.sub } });
    return res.status(201).json(playlist);
  } catch (error) {
    return next(error);
  }
});

playlistsRouter.get('/:id', async (req, res) => {
  const playlist = await prisma.playlist.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { movie: true }, orderBy: { itemOrder: 'asc' } }, user: { select: { id: true, username: true } } }
  });
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  res.json(playlist);
});

playlistsRouter.post('/:id/add', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const data = addMovieSchema.parse(req.body);
    const playlist = await prisma.playlist.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.userId !== req.user!.sub) return res.status(403).json({ message: 'Forbidden' });

    const item = await prisma.playlistItem.create({
      data: { playlistId: playlist.id, movieId: data.movieId, itemOrder: playlist.items.length + 1 }
    });

    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
});
