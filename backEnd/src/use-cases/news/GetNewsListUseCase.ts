import { NewsEntity } from '@infrastructure/entities/NewsEntity';

export interface INewsLister {
  findAllByUser(userId: number): Promise<NewsEntity[]>;
}

export class GetNewsListUseCase {
  constructor(private readonly repository: INewsLister) {}

  execute(userId: number): Promise<NewsEntity[]> {
    return this.repository.findAllByUser(userId);
  }
}