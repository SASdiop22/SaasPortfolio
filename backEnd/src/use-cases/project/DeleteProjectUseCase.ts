export interface IProjectDeleter {
  deleteForUser(id: number, userId: number): Promise<void>;
}

export class DeleteProjectUseCase {
  constructor(private readonly repository: IProjectDeleter) {}

  execute(id: number, userId: number): Promise<void> {
    return this.repository.deleteForUser(id, userId);
  }
}