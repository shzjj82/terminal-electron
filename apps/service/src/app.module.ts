import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ServersModule } from './servers/servers.module';
import { KeysModule } from './keys/keys.module';
import { PortForwardsModule } from './port-forwards/port-forwards.module';
import { TeamsModule } from './teams/teams.module';
import { DataModule } from './data/data.module';
import { User } from './entities/user.entity';
import { Server } from './entities/server.entity';
import { Key } from './entities/key.entity';
import { PortForward } from './entities/port-forward.entity';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/app.db',
      entities: [User, Server, Key, PortForward, Team, TeamMember],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    ServersModule,
    KeysModule,
    PortForwardsModule,
    TeamsModule,
    DataModule,
  ],
})
export class AppModule {}
