import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { RegisterUseCase } from '@use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '@use-cases/auth/LoginUseCase';
import { env } from '@config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: env.nodeEnv === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const { token, user } = await new RegisterUseCase(repo).execute(req.body);
      res.cookie('token', token, COOKIE_OPTIONS);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const { token, user } = await new LoginUseCase(repo).execute(req.body);
      res.cookie('token', token, COOKIE_OPTIONS);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  logout(_req: Request, res: Response): void {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
  }
}