import { Request, Response, NextFunction } from 'express';
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { GetSkillsUseCase } from '@use-cases/skill/GetSkillsUseCase';
import { GetSkillUseCase } from '@use-cases/skill/GetSkillUseCase';
import { CreateSkillUseCase } from '@use-cases/skill/CreateSkillUseCase';
import { UpdateSkillUseCase } from '@use-cases/skill/UpdateSkillUseCase';
import { DeleteSkillUseCase } from '@use-cases/skill/DeleteSkillUseCase';

export class SkillController {
  private get repo(): SkillRepository {
    return new SkillRepository();
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skills = await new GetSkillsUseCase(this.repo).execute(req.user.id);
      res.status(200).json({ success: true, data: skills });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const skill = await new GetSkillUseCase(this.repo).execute(id, req.user.id);
      res.status(200).json({ success: true, data: skill });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skill = await new CreateSkillUseCase(this.repo).execute(req.user.id, req.body);
      res.status(201).json({ success: true, data: skill });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const skill = await new UpdateSkillUseCase(this.repo).execute(id, req.user.id, req.body);
      res.status(200).json({ success: true, data: skill });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await new DeleteSkillUseCase(this.repo).execute(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}