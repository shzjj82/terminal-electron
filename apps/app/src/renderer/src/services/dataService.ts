import { syncApi } from '@renderer/api';
import { serversStore } from '../stores/serversStore';
import { keysStore } from '../stores/keysStore';
import { portForwardingStore } from '../stores/portForwardingStore';
import { authStore } from '../stores/authStore';
import { getCurrentDataContext } from '../hooks/useDataContext';

export class DataService {
  // 统一的持久化方法
  // private static persistStores() {
  //   if (!authStore.isAuthenticated) {
  //     serversStore.persist();
  //     keysStore.persist();
  //     portForwardingStore.persist();
  //   }
  // }

  // 统一的数据操作管理器
  private static dataManager = {
    // 服务器操作
    servers: {
      create: (data: any) => serversStore.createServerFromData(data),
      update: (id: string, data: any) => serversStore.updateServer(id, data),
      delete: (id: string) => serversStore.deleteServer(id),
      getAll: () => serversStore.servers,
      clear: () => serversStore.clearServers(),
      addFromCloud: (data: any) => serversStore.addServerFromCloud(data),
      updateCloudId: (id: string, cloudId: string) => serversStore.updateServerCloudId(id, cloudId)
    },
    // 密钥操作
    keys: {
      create: (data: any) => keysStore.createKeyFromData(data),
      update: (id: string, data: any) => keysStore.updateKey(id, data),
      delete: (id: string) => keysStore.deleteKey(id),
      getAll: () => keysStore.keys,
      clear: () => keysStore.clearKeys(),
      addFromCloud: (data: any) => keysStore.addKeyFromCloud(data),
      updateCloudId: (id: string, cloudId: string) => keysStore.updateKeyCloudId(id, cloudId)
    },
    // 端口转发操作
    portForwards: {
      create: (data: any) => portForwardingStore.createPortForwardFromData(data),
      update: (id: string, data: any) => portForwardingStore.updatePortForwardInMemory(id, data),
      delete: (id: string) => portForwardingStore.deletePortForward(id),
      getAll: () => portForwardingStore.portForwards,
      clear: () => portForwardingStore.clearPortForwards(),
      addFromCloud: (data: any) => portForwardingStore.addPortForwardFromCloud(data),
      updateCloudId: (id: string, cloudId: string) => portForwardingStore.updatePortForwardCloudId(id, cloudId)
    }
  };



  // 初始化数据
  static async initializeData() {
    try {
      if (authStore.isAuthenticated) {
        // 从服务端加载个人数据
        await this.loadFromServer();
      } else {
        // 从本地加载数据
        await this.loadFromLocal();
      }
    } catch (error) {
      this.handleError(error, '数据初始化失败');
    }
  }

  // 从服务端加载数据
  static async loadFromServer(namespace?: string) {
    if (!authStore.isAuthenticated) {
      return;
    }

    try {
      const { syncApi } = await import('@/api/sync');
      
      // 加载服务器数据
      const servers = await syncApi.getServers(namespace);
      serversStore.clearServers();
      servers.forEach(server => {
        serversStore.addServerFromCloud(server);
      });

      // 加载密钥数据
      const keys = await syncApi.getKeys(namespace);
      keysStore.clearKeys();
      keys.forEach(key => {
        keysStore.addKeyFromCloud(key);
      });

      // 加载端口转发数据
      const portForwards = await syncApi.getPortForwards(namespace);
      portForwardingStore.clearPortForwards();
      portForwards.forEach(forward => {
        portForwardingStore.addPortForwardFromCloud(forward);
      });
    } catch (error) {
      this.handleError(error, '从服务端加载数据失败');
      // 服务端加载失败，回退到本地加载
      await this.loadFromLocal();
    }
  }

  // 从本地加载数据
  static async loadFromLocal() {
    try {
      // 从本地持久化存储加载数据
      await serversStore.loadData();
      await keysStore.loadData();
      await portForwardingStore.loadData();
    } catch (error) {
      this.handleError(error, '从本地加载数据失败');
    }
  }

  /**
   * 切换到云端数据（登录后调用）
   */
  static async switchToCloud() {
    await this.loadFromServer();
  }

  /**
   * 切换到本地数据（登出后调用）
   */
  static async switchToLocal() {
    await this.loadFromLocal();
  }

