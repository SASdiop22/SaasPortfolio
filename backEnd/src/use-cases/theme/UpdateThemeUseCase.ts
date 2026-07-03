import { ThemeEntity } from '@infrastructure/entities/ThemeEntity';
import { UpdateThemeDtoType } from '@infrastructure/dto/theme.dto';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface IThemeUpdater {
  findByIdAndUser(id: number, userId: number): Promise<ThemeEntity | null>;
  save(entity: ThemeEntity): Promise<ThemeEntity>;
}

export class UpdateThemeUseCase {
  constructor(private readonly repository: IThemeUpdater) {}

  async execute(id: number, userId: number, data: UpdateThemeDtoType): Promise<ThemeEntity> {
    const theme = await this.repository.findByIdAndUser(id, userId);
    if (!theme) throw new NotFoundException();
    Object.assign(theme, data);
    return this.repository.save(theme);
  }
}