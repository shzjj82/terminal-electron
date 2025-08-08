import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = '/login' 
}) => {
  const location = useLocation();
  
  if (!authStore.isAuthenticated) {
    // 如果当前在团队页面，跳转到 servers 页面
    if (location.pathname.startsWith('/teams')) {
      return <Navigate to="/servers" replace />;
    }
    // 其他情况跳转到指定的 fallback 页面
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}; 