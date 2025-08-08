import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Mail, ArrowLeft, CheckCircle,HardDrive } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Link } from 'react-router-dom';
import { authStore } from '@renderer/stores/authStore';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setError('');
    
    const result = await authStore.sendResetPasswordEmail(email);
    
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || '发送失败，请稍后重试');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">邮件已发送</CardTitle>
            <CardDescription className="text-gray-600">
              我们已向 {email} 发送了密码重置邮件，请查收并按照邮件中的指示重置密码。
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>提示：</strong>如果您没有收到邮件，请检查垃圾邮件文件夹，或者确认邮箱地址是否正确。
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full"
              >
                重新发送
              </Button>
              
              <Link
                to="/login"
                className="text-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                返回登录页面
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">忘记密码</CardTitle>
          <CardDescription className="text-gray-600">
            请输入您的邮箱地址，我们将发送密码重置链接给您
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
                  placeholder="请输入您的邮箱地址"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className={`pl-10 ${error ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            {/* 发送按钮 */}
            <Button
              type="submit"
              className="w-full"
              disabled={authStore.isLoading}
            >
              {authStore.isLoading ? '发送中...' : '发送重置邮件'}
            </Button>

            {/* 返回登录链接 */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回登录页面
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
              onClick={() => window.location.href = '/servers'}
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

export default observer(ForgotPassword); 