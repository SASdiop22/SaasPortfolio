import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 30 })
  username!: string;

  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ length: 100, nullable: true })
  fullName!: string | null;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ nullable: true })
  avatarUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}