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
    return this.repo.save(entity) as Promise<UserEntity>;
  }

  save(entity: UserEntity): Promise<UserEntity> {
    return this.repo.save(entity) as Promise<UserEntity>;
  }
}