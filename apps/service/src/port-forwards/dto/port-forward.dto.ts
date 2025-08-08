import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreatePortForwardDto {
  @IsOptional()
  @IsString()
  localId?: string;

  @IsString()
  name: string;

  @IsEnum(['dynamic', 'local', 'remote'])
  type: 'dynamic' | 'local' | 'remote';

  @IsOptional()
  @IsString()
  localHost?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(65535)
  localPort?: number;

  @IsOptional()
  @IsString()
  remoteHost?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(65535)
  remotePort?: number;

  @IsOptional()
  @IsString()
  bindAddress?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(65535)
  bindPort?: number;

  @IsOptional()
  @IsString()
  serverId?: string;

  // 手动输入服务器信息时的字段
  @IsOptional()
  @IsString()
  serverAddress?: string; // 服务器地址

  @IsOptional()
  @IsString()
  username?: string; // SSH 用户名

  @IsOptional()
  @IsEnum(['password', 'key'])
  authType?: 'password' | 'key'; // 认证类型

  @IsOptional()
  @IsString()
  password?: string; // 密码

  @IsOptional()
  @IsString()
  keyPath?: string; // 密钥文件路径

  @IsOptional()
  @IsString()
  keyContent?: string; // 密钥内容

  @IsOptional()
  @IsString()
  passphrase?: string; // 密钥密码
}

export class UpdatePortForwardDto extends CreatePortForwardDto {
  @IsOptional()
  @IsString()
  id?: string;
} 