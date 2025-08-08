// ==================== 基础类型 ====================

export interface BaseItem {
  id: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
}

// ==================== 通用类型 ====================

export type Status = 'active' | 'inactive' | 'error' | 'connected' | 'disconnected' | 'connecting';

export type AuthType = 'password' | 'key' | 'keyContent' | 'keySelect';

export type ForwardType = 'local' | 'remote' | 'dynamic';

export type KeyType = 'rsa' | 'ed25519' | 'ecdsa' | 'password';

// ==================== UI 状态相关类型 ====================

export interface UIState {
  searchTerm: string;
  showForm: boolean;
  showPassword: boolean;
  showPassphrase: boolean;
  isEditing: boolean;
  editingItem: any | null;
}

// ==================== Store 相关类型 ====================

export interface StoreState<T> {
  items: T[];
  ui: UIState;
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
} 