import { Repository } from 'typeorm';
import { AppDataSource } from '@infrastructure/database/data-source';
import { ThemeEntity } from '@infrastructure/entities/ThemeEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export class ThemeRepository {
  private readonly repo: Repository<ThemeEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(ThemeEntity);
  }

  findAllByUser(userId: number): Promise<ThemeEntity[]> {
    return this.repo.find({ where: { userId } });
  }

  findByIdAndUser(id: number, userId: number): Promise<ThemeEntity | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  async create(data: Partial<ThemeEntity>): Promise<ThemeEntity> {
    const entity = this.repo.create(data as ThemeEntity);
    return (await this.repo.save(entity)) as unknown as ThemeEntity;
  }

  async save(entity: ThemeEntity): Promise<ThemeEntity> {
    return (await this.repo.save(entity)) as unknown as ThemeEntity;
  }

  async delete(id: number, userId: number): Promise<void> {
    const entity = await this.findByIdAndUser(id, userId);
    if (!entity) throw new NotFoundException();
    await this.repo.remove(entity);
  }

  findActiveByUser(userId: number): Promise<ThemeEntity | null> {
    return this.repo.findOne({ where: { userId, isActive: true } });
  }

  async setActive(id: number, userId: number): Promise<ThemeEntity> {
    await this.repo.update({ userId } as any, { isActive: false });
    const entity = await this.findByIdAndUser(id, userId);
    if (!entity) throw new NotFoundException();
    entity.isActive = true;
    return (await this.repo.save(entity)) as unknown as ThemeEntity;
  }
}
