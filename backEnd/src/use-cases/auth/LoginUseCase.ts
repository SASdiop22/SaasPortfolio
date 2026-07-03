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