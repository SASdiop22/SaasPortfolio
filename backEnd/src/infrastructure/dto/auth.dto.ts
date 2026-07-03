import { z } from 'zod';

export const RegisterDto = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, _ and - allowed'),
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(100).optional(),
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
export type LoginDtoType = z.infer<typeof LoginDto>;