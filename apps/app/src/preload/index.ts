import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // SSH相关API
  ssh: {
    connect: (config: any) => ipcRenderer.invoke('ssh:connect', config),
    execute: (connectionId: string, command: string) => ipcRenderer.invoke('ssh:execute', connectionId, command),
    disconnect: (connectionId: string) => ipcRenderer.invoke('ssh:disconnect', connectionId),
    isConnected: (connectionId: string) => ipcRenderer.invoke('ssh:isConnected', connectionId),
    createPortForwarding: (connectionId: string, config: any) => ipcRenderer.invoke('ssh:createPortForwarding', connectionId, config),
    closePortForwarding: (tunnelId: string) => ipcRenderer.invoke('ssh:closePortForwarding', tunnelId)
  },
  // 窗口控制API
  window: {
    close: () => ipcRenderer.invoke('window:close'),
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize')
  }
}

// 兼容 window.electron.invoke/on 用法
const electronCompat = {
  ...electronAPI,
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => {
      listener(...args);
    });
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronCompat)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronCompat
  // @ts-ignore (define in dts)
  window.api = api
}
