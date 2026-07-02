import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('projects')
export class ProjectEntity extends BaseContentEntity {
  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column('text', { array: true, default: [] })
  technologies!: string[];

  @Column({ type: 'date', nullable: true })
  startDate!: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ nullable: true })
  url!: string | null;

  @Column({ nullable: true })
  imageUrl!: string | null;
}