import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { Server } from '../entities/server.entity';
import { Key } from '../entities/key.entity';
import { PortForward } from '../entities/port-forward.entity';
import { TeamMember } from '../entities/team-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server, Key, PortForward, TeamMember])],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {} 