import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { CreateExperienceDtoType } from '@infrastructure/dto/experience.dto';

export interface IExperienceCreator {
  createForUser(userId: number, data: Partial<ExperienceEntity>): Promise<ExperienceEntity>;
}

export class CreateExperienceUseCase {
  constructor(private readonly repository: IExperienceCreator) {}

  execute(userId: number, data: CreateExperienceDtoType): Promise<ExperienceEntity> {
    return this.repository.createForUser(userId, data as unknown as Partial<ExperienceEntity>);
  }
}