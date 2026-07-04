import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from '@config/env';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { ThemeEntity } from '@infrastructure/entities/ThemeEntity';

const entities = [
  UserEntity, ProjectEntity, SkillEntity, ExperienceEntity,
  EducationEntity, NewsEntity, SocialLinkEntity, ThemeEntity,
];

const isProduction = env.nodeEnv === 'production';
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

const options: DataSourceOptions = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      entities,
      synchronize: !isProduction,
      logging: !isProduction,
    }
  : {
      type: 'postgres',
      host: env.db.host,
      port: env.db.port,
      username: env.db.username,
      password: env.db.password,
      database: env.db.name,
      ssl: env.db.host.includes('supabase.co') ? { rejectUnauthorized: false } : false,
      entities,
      synchronize: !isProduction,
      logging: !isProduction,
    };

export const AppDataSource = new DataSource(options);