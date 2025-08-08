import { useCallback } from 'react';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';
import { useTeamPermissions } from '@/contexts/TeamPermissionContext';

interface UsePortForwardListProps {
  onEdit: (forward: any) => void;
  onDelete: (forward: any) => void;
  onStart: (forward: any) => void;
  onStop: (forward: any) => void;
}

interface UsePortForwardListReturn {
  forwards: any[];
  getCardProps: (forward: any) => any;
}

export const usePortForwardList = ({
  onEdit,
  onDelete,
  onStart,
  onStop
}: UsePortForwardListProps): UsePortForwardListReturn => {
  const { canEditData, canDeleteData, canUseData } = useTeamPermissions();
  
  const getActions = useCallback((forward: any) => {
    const actions: any[] = [];
    
    // 启动/停止 - 所有用户都可以使用
    actions.push({
      type: forward.status === 'active' ? 'stop' : 'start',
      onClick: () => forward.status === 'active' ? onStop(forward) : onStart(forward),
      variant: 'outline' as const
    });
    
    // 编辑 - 个人模式或管理者和开发者可以编辑
    if (canEditData) {
      actions.push({
        type: 'edit',
        onClick: () => onEdit(forward),
        variant: 'outline' as const,
        disabled: forward.status === 'active'
      });
    }
    
    // 删除 - 个人模式或管理者和开发者可以删除
    if (canDeleteData) {
      actions.push({
        type: 'delete',
        onClick: () => onDelete(forward),
        variant: 'outline' as const,
        className: 'text-red-600 hover:text-red-700'
      });
    }
    
    return actions;
  }, [onEdit, onDelete, onStart, onStop, canEditData, canDeleteData]);

  const getBadges = useCallback((forward: any) => {
    return [
      {
        text: portForwardingStore.getTypeText(forward.type),
        variant: (forward.type === 'local' ? 'default' :
          forward.type === 'remote' ? 'outline' : 'secondary') as 'default' | 'outline' | 'secondary'
      },
      {
        text: portForwardingStore.getStatusText(forward.status),
        variant: (forward.status === 'active' ? 'default' :
          forward.status === 'error' ? 'destructive' : 'outline') as 'default' | 'outline' | 'destructive'
      }
    ];
  }, []);

  const getCardProps = useCallback((forward: any) => {
    return {
      id: forward.id,
      title: forward.name,
      createdAt: new Date(forward.createdAt),
      iconType: 'arrow-left-right',
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      badges: getBadges(forward),
      actions: getActions(forward)
    };
  }, [getBadges, getActions]);

  return {
    forwards: portForwardingStore.filteredPortForwards,
    getCardProps
  };
}; 