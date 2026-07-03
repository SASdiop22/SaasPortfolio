import { Request, Response, NextFunction } from 'express';
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { GetNewsListUseCase } from '@use-cases/news/GetNewsListUseCase';
import { GetNewsUseCase } from '@use-cases/news/GetNewsUseCase';
import { CreateNewsUseCase } from '@use-cases/news/CreateNewsUseCase';
import { UpdateNewsUseCase } from '@use-cases/news/UpdateNewsUseCase';
import { DeleteNewsUseCase } from '@use-cases/news/DeleteNewsUseCase';

export class NewsController {
  private get repo(): NewsRepository {
    return new NewsRepository();
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await new GetNewsListUseCase(this.repo).execute(req.user.id);
      res.status(200).json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await new GetNewsUseCase(this.repo).execute(id, req.user.id);
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await new CreateNewsUseCase(this.repo).execute(req.user.id, req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await new UpdateNewsUseCase(this.repo).execute(id, req.user.id, req.body);
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await new DeleteNewsUseCase(this.repo).execute(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}