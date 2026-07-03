import { Request, Response, NextFunction } from 'express';
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { GetExperiencesUseCase } from '@use-cases/experience/GetExperiencesUseCase';
import { GetExperienceUseCase } from '@use-cases/experience/GetExperienceUseCase';
import { CreateExperienceUseCase } from '@use-cases/experience/CreateExperienceUseCase';
import { UpdateExperienceUseCase } from '@use-cases/experience/UpdateExperienceUseCase';
import { DeleteExperienceUseCase } from '@use-cases/experience/DeleteExperienceUseCase';

export class ExperienceController {
  private get repo(): ExperienceRepository {
    return new ExperienceRepository();
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const experiences = await new GetExperiencesUseCase(this.repo).execute(req.user.id);
      res.status(200).json({ success: true, data: experiences });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const experience = await new GetExperienceUseCase(this.repo).execute(id, req.user.id);
      res.status(200).json({ success: true, data: experience });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const experience = await new CreateExperienceUseCase(this.repo).execute(req.user.id, req.body);
      res.status(201).json({ success: true, data: experience });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const experience = await new UpdateExperienceUseCase(this.repo).execute(id, req.user.id, req.body);
      res.status(200).json({ success: true, data: experience });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await new DeleteExperienceUseCase(this.repo).execute(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}