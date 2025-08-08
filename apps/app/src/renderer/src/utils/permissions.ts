import { TeamMemberData } from '@/api/teams';

export type TeamRole = 'owner' | 'developer' | 'user';

export interface UserTeamInfo {
  teamId: string;
  role: TeamRole;
}

// 权限检查函数
export class TeamPermissions {
  // 检查是否为个人模式
  static isPersonalMode(currentMode: string): boolean {
    return currentMode === 'personal';
  }

  // 检查用户是否有编辑其他成员身份的权限
  static canEditMemberRoles(role: TeamRole): boolean {
    return role === 'owner';
  }

  // 检查用户是否有创建数据的权限
  static canCreateData(role: TeamRole): boolean {
    return role === 'owner' || role === 'developer';
  }

  // 检查用户是否有编辑数据的权限
  static canEditData(role: TeamRole): boolean {
    return role === 'owner' || role === 'developer';
  }

  // 检查用户是否有删除数据的权限
  static canDeleteData(role: TeamRole): boolean {
    return role === 'owner' || role === 'developer';
  }

  // 检查用户是否有使用数据的权限
  static canUseData(role: TeamRole): boolean {
    return role === 'owner' || role === 'developer' || role === 'user';
  }

  // 检查用户是否有邀请成员的权限
  static canInviteMembers(role: TeamRole): boolean {
    return role === 'owner';
  }

  // 检查用户是否有移除成员的权限
  static canRemoveMembers(role: TeamRole): boolean {
    return role === 'owner';
  }

  // 检查用户是否有解散团队的权限
  static canDissolveTeam(role: TeamRole): boolean {
    return role === 'owner';
  }

  // 获取角色显示文本
  static getRoleText(role: TeamRole): string {
    switch (role) {
      case 'owner': return '团队管理者';
      case 'developer': return '开发者';
      case 'user': return '使用者';
      default: return role;
    }
  }

  // 获取角色颜色
  static getRoleColor(role: TeamRole): string {
    switch (role) {
      case 'owner': return 'bg-red-100 text-red-800';
      case 'developer': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // 从团队成员列表中获取当前用户的角色
  static getUserRole(members: TeamMemberData[], userId: string): TeamRole | null {
    const member = members.find(m => m.userId === userId);
    return member?.role || null;
  }
} 