import { useCallback } from 'react';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';
import { buildSSHConfig } from '../ssh/useSSHConfig';

export const usePortForwardingActions = () => {
  // 启动端口转发
  const handleStartForward = useCallback(async (forward: any) => {
    try {
      let sshConfig: any;
      
      // 如果有serverId，使用复用的SSH配置构建逻辑
      if (forward.serverId) {
        sshConfig = buildSSHConfig(forward.serverId);
        if (!sshConfig) {
          console.error('无法获取服务器信息:', forward.serverId);
          portForwardingStore.stopPortForward(forward.id);
          return;
        }
      } else {
        // 手动输入模式，使用forward中的信息
        sshConfig = {
          host: forward.server,
          port: 22,
          username: forward.username || 'root',
          authType: forward.authType || 'password',
          password: forward.password || '',
          keyPath: forward.keyPath,
          keyContent: forward.keyContent,
          passphrase: forward.passphrase
        };
       
      }
      
      // 连接到SSH服务器
      const connectResult = await (window as any).api.ssh.connect(sshConfig);
      if (!connectResult.success) {
        console.error('SSH连接失败:', connectResult.error);
        portForwardingStore.stopPortForward(forward.id);
        return;
      }

      // 创建端口转发配置
      const portForwardConfig = {
        type: forward.type,
        localHost: forward.localHost,
        localPort: forward.localPort,
        remoteHost: forward.remoteHost,
        remotePort: forward.remotePort,
        bindAddress: forward.localHost,
        bindPort: forward.localPort
      };

      // 创建端口转发
      const forwardResult = await (window as any).api.ssh.createPortForwarding(
        connectResult.connectionId,
        portForwardConfig
      );

      if (forwardResult.success) {
        // 保存隧道ID和连接ID
        portForwardingStore.setTunnelInfo(forward.id, forwardResult.tunnelId!, connectResult.connectionId!);
        portForwardingStore.startPortForward(forward.id);
      } else {
        portForwardingStore.stopPortForward(forward.id);
      }
    } catch (error) {
      console.error('启动端口转发失败:', error);
      portForwardingStore.stopPortForward(forward.id);
    }
  }, []);

  // 停止端口转发
  const handleStopForward = useCallback(async (forward: any) => {
    try {
      // 如果有隧道ID，关闭端口转发
      if (forward.tunnelId) {
        const closeResult = await (window as any).api.ssh.closePortForwarding(forward.tunnelId);
        if (!closeResult.success) {
          console.error('关闭端口转发失败:', closeResult.error);
        }
      }

      // 如果有连接ID，断开SSH连接
      if (forward.connectionId) {
        const disconnectResult = await (window as any).api.ssh.disconnect(forward.connectionId);
        if (!disconnectResult.success) {
          console.error('断开SSH连接失败:', disconnectResult.error);
        }
      }

      // 清除隧道信息并更新状态
      portForwardingStore.clearTunnelInfo(forward.id);
      portForwardingStore.stopPortForward(forward.id);
    } catch (error) {
      console.error('停止端口转发失败:', error);
      // 即使出错也要清除隧道信息
      portForwardingStore.clearTunnelInfo(forward.id);
      portForwardingStore.stopPortForward(forward.id);
    }
  }, []);

  // 删除端口转发
  const handleDeleteForward = useCallback(async (forward: any) => {
    try {
      // 如果端口转发正在运行，先停止它
      if (forward.status === 'active') {
        await handleStopForward(forward);
      }
      
      // 使用新的删除方法（包含云端同步）
      await portForwardingStore.deletePortForwardWithSync(forward.id);
    } catch (error) {
      console.error('删除端口转发失败:', error);
      // 即使出错也要删除本地记录
      portForwardingStore.deletePortForward(forward.id);
    }
  }, [handleStopForward]);

  return {
    handleStartForward,
    handleStopForward,
    handleDeleteForward
  };
}; 