import { GetProjectUseCase } from '@use-cases/project/GetProjectUseCase';
import { UpdateProjectUseCase } from '@use-cases/project/UpdateProjectUseCase';
import { DeleteProjectUseCase } from '@use-cases/project/DeleteProjectUseCase';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

const projectRepo = {
  findByIdAndUser: jest.fn(),
  updateForUser: jest.fn(),
  deleteForUser: jest.fn(),
};

const mockProject = { id: 10, userId: 7, title: 'My Project', description: '' };

describe('Multi-tenant isolation: project use-cases always scope by userId', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── GetProjectUseCase ──────────────────────────────────────────────────────
  it('GetProjectUseCase: calls findByIdAndUser with both id and userId', async () => {
    projectRepo.findByIdAndUser.mockResolvedValue(mockProject);

    const useCase = new GetProjectUseCase(projectRepo as any);
    const result = await useCase.execute(10, 7);

    expect(projectRepo.findByIdAndUser).toHaveBeenCalledWith(10, 7);
    expect(result).toEqual(mockProject);
  });

  // ── UpdateProjectUseCase ───────────────────────────────────────────────────
  it('UpdateProjectUseCase: calls updateForUser with correct id and userId', async () => {
    const updated = { ...mockProject, title: 'Updated' };
    projectRepo.updateForUser.mockResolvedValue(updated);

    const useCase = new UpdateProjectUseCase(projectRepo as any);
    const result = await useCase.execute(10, 7, { title: 'Updated' });

    expect(projectRepo.updateForUser).toHaveBeenCalledWith(10, 7, { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  // ── DeleteProjectUseCase ───────────────────────────────────────────────────
  it('DeleteProjectUseCase: calls deleteForUser with correct id and userId', async () => {
    projectRepo.deleteForUser.mockResolvedValue(undefined);

    const useCase = new DeleteProjectUseCase(projectRepo as any);
    await useCase.execute(10, 7);

    expect(projectRepo.deleteForUser).toHaveBeenCalledWith(10, 7);
  });

  // ── Cross-tenant guard ─────────────────────────────────────────────────────
  it('GetProjectUseCase: throws NotFoundException when userId does not own the resource', async () => {
    projectRepo.findByIdAndUser.mockResolvedValue(null); // wrong userId → repo returns null

    const useCase = new GetProjectUseCase(projectRepo as any);

    await expect(useCase.execute(10, 999)).rejects.toThrow(NotFoundException);
    expect(projectRepo.findByIdAndUser).toHaveBeenCalledWith(10, 999);
  });
});