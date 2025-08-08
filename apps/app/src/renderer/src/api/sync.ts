import apiClient from './config';

// 服务器相关类型
export interface ServerData {
  id?: string; // 服务端返回的ID
  localId?: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  keyId?: string;
  authType: 'password' | 'key';
  description?: string;
}

// 密钥相关类型
export interface KeyData {
  id?: string; // 服务端返回的ID
  localId?: string;
  name: string;
  type: 'password' | 'rsa' | 'ed25519' | 'ecdsa' | 'keySelect';
  privateKey: string;
  passphrase?: string;
  password?: string;
  description?: string;
}

// 端口转发相关类型
export interface PortForwardData {
  id?: string; // 服务端返回的ID
  localId?: string;
  name: string;
  type: 'dynamic' | 'local' | 'remote';
  localHost?: string;
  localPort?: number;
  remoteHost?: string;
  remotePort?: number;
  bindAddress?: string;
  bindPort?: number;
  serverId?: string;
  // 手动输入服务器信息时的字段
  serverAddress?: string; // 服务器地址
  username?: string; // SSH 用户名
  authType?: 'password' | 'key'; // 认证类型
  password?: string; // 密码
  keyPath?: string; // 密钥文件路径
  keyContent?: string; // 密钥内容
  passphrase?: string; // 密钥密码
}

// 数据同步API接口
export const syncApi = {
  // ==================== 同步方法 ====================
  
  // 同步服务器数据
  async syncServers(servers: ServerData[]): Promise<ServerData[]> {
    const response = await apiClient.post<ServerData[]>('/servers/sync', servers);
    return response.data;
  },

  // 同步密钥数据
  async syncKeys(keys: KeyData[]): Promise<KeyData[]> {
    const response = await apiClient.post<KeyData[]>('/keys/sync', keys);
    return response.data;
  },

  // 同步端口转发数据
  async syncPortForwards(portForwards: PortForwardData[]): Promise<PortForwardData[]> {
    const response = await apiClient.post<PortForwardData[]>('/port-forwards/sync', portForwards);
    return response.data;
  },

  // ==================== 获取方法 ====================

  // 获取所有服务器
  async getServers(namespace?: string): Promise<ServerData[]> {
    const params = namespace ? { namespace } : { namespace: null };
    const response = await apiClient.get<ServerData[]>('/servers', { params });
    return response.data;
  },

  // 获取所有密钥
  async getKeys(namespace?: string): Promise<KeyData[]> {
    const params = namespace ? { namespace } : { namespace: null };
    const response = await apiClient.get<KeyData[]>('/keys', { params });
    return response.data;
  },

  // 获取所有端口转发
  async getPortForwards(namespace?: string): Promise<PortForwardData[]> {
    const params = namespace ? { namespace } : { namespace: null };
    const response = await apiClient.get<PortForwardData[]>('/port-forwards', { params });
    return response.data;
  },

  // ==================== 创建方法 ====================

  // 创建服务器
  async createServer(server: ServerData, namespace?: string): Promise<ServerData> {
    const params = namespace ? { namespace } : { namespace: null };
    const response = await apiClient.post<ServerData>('/servers', server, { params });
    return response.data;
  },

  // 创建密钥
  async createKey(key: KeyData, namespace?: string): Promise<KeyData> {
    const params = namespace ? { namespace } : { namespace: null };
    const response = await apiClient.post<KeyData>('/keys', key, { params });
    return response.data;
  },

  // 创建端口转发
  async createPortForward(portForward: PortForwardData, namespace?: string): Promise<PortForwardData> {
    const params = namespace ? { namespace } : { namespace: null };
    const response = await apiClient.post<PortForwardData>('/port-forwards', portForward, { params });
    return response.data;
  },

  // ==================== 删除方法 ====================

  // 删除服务器
  async deleteServer(serverId: string): Promise<void> {
    await apiClient.delete(`/servers/${serverId}`);
  },

  // 删除密钥
  async deleteKey(keyId: string): Promise<void> {
    await apiClient.delete(`/keys/${keyId}`);
  },

  // 删除端口转发
  async deletePortForward(portForwardId: string): Promise<void> {
    await apiClient.delete(`/port-forwards/${portForwardId}`);
  },

  // ==================== 更新方法 ====================

  // 更新服务器
  async updateServer(serverId: string, server: Partial<ServerData>): Promise<ServerData> {
    const response = await apiClient.patch<ServerData>(`/servers/${serverId}`, server);
    return response.data;
  },

  // 更新密钥
  async updateKey(keyId: string, key: Partial<KeyData>): Promise<KeyData> {
    const response = await apiClient.patch<KeyData>(`/keys/${keyId}`, key);
    return response.data;
  },

  // 更新端口转发
  async updatePortForward(portForwardId: string, portForward: Partial<PortForwardData>): Promise<PortForwardData> {
    const response = await apiClient.patch<PortForwardData>(`/port-forwards/${portForwardId}`, portForward);
    return response.data;
  },

  // ==================== 团队数据方法 ====================

  // 获取团队数据
  async getTeamData(teamId: string): Promise<{
    servers: ServerData[];
    keys: KeyData[];
    portForwards: PortForwardData[];
  }> {
    const response = await apiClient.get<{
      servers: ServerData[];
      keys: KeyData[];
      portForwards: PortForwardData[];
    }>(`/data/teams/${teamId}`);
    return response.data;
  },

  // 获取个人数据
  async getPersonalData(): Promise<{
    servers: ServerData[];
    keys: KeyData[];
    portForwards: PortForwardData[];
  }> {
    const response = await apiClient.get<{
      servers: ServerData[];
      keys: KeyData[];
      portForwards: PortForwardData[];
    }>('/data/personal');
    return response.data;
  },
};

export default syncApi; 