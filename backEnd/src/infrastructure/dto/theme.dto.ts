import { z } from 'zod';

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const CreateThemeDto = z.object({
  name: z.string().min(1).max(100),
  primaryColor: hexColor.optional(),
  secondaryColor: hexColor.optional(),
  backgroundColor: hexColor.optional(),
  textColor: hexColor.optional(),
  accentColor: hexColor.optional(),
  fontFamily: z.string().max(100).optional(),
  layout: z.string().max(50).optional(),
});

export const UpdateThemeDto = CreateThemeDto.partial();

export type CreateThemeDtoType = z.infer<typeof CreateThemeDto>;
export type UpdateThemeDtoType = z.infer<typeof UpdateThemeDto>;