// 环境变量加载工具

interface EnvConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  NODE_ENV: string;
}

// 从环境变量文件加载配置
export const loadEnvFile = async (filePath: string): Promise<Record<string, string>> => {
  try {
    // 在 Electron 环境中，尝试从主进程获取环境变量文件内容
    if ((window as any).electron?.ipcRenderer) {
      // 通过 IPC 从主进程读取文件
      const content = await (window as any).electron.ipcRenderer.invoke('read-env-file', filePath);
      const env: Record<string, string> = {};
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim();
          }
        }
      }
      
      return env;
    } else {
      // 回退到 fetch 方式
      const response = await fetch(filePath);
      const content = await response.text();
      
      const env: Record<string, string> = {};
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim();
          }
        }
      }
      
      return env;
    }
  } catch (error) {
    console.warn('Failed to load env file:', error);
    return {};
  }
};

// 加载环境配置
export const loadEnvironmentConfig = (): EnvConfig => {
  const isDev = process.env.NODE_ENV === 'development';
  const buildTarget = process.env.BUILD_TARGET || 'development';
  
  console.log('Current environment:', {
    NODE_ENV: process.env.NODE_ENV,
    BUILD_TARGET: buildTarget,
    API_BASE_URL: process.env.API_BASE_URL
  });
  
  return {
    API_BASE_URL: process.env.API_BASE_URL || (isDev ? 'http://localhost:3000' : 'http://localhost:4000'),
    API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
};

// 初始化环境变量
export const initEnvironment = async (): Promise<void> => {
  try {
    // 根据构建目标确定环境变量文件路径
    const buildTarget = process.env.BUILD_TARGET || 'development';
    const envFileName = buildTarget === 'production' ? 'production.env' : 'development.env';
    const envFilePath = `../../env/${envFileName}`;
    
    console.log('Loading environment from:', envFilePath);
    
    // 尝试加载环境变量文件
    const envFromFile = await loadEnvFile(envFilePath);
    
    // 合并环境变量（文件中的变量优先）
    const config = loadEnvironmentConfig();
    const mergedConfig = {
      ...config,
      ...envFromFile
    };
    
    // 将配置设置到 process.env
    Object.entries(mergedConfig).forEach(([key, value]) => {
      if (typeof process !== 'undefined' && process.env) {
        process.env[key] = value.toString();
      }
    });
    
    console.log('Environment initialized:', mergedConfig);
  } catch (error) {
    console.error('Failed to initialize environment:', error);
  }
}; 