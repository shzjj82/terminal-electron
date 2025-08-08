import { observer } from 'mobx-react-lite';
import { Button } from '@renderer/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog';
import { keysStore } from '@renderer/stores/keysStore';

const DeleteKeyDialog = observer(() => {
  return (
    <Dialog open={keysStore.showDeleteConfirmDialog} onOpenChange={(open) => {
      if (!open) {
        keysStore.cancelDelete();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            您确定要删除密钥 "{keysStore.deletingKey?.name}" 吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => keysStore.cancelDelete()}>
            取消
          </Button>
          <Button
            variant="destructive"
            className="text-white"
            onClick={() => keysStore.confirmDelete()}
          >
            删除
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default DeleteKeyDialog; 