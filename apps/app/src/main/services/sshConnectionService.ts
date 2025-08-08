import { Client } from 'ssh2';

export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  authType: 'password' | 'key' | 'keyContent' | 'keySelect';
  password?: string;
  keyPath?: string;
  keyContent?: string;
  keyId?: string;
  passphrase?: string;
}

export interface SSHConnection {
  client: Client;
  config: SSHConfig;
  isConnected: boolean;
  connectTime: number;
  welcomeInfo?: string;
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

class SSHConnectionService {
  private connections = new Map<string, SSHConnection>();

  async connect(config: SSHConfig): Promise<SSHConnectionResult> {
    return new Promise((resolve) => {
      const connectionId = `ssh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const conn = new Client();

      // 构建SSH连接配置
      const sshConfig = this.buildSSHConfig(config);



      conn.on('ready', () => {
        clearTimeout(timeoutId);

        // 获取服务器欢迎信息
        this.getServerWelcomeInfo(conn, connectionId, config, resolve);
      });

      conn.on('error', (err) => {
        console.error('SSH连接错误:', err.message);
        console.error('错误详情:', err);
        clearTimeout(timeoutId);
        resolve({ success: false, error: `SSH连接失败: ${err.message}` });
      });

      conn.on('end', () => {
        const connection = this.connections.get(connectionId);
        if (connection) {
          connection.isConnected = false;
        }
      });

      conn.on('timeout', () => {
        clearTimeout(timeoutId);
        conn.end();
        resolve({ success: false, error: 'SSH连接超时 - 服务器无响应' });
      });

      // 设置连接超时
      const timeoutId = setTimeout(() => {
        if (!this.connections.has(connectionId)) {
          conn.end();
          resolve({ success: false, error: 'Connection timeout - 连接超时，请检查网络连接和服务器状态' });
        }
      }, 30000); // 使用固定的30秒超时

      conn.connect(sshConfig);
    });
  }

  async executeCommand(connectionId: string, command: string): Promise<SSHCommandResult> {
    return new Promise((resolve, reject) => {
      const connection = this.connections.get(connectionId);
      if (!connection || !connection.isConnected) {
        reject(new Error('Connection not found or not connected'));
        return;
      }



      connection.client.exec(command, (err, stream) => {
        if (err) {
          console.error('SSH命令执行错误:', err);
          reject(err);
          return;
        }

        let stdout = '';
        let stderr = '';

        stream.on('data', (data: Buffer) => {
          stdout += data.toString();
        });

        stream.stderr.on('data', (data: Buffer) => {
          stderr += data.toString();
        });

        stream.on('close', (code: number) => {
          if (stdout) {
            // 命令输出处理
          }
          if (stderr) {
            // 错误输出处理
          }
          resolve({ stdout, stderr, exitCode: code });
        });

        stream.on('error', (err: Error) => {
          console.error('SSH命令流错误:', err);
          reject(err);
        });
      });
    });
  }

  async disconnect(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection && connection.isConnected) {
      connection.client.end();
      connection.isConnected = false;
      this.connections.delete(connectionId);
    }
  }

  isConnected(connectionId: string): boolean {
    const connection = this.connections.get(connectionId);
    return connection ? connection.isConnected : false;
  }

  getConnection(connectionId: string): SSHConnection | undefined {
    return this.connections.get(connectionId);
  }

  clearAllConnections(): void {
    this.connections.clear();
  }

  private buildSSHConfig(config: SSHConfig): any {
    const sshConfig: any = {
      host: config.host,
      port: config.port,
      username: config.username,
      timeout: 30000, // 增加超时时间到30秒
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
      readyTimeout: 20000, // SSH握手超时时间
      retryMinTimeout: 2000, // 重试最小间隔
      retryMaxTimeout: 10000, // 重试最大间隔
      maxRetries: 3, // 最大重试次数
      // 启用GatewayPorts，允许远程端口转发绑定到所有接口
      gatewayPorts: true,
      algorithms: {
        kex: [
          'diffie-hellman-group1-sha1',
          'diffie-hellman-group14-sha1',
          'diffie-hellman-group-exchange-sha1',
          'diffie-hellman-group-exchange-sha256',
          'diffie-hellman-group16-sha512',
          'diffie-hellman-group18-sha512',
          'curve25519-sha256',
          'curve25519-sha256@libssh.org'
        ],
        cipher: [
          'aes128-ctr',
          'aes192-ctr',
          'aes256-ctr',
          'aes128-gcm',
          'aes256-gcm',
          'aes128-cbc',
          'aes192-cbc',
          'aes256-cbc',
          '3des-cbc'
        ],
        serverHostKey: [
          'ssh-rsa',
          'ssh-dss',
          'ecdsa-sha2-nistp256',
          'ecdsa-sha2-nistp384',
          'ecdsa-sha2-nistp521',
          'ssh-ed25519'
        ],
        hmac: [
          'hmac-sha2-256',
          'hmac-sha2-512',
          'hmac-sha1'
        ]
      }
    };

    // 根据认证方式设置认证信息
    if (config.authType === 'password' && config.password) {
      sshConfig.password = config.password;
    } else if (config.authType === 'key' && config.keyPath) {
      try {
        sshConfig.privateKey = require('fs').readFileSync(config.keyPath);
        if (config.passphrase) {
          sshConfig.passphrase = config.passphrase;
        }
      } catch (error) {
        console.error('读取密钥文件失败:', error);
        throw new Error(`Failed to read key file: ${config.keyPath}`);
      }
    } else if (config.authType === 'keyContent' && config.keyContent) {
      sshConfig.privateKey = config.keyContent;
      if (config.passphrase) {
        sshConfig.passphrase = config.passphrase;
      }
    } else if (config.authType === 'keySelect') {
      // keySelect 类型，根据传递的内容判断实际认证方式
      if (config.keyContent) {
        // 如果传递了密钥内容，使用密钥认证
        sshConfig.privateKey = config.keyContent;
        if (config.passphrase) {
          sshConfig.passphrase = config.passphrase;
        }
      } else if (config.password) {
        // 如果传递了密码，使用密码认证
        sshConfig.password = config.password;
      } else {
        console.error('keySelect认证类型需要提供keyContent或password');
        throw new Error('Selected key not found or invalid - 请提供密钥内容或密码');
      }
    } else {
      console.error('未找到有效的认证信息');
      throw new Error('No valid authentication method provided');
    }



    return sshConfig;
  }

  private async getServerWelcomeInfo(
    conn: Client,
    connectionId: string,
    config: SSHConfig,
    resolve: (value: SSHConnectionResult) => void
  ) {
    // 获取SSH登录时的欢迎信息
    conn.exec('echo "=== SSH_LOGIN_INFO_START ===" && cat /etc/motd 2>/dev/null || echo "No motd" && echo "=== SSH_LOGIN_INFO_END ==="', (err, stream) => {
      if (err) {
        // 如果获取motd失败，直接保存连接信息
        this.connections.set(connectionId, {
          client: conn,
          config,
          isConnected: true,
          connectTime: Date.now()
        });
        resolve({ success: true, connectionId });
      } else {
        let motdInfo = '';
        stream.on('data', (data) => {
          motdInfo += data.toString();
        });
        stream.on('close', () => {
          // 保存连接信息
          this.connections.set(connectionId, {
            client: conn,
            config,
            isConnected: true,
            connectTime: Date.now(),
            welcomeInfo: motdInfo.trim()
          });

          resolve({ success: true, connectionId, welcomeInfo: motdInfo.trim() });
        });
      }
    });
  }

  // 暂时注释掉未使用的方法
  // private getConnectionDuration(connectionId: string): string {
  //   const connection = this.connections.get(connectionId);
  //   if (connection && connection.connectTime) {
  //     const duration = Date.now() - connection.connectTime;
  //     const seconds = Math.floor(duration / 1000);
  //     const minutes = Math.floor(seconds / 60);
  //     const hours = Math.floor(minutes / 60);

  //     if (hours > 0) {
  //       return `${hours}小时${minutes % 60}分钟${seconds % 60}秒`;
  //     } else if (minutes > 0) {
  //       return `${minutes}分钟${seconds % 60}秒`;
  //     } else {
  //       return `${seconds}秒`;
  //     }
  //   }
  //   return '未知';
  // }
}

export const sshConnectionService = new SSHConnectionService(); 