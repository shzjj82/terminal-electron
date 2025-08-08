# 密钥管理

Terminal Electron 提供了完整的 SSH 密钥管理功能，支持多种密钥类型和安全的密钥存储。

## 密钥类型

### 1. RSA 密钥

传统的 SSH 密钥类型，兼容性最好。

#### 特点
- **兼容性**: 所有 SSH 客户端都支持
- **安全性**: 2048 位以上足够安全
- **性能**: 计算开销适中
- **长度**: 支持 2048、4096 位

#### 生成命令
```bash
# 生成 RSA 密钥
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 指定密钥文件
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_production
```

#### 密钥格式
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAIEAvxX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
...
-----END OPENSSH PRIVATE KEY-----
```

### 2. Ed25519 密钥

现代的高性能密钥类型，推荐使用。

#### 特点
- **安全性**: 高安全性，256 位密钥
- **性能**: 计算速度快
- **长度**: 固定 256 位
- **兼容性**: 现代 SSH 客户端支持

#### 生成命令
```bash
# 生成 Ed25519 密钥
ssh-keygen -t ed25519 -C "your-email@example.com"

# 指定密钥文件
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_production
```

#### 密钥格式
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAdzc2gtZWQy
NTUxOQAAACD8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
...
-----END OPENSSH PRIVATE KEY-----
```

### 3. ECDSA 密钥

基于椭圆曲线的密钥类型。

#### 特点
- **安全性**: 基于椭圆曲线密码学
- **性能**: 计算效率高
- **长度**: 支持 256、384、521 位
- **兼容性**: 现代系统支持

#### 生成命令
```bash
# 生成 ECDSA 密钥
ssh-keygen -t ecdsa -b 521 -C "your-email@example.com"

# 指定密钥文件
ssh-keygen -t ecdsa -b 521 -f ~/.ssh/id_ecdsa_production
```

## 密钥管理

### 1. 密钥创建

#### 通过界面创建
1. 在密钥管理页面点击 "新建密钥"
2. 选择密钥类型 (RSA/Ed25519/ECDSA)
3. 设置密钥名称和描述
4. 选择密钥长度
5. 设置密钥密码 (可选)
6. 点击 "生成密钥"

#### 通过命令行创建
```bash
# 生成新密钥
ssh-keygen -t ed25519 -C "production-server-key"

# 设置密钥密码
ssh-keygen -t ed25519 -C "production-server-key" -N "your-passphrase"

# 指定密钥文件
ssh-keygen -t ed25519 -f ~/.ssh/production_key -C "production-server-key"
```

#### 密钥配置
```json
{
  "id": "key-uuid",
  "name": "Production Server Key",
  "type": "ed25519",
  "publicKey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...",
  "privateKey": "-----BEGIN OPENSSH PRIVATE KEY-----...",
  "passphrase": "encrypted-passphrase",
  "description": "用于生产服务器的密钥",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastUsed": "2024-01-01T00:00:00.000Z"
}
```

### 2. 密钥导入

#### 导入现有密钥
1. 在密钥管理页面点击 "导入密钥"
2. 选择密钥文件或粘贴密钥内容
3. 输入密钥密码 (如果设置了)
4. 设置密钥名称和描述
5. 点击 "导入密钥"

#### 导入方式
```bash
# 从文件导入
ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub

# 从 SSH 代理导入
ssh-add -L

# 从其他系统导入
scp ~/.ssh/id_ed25519 user@remote-server:~/.ssh/
```

### 3. 密钥存储

#### 本地存储
- **加密存储**: 使用系统密钥链加密
- **权限控制**: 限制文件访问权限
- **备份机制**: 自动备份到安全位置
- **版本控制**: 支持密钥版本管理

#### 安全措施
```bash
# 设置正确的文件权限
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub

# 设置目录权限
chmod 700 ~/.ssh

# 验证权限设置
ls -la ~/.ssh/
```

### 4. 密钥使用

