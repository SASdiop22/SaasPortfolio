import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import type {
  Project,
  Skill,
  Experience,
  Education,
  News,
  SocialLink,
  Theme,
  User,
  ApiResponse,
} from './types';

// ── Profile ──────────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<ApiResponse<User>>('/api/me').then((r) => r.data.data),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) =>
      api.put<ApiResponse<User>>('/api/me', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append('avatar', file);
      return api
        .post<ApiResponse<User>>('/api/me/avatar', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });
}

// ── Projects ─────────────────────────────────────────────────────────────────

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      api.get<ApiResponse<Project[]>>('/api/projects').then((r) => r.data.data),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) =>
      api.post<ApiResponse<Project>>('/api/projects', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Project> & { id: number }) =>
      api
        .put<ApiResponse<Project>>(`/api/projects/${id}`, data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

// ── Skills ───────────────────────────────────────────────────────────────────

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () =>
      api.get<ApiResponse<Skill[]>>('/api/skills').then((r) => r.data.data),
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Skill>) =>
      api.post<ApiResponse<Skill>>('/api/skills', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Skill> & { id: number }) =>
      api
        .put<ApiResponse<Skill>>(`/api/skills/${id}`, data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/skills/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
}

// ── Experiences ───────────────────────────────────────────────────────────────

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: () =>
      api.get<ApiResponse<Experience[]>>('/api/experiences').then((r) => r.data.data),
  });
}

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Experience>) =>
      api
        .post<ApiResponse<Experience>>('/api/experiences', data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
}

export function useUpdateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Experience> & { id: number }) =>
      api
        .put<ApiResponse<Experience>>(`/api/experiences/${id}`, data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
}

export function useDeleteExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/experiences/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  });
}

// ── Educations ────────────────────────────────────────────────────────────────

export function useEducations() {
  return useQuery({
    queryKey: ['educations'],
    queryFn: () =>
      api.get<ApiResponse<Education[]>>('/api/educations').then((r) => r.data.data),
  });
}

export function useCreateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Education>) =>
      api
        .post<ApiResponse<Education>>('/api/educations', data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['educations'] }),
  });
}

export function useUpdateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Education> & { id: number }) =>
      api
        .put<ApiResponse<Education>>(`/api/educations/${id}`, data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['educations'] }),
  });
}

export function useDeleteEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/educations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['educations'] }),
  });
}

// ── News ──────────────────────────────────────────────────────────────────────

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () =>
      api.get<ApiResponse<News[]>>('/api/news').then((r) => r.data.data),
  });
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<News>) =>
      api.post<ApiResponse<News>>('/api/news', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['news'] }),
  });
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<News> & { id: number }) =>
      api
        .put<ApiResponse<News>>(`/api/news/${id}`, data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['news'] }),
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/news/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['news'] }),
  });
}

// ── Social Links ──────────────────────────────────────────────────────────────

export function useSocialLinks() {
  return useQuery({
    queryKey: ['social-links'],
    queryFn: () =>
      api.get<ApiResponse<SocialLink[]>>('/api/social-links').then((r) => r.data.data),
  });
}

export function useCreateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SocialLink>) =>
      api
        .post<ApiResponse<SocialLink>>('/api/social-links', data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['social-links'] }),
  });
}

export function useUpdateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<SocialLink> & { id: number }) =>
      api
        .put<ApiResponse<SocialLink>>(`/api/social-links/${id}`, data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['social-links'] }),
  });
}

export function useDeleteSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/social-links/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['social-links'] }),
  });
}

// ── Themes ────────────────────────────────────────────────────────────────────

export function useThemes() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: () =>
      api.get<ApiResponse<Theme[]>>('/api/themes').then((r) => r.data.data),
  });
}

export function useCreateTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Theme>) =>
      api.post<ApiResponse<Theme>>('/api/themes', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['themes'] }),
  });
}

export function useUpdateTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Theme> & { id: number }) =>
      api
        .put<ApiResponse<Theme>>(`/api/themes/${id}`, data)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['themes'] }),
  });
}

export function useDeleteTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/themes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['themes'] }),
  });
}

export function useSetActiveTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api
        .post<ApiResponse<Theme>>(`/api/themes/${id}/active`)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['themes'] }),
  });
}