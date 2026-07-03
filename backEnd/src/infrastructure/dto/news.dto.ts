import { z } from 'zod';

export const CreateNewsDto = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  publishedAt: z.string().datetime().optional().nullable(),
  imageUrl: z.string().url().max(500).optional().nullable(),
  slug: z.string().max(255).optional().nullable(),
});

export const UpdateNewsDto = CreateNewsDto.partial();

export type CreateNewsDtoType = z.infer<typeof CreateNewsDto>;
export type UpdateNewsDtoType = z.infer<typeof UpdateNewsDto>;
