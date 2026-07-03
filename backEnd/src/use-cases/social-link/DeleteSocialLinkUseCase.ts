export interface ISocialLinkDeleter {
  deleteForUser(id: number, userId: number): Promise<void>;
}

export class DeleteSocialLinkUseCase {
  constructor(private readonly repository: ISocialLinkDeleter) {}

  execute(id: number, userId: number): Promise<void> {
    return this.repository.deleteForUser(id, userId);
  }
}