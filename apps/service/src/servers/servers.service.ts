import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Server } from '../entities/server.entity';
import { CreateServerDto, UpdateServerDto } from './dto/server.dto';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
  ) {}

  async create(createServerDto: CreateServerDto, userId: string, namespace?: string) {
    const server = this.serverRepository.create({
      ...createServerDto,
      userId,
      namespace,
                  dataType: namespace ? 'team' : 'personal', // 根据 namespace 设置类型
    });

    return this.serverRepository.save(server);
  }

  async findAll(userId: string, namespace?: string) {
    let whereCondition;
    
    if (namespace) {
      // 团队模式：查询指定团队的数据
      whereCondition = { namespace, dataType: 'team', isActive: true };
    } else {
      // 个人模式：查询个人数据，排除团队数据
      whereCondition = { userId, dataType: 'personal', isActive: true };
    }
    
    return this.serverRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    // 首先尝试查找个人数据
    let server = await this.serverRepository.findOne({
      where: { id, userId, dataType: 'personal', isActive: true },
    });

    // 如果没找到个人数据，尝试查找团队数据
    if (!server) {
      // 查找用户所属的团队
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.serverRepository.manager.getRepository(TeamMember);
      
      const userTeams = await teamMemberRepository.find({
        where: { userId }
      });

      if (userTeams.length > 0) {
        const teamIds = userTeams.map(tm => tm.teamId);
        
        // 在用户所属的团队中查找服务器
        server = await this.serverRepository.findOne({
          where: { 
            id, 
            namespace: In(teamIds),
            dataType: 'team', 
            isActive: true 
          },
        });
      }
    }

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    return server;
  }

  async findByLocalId(localId: string, userId: string) {
    // 首先尝试查找个人数据
    let server = await this.serverRepository.findOne({
      where: { localId, userId, dataType: 'personal', isActive: true },
    });

    // 如果没找到个人数据，尝试查找团队数据
    if (!server) {
      // 查找用户所属的团队
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.serverRepository.manager.getRepository(TeamMember);
      
      const userTeams = await teamMemberRepository.find({
        where: { userId }
      });

      if (userTeams.length > 0) {
        const teamIds = userTeams.map(tm => tm.teamId);
        
        // 在用户所属的团队中查找服务器
        server = await this.serverRepository.findOne({
          where: { 
            localId, 
            namespace: In(teamIds),
            dataType: 'team', 
            isActive: true 
          },
        });
      }
    }

    return server;
  }

  async update(id: string, updateServerDto: UpdateServerDto, userId: string) {
    const server = await this.findOne(id, userId);

    // 检查用户是否有编辑权限
    if (server.dataType === 'team') {
      // 对于团队数据，检查用户角色
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.serverRepository.manager.getRepository(TeamMember);
      
      const membership = await teamMemberRepository.findOne({
        where: { teamId: server.namespace, userId }
      });

      if (!membership) {
        throw new ForbiddenException('您不是该团队成员');
      }

      // 只有管理者和开发者可以编辑团队数据
      if (membership.role === 'user') {
        throw new ForbiddenException('使用者无权编辑团队数据');
      }
    }

    Object.assign(server, updateServerDto);
    return this.serverRepository.save(server);
  }

  async remove(id: string, userId: string) {
    const server = await this.findOne(id, userId);
    
    // 检查用户是否有删除权限
    if (server.dataType === 'team') {
      // 对于团队数据，检查用户角色
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.serverRepository.manager.getRepository(TeamMember);
      
      const membership = await teamMemberRepository.findOne({
        where: { teamId: server.namespace, userId }
      });

      if (!membership) {
        throw new ForbiddenException('您不是该团队成员');
      }

      // 只有管理者和开发者可以删除团队数据
      if (membership.role === 'user') {
        throw new ForbiddenException('使用者无权删除团队数据');
      }
    }
    
    server.isActive = false;
    return this.serverRepository.save(server);
  }

  // 批量同步本地数据到服务端
  async syncFromLocal(servers: CreateServerDto[], userId: string) {
    const results = [];

    for (const serverData of servers) {
      const { localId, ...serverInfo } = serverData;
      
      // 检查是否已存在相同的localId
      const existingServer = await this.findByLocalId(localId, userId);
      
      if (existingServer) {
        // 更新现有记录
        Object.assign(existingServer, serverInfo);
        const updated = await this.serverRepository.save(existingServer);
        results.push(updated);
      } else {
        // 创建新记录
        const newServer = await this.create(serverData, userId);
        results.push(newServer);
      }
    }

    return results;
  }

  // 获取个人数据
  async getPersonalData(userId: string) {
    return this.serverRepository.find({
      where: { userId, dataType: 'personal', isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
} 