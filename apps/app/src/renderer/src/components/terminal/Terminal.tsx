import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { getServersStore, getTerminalStore } from '@/stores/globalStores';
import XtermTerminal from './XtermTerminal';
import { startSshSession, writeSsh, closeSsh, onSshData, onSshExit } from '@/services/sshService';
import { serversStore } from '@/stores/serversStore';
import { buildSSHConfig } from '@renderer/hooks';

const Terminal: React.FC = observer(() => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentServer, setCurrentServer] = useState<any>(null);
  const [sshSessionId, setSshSessionId] = useState<string | null>(null);
  const [hasAttemptedAutoConnect, setHasAttemptedAutoConnect] = useState(false);
  // const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const xtermRef = useRef<any>(null);

  // 获取 terminalStore
  const terminalStore = getTerminalStore();

  // 断开当前连接
  const disconnectCurrentSession = async () => {
    if (sshSessionId) {
      closeSsh(sshSessionId);
      setIsConnected(false);
      setSshSessionId(null);
      setHasAttemptedAutoConnect(false);
      
      // 更新服务器状态为未连接
      if (currentServer) {
        serversStore.updateServerStatus(currentServer.id, 'disconnected');
      }
      
      // 更新终端会话状态
      if (terminalStore && terminalStore.activeSession) {
        terminalStore.updateSessionStatus(terminalStore.activeSession.id, 'disconnected');
      }
    }
  };

  useEffect(() => {
    if (!terminalStore) {
      navigate('/servers');
      return;
    }

    if (sessionId) {
      terminalStore.setActiveSession(sessionId);
      setCurrentSessionId(sessionId);
    }
    
    if (!terminalStore.activeSession) {
      navigate('/servers');
      return;
    }
    
    const serversStore = getServersStore();
    const server = serversStore.servers.find(s => s.id === terminalStore.activeSession.serverId);
    if (!server) {
      return;
    }
    server && setCurrentServer(server);
    
    // 检查当前 session 的连接状态
    const sessionStatus = terminalStore.activeSession.status;
    
    if (sessionStatus === 'connected') {
      // 如果 session 之前已连接，恢复连接状态
      setIsConnected(true);
      setIsConnecting(false);
      setHasAttemptedAutoConnect(true);
      // 注意：这里不重新建立 SSH 连接，因为实际的 SSH 连接可能已经断开
      // 但 UI 状态保持为已连接，用户需要手动重新连接
    } else if (!isConnected && !isConnecting && !hasAttemptedAutoConnect) {
      // 第一次访问或 session 未连接时，自动建立连接
      if (server.host && server.port && server.username) {
        setHasAttemptedAutoConnect(true);
        handleCreateConnection(buildSSHConfig(server.id));
      }
    }
  }, [sessionId]);

  // 建立 SSH 连接
  const handleCreateConnection = async (server: any) => {
    setIsConnecting(true);
    try {
      const sessionId = await startSshSession({
        host: server.host,
        port: server.port,
        username: server.username,
        password: server.password,
        privateKey: server.privateKey,
        passphrase: server.passphrase,
      });
      setSshSessionId(sessionId);
      
      // 立即注册事件监听
      onSshData(sessionId, (data) => {
        if (xtermRef.current && typeof data === 'string' && data) {
          xtermRef.current.write(data);
          // 将数据保存到当前 session 的终端内容中
          if (terminalStore && terminalStore.activeSession) {
            terminalStore.appendTerminalContent(terminalStore.activeSession.id, data);
          }
        }
      });
      
      onSshExit(sessionId, () => {
        setIsConnected(false);
        setSshSessionId(null);
        setHasAttemptedAutoConnect(false); // 允许重新自动连接
        // 更新服务器状态为未连接
        if (currentServer) {
          serversStore.updateServerStatus(currentServer.id, 'disconnected');
        }
        // 更新终端会话状态
        if (terminalStore && terminalStore.activeSession) {
          terminalStore.updateSessionStatus(terminalStore.activeSession.id, 'disconnected');
        }
      });
      
      setIsConnected(true);
      setIsConnecting(false);
      // 更新服务器状态为已连接
      if (currentServer) {
        serversStore.updateServerStatus(currentServer.id, 'connected');
      }
      // 更新终端会话状态
      if (terminalStore && terminalStore.activeSession) {
        terminalStore.updateSessionStatus(terminalStore.activeSession.id, 'connected');
      }
    } catch (e) {
      setIsConnecting(false);
      setIsConnected(false);
      setSshSessionId(null);
      setHasAttemptedAutoConnect(false); // 允许重试
      // 更新服务器状态为未连接
      if (currentServer) {
        serversStore.updateServerStatus(currentServer.id, 'disconnected');
      }
      // 更新终端会话状态
      if (terminalStore && terminalStore.activeSession) {
        terminalStore.updateSessionStatus(terminalStore.activeSession.id, 'disconnected');
      }
    }
  };

  // 断开 SSH 连接
  const handleDisconnect = async () => {
    await disconnectCurrentSession();
  };

  // 发送数据到 SSH
  const handleXtermData = (data: string) => {
    if (sshSessionId) {
      writeSsh(sshSessionId, data);
    }
  };

  // 连接按钮
  const handleManualConnect = () => {
    if (currentServer) {
      setHasAttemptedAutoConnect(false); // 重置自动连接状态
      handleCreateConnection(buildSSHConfig(currentServer.id));
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4 flex-shrink-0">
          {isConnected && currentServer && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">
                {currentServer.name} - {currentServer.username}@{currentServer.host}
              </span>
            </div>
          )}
          {isConnecting && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Connecting...</span>
            </div>
          )}
          {!isConnected && !isConnecting && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Not Connected</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isConnected && (
            <button
              onClick={handleDisconnect}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Disconnect
            </button>
          )}
          {!isConnected && !isConnecting && currentServer && (
            <button
              onClick={handleManualConnect}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Connect
            </button>
          )}
        </div>
      </div>
      {/* Terminal Content */}
      <div className="flex-1 bg-black overflow-hidden">
        {isConnected && sshSessionId ? (
          <XtermTerminal
            ref={xtermRef}
            onData={handleXtermData}
            resetSignal={!isConnected}
            sessionId={sessionId}
            initialContent={terminalStore?.activeSessionTerminalContent || ''}
            key={sessionId}
          />
        ) : isConnecting ? (
          <div className="h-full flex flex-col items-center justify-center text-white">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-lg text-gray-300">Connecting...</div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">No SSH Connection</h3>
              <p className="text-gray-400">
                Click the button above to create an SSH connection
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Terminal; 