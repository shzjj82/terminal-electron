import { makeAutoObservable, reaction } from 'mobx';
import { createPersistenceManager } from './persistence';
import { PortForwardItem, PortForwardForm } from '../types';
import { authStore } from './authStore';

class PortForwardingStore {
  private persistence = createPersistenceManager('port-forwarding-store');

  // 端口转发列表
  portForwards: PortForwardItem[] = [];

  // UI 状态
  searchTerm = '';
  showForwardForm = false;
  showTypeSelector = false;
  selectedForwardType: 'local' | 'remote' | 'dynamic' | null = null;
  showPassword = false;
  showPassphrase = false;
  editingForward: PortForwardItem | null = null;
  isEditing = false;

  // 表单数据
  forwardForm: PortForwardForm = {
    name: '',
    type: 'local',
    localHost: '127.0.0.1',
    localPort: '',
    remoteHost: '',
    remotePort: '',
    server: '',
    serverId: undefined,
    username: '',
    authType: 'password',
    password: '',
    keyPath: '',
    keyContent: '',
    passphrase: ''
  };

  constructor() {
    makeAutoObservable(this);
    
    // 初始化时加载数据
    this.loadData();
    
    // 监听 portForwards 变化并自动保存
    reaction(
      () => this.portForwards.length,
      () => {
        if (!authStore.isAuthenticated) {
          this.saveData();
        }
      },
      { fireImmediately: false }
    );
  }

  // 计算属性
  get filteredPortForwards() {
    return this.portForwards.filter(forward =>
      forward.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      forward.server.toLowerCase().includes(this.searchTerm)
    );
  }

  // Actions
  setSearchTerm(term: string) {
    this.searchTerm = term;
  }

  setShowForwardForm(show: boolean) {
    this.showForwardForm = show;
    if (!show) {
      this.resetForwardForm();
    }
  }

  setShowTypeSelector(show: boolean) {
    this.showTypeSelector = show;
  }

  setSelectedForwardType(type: 'local' | 'remote' | 'dynamic' | null) {
    this.selectedForwardType = type;
  }

  setShowPassword(show: boolean) {
    this.showPassword = show;
  }

  setShowPassphrase(show: boolean) {
    this.showPassphrase = show;
  }

  setEditingForward(forward: PortForwardItem | null) {
    this.editingForward = forward;
  }

  setIsEditing(editing: boolean) {
    this.isEditing = editing;
  }

  updateForwardForm(updates: Partial<PortForwardForm>) {
    this.forwardForm = { ...this.forwardForm, ...updates };
  }

  resetForwardForm() {
    this.forwardForm = {
      name: '',
      type: 'local',
      localHost: '127.0.0.1',
      localPort: '',
      remoteHost: '',
      remotePort: '',
      server: '',
      serverId: undefined,
      username: '',
      authType: 'password',
      password: '',
      keyPath: '',
      keyContent: '',
      passphrase: ''
    };
    this.showPassword = false;
    this.showPassphrase = false;
    this.isEditing = false;
    this.editingForward = null;
    this.selectedForwardType = null;
  }

