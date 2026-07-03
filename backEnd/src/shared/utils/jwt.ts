import jwt from 'jsonwebtoken';
import { env } from '@config/env';
import { UnauthorizedException } from '@shared/exceptions/UnauthorizedException';

export interface JwtPayload {
  id: number;
  username: string;
}

export const signJwt = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || env.jwt.secret;
  const expiresIn = process.env.JWT_EXPIRES_IN || env.jwt.expiresIn;
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyJwt = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.jwt.secret) as JwtPayload;
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
};