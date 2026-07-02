# SaaS Portfolio — Backend API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-tenant Express + TypeScript + PostgreSQL backend API where every user manages their own portfolio content, isolated by `userId` enforced at the repository layer.

**Architecture:** Shared database, shared schema. Every content table has a `userId` FK pointing to `users`. A `BaseRepository<T>` enforces `WHERE user_id = ?` on all reads/writes. Public routes query by `username` with no auth. JWT stored in `httpOnly` cookie.

**Tech Stack:** Node 22, Express 4, TypeORM 0.3, PostgreSQL 16, Zod (validation), bcryptjs, jsonwebtoken, cookie-parser, Supabase Storage (file uploads), Jest + ts-jest (unit tests).

## Global Constraints

- Node 22 required (native WebSocket for Supabase, Railway compat)
- All API responses use `{ success: boolean, data?: T, message?: string }`
- Never return `passwordHash` in any response
- All content endpoints require valid JWT cookie (`token`)
- `userId` is NEVER taken from the request body — always from `req.user.id` (JWT)
- `BaseRepository` methods always include `userId` as a parameter — no exceptions
- `username` must match `^[a-z0-9_-]+$`, 3–30 chars
- TypeScript strict mode on

## Branch Strategy

```
main          ← stable, production-ready (PR from develop)
develop       ← integration branch (PR target for all features)
  feature/setup-projet      ← Tasks 1-4 (init + entities + shared infra)
  feature/backend-auth      ← Tasks 5-6 (register/login + profile)
  feature/backend-crud      ← Tasks 7-9 (all CRUD resources)
  feature/backend-public    ← Tasks 10-11 (public routes + server)
```

Each feature branch opens a PR → `develop`. No direct commits to `main` or `develop`.

---

## File Map

```
backEnd/
  src/
    config/env.ts
    shared/
      exceptions/
        AppError.ts
        NotFoundException.ts
        UnauthorizedException.ts
        ConflictException.ts
        BadRequestException.ts
      utils/
        jwt.ts
        bcrypt.ts
    infrastructure/
      database/data-source.ts
      entities/
        UserEntity.ts
        BaseContentEntity.ts
        ProjectEntity.ts
        SkillEntity.ts
        ExperienceEntity.ts
        EducationEntity.ts
        NewsEntity.ts
        SocialLinkEntity.ts
      repositories/
        BaseRepository.ts
        UserRepository.ts
        ProjectRepository.ts
        SkillRepository.ts
        ExperienceRepository.ts
        EducationRepository.ts
        NewsRepository.ts
        SocialLinkRepository.ts
      middlewares/
        authMiddleware.ts
        validate.ts
        errorMiddleware.ts
      controllers/
        AuthController.ts
        UserController.ts
        ProjectController.ts
        SkillController.ts
        ExperienceController.ts
        EducationController.ts
        NewsController.ts
        SocialLinkController.ts
        PublicController.ts
      routes/
        auth.routes.ts
        user.routes.ts
        project.routes.ts
        skill.routes.ts
        experience.routes.ts
        education.routes.ts
        news.routes.ts
        social-link.routes.ts
        public.routes.ts
        index.ts
      dto/
        auth.dto.ts
        user.dto.ts
        project.dto.ts
        skill.dto.ts
        experience.dto.ts
        education.dto.ts
        news.dto.ts
        social-link.dto.ts
    use-cases/
      auth/
        RegisterUseCase.ts
        LoginUseCase.ts
      user/
        GetProfileUseCase.ts
        UpdateProfileUseCase.ts
        UploadAvatarUseCase.ts
      project/
        GetProjectsUseCase.ts
        GetProjectByIdUseCase.ts
        CreateProjectUseCase.ts
        UpdateProjectUseCase.ts
        DeleteProjectUseCase.ts
      skill/         (same 5 use-cases)
      experience/    (same 5)
      education/     (same 5)
      news/          (same 5)
      social-link/   (same 5)
      public/
        GetPublicPortfolioUseCase.ts
    server.ts
  tests/
    unit/
      auth/
        RegisterUseCase.test.ts
        LoginUseCase.test.ts
      project/
        GetProjectsUseCase.test.ts
        CreateProjectUseCase.test.ts
  package.json
  tsconfig.json
  jest.config.ts
  .env
  .env.example
  .gitignore
```

---

## Task 1: Repo setup & backend init

**Branch:** `feature/setup-projet` (from `develop`)

**Files:**
- Create: `backEnd/package.json`
- Create: `backEnd/tsconfig.json`
- Create: `backEnd/jest.config.ts`
- Create: `backEnd/.env.example`
- Create: `backEnd/.gitignore`
- Create: `backEnd/src/config/env.ts`

- [ ] **Step 1: Init branches**

```bash
cd ~/SaasPortfolio
git checkout -b develop
git push -u origin develop
git checkout -b feature/setup-projet
```

- [ ] **Step 2: Create `backEnd/package.json`**

```json
{
  "name": "saas-portfolio-backend",
  "version": "1.0.0",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest --runInBand",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.43.0",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.2.0",
    "helmet": "^7.1.0",
    "hpp": "^0.2.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "pg": "^8.11.3",
    "reflect-metadata": "^0.2.2",
    "typeorm": "^0.3.20",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/hpp": "^0.2.6",
    "@types/jest": "^29.5.12",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.12.7",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.4.5"
  }
}
```

- [ ] **Step 3: Create `backEnd/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": "./src",
    "paths": {
      "@config/*": ["config/*"],
      "@shared/*": ["shared/*"],
      "@infrastructure/*": ["infrastructure/*"],
      "@use-cases/*": ["use-cases/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 4: Create `backEnd/jest.config.ts`**

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@use-cases/(.*)$': '<rootDir>/src/use-cases/$1',
  },
};

export default config;
```

- [ ] **Step 5: Create `backEnd/.env.example`**

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_NAME=saas_portfolio_db

JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

ALLOWED_ORIGINS=http://localhost:3000
```

- [ ] **Step 6: Create `backEnd/.gitignore`**

```
node_modules/
dist/
.env
*.js.map
```

- [ ] **Step 7: Create `backEnd/src/config/env.ts`**

```typescript
import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  },
} as const;
```

- [ ] **Step 8: Install dependencies**

```bash
cd ~/SaasPortfolio/backEnd
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 9: Copy `.env.example` → `.env` and fill in local DB values**

```bash
cp .env.example .env
# Fill DB_USERNAME, DB_PASSWORD, DB_NAME=saas_portfolio_db, JWT_SECRET=any_long_string
```

- [ ] **Step 10: Create the local database**

```bash
psql -U postgres -c "CREATE DATABASE saas_portfolio_db;"
# Or with your local user:
createdb saas_portfolio_db
```

- [ ] **Step 11: Commit**

```bash
cd ~/SaasPortfolio
git add backEnd/package.json backEnd/tsconfig.json backEnd/jest.config.ts backEnd/.env.example backEnd/.gitignore backEnd/src/config/env.ts
git commit -m "feat(setup): initialize backend project"
```

---

## Task 2: TypeORM entities & data-source

**Branch:** `feature/setup-projet` (continue)

**Files:**
- Create: `backEnd/src/infrastructure/database/data-source.ts`
- Create: `backEnd/src/infrastructure/entities/UserEntity.ts`
- Create: `backEnd/src/infrastructure/entities/BaseContentEntity.ts`
- Create: `backEnd/src/infrastructure/entities/ProjectEntity.ts`
- Create: `backEnd/src/infrastructure/entities/SkillEntity.ts`
- Create: `backEnd/src/infrastructure/entities/ExperienceEntity.ts`
- Create: `backEnd/src/infrastructure/entities/EducationEntity.ts`
- Create: `backEnd/src/infrastructure/entities/NewsEntity.ts`
- Create: `backEnd/src/infrastructure/entities/SocialLinkEntity.ts`

- [ ] **Step 1: Create `UserEntity.ts`**

