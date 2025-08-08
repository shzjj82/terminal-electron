import { useCallback } from 'react';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';

export const usePortForwardingForm = () => {
  // 处理密钥文件选择
  const handleSelectKeyFile = useCallback(async () => {
    try {
      // 在 Electron 环境中使用原生文件对话框
      if ((window as any).electron) {
        const result = await (window as any).electron.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            { name: 'SSH 密钥文件', extensions: ['pem', 'key', 'ppk'] },
            { name: '所有文件', extensions: ['*'] }
          ]
        });

        if (!result.canceled && result.filePaths.length > 0) {
          portForwardingStore.updateForwardForm({ keyPath: result.filePaths[0] });
        }
      } else {
        // 在浏览器环境中使用文件输入
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pem,.key,.ppk,*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            portForwardingStore.updateForwardForm({ keyPath: file.name });
          }
        };
        input.click();
      }
    } catch (error) {
      console.error('文件选择失败:', error);
    }
  }, []);

  // 处理表单提交
  const handleFormSubmit = useCallback(() => {
    if (portForwardingStore.isEditing) {
      portForwardingStore.updatePortForward();
    } else {
      portForwardingStore.createPortForward();
    }
  }, []);

  return {
    handleSelectKeyFile,
    handleFormSubmit
  };
}; 