import { Request, Response, NextFunction } from 'express';
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { GetSocialLinksUseCase } from '@use-cases/social-link/GetSocialLinksUseCase';
import { GetSocialLinkUseCase } from '@use-cases/social-link/GetSocialLinkUseCase';
import { CreateSocialLinkUseCase } from '@use-cases/social-link/CreateSocialLinkUseCase';
import { UpdateSocialLinkUseCase } from '@use-cases/social-link/UpdateSocialLinkUseCase';
import { DeleteSocialLinkUseCase } from '@use-cases/social-link/DeleteSocialLinkUseCase';

export class SocialLinkController {
  private get repo(): SocialLinkRepository {
    return new SocialLinkRepository();
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await new GetSocialLinksUseCase(this.repo).execute(req.user.id);
      res.status(200).json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await new GetSocialLinkUseCase(this.repo).execute(id, req.user.id);
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await new CreateSocialLinkUseCase(this.repo).execute(req.user.id, req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await new UpdateSocialLinkUseCase(this.repo).execute(id, req.user.id, req.body);
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await new DeleteSocialLinkUseCase(this.repo).execute(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}