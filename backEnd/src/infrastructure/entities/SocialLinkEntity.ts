import { Entity, Column } from 'typeorm';
import { BaseContentEntity } from './BaseContentEntity';

@Entity('social_links')
export class SocialLinkEntity extends BaseContentEntity {
  @Column()
  platform!: string;

  @Column()
  url!: string;
}