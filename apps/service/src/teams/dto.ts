import { IsString, IsNotEmpty, IsUUID, IsIn } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AddMemberDto {
  @IsUUID()
  userId: string;

  @IsIn(['developer', 'user'])
  role: 'developer' | 'user';
}

export class UpdateMemberRoleDto {
  @IsUUID()
  memberId: string;

  @IsIn(['developer', 'user'])
  role: 'developer' | 'user';
}

export class JoinTeamDto {
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}

// 返回类型定义
export interface TeamMemberResponse {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'developer' | 'user';
  createdAt: Date;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface TeamResponse {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}
