import { observer } from 'mobx-react-lite';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';

const ForwardRemoteSettings = observer(() => {
  // 动态端口转发不需要远程设置
  if (portForwardingStore.selectedForwardType === 'dynamic') {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
      <h3 className="text-base font-medium text-purple-900 border-b border-purple-300 pb-3 mb-4">远程设置</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="remote-host">远程主机</Label>
          <Input
            id="remote-host"
            value={portForwardingStore.forwardForm.remoteHost}
            onChange={(e) => portForwardingStore.updateForwardForm({ remoteHost: e.target.value })}
            placeholder="localhost 或 IP 地址"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="remote-port">远程端口</Label>
          <Input
            id="remote-port"
            value={portForwardingStore.forwardForm.remotePort}
            onChange={(e) => portForwardingStore.updateForwardForm({ remotePort: e.target.value })}
            placeholder="80"
            type="number"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
});

export default ForwardRemoteSettings; 