import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 15, unique: true })
  login_id: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  about_me: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: false })
  comment_alert: boolean;

  @Column({ default: false })
  update_alert: boolean;
}
