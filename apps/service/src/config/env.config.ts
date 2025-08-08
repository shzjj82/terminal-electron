import { readFileSync } from 'fs';
import { join } from 'path';

interface EnvConfig {
  NODE_ENV: string;
  DB_TYPE: string;
  DB_DATABASE: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  PORT: number;
  API_BASE_URL: string;
  API_TIMEOUT: number;
}

// 从环境变量文件加载配置
export const loadEnvFile = (filePath: string): Record<string, string> => {
  try {
    const content = readFileSync(filePath, 'utf-8');
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
  } catch (error) {
    console.warn('Failed to load env file:', error);
    return {};
  }
};

// 加载环境配置
export const loadEnvironmentConfig = (): EnvConfig => {
  const isDev = process.env.NODE_ENV === 'development';
  
  // 尝试从环境变量文件加载
  let envFile: Record<string, string> = {};
  try {
    const envPath = isDev 
      ? join(process.cwd(), '../../env/development.env')
      : join(process.cwd(), '../../env/production.env');
    envFile = loadEnvFile(envPath);
  } catch (error) {
    console.warn('Failed to load env file, using process.env:', error);
  }
  
  return {
    NODE_ENV: envFile.NODE_ENV || process.env.NODE_ENV || 'development',
    DB_TYPE: envFile.DB_TYPE || process.env.DB_TYPE || 'sqlite',
    DB_DATABASE: envFile.DB_DATABASE || process.env.DB_DATABASE || (isDev ? 'apps/service/data/terminal-dev.db' : '/app/data/terminal.db'),
    JWT_SECRET: envFile.JWT_SECRET || process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRES_IN: envFile.JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '7d',
    PORT: parseInt(envFile.PORT || process.env.PORT || '3000'),
    API_BASE_URL: envFile.API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3000',
    API_TIMEOUT: parseInt(envFile.API_TIMEOUT || process.env.API_TIMEOUT || '10000'),
  };
};

// 初始化环境变量
export const initEnvironment = (): void => {
  try {
    const config = loadEnvironmentConfig();
    
    // 将配置设置到 process.env
    Object.entries(config).forEach(([key, value]) => {
      process.env[key] = value.toString();
    });
    
    console.log('Environment initialized:', {
      NODE_ENV: config.NODE_ENV,
      DB_TYPE: config.DB_TYPE,
      DB_DATABASE: config.DB_DATABASE,
      PORT: config.PORT,
    });
  } catch (error) {
    console.error('Failed to initialize environment:', error);
  }
}; 