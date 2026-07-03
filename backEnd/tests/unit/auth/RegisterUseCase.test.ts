import { RegisterUseCase } from '@use-cases/auth/RegisterUseCase';
import { ConflictException } from '@shared/exceptions/ConflictException';

const mockUserRepo = {
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  create: jest.fn(),
};

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterUseCase(mockUserRepo as any);
  });

  it('creates user and returns JWT token', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.findByUsername.mockResolvedValue(null);
    mockUserRepo.create.mockResolvedValue({ id: 1, username: 'testuser', email: 'test@test.com' });
    process.env.JWT_SECRET = 'testsecret';

    const result = await useCase.execute({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.token).toBeDefined();
    expect(result.user.username).toBe('testuser');
    expect(result.user.id).toBe(1);
  });

  it('throws ConflictException if email already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1 });

    await expect(
      useCase.execute({ username: 'u', email: 'existing@test.com', password: 'password123' })
    ).rejects.toThrow(ConflictException);
  });

  it('throws ConflictException if username already taken', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.findByUsername.mockResolvedValue({ id: 2 });

    await expect(
      useCase.execute({ username: 'taken', email: 'new@test.com', password: 'password123' })
    ).rejects.toThrow(ConflictException);
  });
});