```typescript
// backEnd/src/infrastructure/entities/UserEntity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  username: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ length: 100, nullable: true })
  fullName: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ nullable: true })
  avatarUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: Create `BaseContentEntity.ts`**

```typescript
// backEnd/src/infrastructure/entities/BaseContentEntity.ts
import {
  PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';

export abstract class BaseContentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 3: Create `ProjectEntity.ts`**

```typescript
// backEnd/src/infrastructure/entities/ProjectEntity.ts
import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('projects')
export class ProjectEntity extends BaseContentEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column('text', { array: true, default: [] })
  technologies: string[];

  @Column({ type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ nullable: true })
  url: string | null;

  @Column({ nullable: true })
  imageUrl: string | null;
}
```

- [ ] **Step 4: Create `SkillEntity.ts`**

```typescript
// backEnd/src/infrastructure/entities/SkillEntity.ts
import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('skills')
export class SkillEntity extends BaseContentEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  category: string | null;

  @Column({ nullable: true })
  level: string | null;
}
```

- [ ] **Step 5: Create `ExperienceEntity.ts`**

```typescript
// backEnd/src/infrastructure/entities/ExperienceEntity.ts
import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('experiences')
export class ExperienceEntity extends BaseContentEntity {
  @Column()
  company: string;

  @Column()
  role: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;
}
```

- [ ] **Step 6: Create `EducationEntity.ts`**

```typescript
// backEnd/src/infrastructure/entities/EducationEntity.ts
import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('educations')
export class EducationEntity extends BaseContentEntity {
  @Column()
  school: string;

  @Column({ nullable: true })
  degree: string | null;

  @Column({ nullable: true })
  field: string | null;

  @Column({ type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;
}
```

- [ ] **Step 7: Create `NewsEntity.ts`**

```typescript
// backEnd/src/infrastructure/entities/NewsEntity.ts
import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('news')
export class NewsEntity extends BaseContentEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;
}
```

- [ ] **Step 8: Create `SocialLinkEntity.ts`**

```typescript
// backEnd/src/infrastructure/entities/SocialLinkEntity.ts
import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('social_links')
export class SocialLinkEntity extends BaseContentEntity {
  @Column()
  platform: string;

  @Column()
  url: string;
}
```

- [ ] **Step 9: Create `data-source.ts`**

```typescript
// backEnd/src/infrastructure/database/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '@config/env';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  entities: [
    UserEntity, ProjectEntity, SkillEntity,
    ExperienceEntity, EducationEntity, NewsEntity, SocialLinkEntity,
  ],
  synchronize: env.nodeEnv === 'development',
  logging: env.nodeEnv === 'development',
});
```

- [ ] **Step 10: Verify TypeScript compiles**

```bash
cd ~/SaasPortfolio/backEnd
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
cd ~/SaasPortfolio
git add backEnd/src/
git commit -m "feat(setup): add TypeORM entities and data-source"
```

---

## Task 3: Shared infrastructure — exceptions, utils, BaseRepository, middlewares

**Branch:** `feature/setup-projet` (continue)

**Files:**
- Create: `backEnd/src/shared/exceptions/AppError.ts`
- Create: `backEnd/src/shared/exceptions/NotFoundException.ts`
- Create: `backEnd/src/shared/exceptions/UnauthorizedException.ts`
- Create: `backEnd/src/shared/exceptions/ConflictException.ts`
- Create: `backEnd/src/shared/exceptions/BadRequestException.ts`
- Create: `backEnd/src/shared/utils/jwt.ts`
- Create: `backEnd/src/shared/utils/bcrypt.ts`
- Create: `backEnd/src/infrastructure/repositories/BaseRepository.ts`
- Create: `backEnd/src/infrastructure/middlewares/authMiddleware.ts`
- Create: `backEnd/src/infrastructure/middlewares/validate.ts`
- Create: `backEnd/src/infrastructure/middlewares/errorMiddleware.ts`

- [ ] **Step 1: Create exception hierarchy**

```typescript
// backEnd/src/shared/exceptions/AppError.ts
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
```

```typescript
// backEnd/src/shared/exceptions/NotFoundException.ts
import { AppError } from './AppError';
export class NotFoundException extends AppError {
  constructor(message = 'Resource not found') { super(message, 404); }
}
```

```typescript
// backEnd/src/shared/exceptions/UnauthorizedException.ts
import { AppError } from './AppError';
export class UnauthorizedException extends AppError {
  constructor(message = 'Unauthorized') { super(message, 401); }
}
```

```typescript
// backEnd/src/shared/exceptions/ConflictException.ts
import { AppError } from './AppError';
export class ConflictException extends AppError {
  constructor(message = 'Conflict') { super(message, 409); }
}
```

```typescript
// backEnd/src/shared/exceptions/BadRequestException.ts
import { AppError } from './AppError';
export class BadRequestException extends AppError {
  constructor(message = 'Bad request') { super(message, 400); }
}
```

- [ ] **Step 2: Create JWT utils**

```typescript
// backEnd/src/shared/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from '@config/env';
import { UnauthorizedException } from '@shared/exceptions/UnauthorizedException';

export interface JwtPayload {
  id: number;
  username: string;
}

export const signJwt = (payload: JwtPayload): string =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn } as jwt.SignOptions);

export const verifyJwt = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.jwt.secret) as JwtPayload;
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
};
```

- [ ] **Step 3: Create bcrypt utils**

```typescript
// backEnd/src/shared/utils/bcrypt.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);
```

- [ ] **Step 4: Create `BaseRepository.ts`**

```typescript
// backEnd/src/infrastructure/repositories/BaseRepository.ts
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export abstract class BaseRepository<T extends ObjectLiteral & { id: number; userId: number }> {
  constructor(protected readonly repo: Repository<T>) {}

  findAllByUser(userId: number): Promise<T[]> {
    return this.repo.find({ where: { userId } as any });
  }

  findByIdAndUser(id: number, userId: number): Promise<T | null> {
    return this.repo.findOne({ where: { id, userId } as any });
  }

  createForUser(userId: number, data: Partial<T>): Promise<T> {
    const entity = this.repo.create({ ...data, userId } as any);
    return this.repo.save(entity);
  }

  async updateForUser(id: number, userId: number, data: Partial<T>): Promise<T> {
    const entity = await this.findByIdAndUser(id, userId);
    if (!entity) throw new NotFoundException();
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async deleteForUser(id: number, userId: number): Promise<void> {
    const entity = await this.findByIdAndUser(id, userId);
    if (!entity) throw new NotFoundException();
    await this.repo.remove(entity);
  }
}
```

- [ ] **Step 5: Create `authMiddleware.ts`**

```typescript
// backEnd/src/infrastructure/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '@shared/utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  try {
    req.user = verifyJwt(token);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
```

- [ ] **Step 6: Create `validate.ts` middleware**

```typescript
// backEnd/src/infrastructure/middlewares/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
```

- [ ] **Step 7: Create `errorMiddleware.ts`**

```typescript
// backEnd/src/infrastructure/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/exceptions/AppError';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};
```

- [ ] **Step 8: Verify TypeScript**

```bash
cd ~/SaasPortfolio/backEnd && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
cd ~/SaasPortfolio
git add backEnd/src/shared/ backEnd/src/infrastructure/repositories/BaseRepository.ts backEnd/src/infrastructure/middlewares/
git commit -m "feat(setup): add shared exceptions, utils, BaseRepository and middlewares"
```

- [ ] **Step 10: Open PR feature/setup-projet → develop**

```bash
cd ~/SaasPortfolio
git push -u origin feature/setup-projet
# Open PR on GitHub: feature/setup-projet → develop
# Title: "feat(setup): project init, entities, shared infrastructure"
# Merge after review
```

---

## Task 4: Auth — register + login

**Branch:** `feature/backend-auth` (from `develop` after Task 3 merged)

**Files:**
- Create: `backEnd/src/infrastructure/dto/auth.dto.ts`
- Create: `backEnd/src/infrastructure/repositories/UserRepository.ts`
- Create: `backEnd/src/use-cases/auth/RegisterUseCase.ts`
- Create: `backEnd/src/use-cases/auth/LoginUseCase.ts`
- Create: `backEnd/src/infrastructure/controllers/AuthController.ts`
- Create: `backEnd/src/infrastructure/routes/auth.routes.ts`
- Create: `backEnd/tests/unit/auth/RegisterUseCase.test.ts`
- Create: `backEnd/tests/unit/auth/LoginUseCase.test.ts`

**Interfaces:**
- Produces: `RegisterUseCase.execute(data: RegisterDtoType): Promise<{ token: string; user: JwtPayload }>`
- Produces: `LoginUseCase.execute(data: LoginDtoType): Promise<{ token: string; user: JwtPayload }>`
- Produces: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`

- [ ] **Step 1: Branch**

```bash
cd ~/SaasPortfolio
git checkout develop && git pull
git checkout -b feature/backend-auth
```

- [ ] **Step 2: Write failing tests**

```typescript
// backEnd/tests/unit/auth/RegisterUseCase.test.ts
import { RegisterUseCase } from '@use-cases/auth/RegisterUseCase';
import { ConflictException } from '@shared/exceptions/ConflictException';

const mockUserRepo = {
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  create: jest.fn(),
};

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterUseCase(mockUserRepo as any);
  });

  it('creates user and returns JWT token', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.findByUsername.mockResolvedValue(null);
    mockUserRepo.create.mockResolvedValue({ id: 1, username: 'testuser', email: 'test@test.com' });
    process.env.JWT_SECRET = 'testsecret';

    const result = await useCase.execute({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.token).toBeDefined();
    expect(result.user.username).toBe('testuser');
    expect(result.user.id).toBe(1);
  });

  it('throws ConflictException if email already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1 });

    await expect(
      useCase.execute({ username: 'u', email: 'existing@test.com', password: 'password123' })
    ).rejects.toThrow(ConflictException);
  });

  it('throws ConflictException if username already taken', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.findByUsername.mockResolvedValue({ id: 2 });

    await expect(
      useCase.execute({ username: 'taken', email: 'new@test.com', password: 'password123' })
    ).rejects.toThrow(ConflictException);
  });
});
```

```typescript
// backEnd/tests/unit/auth/LoginUseCase.test.ts
import { LoginUseCase } from '@use-cases/auth/LoginUseCase';
import { UnauthorizedException } from '@shared/exceptions/UnauthorizedException';
import * as bcryptUtils from '@shared/utils/bcrypt';

