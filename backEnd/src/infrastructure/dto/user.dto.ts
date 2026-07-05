import { z } from 'zod';

export const UpdateProfileDto = z.object({
  fullName: z.string().min(2).max(100).nullish(),
  bio: z.string().max(500).nullish(),
});

export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDto>;