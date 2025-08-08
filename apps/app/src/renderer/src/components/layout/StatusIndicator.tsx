import { observer } from 'mobx-react-lite';
import { Cloud, HardDrive } from 'lucide-react';
import { authStore } from '@/stores/authStore';

function StatusIndicator() {
  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-full">
      {authStore.isAuthenticated ? (
        <>
          <Cloud className="w-3 h-3 text-blue-400" />
          <span className="text-xs text-gray-300">云端模式</span>
        </>
      ) : (
        <>
          <HardDrive className="w-3 h-3 text-green-400" />
          <span className="text-xs text-gray-300">本地模式</span>
        </>
      )}
    </div>
  );
}

export default observer(StatusIndicator); 