import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { UpdateExperienceDtoType } from '@infrastructure/dto/experience.dto';

export interface IExperienceUpdater {
  updateForUser(id: number, userId: number, data: Partial<ExperienceEntity>): Promise<ExperienceEntity>;
}

export class UpdateExperienceUseCase {
  constructor(private readonly repository: IExperienceUpdater) {}

  execute(id: number, userId: number, data: UpdateExperienceDtoType): Promise<ExperienceEntity> {
    return this.repository.updateForUser(id, userId, data as Partial<ExperienceEntity>);
  }
}