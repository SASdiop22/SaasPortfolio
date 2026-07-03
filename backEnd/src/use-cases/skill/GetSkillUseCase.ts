import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface ISkillFinder {
  findByIdAndUser(id: number, userId: number): Promise<SkillEntity | null>;
}

export class GetSkillUseCase {
  constructor(private readonly repository: ISkillFinder) {}

  async execute(id: number, userId: number): Promise<SkillEntity> {
    const skill = await this.repository.findByIdAndUser(id, userId);
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }
}