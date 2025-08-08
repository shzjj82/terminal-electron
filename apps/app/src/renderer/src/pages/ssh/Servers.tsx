import { Server, Plus } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { serversStore } from '@renderer/stores/serversStore';
import { observer } from 'mobx-react-lite';
import { ServerList, ServerForm } from '@renderer/components/servers';
import { EmptyState } from '@renderer/components/empty';
import { PageHeader } from '@renderer/components/header';
import { useServersActions, useServersUI } from '@renderer/hooks';
import { useTeamPermissions } from '@/contexts/TeamPermissionContext';

function Servers() {
  // 使用 hooks 来管理不同的逻辑
  const { 
    handleCreateSession, 
    handleDisconnectServer, 
    handleCreateServer, 
    handleEditServer, 
    handleDeleteServer 
  } = useServersActions();
  
  const { handleSearchChange, emptyStateAction } = useServersUI();
  const { canCreateData } = useTeamPermissions();

  const handleFormSubmit = () => {
    serversStore.createServer();
  };

  const emptyAction = emptyStateAction();

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <PageHeader
        searchPlaceholder="搜索服务器..."
        searchValue={serversStore.searchTerm}
        onSearchChange={handleSearchChange}
        renderActions={() => (
          canCreateData && (
            <Button
              onClick={handleCreateServer}
            >
              <Server className="mr-2 h-4 w-4" />
              创建服务器
            </Button>
          )
        )}
      />

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">服务器管理</h2>
          <p className="text-gray-600">管理您的 SSH 服务器连接</p>
        </div>

        {/* Server List or Empty State */}
        {serversStore.filteredServers.length > 0 ? (
          <ServerList
            onEdit={handleEditServer}
            onDelete={handleDeleteServer}
            onConnect={handleCreateSession}
            onDisconnect={handleDisconnectServer}
          />
        ) : (
          <EmptyState
            icon={Server}
            title="暂无服务器"
            description="添加您的第一个服务器连接"
            action={
              canCreateData && (
                <Button onClick={emptyAction.onClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  {emptyAction.children}
                </Button>
              )
            }
          />
        )}
      </div>

      {/* Server Form Dialog */}
      <ServerForm onFormSubmit={handleFormSubmit} />
    </div>
  );
}

export default observer(Servers); 