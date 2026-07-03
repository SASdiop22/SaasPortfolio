import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { UpdateNewsDtoType } from '@infrastructure/dto/news.dto';

export interface INewsUpdater {
  updateForUser(id: number, userId: number, data: Partial<NewsEntity>): Promise<NewsEntity>;
}

export class UpdateNewsUseCase {
  constructor(private readonly repository: INewsUpdater) {}

  execute(id: number, userId: number, data: UpdateNewsDtoType): Promise<NewsEntity> {
    const payload: Partial<NewsEntity> = {
      ...data,
      publishedAt: data.publishedAt !== undefined
        ? (data.publishedAt ? new Date(data.publishedAt) : null)
        : undefined,
    };
    return this.repository.updateForUser(id, userId, payload);
  }
}