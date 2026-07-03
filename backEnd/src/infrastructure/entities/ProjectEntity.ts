import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('projects')
export class ProjectEntity extends BaseContentEntity {
  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'json', nullable: true, default: [] })
  techStack!: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  liveUrl!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  githubUrl!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;
}