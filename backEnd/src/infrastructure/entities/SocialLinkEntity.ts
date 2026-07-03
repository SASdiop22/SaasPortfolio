import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('social_links')
export class SocialLinkEntity extends BaseContentEntity {
  @Column({ type: 'varchar', length: 100 })
  platform!: string;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;
}