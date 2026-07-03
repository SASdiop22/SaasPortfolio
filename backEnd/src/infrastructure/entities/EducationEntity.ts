import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('educations')
export class EducationEntity extends BaseContentEntity {
  @Column({ type: 'varchar', length: 255 })
  institution!: string;

  @Column({ type: 'varchar', length: 255 })
  degree!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  field!: string | null;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;
}