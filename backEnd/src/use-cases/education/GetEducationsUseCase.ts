import { EducationEntity } from '@infrastructure/entities/EducationEntity';

export interface IEducationLister {
  findAllByUser(userId: number): Promise<EducationEntity[]>;
}

export class GetEducationsUseCase {
  constructor(private readonly repository: IEducationLister) {}

  execute(userId: number): Promise<EducationEntity[]> {
    return this.repository.findAllByUser(userId);
  }
}