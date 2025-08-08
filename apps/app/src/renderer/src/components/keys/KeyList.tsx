import { observer } from 'mobx-react-lite';
import { Copy } from 'lucide-react';
import { useKeyList } from '@renderer/hooks';
import DataCard from '@renderer/components/data-card';

interface KeyListProps {
  onEdit: (key: any) => void;
  onDelete: (key: any) => void;
  onCopy: (key: any) => void;
}

const KeyList = observer(({ onEdit, onDelete, onCopy }: KeyListProps) => {
  const { keys, getCardProps, getPrivateKeyData } = useKeyList({
    onEdit,
    onDelete,
    onCopy
  });

  const renderPrivateKeyContent = (key: any) => {
    const privateKeyData = getPrivateKeyData(key);
    if (!privateKeyData) return null;

    return (
      <div className="mt-4 p-3 bg-gray-50 rounded border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">私钥</span>
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
            onClick={privateKeyData.onCopy}
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
          {privateKeyData.privateKey}
        </pre>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {keys.map((key) => (
        <DataCard
          key={key.id}
          {...getCardProps(key)}
        >
          {renderPrivateKeyContent(key)}
        </DataCard>
      ))}
    </div>
  );
});

export default KeyList; 