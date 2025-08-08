import { observer } from 'mobx-react-lite';
import { useServerList } from '@renderer/hooks';
import DataCard from '@renderer/components/data-card';

interface ServerListProps {
  onEdit: (server: any) => void;
  onDelete: (server: any) => void;
  onConnect: (server: any) => void;
  onDisconnect: (server: any) => void;
}

const ServerList = observer(({ 
  onEdit, 
  onDelete, 
  onConnect, 
  onDisconnect 
}: ServerListProps) => {
  const { servers, getCardProps } = useServerList({
    onEdit,
    onDelete,
    onConnect,
    onDisconnect
  });

  return (
    <div className="space-y-4">
      {servers.map((server) => (
        <DataCard
          key={server.id}
          {...getCardProps(server)}
        />
      ))}
    </div>
  );
});

export default ServerList; 