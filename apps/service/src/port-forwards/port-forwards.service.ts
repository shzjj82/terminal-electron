import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PortForward } from '../entities/port-forward.entity';
import { Server } from '../entities/server.entity';
import { CreatePortForwardDto, UpdatePortForwardDto } from './dto/port-forward.dto';

@Injectable()
export class PortForwardsService {
  constructor(
    @InjectRepository(PortForward)
    private portForwardRepository: Repository<PortForward>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
  ) {}

  async create(createPortForwardDto: CreatePortForwardDto, userId: string, namespace?: string) {
    // 保存原始的 serverId（前端本地ID）
    const originalServerId = createPortForwardDto.serverId;
    
    // 验证 serverId 是否存在（如果提供了的话）
    if (createPortForwardDto.serverId) {
      // 首先尝试通过 localId 查找服务器
      let server = await this.serverRepository.findOne({
        where: { localId: createPortForwardDto.serverId, userId, isActive: true }
      });
      
      // 如果通过 localId 没找到，再尝试通过 id 查找
      if (!server) {
        server = await this.serverRepository.findOne({
          where: { id: createPortForwardDto.serverId, userId, isActive: true }
        });
      }
      
      if (!server) {
        throw new BadRequestException(`Server with id ${createPortForwardDto.serverId} not found`);
      }
      
      // 使用服务器的服务端ID作为外键
      createPortForwardDto.serverId = server.id;
    }

    const portForward = this.portForwardRepository.create({
      ...createPortForwardDto,
      userId,
      namespace,
      dataType: namespace ? 'team' : 'personal', // 根据 namespace 设置类型
    });

    const savedPortForward = await this.portForwardRepository.save(portForward);
    
    // 返回时包含原始的 serverId，供前端使用
    return {
      ...savedPortForward,
      serverId: originalServerId // 保留前端发送的原始 serverId
    };
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
    
    const portForwards = await this.portForwardRepository.find({
      where: whereCondition,
      relations: ['server'],
      order: { createdAt: 'DESC' },
    });

    // 为每个端口转发添加 serverId（使用服务器的 localId）
    return portForwards.map(portForward => ({
      ...portForward,
      serverId: portForward.server?.localId || portForward.serverId
    }));
  }

  async findOne(id: string, userId: string) {
    // 首先尝试查找个人数据
    let portForward = await this.portForwardRepository.findOne({
      where: { id, userId, dataType: 'personal', isActive: true },
      relations: ['server'],
    });

    // 如果没找到个人数据，尝试查找团队数据
    if (!portForward) {
      // 查找用户所属的团队
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.portForwardRepository.manager.getRepository(TeamMember);
      
      const userTeams = await teamMemberRepository.find({
        where: { userId }
      });

      if (userTeams.length > 0) {
        const teamIds = userTeams.map(tm => tm.teamId);
        
        // 在用户所属的团队中查找端口转发
        portForward = await this.portForwardRepository.findOne({
          where: { 
            id, 
            namespace: In(teamIds),
            dataType: 'team', 
            isActive: true 
          },
          relations: ['server'],
        });
      }
    }

    if (!portForward) {
      throw new NotFoundException('Port forward not found');
    }

    // 添加 serverId（使用服务器的 localId）
    return {
      ...portForward,
      serverId: portForward.server?.localId || portForward.serverId
    };
  }

  async findByLocalId(localId: string, userId: string) {
    // 首先尝试查找个人数据
    let portForward = await this.portForwardRepository.findOne({
      where: { localId, userId, dataType: 'personal', isActive: true },
      relations: ['server'],
    });

    // 如果没找到个人数据，尝试查找团队数据
    if (!portForward) {
      // 查找用户所属的团队
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.portForwardRepository.manager.getRepository(TeamMember);
      
      const userTeams = await teamMemberRepository.find({
        where: { userId }
      });

      if (userTeams.length > 0) {
        const teamIds = userTeams.map(tm => tm.teamId);
        
        // 在用户所属的团队中查找端口转发
        portForward = await this.portForwardRepository.findOne({
          where: { 
            localId, 
            namespace: In(teamIds),
            dataType: 'team', 
            isActive: true 
          },
          relations: ['server'],
        });
      }
    }

    return portForward;
  }

