import { z } from 'zod';

export const UpdateProfileDto = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  bio: z.string().max(500).nullish(),
});

export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDto>;