  // 监听登录状态变化
  static setupAuthListener() {
    let wasAuthenticated = authStore.isAuthenticated;
    setInterval(() => {
      const isNowAuthenticated = authStore.isAuthenticated;
      if (wasAuthenticated !== isNowAuthenticated) {
        if (isNowAuthenticated) {
          this.switchToCloud().catch(error => this.handleError(error, '登录后切换到云端'));
        } else {
          this.switchToLocal().catch(error => this.handleError(error, '登出后切换到本地'));
        }
        wasAuthenticated = isNowAuthenticated;
      }
    }, 1000);
  }

  // 手动刷新数据
  static async refreshData() {
    if (authStore.isAuthenticated) {
      await this.loadFromServer();
    } else {
      await this.loadFromLocal();
    }
  }

  // ==================== 删除数据同步 ====================

  // 比对本地和云端数据，同步删除操作
  static async syncDeletedItems(
    localServerIds: Set<string>,
    cloudServerIds: Set<string>,
    localKeyIds: Set<string>,
    cloudKeyIds: Set<string>,
    localForwardIds: Set<string>,
    cloudForwardIds: Set<string>
  ) {
    try {
      // 找出本地有但云端没有的服务器（被删除的）
      const deletedServerIds = Array.from(localServerIds).filter(id => !cloudServerIds.has(id));
      for (const serverId of deletedServerIds) {
        try {
          const { syncApi } = await import('@/api/sync');
          await syncApi.deleteServer(serverId);
        } catch (error) {
          this.handleError(error, `同步删除服务器失败: ${serverId}`);
        }
      }

      // 找出本地有但云端没有的密钥（被删除的）
      const deletedKeyIds = Array.from(localKeyIds).filter(id => !cloudKeyIds.has(id));
      for (const keyId of deletedKeyIds) {
        try {
          const { syncApi } = await import('@/api/sync');
          await syncApi.deleteKey(keyId);
        } catch (error) {
          this.handleError(error, `同步删除密钥失败: ${keyId}`);
        }
      }

      // 找出本地有但云端没有的端口转发（被删除的）
      const deletedForwardIds = Array.from(localForwardIds).filter(id => !cloudForwardIds.has(id));
      for (const forwardId of deletedForwardIds) {
        try {
          const { syncApi } = await import('@/api/sync');
          await syncApi.deletePortForward(forwardId);
        } catch (error) {
          this.handleError(error, `同步删除端口转发失败: ${forwardId}`);
        }
      }
    } catch (error) {
      this.handleError(error, '同步删除数据失败');
    }
  }

  // ==================== 删除操作同步 ====================

  /**
   * 批量删除服务器
   */
  static async batchDeleteServers(ids: string[]) {
    for (const id of ids) {
      try {
        await this.deleteServer(id);
      } catch (error) {
        this.handleError(error, `批量删除服务器 ${id}`);
      }
    }
  }
  /**
   * 批量删除密钥
   */
  static async batchDeleteKeys(ids: string[]) {
    for (const id of ids) {
      try {
        await this.deleteKey(id);
      } catch (error) {
        this.handleError(error, `批量删除密钥 ${id}`);
      }
    }
  }
  /**
   * 批量删除端口转发
   */
  static async batchDeletePortForwards(ids: string[]) {
    for (const id of ids) {
      try {
        await this.deletePortForward(id);
      } catch (error) {
        this.handleError(error, `批量删除端口转发 ${id}`);
      }
    }
  }

  // 删除服务器
  static async deleteServer(serverId: string) {
    try {
      const { syncApi } = await import('@/api/sync');
      await syncApi.deleteServer(serverId);
      serversStore.deleteServer(serverId);
    } catch (error) {
      this.handleError(error, '删除服务器失败');
    }
  }

  // 删除密钥
  static async deleteKey(keyId: string) {
    try {
      const { syncApi } = await import('@/api/sync');
      await syncApi.deleteKey(keyId);
      keysStore.deleteKey(keyId);
    } catch (error) {
      this.handleError(error, '删除密钥失败');
    }
  }

