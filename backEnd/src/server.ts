import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from '@infrastructure/database/data-source';
import { errorMiddleware } from '@infrastructure/middlewares/errorMiddleware';
import { env } from '@config/env';

import authRoutes from '@infrastructure/routes/auth.routes';
import userRoutes from '@infrastructure/routes/user.routes';
import projectRoutes from '@infrastructure/routes/project.routes';
import skillRoutes from '@infrastructure/routes/skill.routes';
import experienceRoutes from '@infrastructure/routes/experience.routes';
import educationRoutes from '@infrastructure/routes/education.routes';
import themeRoutes from '@infrastructure/routes/theme.routes';
import newsRoutes from '@infrastructure/routes/news.routes';
import socialLinkRoutes from '@infrastructure/routes/social-link.routes';
import publicRoutes from '@infrastructure/routes/public.routes';

const app = express();

app.use(helmet());
app.use(hpp());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/me', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/educations', educationRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/social-links', socialLinkRoutes);
app.use('/public/u', publicRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorMiddleware);

AppDataSource.initialize()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

export default app;