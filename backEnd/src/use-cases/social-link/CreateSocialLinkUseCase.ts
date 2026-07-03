import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { CreateSocialLinkDtoType } from '@infrastructure/dto/social-link.dto';

export interface ISocialLinkCreator {
  createForUser(userId: number, data: Partial<SocialLinkEntity>): Promise<SocialLinkEntity>;
}

export class CreateSocialLinkUseCase {
  constructor(private readonly repository: ISocialLinkCreator) {}

  execute(userId: number, data: CreateSocialLinkDtoType): Promise<SocialLinkEntity> {
    return this.repository.createForUser(userId, data as Partial<SocialLinkEntity>);
  }
}
