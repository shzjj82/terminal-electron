import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from './team.entity';
import { User } from './user.entity';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @Column()
  userId: string;

  @Column({ type: 'varchar' })
  role: 'owner' | 'developer' | 'user';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Team, team => team.id)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}