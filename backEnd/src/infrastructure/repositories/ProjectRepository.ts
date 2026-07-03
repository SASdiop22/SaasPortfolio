import { AppDataSource } from '@infrastructure/database/data-source';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { BaseRepository } from './BaseRepository';

export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor() {
    super(AppDataSource.getRepository(ProjectEntity));
  }
}