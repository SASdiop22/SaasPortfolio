import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '@config/env';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { ThemeEntity } from '@infrastructure/entities/ThemeEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  entities: [
    UserEntity,
    ProjectEntity,
    SkillEntity,
    ExperienceEntity,
    EducationEntity,
    NewsEntity,
    SocialLinkEntity,
    ThemeEntity,
  ],
  synchronize: env.nodeEnv === 'development',
  logging: env.nodeEnv === 'development',
});