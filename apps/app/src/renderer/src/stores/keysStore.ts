import { makeAutoObservable, reaction } from 'mobx';
import { createPersistenceManager } from './persistence';
import { KeyItem, KeyForm, CreateKeyMode } from '../types';
import { authStore } from './authStore';

class KeysStore {
  private persistence = createPersistenceManager('keys-store');

  // 密钥列表
  keys: KeyItem[] = [];

  // UI 状态
  searchTerm = '';
  showCreateKeyDialog = false;
  createKeyMode: CreateKeyMode = 'password';
  showPassword = false;
  
  // 编辑状态
  isEditing = false;
  editingKey: KeyItem | null = null;
  
  // 删除确认状态
  showDeleteConfirmDialog = false;
  deletingKey: KeyItem | null = null;

  // 表单数据
  keyForm: KeyForm = {
    name: '',
    password: '',
    keyPath: '',
    keyContent: ''
  };

  constructor() {
    makeAutoObservable(this);
    
    // 初始化时加载数据
    this.loadData();
    
    // 监听 keys 变化并自动保存
    reaction(
      () => this.keys.length,
      () => {
        if (!authStore.isAuthenticated) {
          this.saveData();
        }
      },
      { fireImmediately: false }
    );
  }

  // 计算属性
  get filteredKeys() {
    return this.keys.filter(key =>
      key.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      key.fingerprint.includes(this.searchTerm)
    );
  }

  // Actions
  setSearchTerm(term: string) {
    this.searchTerm = term;
  }

  setShowCreateKeyDialog(show: boolean) {
    this.showCreateKeyDialog = show;
    if (!show) {
      this.resetKeyForm();
    }
  }

  setCreateKeyMode(mode: CreateKeyMode) {
    this.createKeyMode = mode;
  }

  setShowPassword(show: boolean) {
    this.showPassword = show;
  }

  // 编辑相关方法
  setIsEditing(editing: boolean) {
    this.isEditing = editing;
  }

  setEditingKey(key: KeyItem | null) {
    this.editingKey = key;
  }

  startEdit(key: KeyItem) {
    this.isEditing = true;
    this.editingKey = key;
    this.keyForm = {
      name: key.name,
      password: key.password || '',
      keyPath: '',
      keyContent: key.privateKey || ''
    };
    this.createKeyMode = key.type === 'password' ? 'password' : 'content';
    this.setShowCreateKeyDialog(true);
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingKey = null;
    this.resetKeyForm();
    this.setShowCreateKeyDialog(false);
  }

  // 删除确认相关方法
  setShowDeleteConfirmDialog(show: boolean) {
    this.showDeleteConfirmDialog = show;
  }

  setDeletingKey(key: KeyItem | null) {
    this.deletingKey = key;
  }

  showDeleteConfirm(key: KeyItem) {
    this.deletingKey = key;
    this.showDeleteConfirmDialog = true;
  }

  async confirmDelete() {
    if (this.deletingKey) {
      try {
        await this.deleteKeyWithSync(this.deletingKey.id);
        this.deletingKey = null;
        this.showDeleteConfirmDialog = false;
      } catch (error) {
        console.error('删除密钥失败:', error);
        // 这里可以显示错误提示，但仍然关闭对话框
        this.deletingKey = null;
        this.showDeleteConfirmDialog = false;
      }
    }
  }

  cancelDelete() {
    this.deletingKey = null;
    this.showDeleteConfirmDialog = false;
  }

  updateKeyForm(updates: Partial<KeyForm>) {
    this.keyForm = { ...this.keyForm, ...updates };
  }

  resetKeyForm() {
    this.keyForm = {
      name: '',
      password: '',
      keyPath: '',
      keyContent: ''
    };
    this.createKeyMode = 'password';
    this.showPassword = false;
  }

  // 创建密钥
  async createKey() {
    if (!this.keyForm.name) return;
    try {
      const keyData = {
        name: this.keyForm.name,
        type: this.createKeyMode === 'password' ? 'password' : 'rsa',
        password: this.createKeyMode === 'password' ? this.keyForm.password : undefined,
        privateKey: this.createKeyMode === 'content' ? this.keyForm.keyContent : undefined
      };

      // 同步到云端
      if (authStore.isAuthenticated) {
        const { DataService } = await import('../services/dataService');
        const namespace = DataService.getCurrentDataContext();
        const { syncApi } = await import('@/api/sync');
        const createdKey = await syncApi.createKey(keyData, namespace);
        this.addKeyFromCloud(createdKey);
      } else {
        // 本地创建
        const { DataService } = await import('../services/dataService');
        const createdKey = DataService.createKey(keyData);
        this.addKeyFromCloud(createdKey);
      }

      this.setShowCreateKeyDialog(false);
      this.resetKeyForm();
      this.setIsEditing(false);
      this.setEditingKey(null);
      this.saveData();
    } catch (error) {
      console.error('创建密钥失败:', error);
    }
  }

