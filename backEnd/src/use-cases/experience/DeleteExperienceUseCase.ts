export interface IExperienceDeleter {
  deleteForUser(id: number, userId: number): Promise<void>;
}

export class DeleteExperienceUseCase {
  constructor(private readonly repository: IExperienceDeleter) {}

  execute(id: number, userId: number): Promise<void> {
    return this.repository.deleteForUser(id, userId);
  }
}