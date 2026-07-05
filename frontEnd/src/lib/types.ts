export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  userId: number;
  name: string;
  level: string | null;
  category: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: number;
  userId: number;
  company: string;
  role: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: number;
  userId: number;
  institution: string;
  degree: string;
  field: string | null;
  startDate: string;
  endDate: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: number;
  userId: number;
  title: string;
  content: string;
  publishedAt: string | null;
  imageUrl: string | null;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: number;
  userId: number;
  platform: string;
  url: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: number;
  userId: number;
  name: string;
  isActive: boolean;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string | null;
  layout: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPortfolio {
  user: Omit<User, 'email'>;
  activeTheme: Theme | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  news: News[];
  socialLinks: SocialLink[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}