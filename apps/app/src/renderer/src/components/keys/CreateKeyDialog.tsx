import { observer } from 'mobx-react-lite';
import { Lock, FileText, FileKey, Eye, EyeOff } from 'lucide-react';
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
import { keysStore } from '@renderer/stores/keysStore';

const CreateKeyDialog = observer(() => {
  return (
    <Dialog open={keysStore.showCreateKeyDialog} onOpenChange={(open) => {
      if (!open) {
        keysStore.cancelEdit();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{keysStore.isEditing ? '编辑密钥' : '创建密钥'}</DialogTitle>
          <DialogDescription>
            {keysStore.isEditing ? '修改密钥信息' : (
              keysStore.createKeyMode === 'password' ? '输入密码生成密钥' :
                keysStore.createKeyMode === 'file' ? '选择密钥文件路径' :
                  '直接输入密钥内容'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 基本信息 */}
          <div className="space-y-2">
            <Label htmlFor="key-name">密钥名称</Label>
            <Input
              id="key-name"
              value={keysStore.keyForm.name}
              onChange={(e) => keysStore.updateKeyForm({ name: e.target.value })}
              placeholder="输入密钥名称"
            />
          </div>

          {/* 模式显示 */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            {keysStore.createKeyMode === 'password' && <Lock className="h-5 w-5 text-gray-600" />}
            {keysStore.createKeyMode === 'file' && <FileText className="h-5 w-5 text-gray-600" />}
            {keysStore.createKeyMode === 'content' && <FileKey className="h-5 w-5 text-gray-600" />}
            <div>
              <div className="font-medium text-gray-700">
                {keysStore.createKeyMode === 'password' && '密码模式'}
                {keysStore.createKeyMode === 'file' && '密钥文件'}
                {keysStore.createKeyMode === 'content' && '密钥内容'}
              </div>
              <div className="text-sm text-gray-500">
                {keysStore.createKeyMode === 'password' && '输入密码生成密钥'}
                {keysStore.createKeyMode === 'file' && '选择密钥文件路径'}
                {keysStore.createKeyMode === 'content' && '直接输入密钥内容'}
              </div>
            </div>
          </div>

          {/* 模式特定的输入 */}
          {keysStore.createKeyMode === 'password' && (
            <div className="space-y-2">
              <Label htmlFor="key-password">密码</Label>
              <div className="relative">
                <Input
                  id="key-password"
                  type={keysStore.showPassword ? "text" : "password"}
                  value={keysStore.keyForm.password}
                  onChange={(e) => keysStore.updateKeyForm({ password: e.target.value })}
                  placeholder="输入密码"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => keysStore.setShowPassword(!keysStore.showPassword)}
                >
                  {keysStore.showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {keysStore.createKeyMode === 'file' && (
            <div className="space-y-2">
              <Label htmlFor="key-path">密钥文件路径</Label>
              <div className="flex">
                <Input
                  id="key-path"
                  value={keysStore.keyForm.keyPath}
                  onChange={(e) => keysStore.updateKeyForm({ keyPath: e.target.value })}
                  placeholder="选择密钥文件"
                  className="flex-1 rounded-r-none"
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-l-none border-l-0"
                  onClick={() => keysStore.selectKeyFile()}
                >
                  浏览
                </Button>
              </div>
            </div>
          )}

          {keysStore.createKeyMode === 'content' && (
            <div className="space-y-2">
              <Label htmlFor="key-content">密钥内容</Label>
              <textarea
                id="key-content"
                value={keysStore.keyForm.keyContent}
                onChange={(e) => keysStore.updateKeyForm({ keyContent: e.target.value })}
                placeholder="粘贴密钥内容..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => keysStore.cancelEdit()}>
            取消
          </Button>
          <Button onClick={() => keysStore.createKey()} disabled={!keysStore.keyForm.name}>
            {keysStore.isEditing ? '保存修改' : '创建密钥'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CreateKeyDialog; 