import { z } from 'zod';

export const CreateProjectDto = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(1000).nullish(),
  techStack: z.array(z.string()).optional(),
  liveUrl: z.string().url().nullish(),
  githubUrl: z.string().url().nullish(),
  imageUrl: z.string().url().nullish(),
  displayOrder: z.number().int().min(0).optional(),
});

export const UpdateProjectDto = CreateProjectDto.partial();

export type CreateProjectDtoType = z.infer<typeof CreateProjectDto>;
export type UpdateProjectDtoType = z.infer<typeof UpdateProjectDto>;