const mockUserRepo = { findByEmail: jest.fn() };

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(mockUserRepo as any);
    process.env.JWT_SECRET = 'testsecret';
  });

  it('returns token for valid credentials', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, username: 'u', passwordHash: 'h' });
    jest.spyOn(bcryptUtils, 'comparePassword').mockResolvedValue(true);

    const result = await useCase.execute({ email: 'u@test.com', password: 'pass' });
    expect(result.token).toBeDefined();
    expect(result.user.id).toBe(1);
  });

  it('throws UnauthorizedException for unknown email', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'unknown@test.com', password: 'pass' })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException for wrong password', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, username: 'u', passwordHash: 'h' });
    jest.spyOn(bcryptUtils, 'comparePassword').mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'u@test.com', password: 'wrong' })
    ).rejects.toThrow(UnauthorizedException);
  });
});
```

- [ ] **Step 3: Run tests — verify they FAIL**

```bash
cd ~/SaasPortfolio/backEnd && npm test
```

Expected: FAIL — `Cannot find module '@use-cases/auth/RegisterUseCase'`

- [ ] **Step 4: Create `auth.dto.ts`**

```typescript
// backEnd/src/infrastructure/dto/auth.dto.ts
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
```

- [ ] **Step 5: Create `UserRepository.ts`**

```typescript
// backEnd/src/infrastructure/repositories/UserRepository.ts
import { Repository } from 'typeorm';
import { UserEntity } from '@infrastructure/entities/UserEntity';

export class UserRepository {
  constructor(private readonly repo: Repository<UserEntity>) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  findByUsername(username: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { username } });
  }

  findById(id: number): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  save(entity: UserEntity): Promise<UserEntity> {
    return this.repo.save(entity);
  }
}
```

- [ ] **Step 6: Create `RegisterUseCase.ts`**

```typescript
// backEnd/src/use-cases/auth/RegisterUseCase.ts
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { hashPassword } from '@shared/utils/bcrypt';
import { signJwt, JwtPayload } from '@shared/utils/jwt';
import { ConflictException } from '@shared/exceptions/ConflictException';
import { RegisterDtoType } from '@infrastructure/dto/auth.dto';

export class RegisterUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: RegisterDtoType): Promise<{ token: string; user: JwtPayload }> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ConflictException('Email already in use');

    const existingUsername = await this.userRepo.findByUsername(data.username);
    if (existingUsername) throw new ConflictException('Username already taken');

    const passwordHash = await hashPassword(data.password);
    const user = await this.userRepo.create({
      username: data.username,
      email: data.email,
      passwordHash,
      fullName: data.fullName ?? null,
    });

    const payload: JwtPayload = { id: user.id, username: user.username };
    return { token: signJwt(payload), user: payload };
  }
}
```

- [ ] **Step 7: Create `LoginUseCase.ts`**

```typescript
// backEnd/src/use-cases/auth/LoginUseCase.ts
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { comparePassword } from '@shared/utils/bcrypt';
import { signJwt, JwtPayload } from '@shared/utils/jwt';
import { UnauthorizedException } from '@shared/exceptions/UnauthorizedException';
import { LoginDtoType } from '@infrastructure/dto/auth.dto';

export class LoginUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: LoginDtoType): Promise<{ token: string; user: JwtPayload }> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await comparePassword(data.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { id: user.id, username: user.username };
    return { token: signJwt(payload), user: payload };
  }
}
```

- [ ] **Step 8: Run tests — verify they PASS**

```bash
cd ~/SaasPortfolio/backEnd && npm test
```

Expected: 6 tests passing (3 RegisterUseCase + 3 LoginUseCase).

- [ ] **Step 9: Create `AuthController.ts`**

```typescript
// backEnd/src/infrastructure/controllers/AuthController.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { RegisterUseCase } from '@use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '@use-cases/auth/LoginUseCase';
import { env } from '@config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: env.nodeEnv === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const { token, user } = await new RegisterUseCase(repo).execute(req.body);
      res.cookie('token', token, COOKIE_OPTIONS);
      res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const { token, user } = await new LoginUseCase(repo).execute(req.body);
      res.cookie('token', token, COOKIE_OPTIONS);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  }

  logout(_req: Request, res: Response): void {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
  }
}
```

- [ ] **Step 10: Create `auth.routes.ts`**

```typescript
// backEnd/src/infrastructure/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '@infrastructure/controllers/AuthController';
import { validate } from '@infrastructure/middlewares/validate';
import { RegisterDto, LoginDto } from '@infrastructure/dto/auth.dto';

const router = Router();
const ctrl = new AuthController();

router.post('/register', validate(RegisterDto), ctrl.register.bind(ctrl));
router.post('/login', validate(LoginDto), ctrl.login.bind(ctrl));
router.post('/logout', ctrl.logout.bind(ctrl));

export default router;
```

- [ ] **Step 11: Verify TypeScript**

```bash
cd ~/SaasPortfolio/backEnd && npx tsc --noEmit
```

- [ ] **Step 12: Commit**

```bash
cd ~/SaasPortfolio
git add backEnd/
git commit -m "feat(auth): register, login, logout with JWT cookie"
```

---

## Task 5: User profile — get, update, upload avatar

**Branch:** `feature/backend-auth` (continue)

**Files:**
- Create: `backEnd/src/infrastructure/dto/user.dto.ts`
- Create: `backEnd/src/use-cases/user/GetProfileUseCase.ts`
- Create: `backEnd/src/use-cases/user/UpdateProfileUseCase.ts`
- Create: `backEnd/src/use-cases/user/UploadAvatarUseCase.ts`
- Create: `backEnd/src/infrastructure/controllers/UserController.ts`
- Create: `backEnd/src/infrastructure/routes/user.routes.ts`

**Interfaces:**
- Consumes: `UserRepository` from Task 4
- Produces: `GET /api/me`, `PUT /api/me`, `POST /api/me/avatar`
- Produces: `GetProfileUseCase.execute(userId: number): Promise<UserWithoutHash>`

- [ ] **Step 1: Create `user.dto.ts`**

```typescript
// backEnd/src/infrastructure/dto/user.dto.ts
import { z } from 'zod';

export const UpdateProfileDto = z.object({
  fullName: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDto>;
```

- [ ] **Step 2: Create `GetProfileUseCase.ts`**

```typescript
// backEnd/src/use-cases/user/GetProfileUseCase.ts
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export type UserProfile = Omit<UserEntity, 'passwordHash'>;

export class GetProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: number): Promise<UserProfile> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...profile } = user;
    return profile;
  }
}
```

- [ ] **Step 3: Create `UpdateProfileUseCase.ts`**

```typescript
// backEnd/src/use-cases/user/UpdateProfileUseCase.ts
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { UserProfile } from './GetProfileUseCase';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
import { UpdateProfileDtoType } from '@infrastructure/dto/user.dto';

export class UpdateProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: number, data: UpdateProfileDtoType): Promise<UserProfile> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, data);
    const updated = await this.userRepo.save(user);
    const { passwordHash: _, ...profile } = updated;
    return profile;
  }
}
```

- [ ] **Step 4: Create `UploadAvatarUseCase.ts`**

```typescript
// backEnd/src/use-cases/user/UploadAvatarUseCase.ts
import { createClient } from '@supabase/supabase-js';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
import { env } from '@config/env';

