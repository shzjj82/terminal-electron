import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Eye, EyeOff, ChevronDown, X } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@renderer/components/ui/dropdown-menu';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';
import { useServerListSimple } from '@renderer/hooks';

interface ForwardBasicInfoProps {
  onSelectKeyFile: () => void;
}

const ForwardBasicInfo = observer(({ onSelectKeyFile }: ForwardBasicInfoProps) => {
  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const serverList = useServerListSimple();
  
  // 根据store中的serverId找到对应的服务器
  const selectedServer = portForwardingStore.forwardForm.serverId 
    ? serverList.find(server => server.id === portForwardingStore.forwardForm.serverId)
    : null;

  const handleServerSelect = (server: any) => {
    portForwardingStore.updateForwardForm({
      server: '', // 清空手动输入的服务器地址
      serverId: server.id,
      username: '', // 清空手动输入的用户名
      authType: 'password', // 重置为默认值
      password: '', // 清空手动输入的密码
      keyPath: '', // 清空手动输入的密钥路径
      keyContent: '' // 清空手动输入的密钥内容
    });
    setShowServerDropdown(false);
  };

  const handleClearServer = () => {
    portForwardingStore.updateForwardForm({
      server: '',
      serverId: undefined, // 清空serverId
      username: '',
      password: '',
      keyPath: '',
      authType: 'password'
    });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-base font-medium text-gray-900 border-b border-gray-300 pb-3 mb-4">基本信息</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="forward-name">转发名称</Label>
          <Input
            id="forward-name"
            value={portForwardingStore.forwardForm.name}
            onChange={(e) => portForwardingStore.updateForwardForm({ name: e.target.value })}
            placeholder="输入转发名称"
            className="h-10"
          />
        </div>

        {/* 服务器配置 */}
        <div className="space-y-2">
          <Label htmlFor="forward-server">服务器地址</Label>
          <div className="flex items-center space-x-2">
            {selectedServer ? (
              <div className="flex-1 flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-md h-10">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">
                    {selectedServer.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearServer}
                  className="h-6 w-6 p-0 hover:bg-blue-100"
                >
                  <X className="h-3 w-3 text-blue-600" />
                </Button>
              </div>
            ) : (
              <Input
                id="forward-server"
                value={portForwardingStore.forwardForm.server}
                onChange={(e) => portForwardingStore.updateForwardForm({ server: e.target.value })}
                placeholder="输入服务器地址"
                className="flex-1 h-10"
              />
            )}
            <DropdownMenu open={showServerDropdown} onOpenChange={setShowServerDropdown}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 px-3"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {serverList.length > 0 ? (
                  serverList.map((server) => (
                    <DropdownMenuItem
                      key={server.id}
                      onClick={() => handleServerSelect(server)}
                      className="flex flex-col items-start p-3"
                    >
                      <div className="font-medium text-sm">{server.name}</div>
                      <div className="text-xs text-gray-500">{server.username}@{server.host}</div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled className="text-gray-500">
                    暂无已配置的服务器
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 用户名 - 仅在未选择服务器时显示 */}
        {!selectedServer && (
          <div className="space-y-2">
            <Label htmlFor="forward-username">用户名</Label>
            <Input
              id="forward-username"
              value={portForwardingStore.forwardForm.username}
              onChange={(e) => portForwardingStore.updateForwardForm({ username: e.target.value })}
              placeholder="输入SSH用户名"
              className="h-10"
            />
          </div>
        )}

        {/* 认证方式 - 仅在未选择服务器时显示 */}
        {!selectedServer && (
          <div className="space-y-2">
            <Label htmlFor="auth-combo">认证方式</Label>
            <div className="flex items-stretch">
              <Select
                value={portForwardingStore.forwardForm.authType}
                onValueChange={(value) => portForwardingStore.updateForwardForm({ authType: value as 'password' | 'key' | 'keyContent' })}
              >
                <SelectTrigger className="w-[100px] !h-10 rounded-r-none border-r-0">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="password">密码</SelectItem>
                  <SelectItem value="key">密钥</SelectItem>
                  <SelectItem value="keyContent">密钥内容</SelectItem>
                </SelectContent>
              </Select>
              
              {portForwardingStore.forwardForm.authType === 'password' ? (
                <div className="relative flex-1">
                  <Input
                    type={portForwardingStore.showPassword ? "text" : "password"}
                    value={portForwardingStore.forwardForm.password}
                    onChange={(e) => portForwardingStore.updateForwardForm({ password: e.target.value })}
                    placeholder="输入密码"
                    className="h-10 rounded-l-none pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => portForwardingStore.setShowPassword(!portForwardingStore.showPassword)}
                  >
                    {portForwardingStore.showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              ) : portForwardingStore.forwardForm.authType === 'key' ? (
                <div className="flex flex-1">
                  <Input
                    value={portForwardingStore.forwardForm.keyPath}
                    onChange={(e) => portForwardingStore.updateForwardForm({ keyPath: e.target.value })}
                    placeholder="选择密钥文件"
                    className="flex-1 h-10 rounded-l-none rounded-r-none"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 px-3 rounded-l-none border-l-0"
                    onClick={onSelectKeyFile}
                  >
                    浏览
                  </Button>
                </div>
              ) : portForwardingStore.forwardForm.authType === 'keyContent' ? (
                <div className="relative flex-1">
                  <Input
                    type={portForwardingStore.showPassword ? "text" : "password"}
                    value={portForwardingStore.forwardForm.keyContent}
                    onChange={(e) => portForwardingStore.updateForwardForm({ keyContent: e.target.value })}
                    placeholder="输入密钥内容"
                    className="h-10 rounded-l-none pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => portForwardingStore.setShowPassword(!portForwardingStore.showPassword)}
                  >
                    {portForwardingStore.showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              ) : (
                <Input
                  placeholder="请先选择认证类型"
                  disabled
                  className="flex-1 h-10 rounded-l-none"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ForwardBasicInfo; 