  // 删除密钥（仅本地删除，由 DataService 调用）
  async deleteKey(keyId: string) {
    try {
      // 同步到云端
      if (authStore.isAuthenticated) {
        const { syncApi } = await import('@/api/sync');
        const { DataService } = await import('../services/dataService');
        const namespace = DataService.getCurrentDataContext();
        await syncApi.deleteKey(keyId, namespace);
      }

      this.keys = this.keys.filter(k => k.id !== keyId);
      this.saveData();
    } catch (error) {
      console.error('删除密钥失败:', error);
    }
  }

  // 删除密钥（包含云端同步）
  async deleteKeyWithSync(keyId: string) {
    try {
      await this.deleteKey(keyId);
    } catch (error) {
      console.error('删除密钥失败:', error);
    }
  }

  // 更新密钥
  async updateKey(keyId: string, updates: Partial<KeyItem>) {
    try {
      const key = this.keys.find(k => k.id === keyId);
      if (!key) return;

      // 更新本地数据
      Object.assign(key, updates);

      // 同步到云端
      if (authStore.isAuthenticated) {
        const { syncApi } = await import('@/api/sync');
        const { DataService } = await import('../services/dataService');
        const namespace = DataService.getCurrentDataContext();
        await syncApi.updateKey(keyId, updates, namespace);
      }

      this.saveData();
    } catch (error) {
      console.error('更新密钥失败:', error);
    }
  }

  // 文件选择处理
  async selectKeyFile() {
    // 这里可以调用 Electron 的文件选择对话框
    // 暂时使用浏览器原生的文件选择
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pem,.key,.id_rsa';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.updateKeyForm({ keyPath: file.name });
      }
    };
    input.click();
  }

  // 获取密钥类型颜色
  getKeyTypeColor(type: string) {
    switch (type) {
      case 'rsa':
        return 'text-blue-600 bg-blue-100';
      case 'ed25519':
        return 'text-green-600 bg-green-100';
      case 'ecdsa':
        return 'text-purple-600 bg-purple-100';
      case 'password':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // 获取密钥类型文本
  getKeyTypeText(type: string) {
    switch (type) {
      case 'rsa':
        return 'RSA';
      case 'ed25519':
        return 'ED25519';
      case 'ecdsa':
        return 'ECDSA';
      case 'password':
        return '密码';
      default:
        return type.toUpperCase();
    }
  }

  // 加载数据
  public loadData() {
    const savedData = this.persistence.load<{ keys: KeyItem[] }>({ keys: [] });
    this.keys = savedData.keys;
  }

  // 保存数据
  private saveData() {
    if (!authStore.isAuthenticated) {
      this.persistence.save({
        keys: this.keys
      });
    }
  }

  persist() {
    if (!authStore.isAuthenticated) {
      this.saveData();
    }
  }

  // 清空密钥列表（只操作内存）
  clearKeys() {
    this.keys = [];
  }

  // 添加密钥到内存（只操作内存）
  addKey(key: KeyItem) {
    this.keys.push(key);
  }

  // 从云端添加密钥（只操作内存）
  addKeyFromCloud(key: any) {
    // 转换云端数据格式为本地格式
    const keyItem: KeyItem = {
      id: key.id || `key_${Date.now()}_${Math.random()}`,
      cloudId: key.id, // 保存云端ID
      name: key.name,
      type: key.type,
      fingerprint: 'SHA256:' + Date.now(),
      publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...',
      createdAt: new Date().toISOString().split('T')[0],
      privateKey: key.privateKey || '',
      password: key.passphrase || ''
    };

    this.keys.push(keyItem);
  }

  // 从数据创建密钥（只操作内存）
  createKeyFromData(keyData: any): KeyItem {
    const newKey: KeyItem = {
      id: `key_${Date.now()}_${Math.random()}`,
      name: keyData.name,
      type: keyData.type,
      fingerprint: 'SHA256:' + Date.now(),
      publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...',
      createdAt: new Date().toISOString().split('T')[0],
      privateKey: keyData.privateKey || '',
      password: keyData.password || ''
    };

    this.keys.push(newKey);
    return newKey;
  }

  // 更新密钥的云端ID（只操作内存）
  updateKeyCloudId(keyId: string, cloudId: string) {
    const key = this.keys.find(k => k.id === keyId);
    if (key) {
      key.cloudId = cloudId;
    }
  }
}

export const keysStore = new KeysStore(); 