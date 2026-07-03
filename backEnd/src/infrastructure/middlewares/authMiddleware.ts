import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '@shared/utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  try {
    req.user = verifyJwt(token);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};