import { RegisterUseCase } from '@use-cases/auth/RegisterUseCase';
import { GetProfileUseCase } from '@use-cases/user/GetProfileUseCase';
import { UpdateProfileUseCase } from '@use-cases/user/UpdateProfileUseCase';

// ── RegisterUseCase mock repo ────────────────────────────────────────────────
const registerRepo = {
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  create: jest.fn(),
};

// ── GetProfile / UpdateProfile mock repos ────────────────────────────────────
const profileFinderRepo = { findById: jest.fn() };
const profileUpdaterRepo = { findById: jest.fn(), save: jest.fn() };

const userWithHash = {
  id: 1,
  username: 'alice',
  email: 'alice@example.com',
  passwordHash: 'supersecret$hash',
  fullName: 'Alice',
  bio: null,
  photoUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('passwordHash never leaks in use-case responses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  // ── RegisterUseCase ────────────────────────────────────────────────────────
  it('RegisterUseCase: returned user object has no passwordHash', async () => {
    registerRepo.findByEmail.mockResolvedValue(null);
    registerRepo.findByUsername.mockResolvedValue(null);
    registerRepo.create.mockResolvedValue(userWithHash);

    const useCase = new RegisterUseCase(registerRepo as any);
    const result = await useCase.execute({
      username: 'alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.token).toBeDefined();
  });

  // ── GetProfileUseCase ──────────────────────────────────────────────────────
  it('GetProfileUseCase: returned profile has no passwordHash', async () => {
    profileFinderRepo.findById.mockResolvedValue(userWithHash);

    const useCase = new GetProfileUseCase(profileFinderRepo as any);
    const profile = await useCase.execute(1);

    expect(profile).not.toHaveProperty('passwordHash');
    expect(profile.username).toBe('alice');
  });

  // ── UpdateProfileUseCase ───────────────────────────────────────────────────
  it('UpdateProfileUseCase: returned profile has no passwordHash', async () => {
    profileUpdaterRepo.findById.mockResolvedValue({ ...userWithHash });
    profileUpdaterRepo.save.mockResolvedValue({ ...userWithHash, bio: 'Hello!' });

    const useCase = new UpdateProfileUseCase(profileUpdaterRepo as any);
    const profile = await useCase.execute(1, { bio: 'Hello!' });

    expect(profile).not.toHaveProperty('passwordHash');
    expect(profile.username).toBe('alice');
  });
});