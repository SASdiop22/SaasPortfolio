import { AppDataSource } from '@infrastructure/database/data-source';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { BaseRepository } from './BaseRepository';

export class NewsRepository extends BaseRepository<NewsEntity> {
  constructor() {
    super(AppDataSource.getRepository(NewsEntity));
  }
}