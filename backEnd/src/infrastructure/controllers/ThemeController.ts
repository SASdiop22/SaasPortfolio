import { Request, Response, NextFunction } from 'express';
import { ThemeRepository } from '@infrastructure/repositories/ThemeRepository';
import { GetThemesUseCase } from '@use-cases/theme/GetThemesUseCase';
import { GetThemeUseCase } from '@use-cases/theme/GetThemeUseCase';
import { CreateThemeUseCase } from '@use-cases/theme/CreateThemeUseCase';
import { UpdateThemeUseCase } from '@use-cases/theme/UpdateThemeUseCase';
import { DeleteThemeUseCase } from '@use-cases/theme/DeleteThemeUseCase';
import { SetActiveThemeUseCase } from '@use-cases/theme/SetActiveThemeUseCase';

export class ThemeController {
  private get repo(): ThemeRepository {
    return new ThemeRepository();
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const themes = await new GetThemesUseCase(this.repo).execute(req.user.id);
      res.status(200).json({ success: true, data: themes });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const theme = await new GetThemeUseCase(this.repo).execute(id, req.user.id);
      res.status(200).json({ success: true, data: theme });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const theme = await new CreateThemeUseCase(this.repo).execute(req.user.id, req.body);
      res.status(201).json({ success: true, data: theme });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const theme = await new UpdateThemeUseCase(this.repo).execute(id, req.user.id, req.body);
      res.status(200).json({ success: true, data: theme });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await new DeleteThemeUseCase(this.repo).execute(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async setActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const theme = await new SetActiveThemeUseCase(this.repo).execute(id, req.user.id);
      res.status(200).json({ success: true, data: theme });
    } catch (err) {
      next(err);
    }
  }
}