export class UploadAvatarUseCase {
  private supabase = createClient(env.supabase.url, env.supabase.serviceKey);

  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: number, file: Express.Multer.File): Promise<string> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException();

    const path = `${userId}/avatar/${Date.now()}-${file.originalname}`;
    const { error } = await this.supabase.storage
      .from('portfolios')
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });

    if (error) throw new Error(error.message);

    const { data } = this.supabase.storage.from('portfolios').getPublicUrl(path);
    user.avatarUrl = data.publicUrl;
    await this.userRepo.save(user);
    return data.publicUrl;
  }
}
```

- [ ] **Step 5: Create `UserController.ts`**

```typescript
// backEnd/src/infrastructure/controllers/UserController.ts
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { GetProfileUseCase } from '@use-cases/user/GetProfileUseCase';
import { UpdateProfileUseCase } from '@use-cases/user/UpdateProfileUseCase';
import { UploadAvatarUseCase } from '@use-cases/user/UploadAvatarUseCase';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
export const avatarUpload = upload.single('avatar');

export class UserController {
  private getRepo(): UserRepository {
    return new UserRepository(AppDataSource.getRepository(UserEntity));
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await new GetProfileUseCase(this.getRepo()).execute(req.user.id);
      res.json({ success: true, data: profile });
    } catch (err) { next(err); }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await new UpdateProfileUseCase(this.getRepo()).execute(req.user.id, req.body);
      res.json({ success: true, data: profile });
    } catch (err) { next(err); }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file provided' });
        return;
      }
      const url = await new UploadAvatarUseCase(this.getRepo()).execute(req.user.id, req.file);
      res.json({ success: true, data: { avatarUrl: url } });
    } catch (err) { next(err); }
  }
}
```

- [ ] **Step 6: Create `user.routes.ts`**

```typescript
// backEnd/src/infrastructure/routes/user.routes.ts
import { Router } from 'express';
import { UserController, avatarUpload } from '@infrastructure/controllers/UserController';
import { validate } from '@infrastructure/middlewares/validate';
import { UpdateProfileDto } from '@infrastructure/dto/user.dto';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';

const router = Router();
const ctrl = new UserController();

router.use(authMiddleware);
router.get('/', ctrl.getProfile.bind(ctrl));
router.put('/', validate(UpdateProfileDto), ctrl.updateProfile.bind(ctrl));
router.post('/avatar', avatarUpload, ctrl.uploadAvatar.bind(ctrl));

export default router;
```

- [ ] **Step 7: Verify TypeScript**

```bash
cd ~/SaasPortfolio/backEnd && npx tsc --noEmit
```

- [ ] **Step 8: Commit + PR**

```bash
cd ~/SaasPortfolio
git add backEnd/
git commit -m "feat(auth): user profile endpoints (get, update, avatar upload)"
git push -u origin feature/backend-auth
# Open PR: feature/backend-auth → develop
```

---

## Task 6: Projects CRUD

**Branch:** `feature/backend-crud` (from `develop` after Task 5 merged)

**Files:**
- Create: `backEnd/src/infrastructure/dto/project.dto.ts`
- Create: `backEnd/src/infrastructure/repositories/ProjectRepository.ts`
- Create: `backEnd/src/use-cases/project/GetProjectsUseCase.ts`
- Create: `backEnd/src/use-cases/project/GetProjectByIdUseCase.ts`
- Create: `backEnd/src/use-cases/project/CreateProjectUseCase.ts`
- Create: `backEnd/src/use-cases/project/UpdateProjectUseCase.ts`
- Create: `backEnd/src/use-cases/project/DeleteProjectUseCase.ts`
- Create: `backEnd/src/infrastructure/controllers/ProjectController.ts`
- Create: `backEnd/src/infrastructure/routes/project.routes.ts`
- Create: `backEnd/tests/unit/project/GetProjectsUseCase.test.ts`
- Create: `backEnd/tests/unit/project/CreateProjectUseCase.test.ts`

**Interfaces:**
- Consumes: `BaseRepository<T>` from Task 3
- Produces: `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/:id`

- [ ] **Step 1: Branch**

```bash
cd ~/SaasPortfolio
git checkout develop && git pull
git checkout -b feature/backend-crud
```

- [ ] **Step 2: Write failing tests**

```typescript
// backEnd/tests/unit/project/GetProjectsUseCase.test.ts
import { GetProjectsUseCase } from '@use-cases/project/GetProjectsUseCase';

const mockRepo = { findAllByUser: jest.fn() };

describe('GetProjectsUseCase', () => {
  it('returns all projects for the user', async () => {
    const projects = [{ id: 1, userId: 1, title: 'App' }];
    mockRepo.findAllByUser.mockResolvedValue(projects);

    const result = await new GetProjectsUseCase(mockRepo as any).execute(1);

    expect(mockRepo.findAllByUser).toHaveBeenCalledWith(1);
    expect(result).toEqual(projects);
  });

  it('returns empty array when user has no projects', async () => {
    mockRepo.findAllByUser.mockResolvedValue([]);
    const result = await new GetProjectsUseCase(mockRepo as any).execute(99);
    expect(result).toEqual([]);
  });
});
```

```typescript
// backEnd/tests/unit/project/CreateProjectUseCase.test.ts
import { CreateProjectUseCase } from '@use-cases/project/CreateProjectUseCase';

const mockRepo = { createForUser: jest.fn() };

describe('CreateProjectUseCase', () => {
  it('creates a project scoped to the user', async () => {
    const created = { id: 1, userId: 1, title: 'App', technologies: [] };
    mockRepo.createForUser.mockResolvedValue(created);

    const result = await new CreateProjectUseCase(mockRepo as any).execute(1, {
      title: 'App',
      technologies: [],
    });

    expect(mockRepo.createForUser).toHaveBeenCalledWith(1, { title: 'App', technologies: [] });
    expect(result.userId).toBe(1);
    expect(result.title).toBe('App');
  });
});
```

- [ ] **Step 3: Run tests — verify FAIL**

```bash
cd ~/SaasPortfolio/backEnd && npm test -- --testPathPattern=project
```

Expected: FAIL — `Cannot find module '@use-cases/project/GetProjectsUseCase'`

- [ ] **Step 4: Create `project.dto.ts`**

```typescript
// backEnd/src/infrastructure/dto/project.dto.ts
import { z } from 'zod';

export const CreateProjectDto = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional().default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
});

export const UpdateProjectDto = CreateProjectDto.partial();

export type CreateProjectDtoType = z.infer<typeof CreateProjectDto>;
export type UpdateProjectDtoType = z.infer<typeof UpdateProjectDto>;
```

- [ ] **Step 5: Create `ProjectRepository.ts`**

```typescript
// backEnd/src/infrastructure/repositories/ProjectRepository.ts
import { Repository } from 'typeorm';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { BaseRepository } from './BaseRepository';

export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor(repo: Repository<ProjectEntity>) { super(repo); }
}
```

- [ ] **Step 6: Create the 5 use-cases**

```typescript
// backEnd/src/use-cases/project/GetProjectsUseCase.ts
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';

export class GetProjectsUseCase {
  constructor(private readonly repo: ProjectRepository) {}
  execute(userId: number): Promise<ProjectEntity[]> {
    return this.repo.findAllByUser(userId);
  }
}
```

```typescript
// backEnd/src/use-cases/project/GetProjectByIdUseCase.ts
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export class GetProjectByIdUseCase {
  constructor(private readonly repo: ProjectRepository) {}
  async execute(id: number, userId: number): Promise<ProjectEntity> {
    const project = await this.repo.findByIdAndUser(id, userId);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }
}
```

```typescript
// backEnd/src/use-cases/project/CreateProjectUseCase.ts
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { CreateProjectDtoType } from '@infrastructure/dto/project.dto';

export class CreateProjectUseCase {
  constructor(private readonly repo: ProjectRepository) {}
  execute(userId: number, data: CreateProjectDtoType): Promise<ProjectEntity> {
    return this.repo.createForUser(userId, data as any);
  }
}
```

```typescript
// backEnd/src/use-cases/project/UpdateProjectUseCase.ts
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { UpdateProjectDtoType } from '@infrastructure/dto/project.dto';

export class UpdateProjectUseCase {
  constructor(private readonly repo: ProjectRepository) {}
  execute(id: number, userId: number, data: UpdateProjectDtoType): Promise<ProjectEntity> {
    return this.repo.updateForUser(id, userId, data as any);
  }
}
```

```typescript
// backEnd/src/use-cases/project/DeleteProjectUseCase.ts
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';

