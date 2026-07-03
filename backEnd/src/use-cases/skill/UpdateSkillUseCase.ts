import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { UpdateSkillDtoType } from '@infrastructure/dto/skill.dto';

export interface ISkillUpdater {
  updateForUser(id: number, userId: number, data: Partial<SkillEntity>): Promise<SkillEntity>;
}

export class UpdateSkillUseCase {
  constructor(private readonly repository: ISkillUpdater) {}

  execute(id: number, userId: number, data: UpdateSkillDtoType): Promise<SkillEntity> {
    return this.repository.updateForUser(id, userId, data as Partial<SkillEntity>);
  }
}