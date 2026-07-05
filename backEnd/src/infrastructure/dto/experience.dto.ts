import { z } from 'zod';

export const CreateExperienceDto = z.object({
  company: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  description: z.string().nullish(),
  startDate: z.string().date(),
  endDate: z.string().date().nullish(),
  displayOrder: z.number().int().min(0).optional(),
});

export const UpdateExperienceDto = CreateExperienceDto.partial();

export type CreateExperienceDtoType = z.infer<typeof CreateExperienceDto>;
export type UpdateExperienceDtoType = z.infer<typeof UpdateExperienceDto>;