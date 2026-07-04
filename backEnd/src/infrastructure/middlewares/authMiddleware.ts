import { Request, Response, NextFunction } from 'express';
import { verifyToken, createClerkClient } from '@clerk/backend';
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';

declare global {
  namespace Express {
    interface Request {
      user: { id: number; clerkId: string };
    }
  }
}

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY ?? '' });

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY ?? '',
    });
    const clerkId = payload.sub;

    const userRepo = AppDataSource.getRepository(UserEntity);
    let user = await userRepo.findOne({ where: { clerkId } });

    if (!user) {
      const clerkUser = await clerk.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress ?? '';
      const baseUsername = (clerkUser.username ?? email.split('@')[0])
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .slice(0, 28);

      let username = baseUsername;
      let suffix = 1;
      while (await userRepo.findOne({ where: { username } })) {
        username = `${baseUsername}_${suffix++}`;
      }

      user = userRepo.create({
        clerkId,
        email,
        username,
        fullName: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null,
        passwordHash: null,
      });
      await userRepo.save(user);
    }

    req.user = { id: user.id, clerkId };
    next();
  } catch (err) {
    console.error('[authMiddleware] error:', err);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};