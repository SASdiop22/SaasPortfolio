export interface IEducationDeleter {
  deleteForUser(id: number, userId: number): Promise<void>;
}

export class DeleteEducationUseCase {
  constructor(private readonly repository: IEducationDeleter) {}

  execute(id: number, userId: number): Promise<void> {
    return this.repository.deleteForUser(id, userId);
  }
}