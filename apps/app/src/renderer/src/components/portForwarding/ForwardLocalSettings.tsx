import { observer } from 'mobx-react-lite';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';

const ForwardLocalSettings = observer(() => {
  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-base font-medium text-blue-900 border-b border-blue-300 pb-3 mb-4">本地设置</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bind-address">绑定地址</Label>
          <Input
            id="bind-address"
            value={portForwardingStore.forwardForm.localHost}
            onChange={(e) => portForwardingStore.updateForwardForm({ localHost: e.target.value })}
            placeholder="127.0.0.1"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="local-port">本地端口</Label>
          <Input
            id="local-port"
            value={portForwardingStore.forwardForm.localPort}
            onChange={(e) => portForwardingStore.updateForwardForm({ localPort: e.target.value })}
            placeholder="8080"
            type="number"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
});

export default ForwardLocalSettings; 