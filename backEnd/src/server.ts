import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AppDataSource } from '@infrastructure/database/data-source';
import { errorMiddleware } from '@infrastructure/middlewares/errorMiddleware';
import { env } from '@config/env';

import authRoutes from '@infrastructure/routes/auth.routes';
import userRoutes from '@infrastructure/routes/user.routes';
import projectRoutes from '@infrastructure/routes/project.routes';
import skillRoutes from '@infrastructure/routes/skill.routes';
import experienceRoutes from '@infrastructure/routes/experience.routes';
import educationRoutes from '@infrastructure/routes/education.routes';

const app = express();

app.use(cors({ origin: env.cors.allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/educations', educationRoutes);

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