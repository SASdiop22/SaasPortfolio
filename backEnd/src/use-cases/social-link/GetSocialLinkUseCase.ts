import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface ISocialLinkFinder {
  findByIdAndUser(id: number, userId: number): Promise<SocialLinkEntity | null>;
}

export class GetSocialLinkUseCase {
  constructor(private readonly repository: ISocialLinkFinder) {}

  async execute(id: number, userId: number): Promise<SocialLinkEntity> {
    const link = await this.repository.findByIdAndUser(id, userId);
    if (!link) throw new NotFoundException('Social link not found');
    return link;
  }
}