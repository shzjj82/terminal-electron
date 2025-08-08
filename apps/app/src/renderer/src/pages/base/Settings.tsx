import { observer } from 'mobx-react-lite';
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Database } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { authStore } from '@renderer/stores/authStore';
import { PageHeader } from '@renderer/components/header';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await authStore.logout();
    // 退出登录后跳转到 servers 页面
    navigate('/servers');
  };

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <PageHeader
        searchPlaceholder=""
        searchValue=""
        onSearchChange={() => {}}
        renderActions={() => null}
      />

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">设置</h2>
          <p className="text-gray-600">管理您的账户偏好和应用配置</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 账户设置 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <CardTitle>账户设置</CardTitle>
              </div>
              <CardDescription>
                管理您的账户信息和登录状态
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authStore.isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">当前用户</span>
                    <span className="text-sm font-medium">{authStore.displayName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">邮箱</span>
                    <span className="text-sm font-medium">{authStore.user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">注册时间</span>
                    <span className="text-sm font-medium">
                      {authStore.user?.createdAt ? new Date(authStore.user.createdAt).toLocaleDateString() : '未知'}
                    </span>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    退出登录
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-4">您当前处于本地模式</p>
                  <Button onClick={() => window.location.href = '/login'}>
                    登录账户
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 安全设置 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <CardTitle>安全设置</CardTitle>
              </div>
              <CardDescription>
                管理应用安全相关配置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">自动锁定</span>
                <Button variant="outline" size="sm">
                  配置
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">密码策略</span>
                <Button variant="outline" size="sm">
                  配置
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">会话超时</span>
                <Button variant="outline" size="sm">
                  配置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 通知设置 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <CardTitle>通知设置</CardTitle>
              </div>
              <CardDescription>
                管理应用通知和提醒
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">连接状态通知</span>
                <Button variant="outline" size="sm">
                  开启
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">错误提醒</span>
                <Button variant="outline" size="sm">
                  开启
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">更新提醒</span>
                <Button variant="outline" size="sm">
                  开启
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 外观设置 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-purple-600" />
                <CardTitle>外观设置</CardTitle>
              </div>
              <CardDescription>
                自定义应用界面外观
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">主题模式</span>
                <Button variant="outline" size="sm">
                  浅色
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">字体大小</span>
                <Button variant="outline" size="sm">
                  默认
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">语言</span>
                <Button variant="outline" size="sm">
                  中文
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 数据管理 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <CardTitle>数据管理</CardTitle>
              </div>
              <CardDescription>
                管理应用数据和备份
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">导出数据</span>
                <Button variant="outline" size="sm">
                  导出
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">导入数据</span>
                <Button variant="outline" size="sm">
                  导入
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">清除数据</span>
                <Button variant="outline" size="sm" className="text-red-600">
                  清除
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 关于 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5 text-gray-600" />
                <CardTitle>关于应用</CardTitle>
              </div>
              <CardDescription>
                应用信息和版本
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">版本</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">构建日期</span>
                <span className="text-sm font-medium">2024-01-01</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">许可证</span>
                <span className="text-sm font-medium">MIT</span>
              </div>
              <Button variant="outline" className="w-full">
                检查更新
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default observer(Settings); 