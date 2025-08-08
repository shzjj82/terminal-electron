import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 服务端ID

  @Column({ nullable: true })
  localId?: string; // 前端本地ID

  @Column()
  name: string;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  keyId?: string;

  @Column({ default: 'password' })
  authType: 'password' | 'key' | 'keyContent' | 'keySelect';

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  namespace?: string; // 团队 namespace，个人数据为 null

  @Column({ default: 'personal' })
  dataType: 'personal' | 'team'; // 数据类型：个人或团队

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 