import { Request, Response, NextFunction } from 'express';
import { Resend } from 'resend';
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

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

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

  async sendContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.params;
      const { senderName, senderEmail, message } = req.body as {
        senderName: string;
        senderEmail: string;
        message: string;
      };

      if (!senderName?.trim() || !senderEmail?.trim() || !message?.trim()) {
        res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
        return;
      }

      const userRepo = AppDataSource.getRepository(UserEntity);
      const owner = await userRepo.findOne({ where: { username } });
      if (!owner) {
        res.status(404).json({ success: false, message: 'Portfolio introuvable.' });
        return;
      }

      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: owner.email,
        replyTo: senderEmail,
        subject: `Message de ${senderName} via votre portfolio`,
        html: `
          <p><strong>Nom :</strong> ${senderName}</p>
          <p><strong>Email :</strong> ${senderEmail}</p>
          <p><strong>Message :</strong></p>
          <p>${message.replaceAll('\n', '<br>')}</p>
        `,
      });

      res.status(200).json({ success: true, message: 'Message envoyé.' });
    } catch (err) {
      next(err);
    }
  }
}