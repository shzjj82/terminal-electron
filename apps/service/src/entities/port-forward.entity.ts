import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Server } from './server.entity';

@Entity('port_forwards')
export class PortForward {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 服务端ID

  @Column({ nullable: true })
  localId?: string; // 前端本地ID

  @Column()
  name: string;

  @Column()
  type: 'dynamic' | 'local' | 'remote';

  @Column({ nullable: true })
  localHost?: string;

  @Column({ nullable: true })
  localPort?: number;

  @Column({ nullable: true })
  remoteHost?: string;

  @Column({ nullable: true })
  remotePort?: number;

  @Column({ nullable: true })
  bindAddress?: string;

  @Column({ nullable: true })
  bindPort?: number;

  @Column({ default: 'inactive' })
  status: 'active' | 'inactive';

  @Column({ nullable: true })
  lastUsed?: Date;

  @Column({ nullable: true })
  tunnelId?: string;

  @Column({ nullable: true })
  connectionId?: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Server, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'serverId' })
  server?: Server;

  @Column({ nullable: true })
  serverId?: string;

  // 手动输入服务器信息时的字段
  @Column({ nullable: true })
  serverAddress?: string; // 服务器地址

  @Column({ nullable: true })
  username?: string; // SSH 用户名

  @Column({ nullable: true })
  authType?: 'password' | 'key'; // 认证类型

  @Column({ nullable: true })
  password?: string; // 密码

  @Column({ nullable: true })
  keyPath?: string; // 密钥文件路径

  @Column({ nullable: true })
  keyContent?: string; // 密钥内容

  @Column({ nullable: true })
  passphrase?: string; // 密钥密码

  @Column({ nullable: true })
  namespace?: string; // 团队 namespace，个人数据为 null

  @Column({ default: 'personal' })
  dataType: 'personal' | 'team'; // 数据类型：个人或团队

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 