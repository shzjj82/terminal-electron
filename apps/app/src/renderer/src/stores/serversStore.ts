import { makeAutoObservable, reaction } from 'mobx';
import { createPersistenceManager } from './persistence';
import { ServerItem, ServerForm } from '../types';
import { Status } from '../types/base';
import { authStore } from './authStore';

class ServersStore {
  private persistence = createPersistenceManager('servers-store');
  
  // 密钥缓存，避免循环依赖
  private keysCache: any[] = [];

  // 服务器列表
  servers: ServerItem[] = [];

  // UI 状态
  searchTerm = '';
  showCreateServerDialog = false;
  showPassword = false;
  showPassphrase = false;
  editingServer: ServerItem | null = null;
  isEditing = false;

  // 表单数据
  serverForm: ServerForm = {
    name: '',
    host: '',
    port: '22',
    username: '',
    authType: 'password',
    password: '',
    keyPath: '',
    keyContent: '',
    keyId: '',
    passphrase: '',
    timeout: '30',
    keepalive: '60',
    compression: false,
    strictHostKeyChecking: true
  };

  constructor() {
    makeAutoObservable(this);
    
    // 初始化时加载数据
    this.loadData();
    
    // 监听 servers 变化并自动保存
    reaction(
      () => this.servers.map(server => ({ id: server.id, status: server.status, lastConnected: server.lastConnected })),
      () => {
        if (!authStore.isAuthenticated) {
        this.saveData();
        }
      },
      { fireImmediately: false }
    );
    
    // 初始化密钥缓存
    this.loadKeysCache();
  }

