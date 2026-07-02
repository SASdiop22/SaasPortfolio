import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('experiences')
export class ExperienceEntity extends BaseContentEntity {
  @Column()
  company!: string;

  @Column()
  role!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'date', nullable: true })
  startDate!: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;
}