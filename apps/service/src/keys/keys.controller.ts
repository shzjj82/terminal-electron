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
import { KeysService } from './keys.service';
import { CreateKeyDto, UpdateKeyDto } from './dto/key.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('keys')
@UseGuards(JwtAuthGuard)
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  create(@Body() createKeyDto: CreateKeyDto, @Request() req) {
    const namespace = req.query.namespace as string;
    return this.keysService.create(createKeyDto, req.user.id, namespace);
  }

  @Get()
  findAll(@Request() req) {
    const namespace = req.query.namespace as string;
    return this.keysService.findAll(req.user.id, namespace);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.keysService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKeyDto: UpdateKeyDto,
    @Request() req,
  ) {
    return this.keysService.update(id, updateKeyDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.keysService.remove(id, req.user.id);
  }

  @Post('sync')
  syncFromLocal(@Body() keys: CreateKeyDto[], @Request() req) {
    return this.keysService.syncFromLocal(keys, req.user.id);
  }
} 