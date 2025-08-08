import { Outlet, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { 
  ChevronDown,
  Terminal,
  X,
  Minus,
  Square,
  LogOut,
  Settings,
  User as UserIcon,
  HardDrive
} from 'lucide-react';
import { teamsApi } from '@/api/teams';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Sidebar from './Sidebar';
import { getTerminalStore } from '@/stores/globalStores';
import { authStore } from '@/stores/authStore';
import SessionDropdown from '@/components/terminal/SessionDropdown';
import StatusIndicator from './StatusIndicator';
import { DataContextSwitcher } from '@/components/data-context/DataContextSwitcher';
import { DataContextIndicator } from '@/components/data-context/DataContextIndicator';

const Layout = observer(() => {
  const navigate = useNavigate();
  // 检查是否为Mac平台
  const isMac = navigator.platform.toLowerCase().includes('mac');

  // 加载团队信息
  const loadTeams = async () => {
    try {
      const teamsData = await teamsApi.getMyTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('加载团队信息失败:', error);
    }
  };

  // 组件加载时获取团队信息
  useEffect(() => {
    if (authStore.isAuthenticated) {
      loadTeams();
    }
  }, [authStore.isAuthenticated]);

  // 窗口控制函数
  const handleWindowControl = (action: 'close' | 'minimize' | 'maximize') => {
    if ((window as any).api?.window) {
      switch (action) {
        case 'close':
          (window as any).api.window.close();
          break;
        case 'minimize':
          (window as any).api.window.minimize();
          break;
        case 'maximize':
          (window as any).api.window.maximize();
          break;
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Navigation Bar */}
      <div 
        className={`bg-gray-800 text-white px-4 py-2 flex items-center justify-between flex-shrink-0 ${isMac ? 'cursor-move' : ''}`}
        style={isMac ? { WebkitAppRegion: 'drag' } as any : {}}
      >
        <div className="flex items-center space-x-4" style={isMac ? { WebkitAppRegion: 'no-drag' } as any : {}}>
          {/* Window Controls - 仅在Mac模式下显示 */}
          {isMac && (
            <div className="flex items-center space-x-2 mr-4">
              <button
                onClick={() => handleWindowControl('close')}
                className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <X className="w-2 h-2 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => handleWindowControl('minimize')}
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors flex items-center justify-center"
              >
                <Minus className="w-2 h-2 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => handleWindowControl('maximize')}
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <Square className="w-2 h-2 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {authStore.isAuthenticated && (
              <>
                <DataContextSwitcher />
 
              </>
            )}
            
            {getTerminalStore()?.sessions?.length > 0 && (
              <SessionDropdown>
                <Button variant="ghost" className="text-white hover:bg-gray-700">
                  <Terminal className="mr-2 h-4 w-4" />
                  {getTerminalStore()?.activeSession ? 
                    `${getTerminalStore()?.activeSession.serverName} (${getTerminalStore()?.activeSession.username}@${getTerminalStore()?.activeSession.host})` : 
                    '选择终端会话'
                  }
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </SessionDropdown>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2" style={isMac ? { WebkitAppRegion: 'no-drag' } as any : {}}>
          <DataContextIndicator />
          <StatusIndicator />
          {authStore.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-gray-700">
                  <UserIcon className="mr-2 h-4 w-4" />
                  {authStore.displayName}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  个人资料
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={async () => {
                    await authStore.logout();
                    // 退出登录后跳转到 servers 页面
                    navigate('/servers');
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-gray-700"
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  本地模式
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/login')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  登录账户
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/help')}>
                  <HardDrive className="mr-2 h-4 w-4" />
                  了解本地模式
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 bg-white overflow-hidden">
          {/* Page Content */}
          <div className="flex-1 h-full overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Layout; 