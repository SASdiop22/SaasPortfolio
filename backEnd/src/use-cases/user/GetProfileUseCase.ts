import { UserEntity } from '@infrastructure/entities/UserEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface IUserFinder {
  findById(id: number): Promise<UserEntity | null>;
}

export class GetProfileUseCase {
  constructor(private readonly repository: IUserFinder) {}

  async execute(userId: number): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash: _, ...profile } = user;
    return profile;
  }
}