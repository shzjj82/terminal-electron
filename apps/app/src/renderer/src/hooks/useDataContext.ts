import { useState, useEffect } from 'react';

// 数据上下文状态
interface DataContextState {
  currentMode: 'personal' | 'team';
  currentTeamId: string | null;
  currentTeamName: string | null;
}

// 全局数据上下文状态
let globalDataContext: DataContextState = {
  currentMode: 'personal',
  currentTeamId: null,
  currentTeamName: null,
};

// 监听器列表
const listeners: Array<(context: DataContextState) => void> = [];

// 更新全局数据上下文
export const updateDataContext = (context: Partial<DataContextState>) => {
  globalDataContext = { ...globalDataContext, ...context };
  // 通知所有监听器
  listeners.forEach(listener => listener(globalDataContext));
};

// 获取当前数据上下文
export const getCurrentDataContext = (): DataContextState => {
  return globalDataContext;
};

// 数据上下文 Hook
export const useDataContext = () => {
  const [context, setContext] = useState<DataContextState>(globalDataContext);

  useEffect(() => {
    const listener = (newContext: DataContextState) => {
      setContext(newContext);
    };
    
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return context;
}; 