import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { authRouter } from './modules/auth/auth.routes';
import { userRouter } from './modules/users/user.routes';
import { activityRouter } from './modules/activity/activity.routes';
import { adminRouter } from './modules/admin/admin.routes';
import { moviesRouter } from './modules/movies/movies.routes';
import { ratingsRouter } from './modules/ratings/ratings.routes';
import { recommendationsRouter } from './modules/recommendations/recommendations.routes';
import { playlistsRouter } from './modules/playlists/playlists.routes';
import { socialRouter } from './modules/social/social.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/activity', activityRouter);
app.use('/admin', adminRouter);
app.use('/movies', moviesRouter);
app.use('/ratings', ratingsRouter);
app.use('/', ratingsRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/playlists', playlistsRouter);
app.use('/', socialRouter);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API running on :${env.port}`);
});
