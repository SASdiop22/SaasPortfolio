import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('skills')
export class SkillEntity extends BaseContentEntity {
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  level!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category!: string | null;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;
}