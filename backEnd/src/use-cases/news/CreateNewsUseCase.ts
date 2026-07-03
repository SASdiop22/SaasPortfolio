import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { CreateNewsDtoType } from '@infrastructure/dto/news.dto';

export interface INewsCreator {
  createForUser(userId: number, data: Partial<NewsEntity>): Promise<NewsEntity>;
}

export class CreateNewsUseCase {
  constructor(private readonly repository: INewsCreator) {}

  execute(userId: number, data: CreateNewsDtoType): Promise<NewsEntity> {
    const payload: Partial<NewsEntity> = {
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    };
    return this.repository.createForUser(userId, payload);
  }
}