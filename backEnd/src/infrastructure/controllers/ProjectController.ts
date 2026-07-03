import { Request, Response, NextFunction } from 'express';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { GetProjectsUseCase } from '@use-cases/project/GetProjectsUseCase';
import { GetProjectUseCase } from '@use-cases/project/GetProjectUseCase';
import { CreateProjectUseCase } from '@use-cases/project/CreateProjectUseCase';
import { UpdateProjectUseCase } from '@use-cases/project/UpdateProjectUseCase';
import { DeleteProjectUseCase } from '@use-cases/project/DeleteProjectUseCase';

export class ProjectController {
  private get repo(): ProjectRepository {
    return new ProjectRepository();
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await new GetProjectsUseCase(this.repo).execute(req.user.id);
      res.status(200).json({ success: true, data: projects });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const project = await new GetProjectUseCase(this.repo).execute(id, req.user.id);
      res.status(200).json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await new CreateProjectUseCase(this.repo).execute(req.user.id, req.body);
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const project = await new UpdateProjectUseCase(this.repo).execute(id, req.user.id, req.body);
      res.status(200).json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await new DeleteProjectUseCase(this.repo).execute(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}