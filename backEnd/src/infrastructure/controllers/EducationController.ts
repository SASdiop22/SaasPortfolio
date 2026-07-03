import { Request, Response, NextFunction } from 'express';
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { GetEducationsUseCase } from '@use-cases/education/GetEducationsUseCase';
import { GetEducationUseCase } from '@use-cases/education/GetEducationUseCase';
import { CreateEducationUseCase } from '@use-cases/education/CreateEducationUseCase';
import { UpdateEducationUseCase } from '@use-cases/education/UpdateEducationUseCase';
import { DeleteEducationUseCase } from '@use-cases/education/DeleteEducationUseCase';

export class EducationController {
  private get repo(): EducationRepository {
    return new EducationRepository();
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const educations = await new GetEducationsUseCase(this.repo).execute(req.user.id);
      res.status(200).json({ success: true, data: educations });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const education = await new GetEducationUseCase(this.repo).execute(id, req.user.id);
      res.status(200).json({ success: true, data: education });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const education = await new CreateEducationUseCase(this.repo).execute(req.user.id, req.body);
      res.status(201).json({ success: true, data: education });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const education = await new UpdateEducationUseCase(this.repo).execute(id, req.user.id, req.body);
      res.status(200).json({ success: true, data: education });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await new DeleteEducationUseCase(this.repo).execute(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}