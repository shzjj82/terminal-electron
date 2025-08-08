import { observer } from 'mobx-react-lite';
import { usePortForwardList } from '@renderer/hooks';
import DataCard from '@renderer/components/data-card';

interface PortForwardListProps {
  onEdit: (forward: any) => void;
  onDelete: (forward: any) => void;
  onStart: (forward: any) => void;
  onStop: (forward: any) => void;
}

const PortForwardList = observer(({ 
  onEdit, 
  onDelete, 
  onStart, 
  onStop 
}: PortForwardListProps) => {
  const { forwards, getCardProps } = usePortForwardList({
    onEdit,
    onDelete,
    onStart,
    onStop
  });

  return (
    <div className="space-y-4">
      {forwards.map((forward) => (
        <DataCard
          key={forward.id}
          {...getCardProps(forward)}
        />
      ))}
    </div>
  );
});

export default PortForwardList; 