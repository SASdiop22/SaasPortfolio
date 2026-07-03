import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export abstract class BaseRepository<T extends ObjectLiteral & { id: number; userId: number }> {
  constructor(protected readonly repo: Repository<T>) {}

  /** Wraps repo.save to avoid the T | T[] overload ambiguity. */
  private async saveOne(entity: T): Promise<T> {
    return (await this.repo.save(entity)) as unknown as T;
  }

  findAllByUser(userId: number): Promise<T[]> {
    return this.repo.find({ where: { userId } as any });
  }

  findByIdAndUser(id: number, userId: number): Promise<T | null> {
    return this.repo.findOne({ where: { id, userId } as any });
  }

  createForUser(userId: number, data: Partial<T>): Promise<T> {
    const entity = this.repo.create({ ...data, userId } as Parameters<Repository<T>['create']>[0]);
    return this.saveOne(entity);
  }

  async updateForUser(id: number, userId: number, data: Partial<T>): Promise<T> {
    const entity = await this.findByIdAndUser(id, userId);
    if (!entity) throw new NotFoundException();
    Object.assign(entity, data);
    return this.saveOne(entity);
  }

  async deleteForUser(id: number, userId: number): Promise<void> {
    const entity = await this.findByIdAndUser(id, userId);
    if (!entity) throw new NotFoundException();
    await this.repo.remove(entity);
  }
}