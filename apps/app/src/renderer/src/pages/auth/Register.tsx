import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Eye, EyeOff, Mail, Lock, User, HardDrive } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { authStore } from '@renderer/stores/authStore';
import SyncService from '@renderer/services/syncService';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    authStore.updateRegisterForm(field as any, value);
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 验证用户名
    if (!authStore.registerForm.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (authStore.registerForm.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    }

    // 验证邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!authStore.registerForm.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!emailRegex.test(authStore.registerForm.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // 验证密码
    if (!authStore.registerForm.password) {
      newErrors.password = '请输入密码';
    } else if (authStore.registerForm.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    // 验证确认密码
    if (!authStore.registerForm.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (authStore.registerForm.password !== authStore.registerForm.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await authStore.register({
      username: authStore.registerForm.username,
      email: authStore.registerForm.email,
      password: authStore.registerForm.password
    });
    
    if (result.success) {
      try {
        // 注册成功后同步数据
        await SyncService.checkAndSync();
      } catch (syncError) {
        console.error('数据同步失败:', syncError);
        // 同步失败不影响注册流程
      }
      
      // 注册成功后跳转到主页
      navigate('/servers');
    } else {
      // 显示错误信息
      setErrors({ general: result.error || '注册失败' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">创建账户</CardTitle>
          <CardDescription className="text-gray-600">
            请填写以下信息完成注册
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名输入 */}
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={authStore.registerForm.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* 邮箱输入 */}
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={authStore.registerForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={authStore.registerForm.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* 确认密码输入 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="请再次输入密码"
                  value={authStore.registerForm.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 用户协议 */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agreement"
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                required
              />
              <Label htmlFor="agreement" className="text-sm text-gray-600">
                我已阅读并同意
                <Link
                  to="/terms"
                  className="text-green-600 hover:text-green-800 hover:underline ml-1"
                >
                  用户协议
                </Link>
                和
                <Link
                  to="/privacy"
                  className="text-green-600 hover:text-green-800 hover:underline ml-1"
                >
                  隐私政策
                </Link>
              </Label>
            </div>

            {/* 注册按钮 */}
            <Button
              type="submit"
              className="w-full"
              disabled={authStore.isLoading}
            >
              {authStore.isLoading ? '注册中...' : '注册'}
            </Button>

            {/* 登录链接 */}
            <div className="text-center">
              <span className="text-sm text-gray-600">已有账户？</span>
              <Link
                to="/login"
                className="text-sm text-green-600 hover:text-green-800 hover:underline ml-1"
              >
                立即登录
              </Link>
            </div>

            {/* 分隔线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">或者</span>
              </div>
            </div>

            {/* 本地模式按钮 */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/servers')}
            >
              <HardDrive className="mr-2 h-4 w-4" />
              本地模式使用
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default observer(Register); 