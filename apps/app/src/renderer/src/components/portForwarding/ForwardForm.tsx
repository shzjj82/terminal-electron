import { observer } from 'mobx-react-lite';
import { Button } from '@renderer/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';
import ForwardBasicInfo from './ForwardBasicInfo';
import ForwardLocalSettings from './ForwardLocalSettings';
import ForwardRemoteSettings from './ForwardRemoteSettings';

interface ForwardFormProps {
  onFormSubmit: () => void;
  onSelectKeyFile: () => void;
}

const ForwardForm = observer(({ onFormSubmit, onSelectKeyFile }: ForwardFormProps) => {
  return (
    <Dialog open={portForwardingStore.showForwardForm} onOpenChange={(open) => {
      portForwardingStore.setShowForwardForm(open);
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle>
            {portForwardingStore.isEditing ? `编辑端口转发 - ${portForwardingStore.editingForward?.name}` : portForwardingStore.getForwardTypeTitle()}
          </DialogTitle>
          <DialogDescription>
            {portForwardingStore.isEditing ? '修改端口转发配置' : portForwardingStore.getForwardTypeDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 基本信息 */}
          <ForwardBasicInfo onSelectKeyFile={onSelectKeyFile} />

          {/* 本地设置 */}
          <ForwardLocalSettings />

          {/* 远程设置 */}
          <ForwardRemoteSettings />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              portForwardingStore.setShowForwardForm(false);
              // 不要清空selectedForwardType，保持用户的选择
            }}
          >
            取消
          </Button>
          <Button onClick={onFormSubmit} className='bg-gray-900 text-white hover:bg-gray-800'>
            {portForwardingStore.isEditing ? '保存修改' : '创建转发'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default ForwardForm; 