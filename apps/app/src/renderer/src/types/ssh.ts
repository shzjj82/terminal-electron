import { AuthType } from './base';

// ==================== SSH 配置相关类型 ====================

export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  authType: AuthType;
  password?: string;
  keyPath?: string;
  keyContent?: string;
  passphrase?: string;
}

export interface SSHConnectionResult {
  success: boolean;
  connectionId?: string;
  error?: string;
  welcomeInfo?: string;
}

export interface SSHCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
} 