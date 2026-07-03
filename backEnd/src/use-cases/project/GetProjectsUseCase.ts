import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';

export interface IProjectLister {
  findAllByUser(userId: number): Promise<ProjectEntity[]>;
}

export class GetProjectsUseCase {
  constructor(private readonly repository: IProjectLister) {}

  execute(userId: number): Promise<ProjectEntity[]> {
    return this.repository.findAllByUser(userId);
  }
}