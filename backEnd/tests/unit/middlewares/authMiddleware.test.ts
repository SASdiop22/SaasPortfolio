import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import * as jwtUtils from '@shared/utils/jwt';
import { UnauthorizedException } from '@shared/exceptions/UnauthorizedException';

jest.mock('@shared/utils/jwt');

const mockVerifyJwt = jwtUtils.verifyJwt as jest.MockedFunction<typeof jwtUtils.verifyJwt>;

function mockReq(token?: string): Partial<Request> {
  return { cookies: token !== undefined ? { token } : {} };
}

function mockRes(): { status: jest.Mock; json: jest.Mock } {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
}

describe('authMiddleware', () => {
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  it('returns 401 when cookie token is missing', () => {
    const req = mockReq();
    const res = mockRes();

    authMiddleware(req as Request, res as unknown as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when JWT is invalid or tampered', () => {
    mockVerifyJwt.mockImplementation(() => {
      throw new UnauthorizedException('Invalid or expired token');
    });

    const req = mockReq('tampered.invalid.token');
    const res = mockRes();

    authMiddleware(req as Request, res as unknown as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.user and calls next() with no argument on valid JWT', () => {
    const payload = { id: 42, username: 'alice' };
    mockVerifyJwt.mockReturnValue(payload);

    const req = mockReq('valid.jwt.token') as Request;
    const res = mockRes();

    authMiddleware(req, res as unknown as Response, next as NextFunction);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });
});