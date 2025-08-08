// 全局 store 实例，用于解决循环依赖问题
import { keysStore } from './keysStore';
import { authStore } from './authStore';

// 创建一个全局对象来存储所有 stores
export const globalStores: {
  keysStore: typeof keysStore;
  authStore: typeof authStore;
  serversStore: any;
  portForwardingStore: any;
  terminalStore: any;
} = {
  keysStore,
  authStore,
  serversStore: null as any,
  portForwardingStore: null as any,
  terminalStore: null as any,
};

// 初始化状态
let isInitialized = false;

// 初始化函数，在应用启动时调用
export const initializeStores = async () => {
  if (isInitialized) return;
  
  try {
    const { serversStore } = await import('./serversStore');
    const { keysStore } = await import('./keysStore');
    const { portForwardingStore } = await import('./portForwardingStore');
    const { terminalStore } = await import('./terminalStore');
    
    globalStores.serversStore = serversStore;
    globalStores.keysStore = keysStore;
    globalStores.portForwardingStore = portForwardingStore;
    globalStores.terminalStore = terminalStore;
    
    // 初始化数据管理服务
    const { DataService } = await import('../services/dataService');
    await DataService.initializeData();
    DataService.setupAuthListener();
    
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize stores:', error);
  }
};

// 获取函数
export const getKeysStore = (): typeof keysStore => keysStore;
export const getAuthStore = (): typeof authStore => authStore;
export const getServersStore = () => globalStores.serversStore;
export const getPortForwardingStore = () => globalStores.portForwardingStore;
export const getTerminalStore = () => globalStores.terminalStore; 