import { UserEntity } from '@infrastructure/entities/UserEntity';
import { UpdateProfileDtoType } from '@infrastructure/dto/user.dto';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface IUserUpdater {
  findById(id: number): Promise<UserEntity | null>;
  save(entity: UserEntity): Promise<UserEntity>;
}

export class UpdateProfileUseCase {
  constructor(private readonly repository: IUserUpdater) {}

  async execute(
    userId: number,
    data: UpdateProfileDtoType,
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.fullName !== undefined) user.fullName = data.fullName;
    if (data.bio !== undefined) user.bio = data.bio;

    const updated = await this.repository.save(user);
    const { passwordHash: _, ...profile } = updated;
    return profile;
  }
}