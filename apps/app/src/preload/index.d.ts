import { ElectronAPI } from '@electron-toolkit/preload'

interface SSHConfig {
  host: string;
  port: number;
  username: string;
  authType: 'password' | 'key' | 'keyContent' | 'keySelect';
  password?: string;
  keyPath?: string;
  keyContent?: string;
  passphrase?: string;
  timeout?: number;
  keepalive?: number;
}

interface PortForwardingConfig {
  type: 'dynamic' | 'local' | 'remote';
  localHost?: string;
  localPort?: number;
  remoteHost?: string;
  remotePort?: number;
  bindAddress?: string;
  bindPort?: number;
}

interface SSHAPI {
  connect: (config: SSHConfig) => Promise<{ success: boolean; connectionId?: string; error?: string; welcomeInfo?: string }>;
  execute: (connectionId: string, command: string) => Promise<{ stdout: string; stderr: string; exitCode: number }>;
  disconnect: (connectionId: string) => Promise<{ success: boolean; error?: string }>;
  isConnected: (connectionId: string) => Promise<boolean>;
  createPortForwarding: (connectionId: string, config: PortForwardingConfig) => Promise<{ success: boolean; tunnelId?: string; error?: string; localPort?: number; remotePort?: number }>;
  closePortForwarding: (tunnelId: string) => Promise<{ success: boolean; error?: string }>;
}

interface WindowAPI {
  close: () => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
}

// 扩展 ElectronAPI 以包含我们的自定义方法
interface ExtendedElectronAPI extends ElectronAPI {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  on: (channel: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electron: ExtendedElectronAPI
    api: {
      ssh: SSHAPI;
      window: WindowAPI;
    }
  }
}
