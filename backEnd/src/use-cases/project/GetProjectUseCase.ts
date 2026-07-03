import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface IProjectFinder {
  findByIdAndUser(id: number, userId: number): Promise<ProjectEntity | null>;
}

export class GetProjectUseCase {
  constructor(private readonly repository: IProjectFinder) {}

  async execute(id: number, userId: number): Promise<ProjectEntity> {
    const project = await this.repository.findByIdAndUser(id, userId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }
}