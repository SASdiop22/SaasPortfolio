import { ThemeEntity } from '@infrastructure/entities/ThemeEntity';

export interface IThemeActivator {
  setActive(id: number, userId: number): Promise<ThemeEntity>;
}

export class SetActiveThemeUseCase {
  constructor(private readonly repository: IThemeActivator) {}

  execute(id: number, userId: number): Promise<ThemeEntity> {
    return this.repository.setActive(id, userId);
  }
}
