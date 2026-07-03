export interface INewsDeleter {
  deleteForUser(id: number, userId: number): Promise<void>;
}

export class DeleteNewsUseCase {
  constructor(private readonly repository: INewsDeleter) {}

  execute(id: number, userId: number): Promise<void> {
    return this.repository.deleteForUser(id, userId);
  }
}