export class DeleteProjectUseCase {
  constructor(private readonly repo: ProjectRepository) {}
  execute(id: number, userId: number): Promise<void> {
    return this.repo.deleteForUser(id, userId);
  }
}
```

- [ ] **Step 7: Run tests — verify PASS**

```bash
cd ~/SaasPortfolio/backEnd && npm test -- --testPathPattern=project
```

Expected: 3 tests passing.

- [ ] **Step 8: Create `ProjectController.ts`**

```typescript
// backEnd/src/infrastructure/controllers/ProjectController.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { GetProjectsUseCase } from '@use-cases/project/GetProjectsUseCase';
import { GetProjectByIdUseCase } from '@use-cases/project/GetProjectByIdUseCase';
import { CreateProjectUseCase } from '@use-cases/project/CreateProjectUseCase';
import { UpdateProjectUseCase } from '@use-cases/project/UpdateProjectUseCase';
import { DeleteProjectUseCase } from '@use-cases/project/DeleteProjectUseCase';

export class ProjectController {
  private repo(): ProjectRepository {
    return new ProjectRepository(AppDataSource.getRepository(ProjectEntity));
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await new GetProjectsUseCase(this.repo()).execute(req.user.id);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await new GetProjectByIdUseCase(this.repo()).execute(Number(req.params.id), req.user.id);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await new CreateProjectUseCase(this.repo()).execute(req.user.id, req.body);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await new UpdateProjectUseCase(this.repo()).execute(Number(req.params.id), req.user.id, req.body);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteProjectUseCase(this.repo()).execute(Number(req.params.id), req.user.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}
```

- [ ] **Step 9: Create `project.routes.ts`**

```typescript
// backEnd/src/infrastructure/routes/project.routes.ts
import { Router } from 'express';
import { ProjectController } from '@infrastructure/controllers/ProjectController';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateProjectDto, UpdateProjectDto } from '@infrastructure/dto/project.dto';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';

const router = Router();
const ctrl = new ProjectController();

router.use(authMiddleware);
router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', validate(CreateProjectDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateProjectDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));

export default router;
```

- [ ] **Step 10: Verify TypeScript + all tests**

```bash
cd ~/SaasPortfolio/backEnd && npx tsc --noEmit && npm test
```

Expected: no TS errors, all tests pass.

- [ ] **Step 11: Commit**

```bash
cd ~/SaasPortfolio
git add backEnd/
git commit -m "feat(crud): projects CRUD with userId scoping"
```

---

## Task 7: Skills, Experiences, Educations CRUD

**Branch:** `feature/backend-crud` (continue)

**Files:** (6 files per resource × 3 resources = 18 files)
- DTOs: `skill.dto.ts`, `experience.dto.ts`, `education.dto.ts`
- Repos: `SkillRepository.ts`, `ExperienceRepository.ts`, `EducationRepository.ts`
- Use-cases: 5 per resource (GetAll, GetById, Create, Update, Delete)
- Controllers: `SkillController.ts`, `ExperienceController.ts`, `EducationController.ts`
- Routes: `skill.routes.ts`, `experience.routes.ts`, `education.routes.ts`

- [ ] **Step 1: Create `skill.dto.ts`**

```typescript
// backEnd/src/infrastructure/dto/skill.dto.ts
import { z } from 'zod';

export const CreateSkillDto = z.object({
  name: z.string().min(1).max(100),
  category: z.string().optional(),
  level: z.string().optional(),
});

export const UpdateSkillDto = CreateSkillDto.partial();
export type CreateSkillDtoType = z.infer<typeof CreateSkillDto>;
export type UpdateSkillDtoType = z.infer<typeof UpdateSkillDto>;
```

- [ ] **Step 2: Create `experience.dto.ts`**

```typescript
// backEnd/src/infrastructure/dto/experience.dto.ts
import { z } from 'zod';

export const CreateExperienceDto = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const UpdateExperienceDto = CreateExperienceDto.partial();
export type CreateExperienceDtoType = z.infer<typeof CreateExperienceDto>;
export type UpdateExperienceDtoType = z.infer<typeof UpdateExperienceDto>;
```

- [ ] **Step 3: Create `education.dto.ts`**

```typescript
// backEnd/src/infrastructure/dto/education.dto.ts
import { z } from 'zod';

export const CreateEducationDto = z.object({
  school: z.string().min(1).max(200),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const UpdateEducationDto = CreateEducationDto.partial();
export type CreateEducationDtoType = z.infer<typeof CreateEducationDto>;
export type UpdateEducationDtoType = z.infer<typeof UpdateEducationDto>;
```

- [ ] **Step 4: Create repositories**

```typescript
// backEnd/src/infrastructure/repositories/SkillRepository.ts
import { Repository } from 'typeorm';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { BaseRepository } from './BaseRepository';

export class SkillRepository extends BaseRepository<SkillEntity> {
  constructor(repo: Repository<SkillEntity>) { super(repo); }
}
```

```typescript
// backEnd/src/infrastructure/repositories/ExperienceRepository.ts
import { Repository } from 'typeorm';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { BaseRepository } from './BaseRepository';

export class ExperienceRepository extends BaseRepository<ExperienceEntity> {
  constructor(repo: Repository<ExperienceEntity>) { super(repo); }
}
```

```typescript
// backEnd/src/infrastructure/repositories/EducationRepository.ts
import { Repository } from 'typeorm';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { BaseRepository } from './BaseRepository';

export class EducationRepository extends BaseRepository<EducationEntity> {
  constructor(repo: Repository<EducationEntity>) { super(repo); }
}
```

- [ ] **Step 5: Create Skill use-cases**

```typescript
// backEnd/src/use-cases/skill/GetSkillsUseCase.ts
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
export class GetSkillsUseCase {
  constructor(private readonly repo: SkillRepository) {}
  execute(userId: number): Promise<SkillEntity[]> { return this.repo.findAllByUser(userId); }
}

// backEnd/src/use-cases/skill/GetSkillByIdUseCase.ts
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
export class GetSkillByIdUseCase {
  constructor(private readonly repo: SkillRepository) {}
  async execute(id: number, userId: number): Promise<SkillEntity> {
    const skill = await this.repo.findByIdAndUser(id, userId);
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }
}

// backEnd/src/use-cases/skill/CreateSkillUseCase.ts
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { CreateSkillDtoType } from '@infrastructure/dto/skill.dto';
export class CreateSkillUseCase {
  constructor(private readonly repo: SkillRepository) {}
  execute(userId: number, data: CreateSkillDtoType): Promise<SkillEntity> {
    return this.repo.createForUser(userId, data as any);
  }
}

// backEnd/src/use-cases/skill/UpdateSkillUseCase.ts
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { UpdateSkillDtoType } from '@infrastructure/dto/skill.dto';
export class UpdateSkillUseCase {
  constructor(private readonly repo: SkillRepository) {}
  execute(id: number, userId: number, data: UpdateSkillDtoType): Promise<SkillEntity> {
    return this.repo.updateForUser(id, userId, data as any);
  }
}

// backEnd/src/use-cases/skill/DeleteSkillUseCase.ts
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
export class DeleteSkillUseCase {
  constructor(private readonly repo: SkillRepository) {}
  execute(id: number, userId: number): Promise<void> { return this.repo.deleteForUser(id, userId); }
}
```

- [ ] **Step 6: Create Experience use-cases**

```typescript
// backEnd/src/use-cases/experience/GetExperiencesUseCase.ts
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
export class GetExperiencesUseCase {
  constructor(private readonly repo: ExperienceRepository) {}
  execute(userId: number): Promise<ExperienceEntity[]> { return this.repo.findAllByUser(userId); }
}

// backEnd/src/use-cases/experience/GetExperienceByIdUseCase.ts
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
export class GetExperienceByIdUseCase {
  constructor(private readonly repo: ExperienceRepository) {}
  async execute(id: number, userId: number): Promise<ExperienceEntity> {
    const item = await this.repo.findByIdAndUser(id, userId);
    if (!item) throw new NotFoundException('Experience not found');
    return item;
  }
}

// backEnd/src/use-cases/experience/CreateExperienceUseCase.ts
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { CreateExperienceDtoType } from '@infrastructure/dto/experience.dto';
export class CreateExperienceUseCase {
  constructor(private readonly repo: ExperienceRepository) {}
  execute(userId: number, data: CreateExperienceDtoType): Promise<ExperienceEntity> {
    return this.repo.createForUser(userId, data as any);
  }
}

// backEnd/src/use-cases/experience/UpdateExperienceUseCase.ts
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { UpdateExperienceDtoType } from '@infrastructure/dto/experience.dto';
export class UpdateExperienceUseCase {
  constructor(private readonly repo: ExperienceRepository) {}
  execute(id: number, userId: number, data: UpdateExperienceDtoType): Promise<ExperienceEntity> {
    return this.repo.updateForUser(id, userId, data as any);
  }
}

// backEnd/src/use-cases/experience/DeleteExperienceUseCase.ts
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
export class DeleteExperienceUseCase {
  constructor(private readonly repo: ExperienceRepository) {}
  execute(id: number, userId: number): Promise<void> { return this.repo.deleteForUser(id, userId); }
}
```

- [ ] **Step 7: Create Education use-cases**

```typescript
// backEnd/src/use-cases/education/GetEducationsUseCase.ts
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
export class GetEducationsUseCase {
  constructor(private readonly repo: EducationRepository) {}
  execute(userId: number): Promise<EducationEntity[]> { return this.repo.findAllByUser(userId); }
}

// backEnd/src/use-cases/education/GetEducationByIdUseCase.ts
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
export class GetEducationByIdUseCase {
  constructor(private readonly repo: EducationRepository) {}
  async execute(id: number, userId: number): Promise<EducationEntity> {
    const item = await this.repo.findByIdAndUser(id, userId);
    if (!item) throw new NotFoundException('Education not found');
    return item;
  }
}

// backEnd/src/use-cases/education/CreateEducationUseCase.ts
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { CreateEducationDtoType } from '@infrastructure/dto/education.dto';
export class CreateEducationUseCase {
  constructor(private readonly repo: EducationRepository) {}
  execute(userId: number, data: CreateEducationDtoType): Promise<EducationEntity> {
    return this.repo.createForUser(userId, data as any);
  }
}

// backEnd/src/use-cases/education/UpdateEducationUseCase.ts
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { UpdateEducationDtoType } from '@infrastructure/dto/education.dto';
export class UpdateEducationUseCase {
  constructor(private readonly repo: EducationRepository) {}
  execute(id: number, userId: number, data: UpdateEducationDtoType): Promise<EducationEntity> {
    return this.repo.updateForUser(id, userId, data as any);
  }
}

// backEnd/src/use-cases/education/DeleteEducationUseCase.ts
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
export class DeleteEducationUseCase {
  constructor(private readonly repo: EducationRepository) {}
  execute(id: number, userId: number): Promise<void> { return this.repo.deleteForUser(id, userId); }
}
```

- [ ] **Step 8: Create SkillController.ts**

```typescript
// backEnd/src/infrastructure/controllers/SkillController.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { GetSkillsUseCase } from '@use-cases/skill/GetSkillsUseCase';
import { GetSkillByIdUseCase } from '@use-cases/skill/GetSkillByIdUseCase';
import { CreateSkillUseCase } from '@use-cases/skill/CreateSkillUseCase';
import { UpdateSkillUseCase } from '@use-cases/skill/UpdateSkillUseCase';
import { DeleteSkillUseCase } from '@use-cases/skill/DeleteSkillUseCase';

export class SkillController {
  private repo(): SkillRepository {
    return new SkillRepository(AppDataSource.getRepository(SkillEntity));
  }
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetSkillsUseCase(this.repo()).execute(req.user.id) }); }
    catch (err) { next(err); }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetSkillByIdUseCase(this.repo()).execute(Number(req.params.id), req.user.id) }); }
    catch (err) { next(err); }
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(201).json({ success: true, data: await new CreateSkillUseCase(this.repo()).execute(req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new UpdateSkillUseCase(this.repo()).execute(Number(req.params.id), req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await new DeleteSkillUseCase(this.repo()).execute(Number(req.params.id), req.user.id); res.status(204).send(); }
    catch (err) { next(err); }
  }
}
```

- [ ] **Step 9: Create ExperienceController.ts**

```typescript
// backEnd/src/infrastructure/controllers/ExperienceController.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { GetExperiencesUseCase } from '@use-cases/experience/GetExperiencesUseCase';
import { GetExperienceByIdUseCase } from '@use-cases/experience/GetExperienceByIdUseCase';
import { CreateExperienceUseCase } from '@use-cases/experience/CreateExperienceUseCase';
import { UpdateExperienceUseCase } from '@use-cases/experience/UpdateExperienceUseCase';
import { DeleteExperienceUseCase } from '@use-cases/experience/DeleteExperienceUseCase';

export class ExperienceController {
  private repo(): ExperienceRepository {
    return new ExperienceRepository(AppDataSource.getRepository(ExperienceEntity));
  }
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetExperiencesUseCase(this.repo()).execute(req.user.id) }); }
    catch (err) { next(err); }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetExperienceByIdUseCase(this.repo()).execute(Number(req.params.id), req.user.id) }); }
    catch (err) { next(err); }
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(201).json({ success: true, data: await new CreateExperienceUseCase(this.repo()).execute(req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new UpdateExperienceUseCase(this.repo()).execute(Number(req.params.id), req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await new DeleteExperienceUseCase(this.repo()).execute(Number(req.params.id), req.user.id); res.status(204).send(); }
    catch (err) { next(err); }
  }
}
```

- [ ] **Step 10: Create EducationController.ts**

```typescript
// backEnd/src/infrastructure/controllers/EducationController.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { GetEducationsUseCase } from '@use-cases/education/GetEducationsUseCase';
import { GetEducationByIdUseCase } from '@use-cases/education/GetEducationByIdUseCase';
import { CreateEducationUseCase } from '@use-cases/education/CreateEducationUseCase';
import { UpdateEducationUseCase } from '@use-cases/education/UpdateEducationUseCase';
import { DeleteEducationUseCase } from '@use-cases/education/DeleteEducationUseCase';

export class EducationController {
  private repo(): EducationRepository {
    return new EducationRepository(AppDataSource.getRepository(EducationEntity));
  }
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetEducationsUseCase(this.repo()).execute(req.user.id) }); }
    catch (err) { next(err); }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetEducationByIdUseCase(this.repo()).execute(Number(req.params.id), req.user.id) }); }
    catch (err) { next(err); }
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(201).json({ success: true, data: await new CreateEducationUseCase(this.repo()).execute(req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new UpdateEducationUseCase(this.repo()).execute(Number(req.params.id), req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await new DeleteEducationUseCase(this.repo()).execute(Number(req.params.id), req.user.id); res.status(204).send(); }
    catch (err) { next(err); }
  }
}
```

- [ ] **Step 11: Create routes for Skill, Experience, Education**

```typescript
// backEnd/src/infrastructure/routes/skill.routes.ts
import { Router } from 'express';
import { SkillController } from '@infrastructure/controllers/SkillController';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateSkillDto, UpdateSkillDto } from '@infrastructure/dto/skill.dto';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
const router = Router();
const ctrl = new SkillController();
router.use(authMiddleware);
router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', validate(CreateSkillDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateSkillDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));
export default router;
```

```typescript
// backEnd/src/infrastructure/routes/experience.routes.ts
import { Router } from 'express';
import { ExperienceController } from '@infrastructure/controllers/ExperienceController';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateExperienceDto, UpdateExperienceDto } from '@infrastructure/dto/experience.dto';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
const router = Router();
const ctrl = new ExperienceController();
router.use(authMiddleware);
router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', validate(CreateExperienceDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateExperienceDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));
export default router;
```

```typescript
// backEnd/src/infrastructure/routes/education.routes.ts
import { Router } from 'express';
import { EducationController } from '@infrastructure/controllers/EducationController';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateEducationDto, UpdateEducationDto } from '@infrastructure/dto/education.dto';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
const router = Router();
const ctrl = new EducationController();
router.use(authMiddleware);
router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', validate(CreateEducationDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateEducationDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));
export default router;
```

- [ ] **Step 12: Verify TypeScript + all tests**

```bash
cd ~/SaasPortfolio/backEnd && npx tsc --noEmit && npm test
```

- [ ] **Step 13: Commit**

```bash
cd ~/SaasPortfolio
git add backEnd/
git commit -m "feat(crud): skills, experiences, educations CRUD"
```

---

## Task 8: News + SocialLinks CRUD

**Branch:** `feature/backend-crud` (continue)

**Files:** DTOs, repos, 5 use-cases each, controllers, routes for News and SocialLink.

- [ ] **Step 1: Create DTOs**

```typescript
// backEnd/src/infrastructure/dto/news.dto.ts
import { z } from 'zod';
export const CreateNewsDto = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  publishedAt: z.string().optional(),
});
export const UpdateNewsDto = CreateNewsDto.partial();
export type CreateNewsDtoType = z.infer<typeof CreateNewsDto>;
export type UpdateNewsDtoType = z.infer<typeof UpdateNewsDto>;
```

```typescript
// backEnd/src/infrastructure/dto/social-link.dto.ts
import { z } from 'zod';
export const CreateSocialLinkDto = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url(),
});
export const UpdateSocialLinkDto = CreateSocialLinkDto.partial();
export type CreateSocialLinkDtoType = z.infer<typeof CreateSocialLinkDto>;
export type UpdateSocialLinkDtoType = z.infer<typeof UpdateSocialLinkDto>;
```

- [ ] **Step 2: Create repositories**

```typescript
// backEnd/src/infrastructure/repositories/NewsRepository.ts
import { Repository } from 'typeorm';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { BaseRepository } from './BaseRepository';
export class NewsRepository extends BaseRepository<NewsEntity> {
  constructor(repo: Repository<NewsEntity>) { super(repo); }
}