  async update(id: string, updatePortForwardDto: UpdatePortForwardDto, userId: string) {
    const portForward = await this.findOne(id, userId);

    // 检查用户是否有编辑权限
    if (portForward.dataType === 'team') {
      // 对于团队数据，检查用户角色
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.portForwardRepository.manager.getRepository(TeamMember);
      
      const membership = await teamMemberRepository.findOne({
        where: { teamId: portForward.namespace, userId }
      });

      if (!membership) {
        throw new ForbiddenException('您不是该团队成员');
      }

      // 只有管理者和开发者可以编辑团队数据
      if (membership.role === 'user') {
        throw new ForbiddenException('使用者无权编辑团队数据');
      }
    }

    // 保存原始的 serverId（前端本地ID）
    const originalServerId = updatePortForwardDto.serverId;
    
    // 验证 serverId 是否存在（如果提供了的话）
    if (updatePortForwardDto.serverId) {
      // 首先尝试通过 localId 查找服务器
      let server = await this.serverRepository.findOne({
        where: { localId: updatePortForwardDto.serverId, userId, isActive: true }
      });
      
      // 如果通过 localId 没找到，再尝试通过 id 查找
      if (!server) {
        server = await this.serverRepository.findOne({
          where: { id: updatePortForwardDto.serverId, userId, isActive: true }
        });
      }
      
      if (!server) {
        throw new BadRequestException(`Server with id ${updatePortForwardDto.serverId} not found`);
      }
      
      // 使用服务器的服务端ID作为外键
      updatePortForwardDto.serverId = server.id;
    }
    
    Object.assign(portForward, updatePortForwardDto);
    const savedPortForward = await this.portForwardRepository.save(portForward);
    
    // 返回时包含原始的 serverId，供前端使用
    return {
      ...savedPortForward,
      serverId: originalServerId // 保留前端发送的原始 serverId
    };
  }

  async remove(id: string, userId: string) {
    const portForward = await this.findOne(id, userId);
    
    // 检查用户是否有删除权限
    if (portForward.dataType === 'team') {
      // 对于团队数据，检查用户角色
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.portForwardRepository.manager.getRepository(TeamMember);
      
      const membership = await teamMemberRepository.findOne({
        where: { teamId: portForward.namespace, userId }
      });

      if (!membership) {
        throw new ForbiddenException('您不是该团队成员');
      }

      // 只有管理者和开发者可以删除团队数据
      if (membership.role === 'user') {
        throw new ForbiddenException('使用者无权删除团队数据');
      }
    }
    
    portForward.isActive = false;
    return this.portForwardRepository.save(portForward);
  }

  // 批量同步本地数据到服务端
  async syncFromLocal(portForwards: CreatePortForwardDto[], userId: string) {
    const results = [];

    for (const portForwardData of portForwards) {
      try {
        const { localId, ...portForwardInfo } = portForwardData;
        
        // 检查是否已存在相同的localId
        const existingPortForward = await this.findByLocalId(localId, userId);
        
        if (existingPortForward) {
          // 更新现有记录
          // 保存原始的 serverId（前端本地ID）
          const originalServerId = portForwardInfo.serverId;
          
          // 验证 serverId 是否存在（如果提供了的话）
          if (portForwardInfo.serverId) {
            // 首先尝试通过 localId 查找服务器
            let server = await this.serverRepository.findOne({
              where: { localId: portForwardInfo.serverId, userId, isActive: true }
            });
            
            // 如果通过 localId 没找到，再尝试通过 id 查找
            if (!server) {
              server = await this.serverRepository.findOne({
                where: { id: portForwardInfo.serverId, userId, isActive: true }
              });
            }
            
            if (!server) {
              console.warn(`Server with id ${portForwardInfo.serverId} not found, skipping port forward: ${portForwardData.name}`);
              continue; // 跳过这个记录
            }
            
            // 使用服务器的服务端ID作为外键
            portForwardInfo.serverId = server.id;
          }
          
          Object.assign(existingPortForward, portForwardInfo);
          const updated = await this.portForwardRepository.save(existingPortForward);
          
          // 返回时包含原始的 serverId，供前端使用
          results.push({
            ...updated,
            serverId: originalServerId // 保留前端发送的原始 serverId
          });
        } else {
          // 创建新记录
          const newPortForward = await this.create(portForwardData, userId);
          results.push(newPortForward);
        }
      } catch (error) {
        console.error(`Error syncing port forward ${portForwardData.name}:`, error.message);
        // 继续处理其他记录，不中断整个同步过程
      }
    }

    return results;
  }
} 