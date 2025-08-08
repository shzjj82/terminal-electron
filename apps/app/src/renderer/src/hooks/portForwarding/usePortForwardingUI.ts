import { useState, useCallback } from 'react';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';

export const usePortForwardingUI = () => {
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // 处理转发类型选择
  const handleForwardTypeSelect = useCallback((type: 'local' | 'remote' | 'dynamic') => {
    // 设置选中的转发类型
    portForwardingStore.setSelectedForwardType(type);
    // 显示类型选择对话框
    setShowTypeSelector(true);
  }, []);

  // 处理主按钮点击
  const handleMainButtonClick = useCallback(() => {
    setShowTypeSelector(true);
  }, []);

  // 处理类型选择
  const handleTypeSelect = useCallback((type: 'local' | 'remote' | 'dynamic') => {
    // 设置选中的转发类型
    portForwardingStore.setSelectedForwardType(type);
    // 关闭类型选择对话框
    setShowTypeSelector(false);
    // 打开表单对话框
    portForwardingStore.setShowForwardForm(true);
  }, []);

  // 处理编辑转发
  const handleEditForward = useCallback((forward: any) => {
    portForwardingStore.editPortForward(forward);
  }, []);

  // 处理搜索
  const handleSearchChange = useCallback((value: string) => {
    portForwardingStore.setSearchTerm(value);
  }, []);

  // 渲染操作按钮
  const renderActions = useCallback(() => {
    return {
      onForwardTypeSelect: handleForwardTypeSelect,
      onMainButtonClick: handleMainButtonClick
    };
  }, [handleForwardTypeSelect, handleMainButtonClick]);

  // 空状态操作
  const emptyStateAction = useCallback(() => ({
    onClick: handleMainButtonClick,
    children: '创建转发'
  }), [handleMainButtonClick]);

  return {
    showTypeSelector,
    setShowTypeSelector,
    handleForwardTypeSelect,
    handleMainButtonClick,
    handleTypeSelect,
    handleEditForward,
    handleSearchChange,
    renderActions,
    emptyStateAction
  };
}; 