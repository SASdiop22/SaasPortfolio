'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { register as registerUser } from '@/lib/auth';
import FormField from '@/components/ui/FormField';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Au moins 3 caractères')
    .max(30, 'Maximum 30 caractères')
    .regex(/^[a-z0-9_-]+$/, 'Lettres minuscules, chiffres, _ et - uniquement'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
  fullName: z.string().min(2, 'Au moins 2 caractères').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName || undefined,
      });
      router.push('/dashboard');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const data = axiosErr.response?.data;

      if (data?.errors) {
        for (const [field, messages] of Object.entries(data.errors)) {
          if (field in schema.shape) {
            setError(field as keyof FormValues, {
              type: 'server',
              message: messages[0],
            });
          }
        }
      } else {
        setServerError(data?.message ?? 'Une erreur est survenue');
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-gray-900 p-8 shadow-xl">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        Créer un compte
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          label="Nom d'utilisateur"
          type="text"
          placeholder="john_doe"
          error={errors.username?.message}
          {...register('username')}
        />

        <FormField
          label="Nom complet (optionnel)"
          type="text"
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="vous@exemple.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormField
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <p className="rounded-md bg-red-900/40 px-3 py-2 text-sm text-red-400">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Inscription…' : "S'inscrire"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-blue-400 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}