import { useMemo } from 'react';
import { getServersStore } from '@renderer/stores/globalStores';
import { getKeysStore } from '@renderer/stores/globalStores';
import { SSHConfig, KeyItem } from '@renderer/types';

// 构建SSH配置的核心逻辑
const buildSSHConfigCore = (serverId?: string): SSHConfig | null => {
  if (!serverId) return null;

  const serversStore = getServersStore();
  const keysStore = getKeysStore();

  // 1. 获取服务器信息
  const server = serversStore.servers.find(s => s.id === serverId);
  if (!server) return null;

  // 2. 获取关联的密钥信息（如果有keyId）
  let key: KeyItem | null = null;
  if (server.keyId) {
    // 首先尝试通过本地ID查找
    key = keysStore.keys.find(k => k.id === server.keyId) || null;
    
    // 如果没找到，尝试通过云端ID查找
    if (!key) {
      key = keysStore.keys.find(k => k.cloudId === server.keyId) || null;
    }
  }
  // 3. 构建SSH配置
  const sshConfig: SSHConfig = {
    host: server.host,
    port: server.port,
    username: server.username,
    authType: server.authType
  };

  // 根据认证类型设置认证信息
  switch (server.authType) {
    case 'password':
      if (server.password) {
        sshConfig.password = server.password;
      }
      break;
    
    case 'key':
      if (server.keyPath) {
        sshConfig.keyPath = server.keyPath;
        if (server.passphrase) {
          sshConfig.passphrase = server.passphrase;
        }
      }
      break;
    
    case 'keyContent':
      if (server.keyContent) {
        sshConfig.keyContent = server.keyContent;
        if (server.passphrase) {
          sshConfig.passphrase = server.passphrase;
        }
      }
      break;
    
    case 'keySelect':
      // keySelect类型根据密钥类型来决定使用哪种认证方式
      if (key) {
        if (key.type === 'password') {
          // 密码类型的密钥，使用password字段
          if (key.password) {
            sshConfig.password = key.password;
          }
        } else {
          // 其他密钥类型（rsa, ed25519, ecdsa），使用privateKey字段
          if (key.privateKey) {
            sshConfig.keyContent = key.privateKey;
            if (server.passphrase) {
              sshConfig.passphrase = server.passphrase;
            }
          }
        }
      } else if (server.password) {
        // 如果没有找到密钥，回退到服务器配置的密码
        sshConfig.password = server.password;
      }
      break;
  }

  return sshConfig;
};

// React hooks版本（用于组件中）
export const useSSHConfig = (serverId?: string): SSHConfig | null => {
  const serversStore = getServersStore();
  const keysStore = getKeysStore();

  return useMemo(() => {
    const server = serversStore.servers.find(s => s.id === serverId);
    if (!server) return null;
    const sshConfig = useMemo(() => {
      const config = buildSSHConfigCore(serverId);
      return config;
    }, [serverId, serversStore.servers, keysStore.keys]);
    return sshConfig;
  }, [serverId, serversStore.servers, keysStore.keys]);
};

// 同步函数版本（用于非React环境）
export const buildSSHConfig = buildSSHConfigCore; 