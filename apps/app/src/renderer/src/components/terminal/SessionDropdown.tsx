import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Monitor, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getTerminalStore, getServersStore } from '@/stores/globalStores';

interface SessionDropdownProps {
  children: React.ReactNode;
}

const SessionDropdown: React.FC<SessionDropdownProps> = observer(({ children }) => {
  const navigate = useNavigate();
  const terminalStore = getTerminalStore();
  const serversStore = getServersStore();

  if (!terminalStore) {
    return null;
  }

  // 使用与serversStore一致的状态映射，但适配下拉菜单的样式
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    // 使用serversStore的状态文本映射
    return serversStore?.getStatusText(status) || '未知';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {terminalStore?.sessions?.map((session) => (
          <DropdownMenuItem 
            key={session.id}
            onClick={() => {
              terminalStore?.setActiveSession(session.id);
              navigate(`/terminal/${session.id}`);
            }}
            className={terminalStore?.activeSessionId === session.id ? 'bg-blue-50' : ''}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>{session.serverName}</span>
                <span className="text-xs text-gray-500">
                  {session.username}@{session.host}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                <span className="text-xs text-gray-500">{getStatusText(session.status)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    const isActiveSession = terminalStore?.activeSessionId === session.id;
                    
                    // 关闭会话
                    terminalStore?.closeSession(session.id);
                    
                    // 如果关闭的是当前活跃会话，跳转到服务器页面
                    if (isActiveSession) {
                      navigate('/servers');
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default SessionDropdown; 