import { z } from 'zod';

export const CreateProjectDto = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  techStack: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const UpdateProjectDto = CreateProjectDto.partial();

export type CreateProjectDtoType = z.infer<typeof CreateProjectDto>;
export type UpdateProjectDtoType = z.infer<typeof UpdateProjectDto>;