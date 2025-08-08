import { Controller, Post, Get, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TeamsService } from './teams.service';
import { CreateTeamDto, AddMemberDto, UpdateMemberRoleDto, JoinTeamDto } from './dto';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // 创建团队
  @Post('create')
  async createTeam(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamsService.createTeam(createTeamDto, req.user.id);
  }

  // 通过邀请码加入团队
  @Post('join')
  async joinTeam(@Body() joinTeamDto: JoinTeamDto, @Request() req) {
    return this.teamsService.joinTeam(joinTeamDto, req.user.id);
  }

  // 获取我的团队列表
  @Get('my')
  async getMyTeams(@Request() req) {
    return this.teamsService.getMyTeams(req.user.id);
  }

  // 获取团队成员列表
  @Get(':id/members')
  async getTeamMembers(@Param('id') teamId: string) {
    return this.teamsService.getTeamMembers(teamId);
  }

  // 邀请成员
  @Post(':id/invite')
  async inviteMember(
    @Param('id') teamId: string,
    @Body() addMemberDto: AddMemberDto,
    @Request() req,
  ) {
    return this.teamsService.inviteMember(teamId, addMemberDto, req.user.id);
  }

  // 移除成员
  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id') teamId: string,
    @Param('memberId') memberId: string,
    @Request() req,
  ) {
    return this.teamsService.removeMember(teamId, memberId, req.user.id);
  }

  // 更新成员身份
  @Patch(':id/members/:memberId/role')
  async updateMemberRole(
    @Param('id') teamId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
    @Request() req,
  ) {
    return this.teamsService.updateMemberRole(teamId, updateMemberRoleDto, req.user.id);
  }

  // 解散团队
  @Delete(':id/dissolve')
  async dissolveTeam(@Param('id') teamId: string, @Request() req) {
    return this.teamsService.dissolveTeam(teamId, req.user.id);
  }

  // 获取团队数据
  @Get(':id/data')
  async getTeamData(@Param('id') teamId: string, @Request() req) {
    return this.teamsService.getTeamData(teamId, req.user.id);
  }
}
