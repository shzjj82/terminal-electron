import apiClient from './config';

// 认证相关的类型定义
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 认证API接口
export const authApi = {
  // 用户登录
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // 用户注册
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // 验证token
  async validateToken(): Promise<boolean> {
    try {
      await apiClient.get('/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  },

  // 登出
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // 即使API调用失败，也要清除本地存储
    } finally {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
    }
  },
};

export default authApi; 