// backEnd/src/infrastructure/repositories/SocialLinkRepository.ts
import { Repository } from 'typeorm';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { BaseRepository } from './BaseRepository';
export class SocialLinkRepository extends BaseRepository<SocialLinkEntity> {
  constructor(repo: Repository<SocialLinkEntity>) { super(repo); }
}
```

- [ ] **Step 3: Create News use-cases**

```typescript
// backEnd/src/use-cases/news/GetNewsUseCase.ts
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
export class GetNewsUseCase {
  constructor(private readonly repo: NewsRepository) {}
  execute(userId: number): Promise<NewsEntity[]> { return this.repo.findAllByUser(userId); }
}

// backEnd/src/use-cases/news/GetNewsByIdUseCase.ts
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
export class GetNewsByIdUseCase {
  constructor(private readonly repo: NewsRepository) {}
  async execute(id: number, userId: number): Promise<NewsEntity> {
    const item = await this.repo.findByIdAndUser(id, userId);
    if (!item) throw new NotFoundException('News not found');
    return item;
  }
}

// backEnd/src/use-cases/news/CreateNewsUseCase.ts
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { CreateNewsDtoType } from '@infrastructure/dto/news.dto';
export class CreateNewsUseCase {
  constructor(private readonly repo: NewsRepository) {}
  execute(userId: number, data: CreateNewsDtoType): Promise<NewsEntity> {
    return this.repo.createForUser(userId, data as any);
  }
}

