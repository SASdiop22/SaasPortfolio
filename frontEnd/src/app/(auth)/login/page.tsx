'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { login } from '@/lib/auth';
import FormField from '@/components/ui/FormField';

const schema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.push('/dashboard');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setServerError(
        axiosErr.response?.data?.message ?? 'Email ou mot de passe incorrect',
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-gray-900 p-8 shadow-xl">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        Connexion
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          {isSubmitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-blue-400 hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}