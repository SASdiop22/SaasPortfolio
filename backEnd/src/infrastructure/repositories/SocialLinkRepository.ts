import { AppDataSource } from '@infrastructure/database/data-source';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { BaseRepository } from './BaseRepository';

export class SocialLinkRepository extends BaseRepository<SocialLinkEntity> {
  constructor() {
    super(AppDataSource.getRepository(SocialLinkEntity));
  }
}
