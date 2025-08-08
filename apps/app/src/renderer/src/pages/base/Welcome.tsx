import { observer } from 'mobx-react-lite';
import { Terminal, Server, Key, ArrowLeftRight, Cloud, HardDrive, ArrowRight } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { authStore } from '@renderer/stores/authStore';

function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Server,
      title: '服务器管理',
      description: '轻松管理多个SSH服务器连接，支持密码和密钥认证'
    },
    {
      icon: Terminal,
      title: '终端会话',
      description: '内置终端，支持多会话管理，实时连接状态监控'
    },
    {
      icon: ArrowLeftRight,
      title: '端口转发',
      description: '支持本地、远程和动态端口转发，满足各种网络需求'
    },
    {
      icon: Key,
      title: '密钥管理',
      description: '安全的SSH密钥管理，支持多种密钥格式和加密方式'
    }
  ];

  const handleLocalMode = () => {
    navigate('/servers');
  };

  const handleCloudMode = () => {
    if (authStore.isAuthenticated) {
      navigate('/servers');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            欢迎使用 SSH 终端管理器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            专业的SSH连接管理工具，支持服务器管理、终端会话、端口转发和密钥管理
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mode Selection */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              选择您的使用模式
            </h2>
            <p className="text-gray-600">
              您可以选择本地模式立即开始使用，或登录云端模式享受更多功能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Local Mode */}
            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <HardDrive className="w-8 h-8 text-green-600" />
                  <div>
                    <CardTitle className="text-xl">本地模式</CardTitle>
                    <CardDescription>立即开始使用，无需登录</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">所有数据存储在本地</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">无需网络连接</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">保护隐私安全</span>
                  </div>
                </div>
                <Button 
                  onClick={handleLocalMode}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  立即开始
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Cloud Mode */}
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Cloud className="w-8 h-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl">云端模式</CardTitle>
                    <CardDescription>登录后享受更多功能</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">多设备数据同步</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">云端备份保护</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">团队协作功能</span>
                  </div>
                </div>
                <Button 
                  onClick={handleCloudMode}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  登录使用
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(Welcome); 