import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto, UpdateServerDto } from './dto/server.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('servers')
@UseGuards(JwtAuthGuard)
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  create(@Body() createServerDto: CreateServerDto, @Request() req) {
    const namespace = req.query.namespace as string;
    return this.serversService.create(createServerDto, req.user.id, namespace);
  }

  @Get()
  findAll(@Request() req) {
    const namespace = req.query.namespace as string;
    return this.serversService.findAll(req.user.id, namespace);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.serversService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServerDto: UpdateServerDto,
    @Request() req,
  ) {
    return this.serversService.update(id, updateServerDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.serversService.remove(id, req.user.id);
  }

  @Post('sync')
  syncFromLocal(@Body() servers: CreateServerDto[], @Request() req) {
    return this.serversService.syncFromLocal(servers, req.user.id);
  }

  // 获取个人数据
  @Get('personal/data')
  getPersonalData(@Request() req) {
    return this.serversService.getPersonalData(req.user.id);
  }
} 