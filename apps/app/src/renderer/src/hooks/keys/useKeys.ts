import { useMemo } from 'react';
import { getKeysStore } from '@renderer/stores/globalStores';
import { KeyItem } from '@renderer/types';

// 获取密钥信息的hooks
export const useKeys = (keyId?: string): KeyItem | null => {
  const keysStore = getKeysStore();

  return useMemo(() => {
    if (!keyId) return null;
    
    // 从keysStore中获取密钥信息
    const key = keysStore.keys.find(k => k.id === keyId);
    return key || null;
  }, [keyId, keysStore.keys]);
}; 