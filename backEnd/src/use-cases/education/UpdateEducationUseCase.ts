import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { UpdateEducationDtoType } from '@infrastructure/dto/education.dto';

export interface IEducationUpdater {
  updateForUser(id: number, userId: number, data: Partial<EducationEntity>): Promise<EducationEntity>;
}

export class UpdateEducationUseCase {
  constructor(private readonly repository: IEducationUpdater) {}

  execute(id: number, userId: number, data: UpdateEducationDtoType): Promise<EducationEntity> {
    return this.repository.updateForUser(id, userId, data as Partial<EducationEntity>);
  }
}