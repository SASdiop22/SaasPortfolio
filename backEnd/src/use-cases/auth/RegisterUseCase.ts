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
    });

    const payload: JwtPayload = { id: user.id, username: user.username };
    return { token: signJwt(payload), user: payload };
  }
}