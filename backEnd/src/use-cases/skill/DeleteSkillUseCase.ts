export interface ISkillDeleter {
  deleteForUser(id: number, userId: number): Promise<void>;
}

export class DeleteSkillUseCase {
  constructor(private readonly repository: ISkillDeleter) {}

  execute(id: number, userId: number): Promise<void> {
    return this.repository.deleteForUser(id, userId);
  }
}