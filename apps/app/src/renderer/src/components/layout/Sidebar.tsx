import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Server, 
  Key, 
  ArrowLeftRight,
  HelpCircle,
  Users
} from 'lucide-react';
import { authStore } from '@/stores/authStore';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface SidebarProps {
  className?: string;
}

function Sidebar({ className = '' }: SidebarProps) {
  const mainItems: SidebarItem[] = [
    { id: 'servers', label: '服务器', icon: Server, path: '/servers' },
    { id: 'keys', label: '密钥', icon: Key, path: '/keys' },
    { id: 'port-forwarding', label: '端口转发', icon: ArrowLeftRight, path: '/port-forwarding' },
  ];

  // 根据登录状态决定是否显示团队功能
  const secondaryItems: SidebarItem[] = [
    ...(authStore.isAuthenticated ? [{ id: 'teams', label: '团队', icon: Users, path: '/teams' }] : []),
    { id: 'help', label: '帮助', icon: HelpCircle, path: '/help' },
  ];
  

  return (
    <div className={`w-48 bg-gray-100 flex flex-col flex-shrink-0  overflow-hidden ${className}`}>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto flex flex-col justify-between">
        {/* Main Navigation */}
        <div className="space-y-2 mb-8">
          {mainItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-gray-200 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-2">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-gray-200 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar; 