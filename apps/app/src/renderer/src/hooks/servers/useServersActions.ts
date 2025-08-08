import { useCallback } from 'react';
import { serversStore } from '@renderer/stores/serversStore';
import { getTerminalStore } from '@renderer/stores/globalStores';
import { ServerItem } from '@renderer/types';
import { useNavigate } from 'react-router-dom';

export const useServersActions = () => {
  const navigate = useNavigate();

  // 创建终端会话
  const handleCreateSession = useCallback(async (server: ServerItem) => {
    try {
      const { id, name, host, username } = server;
      // 检查terminalStore是否可用
      const terminalStore = getTerminalStore();
      if (!terminalStore) {
        console.error('Terminal store not available');
        return;
      }

      // 检查是否已存在该服务器的会话
      const existingSession = terminalStore.getSessionByServerId(id);
      if (existingSession) {
        // 如果会话已连接，直接导航到现有会话
        if (existingSession.status === 'connected') {
          navigate(`/terminal/${existingSession.id}`);
          return;
        }
        // 如果会话存在但未连接，删除旧会话
        terminalStore.closeSession(existingSession.id);
      }

      // 创建新会话
      const sessionId = terminalStore.createSession(
        id,
        name,
        host,
        username
      );

      if (!sessionId) {
        console.error('Failed to create session');
        return;
      }

      // 更新服务器状态为连接中
      serversStore.updateServerStatus(id, 'connecting');

      // 导航到终端页面
      navigate(`/terminal/${sessionId}`);
      
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }, [navigate]);

  // 断开服务器连接
  const handleDisconnectServer = useCallback(async (server: ServerItem) => {
    try {
      // 检查是否有对应的终端会话
      const terminalStore = getTerminalStore();
      if (terminalStore) {
        const existingSession = terminalStore.getSessionByServerId(server.id);
        if (existingSession) {
          // 关闭终端会话
          terminalStore.closeSession(existingSession.id);
        }
      }
      
      // 更新服务器状态
      await serversStore.disconnectServer(server.id);
    } catch (error) {
      console.error('Error disconnecting server:', error);
    }
  }, []);

  // 创建服务器
  const handleCreateServer = () => {
    serversStore.setShowCreateServerDialog(true);
  };

  // 编辑服务器
  const handleEditServer = (server: ServerItem) => {
    serversStore.editServer(server);
  };

  // 删除服务器
  const handleDeleteServer = async (server: ServerItem) => {
    try {
      await serversStore.deleteServerWithSync(server.id);
    } catch (error) {
      console.error('删除服务器失败:', error);
    }
  };

  return {
    handleCreateSession,
    handleDisconnectServer,
    handleCreateServer,
    handleEditServer,
    handleDeleteServer
  };
}; 