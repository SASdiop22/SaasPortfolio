import { z } from 'zod';

export const CreateExperienceDto = z.object({
  company: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  description: z.string().optional(),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const UpdateExperienceDto = CreateExperienceDto.partial();

export type CreateExperienceDtoType = z.infer<typeof CreateExperienceDto>;
export type UpdateExperienceDtoType = z.infer<typeof UpdateExperienceDto>;