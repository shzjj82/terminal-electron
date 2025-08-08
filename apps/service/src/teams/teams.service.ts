import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import { TeamMember } from '../entities/team-member.entity';
import { CreateTeamDto, AddMemberDto, UpdateMemberRoleDto, JoinTeamDto } from './dto';
import { User } from '../entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
  ) {}

  // 生成8位随机邀请码
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 创建团队
  async createTeam(createTeamDto: CreateTeamDto, userId: string): Promise<Team> {
    const inviteCode = this.generateInviteCode();
    const team = this.teamRepo.create({
      name: createTeamDto.name,
      ownerId: userId,
      inviteCode: inviteCode,
    });
    const savedTeam = await this.teamRepo.save(team);
    
    // 创建者自动成为团队成员（owner角色）
    await this.memberRepo.save({
      teamId: savedTeam.id,
      userId: userId,
      role: 'owner',
    });
    
    return savedTeam;
  }

  // 通过邀请码加入团队
  async joinTeam(joinTeamDto: JoinTeamDto, userId: string): Promise<Team> {
    const team = await this.teamRepo.findOne({ 
      where: { inviteCode: joinTeamDto.inviteCode } 
    });
    
    if (!team) {
      throw new NotFoundException('邀请码无效');
    }
    
    // 检查用户是否已经是团队成员
    const existingMember = await this.memberRepo.findOne({
      where: { teamId: team.id, userId: userId },
    });
    
    if (existingMember) {
      throw new ForbiddenException('您已经是该团队成员');
    }
    
    // 添加用户为团队成员（默认角色为user）
    await this.memberRepo.save({
      teamId: team.id,
      userId: userId,
      role: 'user',
    });
    
    return team;
  }

  // 获取我的团队列表
  async getMyTeams(userId: string): Promise<Team[]> {
    const memberships = await this.memberRepo.find({
      where: { userId },
      relations: ['team'],
    });
    return memberships.map(membership => membership.team);
  }

  // 获取团队成员列表
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return this.memberRepo.find({
      where: { teamId },
      relations: ['user'],
    });
  }

  // 邀请成员（仅团队创建者可邀请）
  async inviteMember(teamId: string, addMemberDto: AddMemberDto, userId: string): Promise<TeamMember> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('团队不存在');
    }
    
    if (team.ownerId !== userId) {
      throw new ForbiddenException('只有团队创建者可以邀请成员');
    }
    
    // 检查用户是否已经是团队成员
    const existingMember = await this.memberRepo.findOne({
      where: { teamId, userId: addMemberDto.userId },
    });
    if (existingMember) {
      throw new ForbiddenException('用户已经是团队成员');
    }
    
    const member = this.memberRepo.create({
      teamId,
      userId: addMemberDto.userId,
      role: addMemberDto.role,
    });
    
    return this.memberRepo.save(member);
  }

  // 移除成员（仅团队创建者可移除）
  async removeMember(teamId: string, memberId: string, userId: string): Promise<void> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('团队不存在');
    }
    
    if (team.ownerId !== userId) {
      throw new ForbiddenException('只有团队创建者可以移除成员');
    }
    
    const member = await this.memberRepo.findOne({ where: { id: memberId, teamId } });
    if (!member) {
      throw new NotFoundException('成员不存在');
    }
    
    if (member.role === 'owner') {
      throw new ForbiddenException('不能移除团队创建者');
    }
    
    await this.memberRepo.remove(member);
  }

  // 更新成员身份（仅团队创建者可更新）
  async updateMemberRole(teamId: string, updateMemberRoleDto: UpdateMemberRoleDto, userId: string): Promise<TeamMember> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('团队不存在');
    }
    
    if (team.ownerId !== userId) {
      throw new ForbiddenException('只有团队创建者可以更新成员身份');
    }
    
    const member = await this.memberRepo.findOne({ where: { id: updateMemberRoleDto.memberId, teamId } });
    if (!member) {
      throw new NotFoundException('成员不存在');
    }
    
    if (member.role === 'owner') {
      throw new ForbiddenException('不能更改团队创建者的身份');
    }
    
    member.role = updateMemberRoleDto.role;
    return this.memberRepo.save(member);
  }

  // 解散团队（仅团队创建者可解散）
  async dissolveTeam(teamId: string, userId: string): Promise<void> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('团队不存在');
    }
    
    if (team.ownerId !== userId) {
      throw new ForbiddenException('只有团队创建者可以解散团队');
    }
    
    // 删除所有团队成员
    await this.memberRepo.delete({ teamId });
    
    // 删除团队
    await this.teamRepo.remove(team);
  }

  // 获取团队数据
  async getTeamData(teamId: string, userId: string) {
    // 检查用户是否为团队成员
    const membership = await this.memberRepo.findOne({
      where: { teamId, userId }
    });
    if (!membership) {
      throw new ForbiddenException('您不是该团队成员');
    }

    // 这里应该从团队数据存储中获取数据
    // 暂时返回空数据，后续需要实现团队数据存储
    return {
      servers: [],
      keys: [],
      portForwards: []
    };
  }
}
