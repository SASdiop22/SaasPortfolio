import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { UpdateProjectDtoType } from '@infrastructure/dto/project.dto';

export interface IProjectUpdater {
  updateForUser(id: number, userId: number, data: Partial<ProjectEntity>): Promise<ProjectEntity>;
}

export class UpdateProjectUseCase {
  constructor(private readonly repository: IProjectUpdater) {}

  execute(id: number, userId: number, data: UpdateProjectDtoType): Promise<ProjectEntity> {
    return this.repository.updateForUser(id, userId, data as Partial<ProjectEntity>);
  }
}