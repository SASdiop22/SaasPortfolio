import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface IEducationFinder {
  findByIdAndUser(id: number, userId: number): Promise<EducationEntity | null>;
}

export class GetEducationUseCase {
  constructor(private readonly repository: IEducationFinder) {}

  async execute(id: number, userId: number): Promise<EducationEntity> {
    const education = await this.repository.findByIdAndUser(id, userId);
    if (!education) throw new NotFoundException('Education not found');
    return education;
  }
}