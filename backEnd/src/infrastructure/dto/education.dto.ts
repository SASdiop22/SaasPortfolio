import { z } from 'zod';

export const CreateEducationDto = z.object({
  institution: z.string().min(1).max(255),
  degree: z.string().min(1).max(255),
  field: z.string().max(255).optional(),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const UpdateEducationDto = CreateEducationDto.partial();

export type CreateEducationDtoType = z.infer<typeof CreateEducationDto>;
export type UpdateEducationDtoType = z.infer<typeof UpdateEducationDto>;