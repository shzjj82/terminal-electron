import axios from 'axios';

// 从环境变量文件读取配置
const loadEnvConfig = () => {
  try {
    // 在 Electron 环境中，可以通过 IPC 从主进程获取环境变量
    // 或者直接从 process.env 读取
    const isDev = process.env.NODE_ENV === 'development';
    
    return {
      API_BASE_URL: isDev 
        ? process.env.API_BASE_URL || 'http://localhost:3000'
        : process.env.API_BASE_URL || 'http://localhost:3000',
      API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
    };
  } catch (error) {
    console.warn('Failed to load env config, using defaults:', error);
    return {
      API_BASE_URL: 'http://localhost:3000',
      API_TIMEOUT: 10000,
    };
  }
};

const config = loadEnvConfig();

// 创建axios实例
export const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      // 可以在这里触发重新登录
    }
    return Promise.reject(error);
  }
);

export default apiClient; 