  // 创建端口转发
  async createPortForward() {
    // 验证必填字段
    if (!this.forwardForm.name) return;
    
    // 确定转发类型：优先使用selectedForwardType，如果没有则使用表单中的type
    const forwardType = this.selectedForwardType || this.forwardForm.type;
    if (!forwardType) return;
    
    // 验证服务器信息：如果有serverId，则不需要验证server和username
    if (!this.forwardForm.serverId && (!this.forwardForm.server || !this.forwardForm.username)) return;

    // 使用 DataService 创建端口转发
    try {
      const forwardData = {
        name: this.forwardForm.name,
        type: forwardType,
        localHost: this.forwardForm.localHost,
        localPort: this.forwardForm.localPort,
        remoteHost: this.forwardForm.remoteHost,
        remotePort: this.forwardForm.remotePort,
        server: this.forwardForm.serverId ? '' : this.forwardForm.server,
        serverId: this.forwardForm.serverId,
        username: this.forwardForm.serverId ? '' : this.forwardForm.username,
        authType: this.forwardForm.serverId ? 'password' : this.forwardForm.authType,
        password: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'password' ? this.forwardForm.password : undefined),
        keyPath: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'key' ? this.forwardForm.keyPath : undefined),
        keyContent: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'keyContent' ? this.forwardForm.keyContent : undefined),
        passphrase: this.forwardForm.serverId ? undefined : (this.forwardForm.passphrase || undefined),
        selectedForwardType: forwardType
      };

      const { DataService } = await import('../services/dataService');
      await DataService.createPortForward(forwardData);
    } catch (error) {
      console.error('创建端口转发失败:', error);
      // 回退到本地创建
      this.createPortForwardFromData({
        name: this.forwardForm.name,
        type: forwardType,
        localHost: this.forwardForm.localHost,
        localPort: this.forwardForm.localPort,
        remoteHost: this.forwardForm.remoteHost,
        remotePort: this.forwardForm.remotePort,
        server: this.forwardForm.serverId ? '' : this.forwardForm.server,
        serverId: this.forwardForm.serverId,
        username: this.forwardForm.serverId ? '' : this.forwardForm.username,
        authType: this.forwardForm.serverId ? 'password' : this.forwardForm.authType,
        password: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'password' ? this.forwardForm.password : undefined),
        keyPath: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'key' ? this.forwardForm.keyPath : undefined),
        keyContent: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'keyContent' ? this.forwardForm.keyContent : undefined),
        passphrase: this.forwardForm.serverId ? undefined : (this.forwardForm.passphrase || undefined),
        selectedForwardType: forwardType
      });
    }

    this.setShowForwardForm(false);
  }

  // 更新端口转发
  async updatePortForward() {
    if (!this.editingForward) return;
    
    // 确定转发类型：优先使用selectedForwardType，如果没有则使用表单中的type
    const forwardType = this.selectedForwardType || this.forwardForm.type;
    if (!forwardType) return;

    try {
      // 使用 DataService 更新端口转发
      const { DataService } = await import('../services/dataService');
      await DataService.updatePortForward(this.editingForward.id, {
        name: this.forwardForm.name,
        type: this.forwardForm.type,
        selectedForwardType: this.selectedForwardType,
        localHost: this.forwardForm.localHost,
        localPort: this.forwardForm.localPort,
        remoteHost: this.forwardForm.remoteHost,
        remotePort: this.forwardForm.remotePort,
        server: this.forwardForm.server,
        serverId: this.forwardForm.serverId,
        username: this.forwardForm.username,
        authType: this.forwardForm.authType,
        password: this.forwardForm.password,
        keyPath: this.forwardForm.keyPath,
        keyContent: this.forwardForm.keyContent,
        passphrase: this.forwardForm.passphrase
      });
    } catch (error) {
      console.error('更新端口转发失败:', error);
      // 回退到本地更新
      const updatedForward: PortForwardItem = {
        ...this.editingForward,
        name: this.forwardForm.name,
        type: forwardType,
        localHost: this.forwardForm.localHost,
        localPort: parseInt(this.forwardForm.localPort) || 0,
        remoteHost: this.forwardForm.remoteHost,
        remotePort: parseInt(this.forwardForm.remotePort) || 0,
        server: this.forwardForm.serverId ? '' : this.forwardForm.server, // 如果有serverId，不保存server字段
        serverId: this.forwardForm.serverId,
        username: this.forwardForm.serverId ? '' : this.forwardForm.username, // 如果有serverId，不保存手动输入的用户名
        authType: this.forwardForm.serverId ? 'password' : this.forwardForm.authType, // 如果有serverId，重置认证类型
        password: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'password' ? this.forwardForm.password : undefined),
        keyPath: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'key' ? this.forwardForm.keyPath : undefined),
        keyContent: this.forwardForm.serverId ? undefined : (this.forwardForm.authType === 'keyContent' ? this.forwardForm.keyContent : undefined),
        passphrase: this.forwardForm.serverId ? undefined : (this.forwardForm.passphrase || undefined)
      };

      this.portForwards = this.portForwards.map(f => f.id === this.editingForward!.id ? updatedForward : f);
    }

    this.setShowForwardForm(false);
  }



  // 删除端口转发（包含云端同步）
  async deletePortForwardWithSync(forwardId: string) {
    try {
      const { DataService } = await import('../services/dataService');
      await DataService.deletePortForward(forwardId);
    } catch (error) {
      console.error('删除端口转发失败:', error);
      throw error;
    }
  }

  // 启动端口转发
  startPortForward(forwardId: string) {
    const forward = this.portForwards.find(f => f.id === forwardId);
    if (forward) {
      forward.status = 'active';
      forward.lastUsed = new Date().toISOString();
    }
  }

  // 停止端口转发
  stopPortForward(forwardId: string) {
    const forward = this.portForwards.find(f => f.id === forwardId);
    if (forward) {
      forward.status = 'inactive';
    }
  }

  // 设置隧道ID和连接ID
  setTunnelInfo(forwardId: string, tunnelId: string, connectionId: string) {
    const forward = this.portForwards.find(f => f.id === forwardId);
    if (forward) {
      forward.tunnelId = tunnelId;
      forward.connectionId = connectionId;
    }
  }

  // 清除隧道信息
  clearTunnelInfo(forwardId: string) {
    const forward = this.portForwards.find(f => f.id === forwardId);
    if (forward) {
      forward.tunnelId = undefined;
      forward.connectionId = undefined;
    }
  }

  // 编辑端口转发
  editPortForward(forward: PortForwardItem) {
    this.setEditingForward(forward);
    this.setIsEditing(true);
    this.setSelectedForwardType(forward.type);
    this.updateForwardForm({
      name: forward.name,
      type: forward.type,
      localHost: forward.localHost,
      localPort: forward.localPort.toString(),
      remoteHost: forward.remoteHost,
      remotePort: forward.remotePort.toString(),
      server: forward.serverId ? '' : forward.server, // 如果有serverId，清空server字段
      serverId: forward.serverId,
      username: forward.serverId ? '' : forward.username, // 如果有serverId，清空手动输入的用户名
      authType: forward.serverId ? 'password' : forward.authType, // 如果有serverId，重置认证类型
      password: forward.serverId ? '' : (forward.password || ''), // 如果有serverId，清空手动输入的密码
      keyPath: forward.serverId ? '' : (forward.keyPath || ''), // 如果有serverId，清空手动输入的密钥路径
      keyContent: forward.serverId ? '' : (forward.keyContent || ''), // 如果有serverId，清空手动输入的密钥内容
      passphrase: forward.serverId ? '' : (forward.passphrase || '') // 如果有serverId，清空手动输入的密码短语
    });
    this.setShowForwardForm(true);
  }

  // 文件选择处理
  async selectKeyFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pem,.key,.id_rsa';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.updateForwardForm({ keyPath: file.name });
      }
    };
    input.click();
  }

  // 获取状态颜色
  getStatusColor(status: string) {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // 获取状态文本
  getStatusText(status: string) {
    switch (status) {
      case 'active':
        return '活跃';
      case 'error':
        return '错误';
      default:
        return '未激活';
    }
  }

  // 获取类型文本
  getTypeText(type: string) {
    switch (type) {
      case 'local':
        return '本地转发';
      case 'remote':
        return '远程转发';
      case 'dynamic':
        return '动态转发';
      default:
        return type.toUpperCase();
    }
  }

  // 获取转发类型标题
  getForwardTypeTitle() {
    switch (this.selectedForwardType) {
      case 'local':
        return '本地端口转发 (-L)';
      case 'remote':
        return '远程端口转发 (-R)';
      case 'dynamic':
        return '动态端口转发 (-D)';
      default:
        return '选择转发类型';
    }
  }

  // 获取转发类型描述
  getForwardTypeDescription() {
    switch (this.selectedForwardType) {
      case 'local':
        return '将本地端口转发到远程主机端口';
      case 'remote':
        return '将远程端口转发到本地主机端口';
      case 'dynamic':
        return '创建 SOCKS 代理服务器';
      default:
        return '选择您要创建的 SSH 端口转发类型';
    }
  }

  // 加载数据
  public loadData() {
    const savedData = this.persistence.load<{ portForwards: PortForwardItem[] }>({ portForwards: [] });
    this.portForwards = savedData.portForwards;
  }

  // 保存数据
  private saveData() {
    if (!authStore.isAuthenticated) {
      this.persistence.save({
        portForwards: this.portForwards
      });
    }
  }

  persist() {
    if (!authStore.isAuthenticated) {
      this.saveData();
    }
  }

  // 清空端口转发列表（只操作内存）
  clearPortForwards() {
    this.portForwards = [];
  }

  // 添加端口转发到内存（只操作内存）
  addPortForward(forward: PortForwardItem) {
    this.portForwards.push(forward);
  }

  // 从云端添加端口转发（只操作内存）
  addPortForwardFromCloud(forward: any) {
    // 转换云端数据格式为本地格式
    const forwardItem: PortForwardItem = {
      id: forward.localId || `forward_${Date.now()}_${Math.random()}`,
      cloudId: forward.id, // 保存云端ID
      name: forward.name,
      type: forward.type,
      localHost: forward.localHost || '127.0.0.1',
      localPort: forward.localPort || 0,
      remoteHost: forward.remoteHost || '',
      remotePort: forward.remotePort || 0,
      server: forward.serverAddress || forward.server || '',
      serverId: forward.serverId,
      status: 'inactive',
      createdAt: forward.createdAt || new Date().toISOString().split('T')[0],
      username: forward.username || '',
      authType: forward.authType || 'password',
      password: forward.authType === 'password' ? forward.password : undefined,
      keyPath: forward.authType === 'key' ? forward.keyPath : undefined,
      keyContent: forward.authType === 'keyContent' ? forward.keyContent : undefined,
      passphrase: forward.passphrase || undefined
    };

    this.portForwards.push(forwardItem);
  }

  // 从数据创建端口转发（只操作内存）
  createPortForwardFromData(forwardData: any): PortForwardItem {
    const forwardType = forwardData.selectedForwardType || forwardData.type;
    
    const newForward: PortForwardItem = {
      id: `forward_${Date.now()}_${Math.random()}`,
      name: forwardData.name,
      type: forwardType,
      localHost: forwardData.localHost || '127.0.0.1',
      localPort: parseInt(forwardData.localPort) || 0,
      remoteHost: forwardData.remoteHost || '',
      remotePort: parseInt(forwardData.remotePort) || 0,
      server: forwardData.server || '',
      serverId: forwardData.serverId,
      status: 'inactive',
      createdAt: new Date().toISOString().split('T')[0],
      username: forwardData.username || '',
      authType: forwardData.authType || 'password',
      password: forwardData.authType === 'password' ? forwardData.password : undefined,
      keyPath: forwardData.authType === 'key' ? forwardData.keyPath : undefined,
      keyContent: forwardData.authType === 'keyContent' ? forwardData.keyContent : undefined,
      passphrase: forwardData.passphrase || undefined
    };

    this.portForwards.push(newForward);
    return newForward;
  }

  // 更新端口转发的云端ID（只操作内存）
  updatePortForwardCloudId(forwardId: string, cloudId: string) {
    const forward = this.portForwards.find(f => f.id === forwardId);
    if (forward) {
      forward.cloudId = cloudId;
    }
  }

  // 删除端口转发（只操作内存）
  deletePortForward(forwardId: string) {
    this.portForwards = this.portForwards.filter(forward => forward.id !== forwardId);
  }

  // 更新端口转发（只操作内存）
  updatePortForwardInMemory(forwardId: string, updates: Partial<PortForwardItem>) {
    const forward = this.portForwards.find(f => f.id === forwardId);
    if (forward) {
      Object.assign(forward, updates);
    }
  }
}

export const portForwardingStore = new PortForwardingStore(); 