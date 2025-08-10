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
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '../../env/development.env'),
        join(process.cwd(), '../../env/production.env'),
      ],
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // 数据库配置
        const dbConfig = {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', '127.0.0.1'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_DATABASE', 'terminal_db'),
          entities: [User, Server, Key, PortForward, Team, TeamMember],
          synchronize: true,
          logging: configService.get('NODE_ENV') === 'development',
          ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        };

        // 在开发环境下，尝试创建数据库
        if (configService.get('NODE_ENV') === 'development') {
          try {
            await createDatabaseIfNotExists(dbConfig);
          } catch (error) {
            console.warn('⚠️  Failed to create database automatically:', error.message);
            console.log('💡  Please ensure PostgreSQL is running and accessible.');
            console.log('💡  You can also create the database manually:');
            console.log(`   psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d postgres -c "CREATE DATABASE ${dbConfig.database};"`);
          }
        }

        return dbConfig;
      },
      inject: [ConfigService],
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

// 创建数据库的函数
async function createDatabaseIfNotExists(dbConfig: any): Promise<void> {
  const { Client } = require('pg');
  
  // 连接到默认的 postgres 数据库
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: 'postgres', // 连接到默认数据库
    connectionTimeoutMillis: 5000, // 5秒连接超时
  });

  try {
    console.log(`🔌 Connecting to PostgreSQL at ${dbConfig.host}:${dbConfig.port}...`);
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully');
    
    // 检查目标数据库是否存在
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbConfig.database]
    );

    if (result.rows.length === 0) {
      console.log(`📦 Creating database: ${dbConfig.database}`);
      await client.query(`CREATE DATABASE "${dbConfig.database}"`);
      console.log(`✅ Database ${dbConfig.database} created successfully`);
    } else {
      console.log(`✅ Database ${dbConfig.database} already exists`);
    }
  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    throw error;
  } finally {
    try {
      await client.end();
    } catch (error) {
      // 忽略关闭连接时的错误
    }
  }
}
