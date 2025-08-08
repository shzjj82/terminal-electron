import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Key } from '../entities/key.entity';
import { CreateKeyDto, UpdateKeyDto } from './dto/key.dto';

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(Key)
    private keyRepository: Repository<Key>,
  ) {}

  async create(createKeyDto: CreateKeyDto, userId: string, namespace?: string) {
    const key = this.keyRepository.create({
      ...createKeyDto,
      userId,
      namespace,
      dataType: namespace ? 'team' : 'personal', // 根据 namespace 设置类型
    });

    return this.keyRepository.save(key);
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
    
    return this.keyRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    // 首先尝试查找个人数据
    let key = await this.keyRepository.findOne({
      where: { id, userId, dataType: 'personal', isActive: true },
    });

    // 如果没找到个人数据，尝试查找团队数据
    if (!key) {
      // 查找用户所属的团队
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.keyRepository.manager.getRepository(TeamMember);
      
      const userTeams = await teamMemberRepository.find({
        where: { userId }
      });

      if (userTeams.length > 0) {
        const teamIds = userTeams.map(tm => tm.teamId);
        
        // 在用户所属的团队中查找密钥
        key = await this.keyRepository.findOne({
          where: { 
            id, 
            namespace: In(teamIds),
            dataType: 'team', 
            isActive: true 
          },
        });
      }
    }

    if (!key) {
      throw new NotFoundException('Key not found');
    }

    return key;
  }

  async findByLocalId(localId: string, userId: string) {
    // 首先尝试查找个人数据
    let key = await this.keyRepository.findOne({
      where: { localId, userId, dataType: 'personal', isActive: true },
    });

    // 如果没找到个人数据，尝试查找团队数据
    if (!key) {
      // 查找用户所属的团队
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.keyRepository.manager.getRepository(TeamMember);
      
      const userTeams = await teamMemberRepository.find({
        where: { userId }
      });

      if (userTeams.length > 0) {
        const teamIds = userTeams.map(tm => tm.teamId);
        
        // 在用户所属的团队中查找密钥
        key = await this.keyRepository.findOne({
          where: { 
            localId, 
            namespace: In(teamIds),
            dataType: 'team', 
            isActive: true 
          },
        });
      }
    }

    return key;
  }

  async update(id: string, updateKeyDto: UpdateKeyDto, userId: string) {
    const key = await this.findOne(id, userId);
    
    // 检查用户是否有编辑权限
    if (key.dataType === 'team') {
      // 对于团队数据，检查用户角色
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.keyRepository.manager.getRepository(TeamMember);
      
      const membership = await teamMemberRepository.findOne({
        where: { teamId: key.namespace, userId }
      });

      if (!membership) {
        throw new ForbiddenException('您不是该团队成员');
      }

      // 只有管理者和开发者可以编辑团队数据
      if (membership.role === 'user') {
        throw new ForbiddenException('使用者无权编辑团队数据');
      }
    }
    
    Object.assign(key, updateKeyDto);
    return this.keyRepository.save(key);
  }

  async remove(id: string, userId: string) {
    const key = await this.findOne(id, userId);
    
    // 检查用户是否有删除权限
    if (key.dataType === 'team') {
      // 对于团队数据，检查用户角色
      const { TeamMember } = await import('../entities/team-member.entity');
      const teamMemberRepository = this.keyRepository.manager.getRepository(TeamMember);
      
      const membership = await teamMemberRepository.findOne({
        where: { teamId: key.namespace, userId }
      });

      if (!membership) {
        throw new ForbiddenException('您不是该团队成员');
      }

      // 只有管理者和开发者可以删除团队数据
      if (membership.role === 'user') {
        throw new ForbiddenException('使用者无权删除团队数据');
      }
    }
    
    key.isActive = false;
    return this.keyRepository.save(key);
  }

  // 批量同步本地数据到服务端
  async syncFromLocal(keys: CreateKeyDto[], userId: string) {
    const results = [];

    for (const keyData of keys) {
      const { localId, ...keyInfo } = keyData;
      
      // 检查是否已存在相同的localId
      const existingKey = await this.findByLocalId(localId, userId);
      
      if (existingKey) {
        // 更新现有记录
        Object.assign(existingKey, keyInfo);
        const updated = await this.keyRepository.save(existingKey);
        results.push(updated);
      } else {
        // 创建新记录
        const newKey = await this.create(keyData, userId);
        results.push(newKey);
      }
    }

    return results;
  }
} 