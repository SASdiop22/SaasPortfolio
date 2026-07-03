import { ThemeEntity } from '@infrastructure/entities/ThemeEntity';
import { CreateThemeDtoType } from '@infrastructure/dto/theme.dto';

export interface IThemeCreator {
  create(data: Partial<ThemeEntity>): Promise<ThemeEntity>;
}

export class CreateThemeUseCase {
  constructor(private readonly repository: IThemeCreator) {}

  execute(userId: number, data: CreateThemeDtoType): Promise<ThemeEntity> {
    return this.repository.create({ ...data, userId, isActive: false });
  }
}