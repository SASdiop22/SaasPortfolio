import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { CreateSkillDtoType } from '@infrastructure/dto/skill.dto';

export interface ISkillCreator {
  createForUser(userId: number, data: Partial<SkillEntity>): Promise<SkillEntity>;
}

export class CreateSkillUseCase {
  constructor(private readonly repository: ISkillCreator) {}

  execute(userId: number, data: CreateSkillDtoType): Promise<SkillEntity> {
    return this.repository.createForUser(userId, data as Partial<SkillEntity>);
  }
}