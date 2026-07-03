import { z } from 'zod';

export const CreateSocialLinkDto = z.object({
  platform: z.string().min(1).max(100),
  url: z.string().url().max(500),
  displayOrder: z.number().int().min(0).optional(),
});

export const UpdateSocialLinkDto = CreateSocialLinkDto.partial();

export type CreateSocialLinkDtoType = z.infer<typeof CreateSocialLinkDto>;
export type UpdateSocialLinkDtoType = z.infer<typeof UpdateSocialLinkDto>;
