import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select';
import { serversStore } from '@renderer/stores/serversStore';
import { Eye, EyeOff } from 'lucide-react';

interface ServerFormProps {
  onFormSubmit: () => void;
}

const ServerForm = observer(({ onFormSubmit }: ServerFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    serversStore.setShowCreateServerDialog(false);
    if (!serversStore.showCreateServerDialog) {
      serversStore.setIsEditing(false);
      serversStore.setEditingServer(null);
    }
  };

  return (
    <Dialog 
      open={serversStore.showCreateServerDialog} 
      onOpenChange={(open) => {
        serversStore.setShowCreateServerDialog(open);
        if (!open) {
          serversStore.setIsEditing(false);
          serversStore.setEditingServer(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {serversStore.isEditing ? '编辑服务器连接' : '创建服务器连接'}
          </DialogTitle>
          <DialogDescription>
            配置 SSH 服务器连接参数
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-base font-medium text-gray-900 border-b border-gray-300 pb-3 mb-4">
              基本信息
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="server-name">服务器名称</Label>
                <Input
                  id="server-name"
                  value={serversStore.serverForm.name}
                  onChange={(e) => serversStore.updateServerForm({ name: e.target.value })}
                  placeholder="输入服务器名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server-host">主机地址</Label>
                <Input
                  id="server-host"
                  value={serversStore.serverForm.host}
                  onChange={(e) => serversStore.updateServerForm({ host: e.target.value })}
                  placeholder="输入主机地址或域名"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server-port">端口</Label>
                <Input
                  id="server-port"
                  value={serversStore.serverForm.port}
                  onChange={(e) => serversStore.updateServerForm({ port: e.target.value })}
                  placeholder="22"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server-username">用户名</Label>
                <Input
                  id="server-username"
                  value={serversStore.serverForm.username}
                  onChange={(e) => serversStore.updateServerForm({ username: e.target.value })}
                  placeholder="输入用户名"
                />
              </div>
            </div>

            {/* 认证方式 */}
            <div className="space-y-2">
              <Label htmlFor="auth-type">认证方式</Label>
              <div className="flex items-stretch">
                <Select
                  value={serversStore.serverForm.authType}
                  onValueChange={(value) => serversStore.updateServerForm({ authType: value as 'password' | 'key' | 'keySelect' })}
                >
                  <SelectTrigger className="w-[120px] !h-10 rounded-r-none border-r-0">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keySelect">选择密钥</SelectItem>
                    <SelectItem value="password">密码</SelectItem>
                    <SelectItem value="key">密钥文件</SelectItem>
                  </SelectContent>
                </Select>

                {serversStore.serverForm.authType === 'password' ? (
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={serversStore.serverForm.password}
                      onChange={(e) => serversStore.updateServerForm({ password: e.target.value })}
                      placeholder="输入密码"
                      className="h-10 rounded-l-none pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                ) : serversStore.serverForm.authType === 'key' ? (
                  <div className="flex flex-1">
                    <Input
                      value={serversStore.serverForm.keyPath}
                      onChange={(e) => serversStore.updateServerForm({ keyPath: e.target.value })}
                      placeholder="选择密钥文件"
                      className="flex-1 h-10 rounded-l-none border-r-0"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-3 rounded-l-none border-l-0"
                      onClick={() => serversStore.selectKeyFile()}
                    >
                      浏览
                    </Button>
                  </div>
                ) : serversStore.serverForm.authType === 'keySelect' ? (
                  <div className="flex-1">
                    <Select
                      value={serversStore.serverForm.keyId}
                      onValueChange={(value) => serversStore.updateServerForm({ keyId: value })}
                    >
                      <SelectTrigger className="h-10 rounded-l-none w-full !h-10">
                        <SelectValue placeholder="选择已配置的密钥" />
                      </SelectTrigger>
                      <SelectContent>
                        {serversStore.availableKeys.length > 0 ? (
                          serversStore.availableKeys.map((key) => (
                            <SelectItem key={key.id} value={key.id}>
                              {key.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-gray-500">
                            暂无配置的密钥，请先在密钥页面创建密钥
                          </div>
                        )}
                      </SelectContent>
                    </Select>
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
          </div>

          {/* 高级选项 */}
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border">
            <h3 className="text-base font-medium text-gray-900 border-b border-purple-300 pb-3 mb-4">
              高级选项
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">连接超时（秒）</Label>
                <Input
                  id="timeout"
                  value={serversStore.serverForm.timeout}
                  onChange={(e) => serversStore.updateServerForm({ timeout: e.target.value })}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keepalive">保活间隔（秒）</Label>
                <Input
                  id="keepalive"
                  value={serversStore.serverForm.keepalive}
                  onChange={(e) => serversStore.updateServerForm({ keepalive: e.target.value })}
                  placeholder="60"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={serversStore.serverForm.compression}
                    onChange={(e) => serversStore.updateServerForm({ compression: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>启用压缩</span>
                </Label>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={serversStore.serverForm.strictHostKeyChecking}
                    onChange={(e) => serversStore.updateServerForm({ strictHostKeyChecking: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>严格主机密钥检查</span>
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button
            onClick={onFormSubmit}
            disabled={!serversStore.serverForm.name || !serversStore.serverForm.host || !serversStore.serverForm.username}
          >
            {serversStore.isEditing ? '更新服务器' : '创建服务器'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default ServerForm; 