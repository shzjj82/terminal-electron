import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreateServerDto {
  @IsOptional()
  @IsString()
  localId?: string;

  @IsString()
  name: string;

  @IsString()
  host: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  port: number;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  keyId?: string;

  @IsEnum(['password', 'key', 'keyContent', 'keySelect'])
  authType: 'password' | 'key' | 'keyContent' | 'keySelect';

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateServerDto extends CreateServerDto {
  @IsOptional()
  @IsString()
  id?: string;
} 