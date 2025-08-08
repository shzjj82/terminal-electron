import { useCallback } from 'react';
import { serversStore } from '@renderer/stores/serversStore';

export const useServersUI = () => {
  // 处理搜索
  const handleSearchChange = useCallback((value: string) => {
    serversStore.setSearchTerm(value);
  }, []);

  // 空状态操作
  const emptyStateAction = useCallback(() => ({
    onClick: () => serversStore.setShowCreateServerDialog(true),
    children: '添加服务器'
  }), []);

  return {
    handleSearchChange,
    emptyStateAction
  };
}; 