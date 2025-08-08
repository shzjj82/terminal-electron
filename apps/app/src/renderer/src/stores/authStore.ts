import { makeAutoObservable } from 'mobx';
import { createPersistenceManager } from './persistence';
import { authApi, type LoginRequest, type RegisterRequest, type AuthResponse } from '@renderer/api/auth';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

class AuthStore {
  private persistence = createPersistenceManager('auth-store');

  // 状态
  isAuthenticated = false;
  isLoading = false;
  user: User | null = null;
  token: string | null = null;

  // 表单数据
  loginForm: LoginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  registerForm: RegisterForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  };

  constructor() {
    makeAutoObservable(this);
    this.loadAuthData();
  }

  // 加载认证数据
  private loadAuthData() {
    try {
      const authData = this.persistence.load<{
        user: User | null;
        token: string | null;
        isAuthenticated: boolean;
      }>({ user: null, token: null, isAuthenticated: false });

      if (authData.isAuthenticated && authData.user && authData.token) {
        this.user = authData.user;
        this.token = authData.token;
        this.isAuthenticated = true;
        
        // 保存token到localStorage用于API请求
        localStorage.setItem('auth-token', authData.token);
        localStorage.setItem('auth-user', JSON.stringify(authData.user));
      }
    } catch (error) {
      console.error('加载认证数据失败:', error);
    }
  }

  // 保存认证数据
  private saveAuthData() {
    try {
      this.persistence.save({
        user: this.user,
        token: this.token,
        isAuthenticated: this.isAuthenticated
      });
      
      // 同时保存到localStorage用于API请求
      if (this.token) {
        localStorage.setItem('auth-token', this.token);
      }
      if (this.user) {
        localStorage.setItem('auth-user', JSON.stringify(this.user));
      }
    } catch (error) {
      console.error('保存认证数据失败:', error);
    }
  }

  // 清除认证数据
  private clearAuthData() {
    try {
      this.persistence.clear();
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
    } catch (error) {
      console.error('清除认证数据失败:', error);
    }
  }

  // 登录
  async login(credentials: { email: string; password: string; rememberMe: boolean }) {
    this.isLoading = true;
    
    try {
      const loginData: LoginRequest = {
        email: credentials.email,
        password: credentials.password
      };

      const response: AuthResponse = await authApi.login(loginData);
      
      // 转换API响应为用户数据
      const user: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.user.email}`,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      this.user = user;
      this.token = response.token;
      this.isAuthenticated = true;

      // 保存认证数据
      this.saveAuthData();

      return { success: true };
    } catch (error: any) {
      console.error('登录失败:', error);
      const errorMessage = error.response?.data?.message || error.message || '登录失败，请检查邮箱和密码';
      return { success: false, error: errorMessage };
    } finally {
      this.isLoading = false;
    }
  }

  // 注册
  async register(userData: { username: string; email: string; password: string }) {
    this.isLoading = true;
    
    try {
      const registerData: RegisterRequest = {
        username: userData.username,
        email: userData.email,
        password: userData.password
      };

      const response: AuthResponse = await authApi.register(registerData);
      
      // 转换API响应为用户数据
      const user: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.user.email}`,
        createdAt: new Date().toISOString()
      };

      this.user = user;
      this.token = response.token;
      this.isAuthenticated = true;

      // 保存认证数据
      this.saveAuthData();

      return { success: true };
    } catch (error: any) {
      console.error('注册失败:', error);
      const errorMessage = error.response?.data?.message || error.message || '注册失败，请稍后重试';
      return { success: false, error: errorMessage };
    } finally {
      this.isLoading = false;
    }
  }

  // 登出
  async logout() {
    try {
      // 调用登出API
      await authApi.logout();
      
      // 清除本地认证数据
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      this.clearAuthData();
      
      // 清空 terminalStore
      try {
        const { getTerminalStore } = await import('./globalStores');
        const terminalStore = getTerminalStore();
        if (terminalStore) {
          terminalStore.clearAllSessions();
        }
      } catch (error) {
        console.error('清空 terminalStore 失败:', error);
      }
      
      return { success: true };
    } catch (error) {
      console.error('登出失败:', error);
      // 即使API调用失败，也要清除本地数据
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.clearAuthData();
      
      // 清空 terminalStore
      try {
        const { getTerminalStore } = await import('./globalStores');
        const terminalStore = getTerminalStore();
        if (terminalStore) {
          terminalStore.clearAllSessions();
        }
      } catch (error) {
        console.error('清空 terminalStore 失败:', error);
      }
      
      return { success: true };
    }
  }

  // 发送重置密码邮件
  async sendResetPasswordEmail(_email: string) {
    this.isLoading = true;
    
    try {
      // 模拟发送邮件
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true };
    } catch (error) {
      console.error('发送重置密码邮件失败:', error);
      return { success: false, error: '发送失败，请稍后重试' };
    } finally {
      this.isLoading = false;
    }
  }

  // 更新登录表单
  updateLoginForm<K extends keyof LoginForm>(field: K, value: LoginForm[K]) {
    this.loginForm[field] = value;
  }

  // 更新注册表单
  updateRegisterForm<K extends keyof RegisterForm>(field: K, value: RegisterForm[K]) {
    this.registerForm[field] = value;
  }

  // 重置登录表单
  resetLoginForm() {
    this.loginForm = {
      email: '',
      password: '',
      rememberMe: false
    };
  }

  // 重置注册表单
  resetRegisterForm() {
    this.registerForm = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    };
  }

  // 获取用户显示名称
  get displayName() {
    return this.user?.username || this.user?.email || '用户';
  }

  // 获取用户头像
  get avatar() {
    return this.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=default`;
  }

  // 检查是否需要同步数据到云端
  get shouldSyncToCloud() {
    return this.isAuthenticated;
  }

  // 检查是否应该从云端加载数据
  get shouldLoadFromCloud() {
    return this.isAuthenticated;
  }
}

export const authStore = new AuthStore(); 