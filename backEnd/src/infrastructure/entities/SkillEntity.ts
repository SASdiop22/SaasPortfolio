import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('skills')
export class SkillEntity extends BaseContentEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  category!: string | null;

  @Column({ nullable: true })
  level!: string | null;
}
