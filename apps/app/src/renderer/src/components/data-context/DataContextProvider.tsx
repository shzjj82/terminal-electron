import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { serversStore } from '@/stores/serversStore';
import { keysStore } from '@/stores/keysStore';
import { portForwardingStore } from '@/stores/portForwardingStore';
import { authStore } from '@/stores/authStore';
import { teamsApi } from '@/api/teams';
import { updateDataContext } from '@/hooks/useDataContext';

// 数据上下文类型
interface DataContextType {
  currentMode: 'personal' | 'team';
  currentTeamId: string | null;
  currentTeamName: string | null;
  userTeams: Array<{ id: string; name: string }>;
  switchToPersonal: () => Promise<void>;
  switchToTeam: (teamId: string) => Promise<void>;
  refreshTeams: () => Promise<void>;
}

// 创建上下文
const DataContext = createContext<DataContextType | undefined>(undefined);

// 数据上下文提供者组件
interface DataContextProviderProps {
  children: ReactNode;
}

export const DataContextProvider = observer(({ children }: DataContextProviderProps) => {
  const [currentMode, setCurrentMode] = useState<'personal' | 'team'>('personal');
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [currentTeamName, setCurrentTeamName] = useState<string | null>(null);
  const [userTeams, setUserTeams] = useState<Array<{ id: string; name: string }>>([]);

  // 加载用户团队列表
  const loadTeams = async () => {
    if (!authStore.isAuthenticated) {
      setUserTeams([]);
      return;
    }

    try {
      const { teamsApi } = await import('@/api/teams');
      const teams = await teamsApi.getMyTeams();
      setUserTeams(teams);
    } catch (error) {
      console.error('加载团队列表失败:', error);
    }
  };

  // 切换到个人模式
  const switchToPersonal = async () => {
    try {
      setCurrentMode('personal');
      setCurrentTeamId(null);
      setCurrentTeamName(null);

      // 清空当前数据
      serversStore.clearServers();
      keysStore.clearKeys();
      portForwardingStore.clearPortForwards();

      // 加载个人数据
      const { syncApi } = await import('@/api/sync');
      const [servers, keys, portForwards] = await Promise.all([
        syncApi.getServers(),
        syncApi.getKeys(),
        syncApi.getPortForwards()
      ]);

      // 添加个人数据到 stores
      servers.forEach(server => {
        serversStore.addServerFromCloud(server);
      });

      keys.forEach(key => {
        keysStore.addKeyFromCloud(key);
      });

      portForwards.forEach(forward => {
        portForwardingStore.addPortForwardFromCloud(forward);
      });
    } catch (error) {
      console.error('切换个人数据失败:', error);
    }
  };

  // 切换到团队模式
  const switchToTeam = async (teamId: string) => {
    try {
      setCurrentMode('team');
      setCurrentTeamId(teamId);

      // 获取团队信息
      const team = userTeams.find(t => t.id === teamId);
      if (team) {
        setCurrentTeamName(team.name);
      }

      // 清空当前数据
      serversStore.clearServers();
      keysStore.clearKeys();
      portForwardingStore.clearPortForwards();

      // 加载团队数据
      const { syncApi } = await import('@/api/sync');
      const [servers, keys, portForwards] = await Promise.all([
        syncApi.getServers(teamId),
        syncApi.getKeys(teamId),
        syncApi.getPortForwards(teamId)
      ]);

      // 添加团队数据到 stores
      servers.forEach(server => {
        serversStore.addServerFromCloud(server);
      });

      keys.forEach(key => {
        keysStore.addKeyFromCloud(key);
      });

      portForwards.forEach(forward => {
        portForwardingStore.addPortForwardFromCloud(forward);
      });
    } catch (error) {
      console.error('切换团队数据失败:', error);
    }
  };

  // 刷新团队列表
  const refreshTeams = async () => {
    await loadTeams();
  };

  // 初始化时加载团队列表
  useEffect(() => {
    loadTeams();
  }, [authStore.isAuthenticated]);

  // 监听认证状态变化
  useEffect(() => {
    if (!authStore.isAuthenticated) {
      // 用户登出时，切换到个人模式
      setCurrentMode('personal');
      setCurrentTeamId(null);
      setCurrentTeamName(null);
      setUserTeams([]);
    }
  }, [authStore.isAuthenticated]);

  const contextValue: DataContextType = {
    currentMode,
    currentTeamId,
    currentTeamName,
    userTeams,
    switchToPersonal,
    switchToTeam,
    refreshTeams,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
});

// 使用数据上下文的 Hook
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataContextProvider');
  }
  return context;
}; 