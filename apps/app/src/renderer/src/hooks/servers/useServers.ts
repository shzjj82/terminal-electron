import { useMemo } from 'react';
import { getServersStore } from '@renderer/stores/globalStores';
import { getKeysStore } from '@renderer/stores/globalStores';
import { 
  ServerItem, 
  KeyItem, 
  ResolvedServerData
} from '@renderer/types';
import { useSSHConfig } from '../ssh/useSSHConfig';

// 获取服务器信息的hooks
export const useServerData = (serverId?: string): ResolvedServerData | null => {
  const serversStore = getServersStore();
  const sshConfig = useSSHConfig(serverId);

  return useMemo(() => {
    if (!serverId || !sshConfig) return null;

    // 1. 获取服务器信息
    const server = serversStore.servers.find(s => s.id === serverId);
    if (!server) return null;

    // 2. 获取关联的密钥信息（如果有keyId）
    let key: KeyItem | null = null;
    if (server.keyId) {
      const keysStore = getKeysStore();
      key = keysStore.keys.find(k => k.id === server.keyId) || null;
    }

    return {
      server,
      key,
      sshConfig
    };
  }, [serverId, sshConfig, serversStore.servers]);
};

// 获取服务器列表的hooks
export const useServerList = (): ServerItem[] => {
  const serversStore = getServersStore();
  
  return useMemo(() => {
    return serversStore.servers;
  }, [serversStore.servers]);
}; 