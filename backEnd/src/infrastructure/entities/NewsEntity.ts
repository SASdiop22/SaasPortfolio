import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('news')
export class NewsEntity extends BaseContentEntity {
  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt!: Date | null;
}