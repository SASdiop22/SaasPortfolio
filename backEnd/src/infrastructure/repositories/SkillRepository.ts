import { AppDataSource } from '@infrastructure/database/data-source';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { BaseRepository } from './BaseRepository';

export class SkillRepository extends BaseRepository<SkillEntity> {
  constructor() {
    super(AppDataSource.getRepository(SkillEntity));
  }
}