import { BaseItem, KeyType } from './base';

// ==================== 密钥相关类型 ====================

export interface KeyItem extends BaseItem {
  type: KeyType;
  fingerprint: string;
  publicKey: string;
  privateKey?: string;
  password?: string; // 密码类型的密钥
  cloudId?: string; // 云端密钥ID
}

export interface KeyForm {
  name: string;
  password: string;
  keyPath: string;
  keyContent: string;
}

export type CreateKeyMode = 'password' | 'file' | 'content'; 