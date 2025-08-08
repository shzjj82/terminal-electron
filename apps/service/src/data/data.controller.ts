import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DataService } from './data.service';

@Controller('data')
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  // 获取个人数据
  @Get('personal')
  async getPersonalData(@Request() req) {
    return this.dataService.getPersonalData(req.user.id);
  }

  // 获取团队数据
  @Get('teams/:teamId')
  async getTeamData(@Param('teamId') teamId: string, @Request() req) {
    return this.dataService.getTeamData(teamId, req.user.id);
  }
} 