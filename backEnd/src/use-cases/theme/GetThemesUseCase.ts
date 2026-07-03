import { ThemeEntity } from '@infrastructure/entities/ThemeEntity';

export interface IThemeLister {
  findAllByUser(userId: number): Promise<ThemeEntity[]>;
}

export class GetThemesUseCase {
  constructor(private readonly repository: IThemeLister) {}

  execute(userId: number): Promise<ThemeEntity[]> {
    return this.repository.findAllByUser(userId);
  }
}