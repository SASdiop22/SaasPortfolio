import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { UpdateSocialLinkDtoType } from '@infrastructure/dto/social-link.dto';

export interface ISocialLinkUpdater {
  updateForUser(id: number, userId: number, data: Partial<SocialLinkEntity>): Promise<SocialLinkEntity>;
}

export class UpdateSocialLinkUseCase {
  constructor(private readonly repository: ISocialLinkUpdater) {}

  execute(id: number, userId: number, data: UpdateSocialLinkDtoType): Promise<SocialLinkEntity> {
    return this.repository.updateForUser(id, userId, data as Partial<SocialLinkEntity>);
  }
}
