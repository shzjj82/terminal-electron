import { BaseItem, AuthType, Status } from './base';

// ==================== 服务器相关类型 ====================

export interface ServerItem extends BaseItem {
  host: string;
  port: number;
  username: string;
  status: Status;
  lastConnected?: string;
  cloudId?: string; // 云端服务器ID
  // SSH 连接相关字段
  authType: AuthType;
  password?: string;
  keyPath?: string;
  keyContent?: string;
  keyId?: string;
  passphrase?: string;
  // 高级选项
  timeout?: number;
  keepalive?: number;
  compression?: boolean;
  strictHostKeyChecking?: boolean;
}

export interface ServerForm {
  name: string;
  host: string;
  port: string;
  username: string;
  authType: AuthType;
  password: string;
  keyPath: string;
  keyContent: string;
  keyId: string;
  passphrase: string;
  timeout: string;
  keepalive: string;
  compression: boolean;
  strictHostKeyChecking: boolean;
}

export interface ServerListItem {
  id: string;
  name: string;
  host: string;
  username: string;
  authType: AuthType;
} 