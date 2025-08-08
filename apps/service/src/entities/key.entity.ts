import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('keys')
export class Key {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 服务端ID

  @Column({ nullable: true })
  localId?: string; // 前端本地ID

  @Column()
  name: string;

  @Column()
  type: 'password' | 'rsa' | 'ed25519' | 'ecdsa' | 'keySelect';

  @Column({ type: 'text' })
  privateKey: string;

  @Column({ nullable: true })
  passphrase?: string;

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