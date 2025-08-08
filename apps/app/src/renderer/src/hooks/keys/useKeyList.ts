import { useCallback } from 'react';
import { keysStore } from '@renderer/stores/keysStore';
import { useTeamPermissions } from '@/contexts/TeamPermissionContext';

interface UseKeyListProps {
  onEdit: (key: any) => void;
  onDelete: (key: any) => void;
  onCopy: (key: any) => void;
}

interface UseKeyListReturn {
  keys: any[];
  getCardProps: (key: any) => any;
  getPrivateKeyData: (key: any) => any;
}

export const useKeyList = ({
  onEdit,
  onDelete,
  onCopy
}: UseKeyListProps): UseKeyListReturn => {
  const { canEditData, canDeleteData } = useTeamPermissions();
  
  const getActions = useCallback((key: any) => {
    const actions: any[] = [];
    
    // 编辑 - 个人模式或管理者和开发者可以编辑
    if (canEditData) {
      actions.push({
        type: 'edit',
        onClick: () => onEdit(key),
        variant: 'outline' as const
      });
    }
    
    // 删除 - 个人模式或管理者和开发者可以删除
    if (canDeleteData) {
      actions.push({
        type: 'delete',
        onClick: () => onDelete(key),
        variant: 'outline' as const,
        className: 'text-red-600 hover:text-red-700'
      });
    }
    
    return actions;
  }, [onEdit, onDelete, canEditData, canDeleteData]);

  const getBadges = useCallback((key: any) => {
    return [
      {
        text: keysStore.getKeyTypeText(key.type),
        variant: 'outline' as const
      }
    ];
  }, []);

  const getCardProps = useCallback((key: any) => {
    return {
      id: key.id,
      title: key.name,
      createdAt: new Date(key.createdAt),
      lastUsed: key.lastUsed ? new Date(key.lastUsed) : undefined,
      iconType: 'key',
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      badges: getBadges(key),
      actions: getActions(key)
    };
  }, [getBadges, getActions]);

  const getPrivateKeyData = useCallback((key: any) => {
    if (!key.privateKey) return null;

    return {
      hasPrivateKey: true,
      privateKey: key.privateKey,
      onCopy: () => onCopy(key)
    };
  }, [onCopy]);

  return {
    keys: keysStore.filteredKeys,
    getCardProps,
    getPrivateKeyData
  };
}; 