#### 连接服务器
1. 在服务器配置中选择 "密钥" 认证方式
2. 选择对应的密钥
3. 输入密钥密码 (如果设置了)
4. 点击连接按钮

#### 密钥配置
```json
{
  "serverId": "server-uuid",
  "authType": "key",
  "keyId": "key-uuid",
  "passphrase": "key-passphrase",
  "username": "deploy"
}
```

## 密钥安全

### 1. 密码保护

#### 设置密钥密码
```bash
# 生成带密码的密钥
ssh-keygen -t ed25519 -C "your-email@example.com" -N "your-passphrase"

# 为现有密钥添加密码
ssh-keygen -p -f ~/.ssh/id_ed25519
```

#### 密码管理
- **强密码**: 使用复杂的密码
- **密码存储**: 安全存储密码
- **密码轮换**: 定期更换密码
- **密码恢复**: 提供密码恢复机制

### 2. 访问控制

#### 权限管理
```bash
# 设置文件权限
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 700 ~/.ssh

# 设置目录权限
chmod 755 ~/.ssh
```

#### 用户权限
- **所有者**: 只有密钥所有者可访问
- **组权限**: 限制组访问权限
- **其他用户**: 禁止其他用户访问
- **执行权限**: 禁止执行权限

### 3. 密钥轮换

#### 轮换策略
- **定期轮换**: 每 90 天轮换一次
- **事件轮换**: 安全事件后立即轮换
- **用户轮换**: 用户离职时轮换
- **系统轮换**: 系统升级时轮换

#### 轮换流程
1. 生成新密钥
2. 将新密钥添加到服务器
3. 测试新密钥连接
4. 移除旧密钥
5. 更新客户端配置

## 密钥部署

### 1. 服务器部署

#### 手动部署
```bash
# 复制公钥到服务器
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server.com

# 或手动添加公钥
cat ~/.ssh/id_ed25519.pub | ssh user@server.com "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

#### 自动化部署
```bash
#!/bin/bash
# 批量部署密钥
for server in servers.txt; do
  ssh-copy-id -i ~/.ssh/id_ed25519.pub user@$server
done
```

### 2. 权限配置

#### SSH 配置
```bash
# 编辑 SSH 配置文件
vim ~/.ssh/config

# 添加服务器配置
Host production-server
    HostName 192.168.1.100
    User deploy
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

#### 服务器配置
```bash
# 编辑服务器 SSH 配置
sudo vim /etc/ssh/sshd_config

# 配置密钥认证
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication no
```

### 3. 测试验证

#### 连接测试
```bash
# 测试密钥连接
ssh -i ~/.ssh/id_ed25519 user@server.com

# 测试特定配置
ssh production-server

# 测试连接并执行命令
ssh user@server.com "echo 'Connection successful'"
```

#### 权限验证
```bash
# 检查密钥权限
ls -la ~/.ssh/

# 检查服务器权限
ssh user@server.com "ls -la ~/.ssh/"

# 验证密钥工作
ssh -T user@server.com
```

## 密钥监控

### 1. 使用统计

#### 连接记录
- **连接时间**: 记录每次连接时间
- **连接时长**: 统计连接持续时间
- **连接频率**: 分析连接使用频率
- **连接来源**: 记录连接来源 IP

#### 使用分析
```json
{
  "keyId": "key-uuid",
  "usageStats": {
    "totalConnections": 150,
    "lastUsed": "2024-01-01T00:00:00.000Z",
    "averageDuration": 1800,
    "mostUsedServer": "server-uuid"
  }
}
```

### 2. 安全监控

#### 异常检测
- **异常登录**: 检测异常登录行为
- **失败尝试**: 监控失败的连接尝试
- **权限变更**: 监控密钥权限变更
- **文件修改**: 监控密钥文件修改

#### 安全日志
```bash
# 查看 SSH 日志
sudo tail -f /var/log/auth.log

# 查看连接日志
grep "Accepted publickey" /var/log/auth.log

# 查看失败日志
grep "Failed publickey" /var/log/auth.log
```

