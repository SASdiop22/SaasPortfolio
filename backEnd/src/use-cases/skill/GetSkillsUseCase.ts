import { SkillEntity } from '@infrastructure/entities/SkillEntity';

export interface ISkillLister {
  findAllByUser(userId: number): Promise<SkillEntity[]>;
}

export class GetSkillsUseCase {
  constructor(private readonly repository: ISkillLister) {}

  execute(userId: number): Promise<SkillEntity[]> {
    return this.repository.findAllByUser(userId);
  }
}