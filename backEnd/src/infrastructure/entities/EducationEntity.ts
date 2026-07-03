import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('educations')
export class EducationEntity extends BaseContentEntity {
  @Column()
  school!: string;

  @Column({ nullable: true })
  degree!: string | null;

  @Column({ nullable: true })
  field!: string | null;

  @Column({ type: 'date', nullable: true })
  startDate!: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;
}