### 3. 健康检查

#### 密钥状态
- **有效性**: 检查密钥是否有效
- **权限**: 验证密钥文件权限
- **完整性**: 检查密钥文件完整性
- **过期性**: 检查密钥是否过期

#### 定期检查
```bash
#!/bin/bash
# 密钥健康检查脚本
for key in ~/.ssh/id_*; do
  if [ -f "$key" ]; then
    echo "Checking $key..."
    ssh-keygen -l -f "$key"
  fi
done
```

## 故障排除

### 1. 常见问题

#### 密钥权限问题
**问题**: 密钥权限过于开放
**解决方案**:
```bash
# 修复密钥权限
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 700 ~/.ssh
```

#### 密钥格式问题
**问题**: 密钥格式不正确
**解决方案**:
```bash
# 转换密钥格式
ssh-keygen -p -f ~/.ssh/id_rsa -m pem

# 生成新格式密钥
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
```

#### 密码问题
**问题**: 密钥密码错误
**解决方案**:
```bash
# 重置密钥密码
ssh-keygen -p -f ~/.ssh/id_ed25519

# 移除密钥密码
ssh-keygen -p -f ~/.ssh/id_ed25519 -N ""
```

### 2. 连接问题

#### 认证失败
**问题**: 密钥认证失败
**解决方案**:
1. 检查密钥是否正确添加到服务器
2. 验证密钥权限设置
3. 确认服务器 SSH 配置
4. 检查密钥密码

#### 连接超时
**问题**: 密钥连接超时
**解决方案**:
1. 检查网络连接
2. 验证服务器地址
3. 确认 SSH 服务状态
4. 检查防火墙设置

### 3. 性能问题

#### 密钥加载慢
**解决方案**:
1. 使用更快的密钥类型 (Ed25519)
2. 减少密钥长度
3. 优化密钥存储
4. 使用 SSH 代理

#### 连接速度慢
**解决方案**:
1. 启用连接压缩
2. 使用更近的服务器
3. 优化网络设置
4. 检查服务器负载

## 最佳实践

### 1. 安全最佳实践

#### 密钥生成
- 使用强密钥类型 (Ed25519)
- 设置足够的密钥长度
- 使用强密码保护
- 定期轮换密钥

#### 密钥存储
- 使用加密存储
- 设置正确的文件权限
- 定期备份密钥
- 安全传输密钥

### 2. 管理最佳实践

#### 密钥组织
- 使用有意义的密钥名称
- 按用途分类密钥
- 记录密钥用途和服务器
- 维护密钥清单

#### 密钥监控
- 定期检查密钥状态
- 监控密钥使用情况
- 记录密钥变更历史
- 及时处理安全问题

### 3. 部署最佳实践

#### 自动化部署
- 使用脚本批量部署
- 验证部署结果
- 测试密钥连接
- 清理旧密钥

#### 权限管理
- 最小权限原则
- 定期审查权限
- 及时撤销权限
- 记录权限变更

## 高级功能

### 1. 密钥代理

#### SSH 代理
```bash
# 启动 SSH 代理
eval $(ssh-agent)

# 添加密钥到代理
ssh-add ~/.ssh/id_ed25519

# 列出代理中的密钥
ssh-add -l

# 移除代理中的密钥
ssh-add -d ~/.ssh/id_ed25519
```

#### 代理管理
- 自动启动代理
- 密钥自动加载
- 代理状态监控
- 代理安全配置

### 2. 密钥同步

#### 多设备同步
- 密钥跨设备同步
- 配置自动同步
- 状态实时同步
- 冲突解决机制

#### 团队协作
- 团队密钥管理
- 权限分级控制
- 密钥共享机制
- 审计日志记录

### 3. 企业功能

#### 集中管理
- 密钥集中存储
- 统一权限管理
- 策略配置
- 合规审计

#### 安全增强
- 密钥加密存储
- 访问控制
- 审计日志
- 安全策略 