  // 计算属性
  get filteredServers() {
    return this.servers.filter(server =>
      server.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      server.host.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      server.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // 设置搜索词
  setSearchTerm(term: string) {
    this.searchTerm = term;
  }

  // 设置创建服务器对话框显示状态
  setShowCreateServerDialog(show: boolean) {
    this.showCreateServerDialog = show;
    if (!show) {
      this.resetServerForm();
    }
  }

  // 设置密码显示状态
  setShowPassword(show: boolean) {
    this.showPassword = show;
  }

  // 设置密钥密码显示状态
  setShowPassphrase(show: boolean) {
    this.showPassphrase = show;
  }

  // 设置编辑服务器
  setEditingServer(server: ServerItem | null) {
    this.editingServer = server;
  }

  // 设置编辑状态
  setIsEditing(editing: boolean) {
    this.isEditing = editing;
  }

  // 更新服务器表单
  updateServerForm(updates: Partial<ServerForm>) {
    this.serverForm = { ...this.serverForm, ...updates };
    
    // 如果认证方式发生变化，重置相关字段
    if (updates.authType && updates.authType !== this.serverForm.authType) {
      this.resetAuthFields(updates.authType);
    }
  }

  // 重置认证相关字段
  private resetAuthFields(newAuthType: 'password' | 'key' | 'keyContent' | 'keySelect') {
    switch (newAuthType) {
      case 'password':
        // 清空密钥相关字段
        this.serverForm.keyPath = '';
        this.serverForm.keyContent = '';
        this.serverForm.keyId = '';
        this.serverForm.passphrase = '';
        break;
      case 'key':
        // 清空密码和密钥内容相关字段
        this.serverForm.password = '';
        this.serverForm.keyContent = '';
        this.serverForm.keyId = '';
        this.serverForm.passphrase = '';
        break;
      case 'keyContent':
        // 清空密码和密钥文件相关字段
        this.serverForm.password = '';
        this.serverForm.keyPath = '';
        this.serverForm.keyId = '';
        this.serverForm.passphrase = '';
        break;
      case 'keySelect':
        // 清空密码和密钥文件、密钥内容相关字段
        this.serverForm.password = '';
        this.serverForm.keyPath = '';
        this.serverForm.keyContent = '';
        this.serverForm.passphrase = '';
        break;
    }
  }

  // 重置服务器表单
  resetServerForm() {
    this.serverForm = {
      name: '',
      host: '',
      port: '22',
      username: '',
      authType: 'password',
      password: '',
      keyPath: '',
      keyContent: '',
      keyId: '',
      passphrase: '',
      timeout: '30',
      keepalive: '60',
      compression: false,
      strictHostKeyChecking: true
    };
    
    // 重置认证相关字段
    this.resetAuthFields('password');
  }

  // 创建或更新服务器
  async createServer() {
    if (this.isEditing && this.editingServer) {
      // 编辑模式：使用 DataService 更新服务器
      try {
        const { DataService } = await import('../services/dataService');
        await DataService.updateServer(this.editingServer.id, this.serverForm);
      } catch (error) {
        console.error('更新服务器失败:', error);
        // 回退到本地更新
        const server = this.servers.find(s => s.id === this.editingServer!.id);
      if (server) {
        Object.assign(server, {
          name: this.serverForm.name,
          host: this.serverForm.host,
          port: parseInt(this.serverForm.port),
          username: this.serverForm.username,
          authType: this.serverForm.authType,
          password: this.serverForm.password || undefined,
          keyPath: this.serverForm.keyPath || undefined,
          keyContent: this.serverForm.keyContent || undefined,
          keyId: this.serverForm.keyId || undefined,
          passphrase: this.serverForm.passphrase || undefined,
          timeout: parseInt(this.serverForm.timeout),
          keepalive: parseInt(this.serverForm.keepalive),
          compression: this.serverForm.compression,
          strictHostKeyChecking: this.serverForm.strictHostKeyChecking
        });
        }
      }
    } else {
      // 创建模式：使用 DataService 创建新服务器
      try {
        const { DataService } = await import('../services/dataService');
        await DataService.createServer(this.serverForm);
      } catch (error) {
        console.error('创建服务器失败:', error);
        // 回退到本地创建
        this.createServerFromData(this.serverForm);
      }
    }
    
    this.setShowCreateServerDialog(false);
    this.resetServerForm();
    this.setIsEditing(false);
    this.setEditingServer(null);
  }

  // 删除服务器（包含云端同步）
  async deleteServerWithSync(serverId: string) {
    try {
      const { DataService } = await import('../services/dataService');
      await DataService.deleteServer(serverId);
    } catch (error) {
      console.error('删除服务器失败:', error);
      throw error;
    }
  }

  // 编辑服务器
  editServer(server: ServerItem) {
    this.setEditingServer(server);
    this.setIsEditing(true);
    this.setShowCreateServerDialog(true);
    
    // 填充表单数据
    this.serverForm = {
      name: server.name,
      host: server.host,
      port: server.port.toString(),
      username: server.username,
      authType: server.authType,
      password: server.password || '',
      keyPath: server.keyPath || '',
      keyContent: server.keyContent || '',
      keyId: server.keyId || '',
      passphrase: server.passphrase || '',
      timeout: server.timeout?.toString() || '30',
      keepalive: server.keepalive?.toString() || '60',
      compression: server.compression || false,
      strictHostKeyChecking: server.strictHostKeyChecking ?? true
    };
    
    // 根据认证类型重置不相关的字段
    this.resetAuthFields(server.authType);
  }



  // 连接服务器
  async connectServer(serverId: string) {
    const server = this.servers.find(s => s.id === serverId);
    if (!server) {
      console.error('Server not found:', serverId);
      return;
    }

    server.status = 'connecting';
    
    try {
      // 构建SSH连接配置
      const sshConfig: any = {
        host: server.host,
        port: server.port,
        username: server.username,
        authType: server.authType,
        timeout: server.timeout || 30000,
        keepalive: server.keepalive || 60000
      };

      // 根据认证方式设置认证信息
      if (server.authType === 'password' && server.password) {
        sshConfig.password = server.password;
      } else if (server.authType === 'key' && server.keyPath) {
        sshConfig.keyPath = server.keyPath;
        if (server.passphrase) {
          sshConfig.passphrase = server.passphrase;
        }
      } else if (server.authType === 'keyContent' && server.keyContent) {
        sshConfig.keyContent = server.keyContent;
        if (server.passphrase) {
          sshConfig.passphrase = server.passphrase;
        }
      } else if (server.authType === 'keySelect' && server.keyId) {
        // 从密钥存储中获取密钥内容
        const key = this.getKeyById(server.keyId);
        if (key) {
          if (key.type === 'password' && key.password) {
            // 密码类型的密钥
            sshConfig.password = key.password;
          } else if (key.privateKey) {
            // SSH密钥对类型
            sshConfig.keyContent = key.privateKey;
            if (key.passphrase) {
              sshConfig.passphrase = key.passphrase;
            }
          } else {
            throw new Error('Selected key not found or invalid');
          }
        } else {
          throw new Error('Selected key not found or invalid');
        }
      }



      // 调用主进程的SSH连接功能
      const result = await (window as any).api.ssh.connect(sshConfig);
      
      if (result.success) {
        server.status = 'connected';
        server.lastConnected = new Date().toISOString();
        
        // 同步终端会话状态
        this.syncTerminalSession(serverId, 'connected');
        
      } else {
        server.status = 'disconnected';
        console.error('SSH connection failed:', result.error);
        throw new Error(result.error || 'Connection failed');
      }
      
      // 强制保存数据
      this.saveData();
      
    } catch (error) {
      server.status = 'disconnected';
      console.error('Failed to connect to server:', error);
      throw error;
    }
  }

  // 断开连接
  async disconnectServer(serverId: string) {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.status = 'disconnected';
      
      // 同步终端会话状态
      this.syncTerminalSession(serverId, 'disconnected');
      
      // 强制保存数据
      this.saveData();
    }
  }

  // 同步终端会话状态
  private async syncTerminalSession(serverId: string, status: 'connected' | 'disconnected') {
    try {
      const { terminalStore } = await import('./terminalStore');
      
      // 查找对应的终端会话
      const session = terminalStore.sessions.find(s => s.serverId === serverId);
      if (session) {
        terminalStore.updateSessionStatus(session.id, status);
      }
    } catch (error) {
      console.error('Failed to sync terminal session:', error);
    }
  }



  // 文件选择处理
  async selectKeyFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pem,.key,.id_rsa';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.updateServerForm({ keyPath: file.name });
      }
    };
    input.click();
  }

  // 获取状态颜色
  getStatusColor(status: string) {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // 获取状态文本
  getStatusText(status: string) {
    switch (status) {
      case 'connected':
        return '已连接';
      case 'connecting':
        return '连接中';
      default:
        return '未连接';
    }
  }

  // 加载密钥缓存
  private async loadKeysCache() {
    try {
      const { keysStore } = await import('./keysStore');
      this.keysCache = keysStore.keys;
      
      // 监听 keys 变化 - 使用更精确的监听
      reaction(
        () => keysStore.keys.map(k => ({ id: k.id, name: k.name })),
        () => {
          this.keysCache = keysStore.keys;
        }
      );
    } catch (error) {
      console.error('Failed to load keys cache:', error);
    }
  }

  // 获取密钥列表
  get availableKeys() {
    return this.keysCache;
  }

  // 根据密钥ID获取密钥
  getKeyById(keyId: string) {
    if (!keyId) return null;
    
    // 先在本地缓存中查找
    const key = this.keysCache.find(k => k.id === keyId);
    if (key) return key;
    
    // 如果本地缓存中没有，从 keysStore 中查找
    const { keysStore } = require('./keysStore');
    return keysStore.keys.find(k => k.id === keyId);
  }

  // 清空服务器列表（只操作内存）
  clearServers() {
    this.servers = [];
  }

  // 添加服务器到内存（只操作内存）
  addServer(server: ServerItem) {
    this.servers.push(server);
  }

  // 从云端添加服务器（只操作内存）
  addServerFromCloud(server: any) {
    // 转换云端数据格式为本地格式
    const serverItem: ServerItem = {
      id: server.id || `server_${Date.now()}_${Math.random()}`,
      cloudId: server.id, // 保存云端ID
      name: server.name,
      host: server.host,
      port: server.port,
      username: server.username,
      status: 'disconnected',
      createdAt: server.createdAt || new Date().toISOString(),
      authType: server.authType,
      password: server.password || undefined,
      keyPath: server.keyPath || undefined,
      keyContent: server.keyContent || undefined,
      keyId: server.keyId || undefined,
      passphrase: server.passphrase || undefined,
      timeout: 30,
      keepalive: 60,
      compression: false,
      strictHostKeyChecking: true
    };

    this.servers.push(serverItem);
  }

  // 从数据创建服务器（只操作内存）
  createServerFromData(serverData: any): ServerItem {
    const newServer: ServerItem = {
      id: `server_${Date.now()}_${Math.random()}`,
      name: serverData.name,
      host: serverData.host,
      port: parseInt(serverData.port),
      username: serverData.username,
      status: 'disconnected',
      createdAt: new Date().toISOString(),
      authType: serverData.authType,
      password: serverData.password || undefined,
      keyPath: serverData.keyPath || undefined,
      keyContent: serverData.keyContent || undefined,
      keyId: serverData.keyId || undefined,
      passphrase: serverData.passphrase || undefined,
      timeout: parseInt(serverData.timeout || '30'),
      keepalive: parseInt(serverData.keepalive || '60'),
      compression: serverData.compression || false,
      strictHostKeyChecking: serverData.strictHostKeyChecking ?? true
    };

    this.servers.push(newServer);
    return newServer;
  }

  // 更新服务器的云端ID（只操作内存）
  updateServerCloudId(serverId: string, cloudId: string) {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.cloudId = cloudId;
    }
  }

  // 删除服务器（只操作内存）
  deleteServer(serverId: string) {
    this.servers = this.servers.filter(server => server.id !== serverId);
  }

  // 更新服务器状态
  updateServerStatus = (serverId: string, status: Status) => {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.status = status;
      if (status === 'connected') {
        server.lastConnected = new Date().toISOString();
      }
    }
  };

  // 更新服务器
  async updateServer(serverId: string, updates: Partial<ServerItem>) {
    try {
      const server = this.servers.find(s => s.id === serverId);
      if (!server) return;

      // 更新本地数据
      Object.assign(server, updates);

      // 同步到云端
      if (authStore.isAuthenticated) {
        const { syncApi } = await import('@/api/sync');
        // 转换 authType 以匹配 API 接口
        const apiUpdates: any = { ...updates };
        if (updates.authType && (updates.authType === 'keyContent' || updates.authType === 'keySelect')) {
          apiUpdates.authType = 'key';
        }
        await syncApi.updateServer(serverId, apiUpdates);
      }

      this.saveData();
    } catch (error) {
      console.error('更新服务器失败:', error);
    }
  }

  // 持久化到本地（只在未登录时生效）
  persist() {
    if (!authStore.isAuthenticated) {
      this.saveData();
    }
  }

  // 从本地加载数据
  loadData() {
    const savedData = this.persistence.load<{ servers: ServerItem[] }>({ servers: [] });
    
    // 在加载数据时，将所有服务器的状态重置为未连接
    this.servers = savedData.servers.map(server => ({
      ...server,
      status: 'disconnected' as const
    }));
  }

  // 保存数据到本地（只在未登录时生效）
  private saveData() {
    if (!authStore.isAuthenticated) {
    this.persistence.save({
      servers: this.servers
    });
    }
  }
}

export const serversStore = new ServersStore(); 