import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { ThemeRepository } from '@infrastructure/repositories/ThemeRepository';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { GetPublicPortfolioUseCase } from '@use-cases/public/GetPublicPortfolioUseCase';

export class PublicController {
  async getPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.params;

      const userRepo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const themeRepo = new ThemeRepository();
      const projectRepo = new ProjectRepository();
      const skillRepo = new SkillRepository();
      const experienceRepo = new ExperienceRepository();
      const educationRepo = new EducationRepository();
      const newsRepo = new NewsRepository();
      const socialLinkRepo = new SocialLinkRepository();

      const portfolio = await new GetPublicPortfolioUseCase(
        userRepo,
        themeRepo,
        projectRepo,
        skillRepo,
        experienceRepo,
        educationRepo,
        newsRepo,
        socialLinkRepo,
      ).execute(username);

      res.status(200).json({ success: true, data: portfolio });
    } catch (err) {
      next(err);
    }
  }
}