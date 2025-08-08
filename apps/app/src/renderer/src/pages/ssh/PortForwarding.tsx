import { Plus, ArrowLeftRight } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';
import { observer } from 'mobx-react-lite';
import { PortForwardList, ForwardTypeSelector, ForwardForm } from '@renderer/components/portForwarding';
import { PageHeader } from '@renderer/components/header';
import { ForwardActionButton } from '@renderer/components/portForwarding';
import { EmptyState } from '@renderer/components/empty';
import { 
  usePortForwardingActions, 
  usePortForwardingUI, 
  usePortForwardingForm 
} from '@renderer/hooks';
import { useTeamPermissions } from '@/contexts/TeamPermissionContext';

function PortForwarding() {
  const { canCreateData, canEditData, canDeleteData, canUseData } = useTeamPermissions();
  
  // 使用 hooks 来管理不同的逻辑
  const { handleStartForward, handleStopForward, handleDeleteForward } = usePortForwardingActions();
  const { 
    showTypeSelector, 
    setShowTypeSelector, 
    handleTypeSelect, 
    handleEditForward, 
    handleSearchChange, 
    renderActions, 
    emptyStateAction 
  } = usePortForwardingUI();
  const { handleSelectKeyFile, handleFormSubmit } = usePortForwardingForm();

  const actions = renderActions();
  const emptyAction = emptyStateAction();

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <PageHeader
        searchPlaceholder="搜索端口转发..."
        searchValue={portForwardingStore.searchTerm}
        onSearchChange={handleSearchChange}
        renderActions={() => (
          canCreateData && (
            <ForwardActionButton 
              onForwardTypeSelect={actions.onForwardTypeSelect}
              onMainButtonClick={actions.onMainButtonClick}
            />
          )
        )}
      />

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">端口转发</h2>
          <p className="text-gray-600">管理您的 SSH 端口转发规则</p>
        </div>

        {/* Port Forward List or Empty State */}
        {portForwardingStore.filteredPortForwards.length > 0 ? (
          <PortForwardList
            onEdit={handleEditForward}
            onDelete={handleDeleteForward}
            onStart={handleStartForward}
            onStop={handleStopForward}
          />
        ) : (
          <EmptyState
            icon={ArrowLeftRight}
            title="暂无端口转发"
            description="创建您的第一个端口转发规则"
            action={
              <Button onClick={emptyAction.onClick}>
                <Plus className="mr-2 h-4 w-4" />
                {emptyAction.children}
              </Button>
            }
          />
        )}
      </div>

      {/* Type Selector Dialog */}
      <ForwardTypeSelector 
        open={showTypeSelector}
        onOpenChange={setShowTypeSelector}
        onForwardTypeSelect={handleTypeSelect} 
      />

      {/* Forward Form Dialog */}
      <ForwardForm 
        onFormSubmit={handleFormSubmit}
        onSelectKeyFile={handleSelectKeyFile}
      />
    </div>
  );
}

export default observer(PortForwarding); 