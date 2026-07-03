import { AppDataSource } from '@infrastructure/database/data-source';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { BaseRepository } from './BaseRepository';

export class ExperienceRepository extends BaseRepository<ExperienceEntity> {
  constructor() {
    super(AppDataSource.getRepository(ExperienceEntity));
  }
}