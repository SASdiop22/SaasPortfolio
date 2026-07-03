import { NewsEntity } from '@infrastructure/entities/NewsEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';

export interface INewsFinder {
  findByIdAndUser(id: number, userId: number): Promise<NewsEntity | null>;
}

export class GetNewsUseCase {
  constructor(private readonly repository: INewsFinder) {}

  async execute(id: number, userId: number): Promise<NewsEntity> {
    const news = await this.repository.findByIdAndUser(id, userId);
    if (!news) throw new NotFoundException('News not found');
    return news;
  }
}