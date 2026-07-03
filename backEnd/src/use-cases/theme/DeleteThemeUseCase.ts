export interface IThemeDeleter {
  delete(id: number, userId: number): Promise<void>;
}

export class DeleteThemeUseCase {
  constructor(private readonly repository: IThemeDeleter) {}

  execute(id: number, userId: number): Promise<void> {
    return this.repository.delete(id, userId);
  }
}