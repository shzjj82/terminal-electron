import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Eye, EyeOff, Mail, Lock, HardDrive } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { authStore } from '@renderer/stores/authStore';
import { DataService } from '@renderer/services/dataService';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    authStore.updateLoginForm(field as any, value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await authStore.login({
      email: authStore.loginForm.email,
      password: authStore.loginForm.password,
      rememberMe: authStore.loginForm.rememberMe
    });
    
    if (result.success) {
      try {
        // 登录成功后从服务端加载数据
        await DataService.loadFromServer();
      } catch (syncError) {
        console.error('从服务端加载数据失败:', syncError);
        // 加载失败不影响登录流程，会自动回退到本地数据
      }
      
      // 登录成功后返回上一页或主页
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      navigate(returnUrl || '/servers');
    } else {
      setError(result.error || '登录失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">欢迎回来</CardTitle>
          <CardDescription className="text-gray-600">
            请登录您的账户以继续使用
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={authStore.loginForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${error ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
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
                  value={authStore.loginForm.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
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
            </div>

            {/* 记住我和忘记密码 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={authStore.loginForm.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  记住我
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                忘记密码？
              </Link>
            </div>

            {/* 登录按钮 */}
            <Button
              type="submit"
              className="w-full"
              disabled={authStore.isLoading}
            >
              {authStore.isLoading ? '登录中...' : '登录'}
            </Button>

            {/* 注册链接 */}
            <div className="text-center">
              <span className="text-sm text-gray-600">还没有账户？</span>
              <Link
                to="/register"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline ml-1"
              >
                立即注册
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

export default observer(Login); 