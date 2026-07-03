import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';

export interface ISocialLinkLister {
  findAllByUser(userId: number): Promise<SocialLinkEntity[]>;
}

export class GetSocialLinksUseCase {
  constructor(private readonly repository: ISocialLinkLister) {}

  execute(userId: number): Promise<SocialLinkEntity[]> {
    return this.repository.findAllByUser(userId);
  }
}