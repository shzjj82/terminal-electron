import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TeamPermissions, TeamRole } from '@/utils/permissions';
import { TeamMemberData } from '@/api/teams';
import { useDataContext } from '@/hooks/useDataContext';
import { authStore } from '@/stores/authStore';

interface TeamPermissionContextType {
  currentUserRole: TeamRole | null;
  currentMode: string;
  canEditMemberRoles: boolean;
  canCreateData: boolean;
  canEditData: boolean;
  canDeleteData: boolean;
  canUseData: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canDissolveTeam: boolean;
  isLoading: boolean;
  refreshPermissions: () => void;
}

const TeamPermissionContext = createContext<TeamPermissionContextType | undefined>(undefined);

interface TeamPermissionProviderProps {
  children: ReactNode;
}

export const TeamPermissionProvider: React.FC<TeamPermissionProviderProps> = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState<TeamRole | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentMode, currentTeamId } = useDataContext();

  // 计算权限 - 个人模式下拥有所有权限
  const isPersonalMode = TeamPermissions.isPersonalMode(currentMode);
  const canEditMemberRoles = isPersonalMode || TeamPermissions.canEditMemberRoles(currentUserRole || 'user');
  const canCreateData = isPersonalMode || TeamPermissions.canCreateData(currentUserRole || 'user');
  const canEditData = isPersonalMode || TeamPermissions.canEditData(currentUserRole || 'user');
  const canDeleteData = isPersonalMode || TeamPermissions.canDeleteData(currentUserRole || 'user');
  const canUseData = isPersonalMode || TeamPermissions.canUseData(currentUserRole || 'user');
  const canInviteMembers = isPersonalMode || TeamPermissions.canInviteMembers(currentUserRole || 'user');
  const canRemoveMembers = isPersonalMode || TeamPermissions.canRemoveMembers(currentUserRole || 'user');
  const canDissolveTeam = isPersonalMode || TeamPermissions.canDissolveTeam(currentUserRole || 'user');

  // 加载团队成员信息
  const loadTeamMembers = async () => {
    if (currentMode !== 'team' || !currentTeamId || !authStore.isAuthenticated) {
      setCurrentUserRole(null);
      setTeamMembers([]);
      return;
    }

    setIsLoading(true);
    try {
      const { teamsApi } = await import('@/api/teams');
      const members = await teamsApi.getTeamMembers(currentTeamId);
      setTeamMembers(members);
      
      // 获取当前用户角色
      const userRole = TeamPermissions.getUserRole(members, authStore.user?.id || '');
      setCurrentUserRole(userRole);
    } catch (error) {
      console.error('加载团队成员失败:', error);
      setCurrentUserRole(null);
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新权限
  const refreshPermissions = () => {
    loadTeamMembers();
  };

  // 当团队模式或团队ID变化时重新加载权限
  useEffect(() => {
    loadTeamMembers();
  }, [currentMode, currentTeamId, authStore.isAuthenticated]);

  const value: TeamPermissionContextType = {
    currentUserRole,
    currentMode,
    canEditMemberRoles,
    canCreateData,
    canEditData,
    canDeleteData,
    canUseData,
    canInviteMembers,
    canRemoveMembers,
    canDissolveTeam,
    isLoading,
    refreshPermissions,
  };

  return (
    <TeamPermissionContext.Provider value={value}>
      {children}
    </TeamPermissionContext.Provider>
  );
};

export const useTeamPermissions = () => {
  const context = useContext(TeamPermissionContext);
  if (context === undefined) {
    throw new Error('useTeamPermissions must be used within a TeamPermissionProvider');
  }
  return context;
}; 