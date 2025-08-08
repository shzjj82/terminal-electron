import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from '../entities/server.entity';
import { Key } from '../entities/key.entity';
import { PortForward } from '../entities/port-forward.entity';
import { TeamMember } from '../entities/team-member.entity';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(Key)
    private keyRepository: Repository<Key>,
    @InjectRepository(PortForward)
    private portForwardRepository: Repository<PortForward>,
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  // 获取个人数据
  async getPersonalData(userId: string) {
    const [servers, keys, portForwards] = await Promise.all([
      this.serverRepository.find({
        where: { userId, dataType: 'personal', isActive: true },
        order: { createdAt: 'DESC' },
      }),
      this.keyRepository.find({
        where: { userId, dataType: 'personal', isActive: true },
        order: { createdAt: 'DESC' },
      }),
      this.portForwardRepository.find({
        where: { userId, dataType: 'personal', isActive: true },
        order: { createdAt: 'DESC' },
      }),
    ]);

    return {
      servers,
      keys,
      portForwards,
    };
  }

  // 获取团队数据
  async getTeamData(teamId: string, userId: string) {
    // 检查用户是否为团队成员
    const membership = await this.teamMemberRepository.findOne({
      where: { teamId, userId }
    });
    if (!membership) {
      throw new ForbiddenException('您不是该团队成员');
    }

    // 获取团队所有成员的数据（使用团队 namespace）
    const [servers, keys, portForwards] = await Promise.all([
      this.serverRepository.find({
        where: { namespace: teamId, dataType: 'team', isActive: true },
        order: { createdAt: 'DESC' },
      }),
      this.keyRepository.find({
        where: { namespace: teamId, dataType: 'team', isActive: true },
        order: { createdAt: 'DESC' },
      }),
      this.portForwardRepository.find({
        where: { namespace: teamId, dataType: 'team', isActive: true },
        order: { createdAt: 'DESC' },
      }),
    ]);

    return {
      servers,
      keys,
      portForwards,
    };
  }
} 