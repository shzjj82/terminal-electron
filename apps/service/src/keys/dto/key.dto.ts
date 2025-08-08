import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateKeyDto {
  @IsOptional()
  @IsString()
  localId?: string;

  @IsString()
  name: string;

  @IsEnum(['password', 'rsa', 'ed25519', 'ecdsa', 'keySelect'])
  type: 'password' | 'rsa' | 'ed25519' | 'ecdsa' | 'keySelect';

  @IsString()
  privateKey: string;

  @IsOptional()
  @IsString()
  passphrase?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateKeyDto extends CreateKeyDto {
  @IsOptional()
  @IsString()
  id?: string;
} 