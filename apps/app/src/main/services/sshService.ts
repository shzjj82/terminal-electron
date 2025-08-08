import { sshConnectionService, SSHConfig, SSHConnectionResult, SSHCommandResult } from './sshConnectionService';
import { portForwardingService, PortForwardingConfig, PortForwardingResult } from './portForwardingService';
import { ipcMain, WebContents } from 'electron';
import { Client } from 'ssh2';

interface Session {
  conn: Client;
  stream: any;
  webContents: WebContents;
}

const sessions = new Map<string, Session>();

ipcMain.handle('ssh.startSession', async (event, config) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.shell({ term: 'xterm-color' }, (err, stream) => {
        if (err) {
          conn.end();
          reject(err);
          return;
        }
        const sessionId = Math.random().toString(36).slice(2);
        const webContents = event.sender;
        sessions.set(sessionId, { conn, stream, webContents });
        stream.on('data', (data: Buffer) => {
          let str = '';
          if (typeof data === 'string') {
            str = data;
          } else if (data && typeof data.toString === 'function') {
            str = data.toString();
          }
          if (str) {
            const eventName = `ssh.data.${sessionId}`;
            webContents.send(eventName, str);
          }
        });
        stream.on('close', () => {
          sessions.delete(sessionId);
          const eventName = `ssh.exit.${sessionId}`;
          webContents.send(eventName);
          conn.end();
        });
        resolve({ sessionId });
      });
    }).on('error', (err) => {
      reject(err);
    }).on('close', () => {
    }).connect({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      privateKey: config.privateKey,
      passphrase: config.passphrase,
      tryKeyboard: true,
    });
  });
});

ipcMain.handle('ssh.write', (_event, sessionId, data) => {
  const session = sessions.get(sessionId);
  if (session) {
    session.stream.write(data);
  }
});

ipcMain.handle('ssh.close', (_event, sessionId) => {
  const session = sessions.get(sessionId);
  if (session) {
    session.conn.end();
    sessions.delete(sessionId);
  }
});

// 重新导出类型，保持向后兼容
export type { SSHConfig, SSHConnectionResult, SSHCommandResult } from './sshConnectionService';
export type { PortForwardingConfig, PortForwardingResult } from './portForwardingService';

class SSHService {
  // SSH 连接相关方法
  async connect(config: SSHConfig): Promise<SSHConnectionResult> {
    return sshConnectionService.connect(config);
  }

  async executeCommand(connectionId: string, command: string): Promise<SSHCommandResult> {
    return sshConnectionService.executeCommand(connectionId, command);
  }

  async disconnect(connectionId: string): Promise<void> {
    return sshConnectionService.disconnect(connectionId);
  }

  isConnected(connectionId: string): boolean {
    return sshConnectionService.isConnected(connectionId);
  }

  // 端口转发相关方法
  async createPortForwarding(
    connectionId: string,
    config: PortForwardingConfig
  ): Promise<PortForwardingResult> {
    const connection = sshConnectionService.getConnection(connectionId);
    if (!connection) {
      return { success: false, error: 'Connection not found' };
    }
    
    return portForwardingService.createPortForwarding(connection, config);
  }

  async closePortForwarding(tunnelId: string): Promise<{ success: boolean; error?: string }> {
    return portForwardingService.closePortForwarding(tunnelId);
  }

  // 清理方法
  clearAllConnections(): void {
    sshConnectionService.clearAllConnections();
  }

  clearAllPortForwarding(): void {
    portForwardingService.clearAllPortForwarding();
  }

  cleanupAll(): void {
    // 清理所有端口转发
    this.clearAllPortForwarding();
    
    // 清理所有SSH连接
    this.clearAllConnections();
  }
}

export const sshService = new SSHService();