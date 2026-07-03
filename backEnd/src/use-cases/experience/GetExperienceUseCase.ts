import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface IExperienceFinder {
  findByIdAndUser(id: number, userId: number): Promise<ExperienceEntity | null>;
}

export class GetExperienceUseCase {
  constructor(private readonly repository: IExperienceFinder) {}

  async execute(id: number, userId: number): Promise<ExperienceEntity> {
    const experience = await this.repository.findByIdAndUser(id, userId);
    if (!experience) throw new NotFoundException('Experience not found');
    return experience;
  }
}