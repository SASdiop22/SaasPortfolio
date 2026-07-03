import { z } from 'zod';

export const CreateSkillDto = z.object({
  name: z.string().min(1).max(150),
  level: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const UpdateSkillDto = CreateSkillDto.partial();

export type CreateSkillDtoType = z.infer<typeof CreateSkillDto>;
export type UpdateSkillDtoType = z.infer<typeof UpdateSkillDto>;