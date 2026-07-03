import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { ThemeRepository } from '@infrastructure/repositories/ThemeRepository';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export class GetPublicPortfolioUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly themeRepo: ThemeRepository,
    private readonly projectRepo: ProjectRepository,
    private readonly skillRepo: SkillRepository,
    private readonly experienceRepo: ExperienceRepository,
    private readonly educationRepo: EducationRepository,
    private readonly newsRepo: NewsRepository,
    private readonly socialLinkRepo: SocialLinkRepository,
  ) {}

  async execute(username: string) {
    const userEntity = await this.userRepo.findByUsername(username);
    if (!userEntity) throw new NotFoundException('User not found');

    const { passwordHash: _omit, ...user } = userEntity;

    const [activeTheme, projects, skills, experiences, educations, news, socialLinks] =
      await Promise.all([
        this.themeRepo.findActiveByUser(user.id),
        this.projectRepo.findAllByUser(user.id),
        this.skillRepo.findAllByUser(user.id),
        this.experienceRepo.findAllByUser(user.id),
        this.educationRepo.findAllByUser(user.id),
        this.newsRepo.findAllByUser(user.id),
        this.socialLinkRepo.findAllByUser(user.id),
      ]);

    return {
      user,
      activeTheme: activeTheme ?? null,
      projects,
      skills,
      experiences,
      educations,
      news,
      socialLinks,
    };
  }
}