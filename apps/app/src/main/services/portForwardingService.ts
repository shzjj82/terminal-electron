import { SSHConnection } from './sshConnectionService';

export interface PortForwardingConfig {
  type: 'dynamic' | 'local' | 'remote';
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

class PortForwardingService {
  private tunnels = new Map<string, any>(); // 存储端口转发隧道

  async createPortForwarding(
    connection: SSHConnection,
    config: PortForwardingConfig
  ): Promise<PortForwardingResult> {
    return new Promise((resolve) => {
      if (!connection.isConnected) {
        resolve({ success: false, error: 'Connection not connected' });
        return;
      }

      const tunnelId = `tunnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      try {
        switch (config.type) {
          case 'dynamic':
            this.createDynamicForwarding(connection, tunnelId, config, resolve);
            break;
          case 'local':
            this.createLocalForwarding(connection, tunnelId, config, resolve);
            break;
          case 'remote':
            this.createRemoteForwarding(connection, tunnelId, config, resolve);
            break;
          default:
            resolve({ success: false, error: 'Invalid forwarding type' });
        }
      } catch (error) {
        console.error('端口转发创建失败:', error);
        resolve({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });
  }

  async closePortForwarding(tunnelId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const tunnel = this.tunnels.get(tunnelId);
      if (tunnel) {
        if (tunnel.type === 'remote') {
          // 远程端口转发，需要取消转发
          if (tunnel.connection && tunnel.connection.client) {
            try {
              tunnel.connection.client.unforwardIn(
                '0.0.0.0', // 使用与创建时相同的地址
                tunnel.remotePort || 22,
                (_err) => {
                  // 静默处理错误
                }
              );
            } catch (error) {
              // 静默处理错误
            }
          }
        } else {
          // 本地和动态端口转发，直接关闭服务器
          if (tunnel && typeof tunnel.close === 'function') {
            tunnel.close();
          }
        }
        
        this.tunnels.delete(tunnelId);
        return { success: true };
      } else {
        return { success: false, error: 'Tunnel not found' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  clearAllPortForwarding(): void {
    for (const [tunnelId, tunnel] of this.tunnels.entries()) {
      try {
        if (tunnel.type === 'remote') {
          // 远程端口转发，需要取消转发
          if (tunnel.connection && tunnel.connection.client) {
            tunnel.connection.client.unforwardIn(
              '0.0.0.0', // 使用与创建时相同的地址
              tunnel.remotePort || 22,
              (err) => {
                if (err) {
                  console.error('清理时取消远程端口转发失败:', err);
                }
              }
            );
          }
        } else {
          // 本地和动态端口转发，直接关闭服务器
          if (tunnel && typeof tunnel.close === 'function') {
            tunnel.close();
          }
        }
      } catch (error) {
        console.error(`关闭隧道 ${tunnelId} 时出错:`, error);
      }
    }
    this.tunnels.clear();
  }

  private createDynamicForwarding(
    connection: SSHConnection,
    tunnelId: string,
    config: PortForwardingConfig,
    resolve: (value: PortForwardingResult) => void
  ) {
    const bindAddress = config.bindAddress || '127.0.0.1';
    const bindPort = config.bindPort || 1080;

    try {
      const server = require('net').createServer((socket) => {
        // 简单的SOCKS代理实现
        socket.once('data', (data) => {
          if (data[0] !== 0x05) {
            socket.end();
            return;
          }

          // 发送SOCKS5认证响应
          socket.write(Buffer.from([0x05, 0x00]));

          socket.once('data', (data) => {
            if (data[0] !== 0x05 || data[1] !== 0x01) {
              socket.end();
              return;
            }

            const addressType = data[3];
            let targetHost = '';
            let targetPort = 0;

            if (addressType === 0x01) {
              // IPv4
              targetHost = `${data[4]}.${data[5]}.${data[6]}.${data[7]}`;
              targetPort = data.readUInt16BE(8);
            } else if (addressType === 0x03) {
              // Domain name
              const domainLength = data[4];
              targetHost = data.slice(5, 5 + domainLength).toString();
              targetPort = data.readUInt16BE(5 + domainLength);
            } else {
              socket.end();
              return;
            }

            // 创建到目标主机的连接
            connection.client.forwardOut(
              socket.remoteAddress || '127.0.0.1',
              socket.remotePort || 0,
              targetHost,
              targetPort,
              (err, stream) => {
                if (err) {
                  socket.write(Buffer.from([0x05, 0x04, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
                  socket.end();
                  return;
                }

                // 发送成功响应
                socket.write(Buffer.from([0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));

                // 建立数据流
                socket.pipe(stream).pipe(socket);
              }
            );
          });
        });

        server.listen(bindPort, bindAddress, () => {
          this.tunnels.set(tunnelId, server);
          resolve({
            success: true,
            tunnelId,
            localPort: server.address().port
          });
        });

        server.on('error', (err) => {
          resolve({ success: false, error: err.message });
        });
      });
    } catch (error) {
      resolve({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  private createLocalForwarding(
    connection: SSHConnection,
    tunnelId: string,
    config: PortForwardingConfig,
    resolve: (value: PortForwardingResult) => void
  ) {
    const localHost = config.localHost || '127.0.0.1';
    const localPort = config.localPort || 0;
    const remoteHost = config.remoteHost || '127.0.0.1';
    const remotePort = config.remotePort || 22;

    try {
      const server = require('net').createServer((socket) => {
        connection.client.forwardOut(
          socket.remoteAddress || '127.0.0.1',
          socket.remotePort || 0,
          remoteHost,
          remotePort,
          (err, stream) => {
            if (err) {
              socket.end();
              return;
            }

            socket.pipe(stream).pipe(socket);
          }
        );
      });

      server.listen(localPort, localHost, () => {
        this.tunnels.set(tunnelId, server);
        resolve({
          success: true,
          tunnelId,
          localPort: server.address().port
        });
      });

      server.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
    } catch (error) {
      resolve({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  private createRemoteForwarding(
    connection: SSHConnection,
    tunnelId: string,
    config: PortForwardingConfig,
    resolve: (value: PortForwardingResult) => void
  ) {
    const remoteHost = config.remoteHost || '127.0.0.1';
    const remotePort = config.remotePort || 22;
    const localHost = config.localHost || '127.0.0.1';
    const localPort = config.localPort || 0;

    try {
      // 监听远程端口转发连接
      connection.client.on('tcp connection', (info, accept, reject) => {
        // 检查是否是我们要处理的端口
        if (info.destPort === remotePort) {
          // 接受连接
          const stream = accept();
          
          // 创建到本地服务的连接
          const net = require('net');
          const localSocket = net.connect(localPort, localHost, () => {
            // 建立数据流
            stream.pipe(localSocket).pipe(stream);
          });

          localSocket.on('error', (_err) => {
            stream.end();
          });

          stream.on('error', (_err) => {
            localSocket.end();
          });

          localSocket.on('end', () => {
            stream.end();
          });

          stream.on('end', () => {
            localSocket.end();
          });
        } else {
          reject();
        }
      });

      // 在远程服务器上创建监听端口
      connection.client.forwardIn('0.0.0.0', remotePort, (err) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }

        this.tunnels.set(tunnelId, { 
          type: 'remote', 
          connection,
          remoteHost,
          remotePort
        });
        
        resolve({
          success: true,
          tunnelId,
          remotePort
        });
      });
    } catch (error) {
      resolve({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}

export const portForwardingService = new PortForwardingService(); 