// SSH服务 - 通过IPC与主进程通信
export interface SSHConnectionConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  timeout?: number;
  authType: 'password' | 'key' | 'keyContent';
  keyPath?: string;
  keyContent?: string;
  keepalive?: number;
}

// 流式 SSH 接口
export async function startSshSession(config: any): Promise<string> {
  const result = await (window as any).electron.invoke('ssh.startSession', config);
  return result.sessionId;
}

export function writeSsh(sessionId: string, data: string) {
  (window as any).electron.invoke('ssh.write', sessionId, data);
}

export function closeSsh(sessionId: string) {
  (window as any).electron.invoke('ssh.close', sessionId);
}

export function onSshData(sessionId: string, callback: (data: string) => void) {
  const eventName = `ssh.data.${sessionId}`;
  (window as any).electron.on(eventName, (data: string) => {
    callback(data);
  });
}

export function onSshExit(sessionId: string, callback: () => void) {
  const eventName = `ssh.exit.${sessionId}`;
  (window as any).electron.on(eventName, () => {
    callback();
  });
}

// 创建全局实例（保持兼容性）
export const sshService = {
  connect: async (config: SSHConnectionConfig) => {
    const sessionId = await startSshSession(config);
    return { success: true, connectionId: sessionId };
  },
  disconnect: (connectionId: string) => closeSsh(connectionId),
  isConnectionActive: () => true,
}; 