// backEnd/src/use-cases/news/UpdateNewsUseCase.ts
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { UpdateNewsDtoType } from '@infrastructure/dto/news.dto';
export class UpdateNewsUseCase {
  constructor(private readonly repo: NewsRepository) {}
  execute(id: number, userId: number, data: UpdateNewsDtoType): Promise<NewsEntity> {
    return this.repo.updateForUser(id, userId, data as any);
  }
}

// backEnd/src/use-cases/news/DeleteNewsUseCase.ts
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
export class DeleteNewsUseCase {
  constructor(private readonly repo: NewsRepository) {}
  execute(id: number, userId: number): Promise<void> { return this.repo.deleteForUser(id, userId); }
}
```

- [ ] **Step 4: Create SocialLink use-cases**

```typescript
// backEnd/src/use-cases/social-link/GetSocialLinksUseCase.ts
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
export class GetSocialLinksUseCase {
  constructor(private readonly repo: SocialLinkRepository) {}
  execute(userId: number): Promise<SocialLinkEntity[]> { return this.repo.findAllByUser(userId); }
}

// backEnd/src/use-cases/social-link/GetSocialLinkByIdUseCase.ts
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
export class GetSocialLinkByIdUseCase {
  constructor(private readonly repo: SocialLinkRepository) {}
  async execute(id: number, userId: number): Promise<SocialLinkEntity> {
    const item = await this.repo.findByIdAndUser(id, userId);
    if (!item) throw new NotFoundException('Social link not found');
    return item;
  }
}

// backEnd/src/use-cases/social-link/CreateSocialLinkUseCase.ts
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { CreateSocialLinkDtoType } from '@infrastructure/dto/social-link.dto';
export class CreateSocialLinkUseCase {
  constructor(private readonly repo: SocialLinkRepository) {}
  execute(userId: number, data: CreateSocialLinkDtoType): Promise<SocialLinkEntity> {
    return this.repo.createForUser(userId, data as any);
  }
}

// backEnd/src/use-cases/social-link/UpdateSocialLinkUseCase.ts
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { UpdateSocialLinkDtoType } from '@infrastructure/dto/social-link.dto';
export class UpdateSocialLinkUseCase {
  constructor(private readonly repo: SocialLinkRepository) {}
  execute(id: number, userId: number, data: UpdateSocialLinkDtoType): Promise<SocialLinkEntity> {
    return this.repo.updateForUser(id, userId, data as any);
  }
}

// backEnd/src/use-cases/social-link/DeleteSocialLinkUseCase.ts
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
export class DeleteSocialLinkUseCase {
  constructor(private readonly repo: SocialLinkRepository) {}
  execute(id: number, userId: number): Promise<void> { return this.repo.deleteForUser(id, userId); }
}
```

- [ ] **Step 5: Create NewsController.ts**

```typescript
// backEnd/src/infrastructure/controllers/NewsController.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { GetNewsUseCase } from '@use-cases/news/GetNewsUseCase';
import { GetNewsByIdUseCase } from '@use-cases/news/GetNewsByIdUseCase';
import { CreateNewsUseCase } from '@use-cases/news/CreateNewsUseCase';
import { UpdateNewsUseCase } from '@use-cases/news/UpdateNewsUseCase';
import { DeleteNewsUseCase } from '@use-cases/news/DeleteNewsUseCase';

export class NewsController {
  private repo(): NewsRepository {
    return new NewsRepository(AppDataSource.getRepository(NewsEntity));
  }
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetNewsUseCase(this.repo()).execute(req.user.id) }); }
    catch (err) { next(err); }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetNewsByIdUseCase(this.repo()).execute(Number(req.params.id), req.user.id) }); }
    catch (err) { next(err); }
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(201).json({ success: true, data: await new CreateNewsUseCase(this.repo()).execute(req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new UpdateNewsUseCase(this.repo()).execute(Number(req.params.id), req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await new DeleteNewsUseCase(this.repo()).execute(Number(req.params.id), req.user.id); res.status(204).send(); }
    catch (err) { next(err); }
  }
}
```

- [ ] **Step 6: Create SocialLinkController.ts**

```typescript
// backEnd/src/infrastructure/controllers/SocialLinkController.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { GetSocialLinksUseCase } from '@use-cases/social-link/GetSocialLinksUseCase';
import { GetSocialLinkByIdUseCase } from '@use-cases/social-link/GetSocialLinkByIdUseCase';
import { CreateSocialLinkUseCase } from '@use-cases/social-link/CreateSocialLinkUseCase';
import { UpdateSocialLinkUseCase } from '@use-cases/social-link/UpdateSocialLinkUseCase';
import { DeleteSocialLinkUseCase } from '@use-cases/social-link/DeleteSocialLinkUseCase';

export class SocialLinkController {
  private repo(): SocialLinkRepository {
    return new SocialLinkRepository(AppDataSource.getRepository(SocialLinkEntity));
  }
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetSocialLinksUseCase(this.repo()).execute(req.user.id) }); }
    catch (err) { next(err); }
  }
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new GetSocialLinkByIdUseCase(this.repo()).execute(Number(req.params.id), req.user.id) }); }
    catch (err) { next(err); }
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(201).json({ success: true, data: await new CreateSocialLinkUseCase(this.repo()).execute(req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await new UpdateSocialLinkUseCase(this.repo()).execute(Number(req.params.id), req.user.id, req.body) }); }
    catch (err) { next(err); }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await new DeleteSocialLinkUseCase(this.repo()).execute(Number(req.params.id), req.user.id); res.status(204).send(); }
    catch (err) { next(err); }
  }
}
```

- [ ] **Step 7: Create routes**

```typescript
// backEnd/src/infrastructure/routes/news.routes.ts
import { Router } from 'express';
import { NewsController } from '@infrastructure/controllers/NewsController';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateNewsDto, UpdateNewsDto } from '@infrastructure/dto/news.dto';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
const router = Router();
const ctrl = new NewsController();
router.use(authMiddleware);
router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', validate(CreateNewsDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateNewsDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));
export default router;
```

```typescript
// backEnd/src/infrastructure/routes/social-link.routes.ts
import { Router } from 'express';
import { SocialLinkController } from '@infrastructure/controllers/SocialLinkController';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateSocialLinkDto, UpdateSocialLinkDto } from '@infrastructure/dto/social-link.dto';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
const router = Router();
const ctrl = new SocialLinkController();
router.use(authMiddleware);
router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', validate(CreateSocialLinkDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateSocialLinkDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));
export default router;
```

- [ ] **Step 8: Verify + commit + PR**

```bash
cd ~/SaasPortfolio/backEnd && npx tsc --noEmit && npm test
```

Expected: all tests pass.

```bash
cd ~/SaasPortfolio
git add backEnd/
git commit -m "feat(crud): news and social-links CRUD"
git push -u origin feature/backend-crud
# Open PR: feature/backend-crud → develop
```

---

## Task 9: Public routes

**Branch:** `feature/backend-public` (from `develop` after Task 8 merged)

**Files:**
- Create: `backEnd/src/use-cases/public/GetPublicPortfolioUseCase.ts`
- Create: `backEnd/src/infrastructure/controllers/PublicController.ts`
- Create: `backEnd/src/infrastructure/routes/public.routes.ts`

**Interfaces:**
- Produces: `GET /public/u/:username` → full portfolio (no auth)
- Produces: `GET /public/u/:username/projects` → projects only
- Note: `passwordHash` is NEVER included in any response from public routes

- [ ] **Step 1: Branch**

```bash
cd ~/SaasPortfolio
git checkout develop && git pull
git checkout -b feature/backend-public
```

- [ ] **Step 2: Create `GetPublicPortfolioUseCase.ts`**

```typescript
// backEnd/src/use-cases/public/GetPublicPortfolioUseCase.ts
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { SkillEntity } from '@infrastructure/entities/SkillEntity';
import { ExperienceEntity } from '@infrastructure/entities/ExperienceEntity';
import { EducationEntity } from '@infrastructure/entities/EducationEntity';
import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { SocialLinkEntity } from '@infrastructure/entities/SocialLinkEntity';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { SkillRepository } from '@infrastructure/repositories/SkillRepository';
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { EducationRepository } from '@infrastructure/repositories/EducationRepository';
import { NewsRepository } from '@infrastructure/repositories/NewsRepository';
import { SocialLinkRepository } from '@infrastructure/repositories/SocialLinkRepository';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
import { UserProfile } from '@use-cases/user/GetProfileUseCase';

