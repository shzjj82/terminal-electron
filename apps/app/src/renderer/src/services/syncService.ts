import { syncApi } from '@renderer/api';
import { serversStore } from '../stores/serversStore';
import { keysStore } from '../stores/keysStore';
import { portForwardingStore } from '../stores/portForwardingStore';
import { authStore } from '../stores/authStore';

export class SyncService {
  // 同步数据到云端
  static async syncToCloud() {
    if (!authStore.isAuthenticated) {
      return;
    }

    try {
      // 同步服务器数据
      const servers = serversStore.servers.map(server => ({
        id: server.cloudId,
        name: server.name,
        host: server.host,
        port: server.port,
        username: server.username,
        authType: server.authType,
        password: server.password,
        keyId: server.keyId,
        description: server.description
      }));

      const syncedServers = await syncApi.syncServers(servers);

      // 同步密钥数据
      const keys = keysStore.keys.map(key => ({
        id: key.cloudId,
        name: key.name,
        type: key.type,
        privateKey: key.privateKey,
        passphrase: key.passphrase,
        description: key.description
      }));

      const syncedKeys = await syncApi.syncKeys(keys);

      // 同步端口转发数据
      const portForwards = portForwardingStore.portForwards.map(forward => ({
        id: forward.cloudId,
        name: forward.name,
        type: forward.type,
        localHost: forward.localHost,
        localPort: forward.localPort,
        remoteHost: forward.remoteHost,
        remotePort: forward.remotePort,
        serverId: forward.serverId,
        serverAddress: forward.server,
        username: forward.username,
        authType: forward.authType,
        password: forward.password,
        keyPath: forward.keyPath,
        keyContent: forward.keyContent,
        passphrase: forward.passphrase
      }));

      const syncedPortForwards = await syncApi.syncPortForwards(portForwards);
    } catch (error) {
      console.error('数据同步失败:', error);
    }
  }

  // 从云端加载数据
  static async loadFromCloud() {
    if (!authStore.isAuthenticated) {
      return;
    }

    try {
      // 从云端加载数据
      const [servers, keys, portForwards] = await Promise.all([
        syncApi.getServers(),
        syncApi.getKeys(),
        syncApi.getPortForwards()
      ]);

      // 清空本地数据
      serversStore.clearServers();
      keysStore.clearKeys();
      portForwardingStore.clearPortForwards();

      // 加载服务器数据
      servers.forEach(server => {
        serversStore.addServerFromCloud(server);
      });

      // 加载密钥数据
      keys.forEach(key => {
        keysStore.addKeyFromCloud(key);
      });

      // 加载端口转发数据
      portForwards.forEach(forward => {
        portForwardingStore.addPortForwardFromCloud(forward);
      });
    } catch (error) {
      console.error('从云端加载数据失败:', error);
    }
  }

  // 检查并同步数据
  static async checkAndSync() {
    if (authStore.isAuthenticated) {
      try {
        // 先同步本地数据到云端
        await this.syncToCloud();
        
        // 然后从云端加载数据（处理冲突）
        await this.loadFromCloud();
      } catch (error) {
        console.error('数据同步检查失败:', error);
      }
    }
  }
}

export default SyncService; 