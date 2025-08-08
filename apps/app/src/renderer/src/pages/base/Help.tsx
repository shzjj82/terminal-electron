import { observer } from 'mobx-react-lite';
import { Cloud, HardDrive, Shield, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { authStore } from '@renderer/stores/authStore';

function Help() {
  return (
    <div className="flex-1 bg-white overflow-y-auto h-full">
      <div className="p-6 pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">使用说明</h2>
          <p className="text-gray-600">了解本地模式和云端模式的区别</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 本地模式 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-green-600" />
                <CardTitle>本地模式</CardTitle>
              </div>
              <CardDescription>
                无需登录，所有数据存储在本地
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">数据安全</h4>
                  <p className="text-sm text-gray-600">所有数据仅存储在您的设备上，确保隐私安全</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Database className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">离线使用</h4>
                  <p className="text-sm text-gray-600">无需网络连接，随时随地使用</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                {/* <Sync className="w-4 h-4 text-gray-400 mt-0.5" /> */}
                <div>
                  <h4 className="font-medium">单设备</h4>
                  <p className="text-sm text-gray-600">数据仅在当前设备上可用</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 云端模式 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <CardTitle>云端模式</CardTitle>
              </div>
              <CardDescription>
                登录后，数据同步到云端
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div>
                  <h4 className="font-medium">多设备同步</h4>
                  <p className="text-sm text-gray-600">数据在多个设备间自动同步</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Cloud className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">云端备份</h4>
                  <p className="text-sm text-gray-600">重要数据自动备份到云端</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">团队协作</h4>
                  <p className="text-sm text-gray-600">支持团队共享和协作功能</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 当前状态 */}
        <div className="mt-8">
          <Card>
            <CardContent>
              <div className="flex items-center space-x-3">
                {authStore.isAuthenticated ? (
                  <>
                    <Cloud className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">云端模式</p>
                      <p className="text-sm text-gray-600">
                        已登录为 {authStore.displayName}，数据将同步到云端
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">本地模式</p>
                      <p className="text-sm text-gray-600">
                        未登录，所有数据存储在本地
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能对比 */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>功能对比</CardTitle>
              <CardDescription>
                本地模式与云端模式的功能差异
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">功能</th>
                      <th className="text-center py-2">本地模式</th>
                      <th className="text-center py-2">云端模式</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">SSH连接</td>
                      <td className="text-center py-2">✅</td>
                      <td className="text-center py-2">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">端口转发</td>
                      <td className="text-center py-2">✅</td>
                      <td className="text-center py-2">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">密钥管理</td>
                      <td className="text-center py-2">✅</td>
                      <td className="text-center py-2">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">数据同步</td>
                      <td className="text-center py-2">❌</td>
                      <td className="text-center py-2">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">云端备份</td>
                      <td className="text-center py-2">❌</td>
                      <td className="text-center py-2">✅</td>
                    </tr>
                    <tr>
                      <td className="py-2">团队协作</td>
                      <td className="text-center py-2">❌</td>
                      <td className="text-center py-2">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default observer(Help); 