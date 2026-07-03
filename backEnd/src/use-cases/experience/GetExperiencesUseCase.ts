import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';

export interface IExperienceLister {
  findAllByUser(userId: number): Promise<ExperienceEntity[]>;
}

export class GetExperiencesUseCase {
  constructor(private readonly repository: IExperienceLister) {}

  execute(userId: number): Promise<ExperienceEntity[]> {
    return this.repository.findAllByUser(userId);
  }
}