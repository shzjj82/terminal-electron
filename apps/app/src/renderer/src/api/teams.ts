import { apiClient } from './config';

// 团队相关接口类型定义
export interface CreateTeamData {
  name: string;
}

export interface TeamData {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddMemberData {
  userId: string;
  role: 'developer' | 'user';
}

export interface UpdateMemberRoleData {
  memberId: string;
  role: 'developer' | 'user';
}

export interface JoinTeamData {
  inviteCode: string;
}

export interface TeamMemberData {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'developer' | 'user';
  createdAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// 团队 API 接口
export const teamsApi = {
  // 创建团队
  createTeam: async (data: CreateTeamData): Promise<TeamData> => {
    const response = await apiClient.post('/teams/create', data);
    return response.data;
  },

  // 通过邀请码加入团队
  joinTeam: async (data: JoinTeamData): Promise<TeamData> => {
    const response = await apiClient.post('/teams/join', data);
    return response.data;
  },

  // 获取我的团队列表
  getMyTeams: async (): Promise<TeamData[]> => {
    const response = await apiClient.get('/teams/my');
    return response.data;
  },

  // 获取团队成员列表
  getTeamMembers: async (teamId: string): Promise<TeamMemberData[]> => {
    const response = await apiClient.get(`/teams/${teamId}/members`);
    return response.data;
  },

  // 邀请成员
  inviteMember: async (teamId: string, data: AddMemberData): Promise<TeamMemberData> => {
    const response = await apiClient.post(`/teams/${teamId}/invite`, data);
    return response.data;
  },

  // 移除成员
  removeMember: async (teamId: string, memberId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/members/${memberId}`);
  },

  // 更新成员身份
  updateMemberRole: async (teamId: string, memberId: string, data: UpdateMemberRoleData): Promise<TeamMemberData> => {
    const response = await apiClient.patch(`/teams/${teamId}/members/${memberId}/role`, data);
    return response.data;
  },

  // 解散团队
  dissolveTeam: async (teamId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/dissolve`);
  },
}; 