  // 删除端口转发
  static async deletePortForward(forwardId: string) {
    try {
      const { syncApi } = await import('@/api/sync');
      await syncApi.deletePortForward(forwardId);
      portForwardingStore.deletePortForward(forwardId);
    } catch (error) {
      this.handleError(error, '删除端口转发失败');
    }
  }

  // ==================== 创建和更新操作同步 ====================

  // 创建服务器
  static async createServer(serverData: any) {
    try {
      if (authStore.isAuthenticated) {
        // 从数据上下文获取当前 namespace
        const dataContext = getCurrentDataContext();
        const namespace = dataContext.currentMode === 'team' ? dataContext.currentTeamId || undefined : undefined;
        
        const cloudServer = await syncApi.createServer({
          name: serverData.name,
          host: serverData.host,
          port: parseInt(serverData.port),
          username: serverData.username,
          authType: serverData.authType,
          password: serverData.password,
          keyId: serverData.keyId,
          description: serverData.name
        }, namespace);
        
        // 将创建的数据添加到 store
        this.dataManager.servers.addFromCloud(cloudServer);
        
        return cloudServer;
      } else {
        return this.dataManager.servers.create(serverData);
      }
    } catch (error) {
      this.handleError(error, '创建服务器');
      throw error;
    }
  }

  // 创建密钥
  static async createKey(keyData: any) {
    try {
      if (authStore.isAuthenticated) {
        const dataContext = getCurrentDataContext();
        const namespace = dataContext.currentMode === 'team' ? dataContext.currentTeamId || undefined : undefined;
        
        const cloudKey = await syncApi.createKey({
          name: keyData.name,
          type: keyData.type,
          privateKey: keyData.privateKey || '',
          passphrase: keyData.password,
          description: keyData.name
        }, namespace);
        
        // 将创建的数据添加到 store
        this.dataManager.keys.addFromCloud(cloudKey);
        
        return cloudKey;
      } else {
        return this.dataManager.keys.create(keyData);
      }
    } catch (error) {
      this.handleError(error, '创建密钥');
      throw error;
    }
  }

  // 创建端口转发
  static async createPortForward(forwardData: any) {
    try {
      if (authStore.isAuthenticated) {
        const dataContext = getCurrentDataContext();
        const namespace = dataContext.currentMode === 'team' ? dataContext.currentTeamId || undefined : undefined;
        
        const localPort = parseInt(forwardData.localPort);
        const remotePort = parseInt(forwardData.remotePort);
        const cloudForward = await syncApi.createPortForward({
          name: forwardData.name,
          type: forwardData.type,
          localHost: forwardData.localHost,
          localPort: (localPort >= 1 && localPort <= 65535) ? localPort : undefined,
          remoteHost: forwardData.remoteHost,
          remotePort: (remotePort >= 1 && remotePort <= 65535) ? remotePort : undefined,
          serverId: forwardData.serverId,
          serverAddress: forwardData.server,
          username: forwardData.username,
          authType: forwardData.authType,
          password: forwardData.password,
          keyPath: forwardData.keyPath,
          keyContent: forwardData.keyContent,
          passphrase: forwardData.passphrase
        }, namespace);
        
        // 将创建的数据添加到 store
        this.dataManager.portForwards.addFromCloud(cloudForward);
        
        return cloudForward;
      } else {
        return this.dataManager.portForwards.create(forwardData);
      }
    } catch (error) {
      this.handleError(error, '创建端口转发');
      throw error;
    }
  }

  // ==================== 更新操作同步 ====================

  // 更新服务器
  static async updateServer(serverId: string, serverData: any) {
    try {
      this.dataManager.servers.update(serverId, {
        name: serverData.name,
        host: serverData.host,
        port: parseInt(serverData.port),
        username: serverData.username,
        authType: serverData.authType,
        password: serverData.password,
        keyPath: serverData.keyPath,
        keyContent: serverData.keyContent,
        keyId: serverData.keyId,
        passphrase: serverData.passphrase,
        timeout: parseInt(serverData.timeout),
        keepalive: parseInt(serverData.keepalive),
        compression: serverData.compression,
        strictHostKeyChecking: serverData.strictHostKeyChecking
      });
      if (authStore.isAuthenticated) {
        const server = this.dataManager.servers.getAll().find(s => s.id === serverId);
        if (server?.cloudId) {
          try {
            await syncApi.updateServer(server.cloudId, {
              name: serverData.name,
              host: serverData.host,
              port: parseInt(serverData.port),
              username: serverData.username,
              authType: serverData.authType,
              password: serverData.password,
              keyId: serverData.keyId,
              description: serverData.name
            });

          } catch (error) {
            this.handleError(error, '同步服务器到云端');
          }
        }
      }
    } catch (error) {
      this.handleError(error, '更新服务器');
      throw error;
    }
  }

