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
import { PortForwardsService } from './port-forwards.service';
import { CreatePortForwardDto, UpdatePortForwardDto } from './dto/port-forward.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('port-forwards')
@UseGuards(JwtAuthGuard)
export class PortForwardsController {
  constructor(private readonly portForwardsService: PortForwardsService) {}

  @Post()
  create(@Body() createPortForwardDto: CreatePortForwardDto, @Request() req) {
    const namespace = req.query.namespace as string;
    return this.portForwardsService.create(createPortForwardDto, req.user.id, namespace);
  }

  @Get()
  findAll(@Request() req) {
    const namespace = req.query.namespace as string;
    return this.portForwardsService.findAll(req.user.id, namespace);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.portForwardsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortForwardDto: UpdatePortForwardDto,
    @Request() req,
  ) {
    return this.portForwardsService.update(id, updatePortForwardDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.portForwardsService.remove(id, req.user.id);
  }

  @Post('sync')
  syncFromLocal(@Body() portForwards: CreatePortForwardDto[], @Request() req) {
    return this.portForwardsService.syncFromLocal(portForwards, req.user.id);
  }
} 