export interface PublicPortfolio {
  profile: UserProfile;
  projects: ProjectEntity[];
  skills: SkillEntity[];
  experiences: ExperienceEntity[];
  educations: EducationEntity[];
  news: NewsEntity[];
  socialLinks: SocialLinkEntity[];
}

export class GetPublicPortfolioUseCase {
  async execute(username: string): Promise<PublicPortfolio> {
    const userRepo = new UserRepository(AppDataSource.getRepository(UserEntity));
    const user = await userRepo.findByUsername(username);
    if (!user) throw new NotFoundException('Portfolio not found');

    const { passwordHash: _, ...profile } = user;
    const userId = user.id;

    const [projects, skills, experiences, educations, news, socialLinks] = await Promise.all([
      new ProjectRepository(AppDataSource.getRepository(ProjectEntity)).findAllByUser(userId),
      new SkillRepository(AppDataSource.getRepository(SkillEntity)).findAllByUser(userId),
      new ExperienceRepository(AppDataSource.getRepository(ExperienceEntity)).findAllByUser(userId),
      new EducationRepository(AppDataSource.getRepository(EducationEntity)).findAllByUser(userId),
      new NewsRepository(AppDataSource.getRepository(NewsEntity)).findAllByUser(userId),
      new SocialLinkRepository(AppDataSource.getRepository(SocialLinkEntity)).findAllByUser(userId),
    ]);

    return { profile, projects, skills, experiences, educations, news, socialLinks };
  }
}
```

- [ ] **Step 3: Create `PublicController.ts`**

```typescript
// backEnd/src/infrastructure/controllers/PublicController.ts
import { Request, Response, NextFunction } from 'express';
import { GetPublicPortfolioUseCase } from '@use-cases/public/GetPublicPortfolioUseCase';
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { ProjectEntity } from '@infrastructure/entities/ProjectEntity';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export class PublicController {
  async getPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await new GetPublicPortfolioUseCase().execute(req.params.username);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRepo = new UserRepository(AppDataSource.getRepository(UserEntity));
      const user = await userRepo.findByUsername(req.params.username);
      if (!user) throw new NotFoundException('Portfolio not found');
      const projects = await new ProjectRepository(AppDataSource.getRepository(ProjectEntity)).findAllByUser(user.id);
      res.json({ success: true, data: projects });
    } catch (err) { next(err); }
  }
}
```

- [ ] **Step 4: Create `public.routes.ts`**

```typescript
// backEnd/src/infrastructure/routes/public.routes.ts
import { Router } from 'express';
import { PublicController } from '@infrastructure/controllers/PublicController';

const router = Router();
const ctrl = new PublicController();

router.get('/:username', ctrl.getPortfolio.bind(ctrl));
router.get('/:username/projects', ctrl.getProjects.bind(ctrl));

export default router;
```

- [ ] **Step 5: Verify TypeScript**

```bash
cd ~/SaasPortfolio/backEnd && npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
cd ~/SaasPortfolio
git add backEnd/
git commit -m "feat(public): public portfolio routes by username"
```

---

## Task 10: Server wiring + security + smoke test

**Branch:** `feature/backend-public` (continue)

**Files:**
- Create: `backEnd/src/infrastructure/routes/index.ts`
- Create: `backEnd/src/server.ts`

- [ ] **Step 1: Create `routes/index.ts`**

```typescript
// backEnd/src/infrastructure/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import skillRoutes from './skill.routes';
import experienceRoutes from './experience.routes';
import educationRoutes from './education.routes';
import newsRoutes from './news.routes';
import socialLinkRoutes from './social-link.routes';
import publicRoutes from './public.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api/me', userRoutes);
router.use('/api/projects', projectRoutes);
router.use('/api/skills', skillRoutes);
router.use('/api/experiences', experienceRoutes);
router.use('/api/educations', educationRoutes);
router.use('/api/news', newsRoutes);
router.use('/api/social-links', socialLinkRoutes);
router.use('/public/u', publicRoutes);

export default router;
```

- [ ] **Step 2: Create `server.ts`**

```typescript
// backEnd/src/server.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from '@config/env';
import { AppDataSource } from '@infrastructure/database/data-source';
import routes from '@infrastructure/routes';
import { errorMiddleware } from '@infrastructure/middlewares/errorMiddleware';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.cors.allowedOrigins, credentials: true }));
app.use(hpp());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(routes);
app.use(errorMiddleware);

AppDataSource.initialize()
  .then(() => {
    app.listen(env.port, () =>
      console.log(`SaaS Portfolio API running on port ${env.port}`)
    );
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

export default app;
```

- [ ] **Step 3: Final TypeScript check**

```bash
cd ~/SaasPortfolio/backEnd && npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Start the server**

```bash
cd ~/SaasPortfolio/backEnd && npm run dev
```

Expected: `SaaS Portfolio API running on port 5000`

- [ ] **Step 5: Smoke test — register**

```bash
curl -c /tmp/cookies.txt -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","fullName":"Test User"}'
```

Expected: `{"success":true,"data":{"id":1,"username":"testuser"}}`

- [ ] **Step 6: Smoke test — protected route**

```bash
curl -b /tmp/cookies.txt http://localhost:5000/api/me
```

Expected: `{"success":true,"data":{...profile without passwordHash...}}`

- [ ] **Step 7: Smoke test — public route (before creating content)**

```bash
curl http://localhost:5000/public/u/testuser
```

Expected: `{"success":true,"data":{"profile":{...},"projects":[],"skills":[],...}}`

- [ ] **Step 8: Smoke test — 401 without cookie**

```bash
curl http://localhost:5000/api/projects
```

Expected: `{"success":false,"message":"Authentication required"}`

- [ ] **Step 9: Run all tests one final time**

```bash
cd ~/SaasPortfolio/backEnd && npm test
```

Expected: all tests pass.

- [ ] **Step 10: Commit + PR**

```bash
cd ~/SaasPortfolio
git add backEnd/
git commit -m "feat(server): wire all routes, add security middleware"
git push -u origin feature/backend-public
# Open PR: feature/backend-public → develop
# After merge, open PR: develop → main
```

---

## Spec coverage check

| Requirement | Task |
|---|---|
| JWT auth (register + login + logout) | Task 4 |
| httpOnly cookie (no localStorage) | Task 4 |
| userId NEVER from request body | Task 3 (BaseRepository), Task 4 (controllers) |
| Full CRUD: projects | Task 6 |
| Full CRUD: skills | Task 7 |
| Full CRUD: experiences | Task 7 |
| Full CRUD: educations | Task 7 |
| Full CRUD: news | Task 8 |
| Full CRUD: social-links | Task 8 |
| User profile + avatar upload | Task 5 |
| Public routes `/public/u/:username` | Task 9 |
| Security headers (helmet, cors, hpp, rate-limit) | Task 10 |
| passwordHash never in response | Task 4, 5, 9 (GetProfile strips it) |
| username validation regex | Task 4 (RegisterDto) |
| TypeScript strict mode | Task 1 (tsconfig) |
| Unit tests for use-cases | Tasks 4, 6 |
| Branch-per-feature strategy | Tasks 1, 4, 6, 9 |