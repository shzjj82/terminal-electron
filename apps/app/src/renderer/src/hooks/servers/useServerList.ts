import { useCallback } from 'react';
import { serversStore } from '@renderer/stores/serversStore';
import { useTeamPermissions } from '@/contexts/TeamPermissionContext';

interface UseServerListProps {
  onEdit: (server: any) => void;
  onDelete: (server: any) => void;
  onConnect: (server: any) => void;
  onDisconnect: (server: any) => void;
}

interface UseServerListReturn {
  servers: any[];
  getCardProps: (server: any) => any;
}

export const useServerList = ({
  onEdit,
  onDelete,
  onConnect,
  onDisconnect
}: UseServerListProps): UseServerListReturn => {
  const { canEditData, canDeleteData, canUseData } = useTeamPermissions();
  // const isPersonalMode = currentMode === 'personal';
  
  const getActions = useCallback((server: any) => {
    const actions: any[] = [];
    
    // 连接/断开连接 - 所有用户都可以使用
    if (canUseData) {
      actions.push({
        type: server.status === 'connected' ? 'disconnect' : 'connect',
        onClick: () => {
          if (server.status === 'connected') {
            onDisconnect(server);
          } else {
            onConnect(server);
          }
        },
        variant: 'outline' as const
      });
    }
    
    // 编辑 - 个人模式或管理者和开发者可以编辑
    if (canEditData) {
      actions.push({
        type: 'edit',
        onClick: () => onEdit(server),
        variant: 'outline' as const,
        disabled: server.status === 'connected'
      });
    }
    
    // 删除 - 个人模式或管理者和开发者可以删除
    if (canDeleteData) {
      actions.push({
        type: 'delete',
        onClick: () => onDelete(server),
        variant: 'outline' as const,
        className: 'text-red-600 hover:text-red-700'
      });
    }
    
    return actions;
  }, [onEdit, onDelete, onConnect, onDisconnect, canEditData, canDeleteData, canUseData]);

  const getBadges = useCallback((server: any) => {
    return [
      {
        text: serversStore.getStatusText(server.status),
        variant: 'outline' as const
      }
    ];
  }, []);

  const getCardProps = useCallback((server: any) => {
    return {
      id: server.id,
      title: server.name,
      createdAt: new Date(server.createdAt),
      lastUsed: server.lastConnected ? new Date(server.lastConnected) : undefined,
      iconType: 'server',
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      badges: getBadges(server),
      actions: getActions(server)
    };
  }, [getBadges, getActions]);

  return {
    servers: serversStore.filteredServers,
    getCardProps
  };
}; 