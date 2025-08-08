import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortForwardsController } from './port-forwards.controller';
import { PortForwardsService } from './port-forwards.service';
import { PortForward } from '../entities/port-forward.entity';
import { Server } from '../entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortForward, Server])],
  controllers: [PortForwardsController],
  providers: [PortForwardsService],
  exports: [PortForwardsService],
})
export class PortForwardsModule {} 