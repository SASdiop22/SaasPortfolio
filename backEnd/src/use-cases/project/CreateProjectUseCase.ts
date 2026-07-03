import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { CreateProjectDtoType } from '@infrastructure/dto/project.dto';

export interface IProjectCreator {
  createForUser(userId: number, data: Partial<ProjectEntity>): Promise<ProjectEntity>;
}

export class CreateProjectUseCase {
  constructor(private readonly repository: IProjectCreator) {}

  execute(userId: number, data: CreateProjectDtoType): Promise<ProjectEntity> {
    return this.repository.createForUser(userId, data as Partial<ProjectEntity>);
  }
}