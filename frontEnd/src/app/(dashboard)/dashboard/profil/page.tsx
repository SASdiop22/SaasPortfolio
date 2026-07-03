'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/lib/queries';
import FormField from '@/components/ui/FormField';

export default function ProfilPage() {
  const { data: user, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? '');
      setBio(user.bio ?? '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync({ fullName, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadAvatar.mutateAsync(file);
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400">Erreur lors du chargement du profil.</div>;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-white">Mon Profil</h1>

      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 mb-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Avatar
        </h2>
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="Avatar"
              width={72}
              height={72}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-18 w-18 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gray-700 text-2xl font-bold text-gray-400">
              {user?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div>
            <label className="cursor-pointer rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors">
              {uploadAvatar.isPending ? 'Envoi...' : 'Choisir une image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploadAvatar.isPending}
              />
            </label>
            {uploadAvatar.isError && (
              <p className="mt-1 text-xs text-red-400">Erreur lors de l&apos;upload.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Informations
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            label="Nom complet"
            type="text"
            placeholder="Jean Dupont"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Biographie</label>
            <textarea
              className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              placeholder="Décrivez-vous en quelques mots..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          {updateProfile.isError && (
            <p className="text-sm text-red-400">Erreur lors de la sauvegarde.</p>
          )}
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {updateProfile.isPending ? 'Sauvegarde...' : saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
          </button>
        </form>
      </div>
    </div>
  );
}