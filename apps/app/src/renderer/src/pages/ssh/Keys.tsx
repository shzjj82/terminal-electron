import { observer } from 'mobx-react-lite';
import { Key } from 'lucide-react';
import { keysStore } from '@renderer/stores/keysStore';
import {
  KeyList,
  CreateKeyDialog,
  DeleteKeyDialog,
} from '@renderer/components/keys';
import { EmptyState } from '@renderer/components/empty';
import { PageHeader } from '@renderer/components/header';
import CreateKeyDropdown from '@renderer/components/keys/CreateKeyDropdown';
import { useTeamPermissions } from '@/contexts/TeamPermissionContext';

function Keys() {
  const { canCreateData, canEditData, canDeleteData } = useTeamPermissions();
  
  const handleCreateKey = (mode: 'password' | 'file' | 'content') => {
    keysStore.setCreateKeyMode(mode);
    keysStore.setShowCreateKeyDialog(true);
  };

  const handleEditKey = (key: any) => {
    keysStore.startEdit(key);
  };

  const handleDeleteKey = (key: any) => {
    keysStore.showDeleteConfirm(key);
  };

  const handleCopyKey = (key: any) => {
    if (key.privateKey) {
      navigator.clipboard.writeText(key.privateKey);
      // 这里可以添加一个toast提示
    }
  };

  const renderHeaderActions = () => (
    canCreateData && (
      <CreateKeyDropdown 
        onCreateKey={handleCreateKey}
      />
    )
  );

  const emptyStateAction = (
    canCreateData && (
      <CreateKeyDropdown 
        onCreateKey={handleCreateKey}
        triggerText="生成密钥"
        showIcon={false}
      />
    )
  );

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <PageHeader
        searchPlaceholder="搜索密钥..."
        searchValue={keysStore.searchTerm}
        onSearchChange={(value) => keysStore.setSearchTerm(value)}
        renderActions={renderHeaderActions}
      />

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">密钥管理</h2>
          <p className="text-gray-600">管理您的 SSH 密钥对</p>
        </div>

        {/* Keys List or Empty State */}
        {keysStore.filteredKeys.length > 0 ? (
          <KeyList
            onEdit={handleEditKey}
            onDelete={handleDeleteKey}
            onCopy={handleCopyKey}
          />
        ) : (
          <EmptyState
            icon={Key}
            title="暂无密钥"
            description="添加您的第一个 SSH 密钥"
            action={emptyStateAction}
          />
        )}
      </div>

      {/* Dialogs */}
      <CreateKeyDialog />
      <DeleteKeyDialog />
    </div>
  );
}

export default observer(Keys); 