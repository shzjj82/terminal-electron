import { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

interface AuthGuardProps {
  children: ReactNode;
  // 移除fallback参数，因为不需要强制登录
}

function AuthGuard({ children }: AuthGuardProps) {
  // 无论是否登录都可以访问，只是功能模式不同
  return <>{children}</>;
}

export default observer(AuthGuard); 