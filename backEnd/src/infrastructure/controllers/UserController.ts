import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { GetProfileUseCase } from '@use-cases/user/GetProfileUseCase';
import { UpdateProfileUseCase } from '@use-cases/user/UpdateProfileUseCase';
import { UploadAvatarUseCase } from '@use-cases/user/UploadAvatarUseCase';

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const profile = await new GetProfileUseCase(repo).execute(req.user.id);
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const profile = await new UpdateProfileUseCase(repo).execute(req.user.id, req.body);
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const repo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const publicUrl = await new UploadAvatarUseCase(repo).execute(req.user.id, req.file);
      res.status(200).json({ success: true, data: { avatarUrl: publicUrl } });
    } catch (err) {
      next(err);
    }
  }
}