  // 更新密钥
  static async updateKey(keyId: string, keyData: any) {
    try {
      const updates: any = {
        name: keyData.name
      };
      if (keyData.createKeyMode === 'password') {
        updates.password = keyData.password;
        updates.type = 'password';
      } else if (keyData.createKeyMode === 'content') {
        updates.privateKey = keyData.keyContent;
      }
      this.dataManager.keys.update(keyId, updates);
      if (authStore.isAuthenticated) {
        const key = this.dataManager.keys.getAll().find(k => k.id === keyId);
        if (key?.cloudId) {
          try {
            await syncApi.updateKey(key.cloudId, {
              name: keyData.name,
              type: keyData.createKeyMode === 'password' ? 'password' : key.type,
              privateKey: keyData.createKeyMode === 'content' ? keyData.keyContent : key.privateKey || '',
              passphrase: keyData.createKeyMode === 'password' ? keyData.password : key.password,
              description: keyData.name
            });

          } catch (error) {
            this.handleError(error, '同步密钥到云端');
          }
        }
      }
    } catch (error) {
      this.handleError(error, '更新密钥');
      throw error;
    }
  }

  // 更新端口转发
  static async updatePortForward(forwardId: string, forwardData: any) {
    try {
      const forwardType = forwardData.selectedForwardType || forwardData.type;
      this.dataManager.portForwards.update(forwardId, {
        name: forwardData.name,
        type: forwardType,
        localHost: forwardData.localHost,
        localPort: parseInt(forwardData.localPort) || 0,
        remoteHost: forwardData.remoteHost,
        remotePort: parseInt(forwardData.remotePort) || 0,
        server: forwardData.serverId ? '' : forwardData.server,
        serverId: forwardData.serverId,
        username: forwardData.serverId ? '' : forwardData.username,
        authType: forwardData.serverId ? 'password' : forwardData.authType,
        password: forwardData.serverId ? undefined : (forwardData.authType === 'password' ? forwardData.password : undefined),
        keyPath: forwardData.serverId ? undefined : (forwardData.authType === 'key' ? forwardData.keyPath : undefined),
        keyContent: forwardData.serverId ? undefined : (forwardData.authType === 'keyContent' ? forwardData.keyContent : undefined),
        passphrase: forwardData.serverId ? undefined : (forwardData.passphrase || undefined)
      });
      if (authStore.isAuthenticated) {
        const forward = this.dataManager.portForwards.getAll().find(f => f.id === forwardId);
        if (forward?.cloudId) {
          try {
            const localPort = parseInt(forwardData.localPort);
            const remotePort = parseInt(forwardData.remotePort);
            await syncApi.updatePortForward(forward.cloudId, {
              name: forwardData.name,
              type: forwardData.selectedForwardType || forwardData.type,
              localHost: forwardData.localHost,
              localPort: (localPort >= 1 && localPort <= 65535) ? localPort : undefined,
              remoteHost: forwardData.remoteHost,
              remotePort: (remotePort >= 1 && remotePort <= 65535) ? remotePort : undefined,
              serverId: forwardData.serverId,
              serverAddress: forwardData.server,
              username: forwardData.username,
              authType: forwardData.authType,
              password: forwardData.password,
              keyPath: forwardData.keyPath,
              keyContent: forwardData.keyContent,
              passphrase: forwardData.passphrase
            });

          } catch (error) {
            this.handleError(error, '同步端口转发到云端');
          }
        }
      }
    } catch (error) {
      this.handleError(error, '更新端口转发');
      throw error;
    }
  }

  // 统一错误处理
  private static handleError(error: any, context: string) {
    if (context) {
      console.error(`[DataService][${context}]`, error);
    } else {
      console.error('[DataService]', error);
    }
  }
}

export default DataService;