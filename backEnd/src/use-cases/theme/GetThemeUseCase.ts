import { ThemeEntity } from '@infrastructure/entities/ThemeEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface IThemeFinder {
  findByIdAndUser(id: number, userId: number): Promise<ThemeEntity | null>;
}

export class GetThemeUseCase {
  constructor(private readonly repository: IThemeFinder) {}

  async execute(id: number, userId: number): Promise<ThemeEntity> {
    const theme = await this.repository.findByIdAndUser(id, userId);
    if (!theme) throw new NotFoundException();
    return theme;
  }
}
