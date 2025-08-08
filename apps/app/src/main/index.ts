import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { sshService } from './services'
import './services/sshService';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    frame: process.platform === 'darwin' ? false : true, // Mac模式下无边框
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default', // Mac模式下隐藏标题栏
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 在Mac模式下设置拖拽区域
  if (process.platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(false); // 隐藏默认的窗口按钮
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // 应用启动时清理所有SSH连接
  sshService.clearAllConnections();
  sshService.clearAllPortForwarding();

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  ipcMain.on('ping', () => {})

  // SSH IPC handlers
  ipcMain.handle('ssh:connect', async (_event, config) => {
    try {
      return await sshService.connect(config);
    } catch (error: any) {
      console.error('SSH connect error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('ssh:execute', async (_event, connectionId, command) => {
    try {
      return await sshService.executeCommand(connectionId, command);
    } catch (error: any) {
      console.error('SSH execute error:', error);
      return { stdout: '', stderr: error.message, exitCode: 1 };
    }
  });

  ipcMain.handle('ssh:disconnect', async (_event, connectionId) => {
    try {
      await sshService.disconnect(connectionId);
      return { success: true };
    } catch (error: any) {
      console.error('SSH disconnect error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('ssh:isConnected', async (_event, connectionId) => {
    return sshService.isConnected(connectionId);
  });

  // 端口转发 IPC handlers
  ipcMain.handle('ssh:createPortForwarding', async (_event, connectionId, config) => {
    try {
      return await sshService.createPortForwarding(connectionId, config);
    } catch (error: any) {
      console.error('SSH port forwarding error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('ssh:closePortForwarding', async (_event, tunnelId) => {
    try {
      return await sshService.closePortForwarding(tunnelId);
    } catch (error: any) {
      console.error('SSH close port forwarding error:', error);
      return { success: false, error: error.message };
    }
  });

  // 窗口控制 IPC handlers
  ipcMain.handle('window:close', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].close();
    }
  });

  ipcMain.handle('window:minimize', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].minimize();
    }
  });

  ipcMain.handle('window:maximize', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      const window = windows[0];
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 程序退出时清理所有SSH资源
app.on('before-quit', () => {
  sshService.cleanupAll();
})

// 确保在程序退出时清理资源
app.on('will-quit', () => {
  sshService.cleanupAll();
})

// 处理未捕获的异常和退出信号
process.on('SIGINT', () => {
  sshService.cleanupAll();
  process.exit(0);
})

process.on('SIGTERM', () => {
  sshService.cleanupAll();
  process.exit(0);
})

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  sshService.cleanupAll();
  process.exit(1);
})

process.on('unhandledRejection', (reason, _promise) => {
  console.error('未处理的Promise拒绝:', reason);
  sshService.cleanupAll();
  process.exit(1);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
