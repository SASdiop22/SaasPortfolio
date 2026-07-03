import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('themes')
export class ThemeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  name!: string;

  @Column({ length: 7, default: '#1d4ed8' })
  primaryColor!: string;

  @Column({ length: 7, default: '#0a1128' })
  secondaryColor!: string;

  @Column({ length: 7, default: '#05091a' })
  backgroundColor!: string;

  @Column({ length: 7, default: '#ffffff' })
  textColor!: string;

  @Column({ length: 7, default: '#3b82f6' })
  accentColor!: string;

  @Column({ type: 'varchar', nullable: true })
  fontFamily!: string | null;

  @Column({ type: 'varchar', nullable: true })
  layout!: string | null;

  @Column({ default: false })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}