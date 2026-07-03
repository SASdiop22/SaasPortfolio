import { AppDataSource } from '@infrastructure/database/data-source';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { BaseRepository } from './BaseRepository';

export class EducationRepository extends BaseRepository<EducationEntity> {
  constructor() {
    super(AppDataSource.getRepository(EducationEntity));
  }
}