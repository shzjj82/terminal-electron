import { BaseItem, AuthType, Status, ForwardType } from './base';

// ==================== 端口转发相关类型 ====================

export interface PortForwardItem extends BaseItem {
  type: ForwardType;
  localHost: string;
  localPort: number;
  remoteHost: string;
  remotePort: number;
  server: string; // 服务器地址（手动输入时使用）
  serverId?: string; // 服务器ID（选择服务器时使用）
  status: Status;
  cloudId?: string; // 云端端口转发ID
  // SSH 连接相关字段（手动输入时使用）
  username: string;
  authType: AuthType;
  password?: string;
  keyPath?: string;
  keyContent?: string;
  passphrase?: string;
  // 运行时跟踪字段
  tunnelId?: string; // 隧道ID，用于关闭端口转发
  connectionId?: string; // SSH连接ID，用于关闭SSH连接
}

export interface PortForwardForm {
  name: string;
  type: ForwardType;
  localHost: string;
  localPort: string;
  remoteHost: string;
  remotePort: string;
  server: string;
  serverId?: string;
  username: string;
  authType: AuthType;
  password: string;
  keyPath: string;
  keyContent: string;
  passphrase: string;
}

// ==================== 端口转发配置相关类型 ====================

export interface PortForwardingConfig {
  type: ForwardType;
  localHost?: string;
  localPort?: number;
  remoteHost?: string;
  remotePort?: number;
  bindAddress?: string;
  bindPort?: number;
}

export interface PortForwardingResult {
  success: boolean;
  tunnelId?: string;
  error?: string;
  localPort?: number;
  remotePort?: number;
} 