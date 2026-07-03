import { LoginUseCase } from '@use-cases/auth/LoginUseCase';
import { UnauthorizedException } from '@shared/exceptions/UnauthorizedException';
import * as bcryptUtils from '@shared/utils/bcrypt';

const mockUserRepo = { findByEmail: jest.fn() };

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(mockUserRepo as any);
    process.env.JWT_SECRET = 'testsecret';
  });

  it('returns token for valid credentials', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, username: 'u', passwordHash: 'h' });
    jest.spyOn(bcryptUtils, 'comparePassword').mockResolvedValue(true);

    const result = await useCase.execute({ email: 'u@test.com', password: 'pass' });
    expect(result.token).toBeDefined();
    expect(result.user.id).toBe(1);
  });

  it('throws UnauthorizedException for unknown email', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'unknown@test.com', password: 'pass' })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException for wrong password', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, username: 'u', passwordHash: 'h' });
    jest.spyOn(bcryptUtils, 'comparePassword').mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'u@test.com', password: 'wrong' })
    ).rejects.toThrow(UnauthorizedException);
  });
});