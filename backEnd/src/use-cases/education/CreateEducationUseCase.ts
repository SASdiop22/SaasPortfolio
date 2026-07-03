import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { CreateEducationDtoType } from '@infrastructure/dto/education.dto';

export interface IEducationCreator {
  createForUser(userId: number, data: Partial<EducationEntity>): Promise<EducationEntity>;
}

export class CreateEducationUseCase {
  constructor(private readonly repository: IEducationCreator) {}

  execute(userId: number, data: CreateEducationDtoType): Promise<EducationEntity> {
    return this.repository.createForUser(userId, data as unknown as Partial<EducationEntity>);
  }
}