# API 文档概览

欢迎使用 Terminal Electron API 文档！本文档提供了完整的API参考，帮助您了解和使用所有可用的API端点。

## 📚 文档结构

### 基础信息
- [API 概述](./index.md) - 基础信息、认证方式、错误处理等

### 核心功能
- [认证 API](./auth.md) - 用户注册、登录、JWT令牌管理
- [服务器管理](./servers.md) - SSH服务器配置的CRUD操作
- [SSH密钥管理](./keys.md) - SSH密钥的创建、管理和同步
- [端口转发管理](./port-forwards.md) - 本地、远程和动态端口转发
- [团队管理](./teams.md) - 团队创建、成员管理、权限控制
- [数据管理](./data.md) - 个人和团队数据的获取与同步

## 🚀 快速开始

### 1. 认证
首先需要注册用户并获取JWT令牌：

```bash
# 注册用户
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }'

# 登录获取令牌
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. 使用API
获取令牌后，在请求头中包含认证信息：

```bash
curl -X GET http://localhost:3000/servers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 开发环境

- **基础URL**: `http://localhost:3000`
- **认证方式**: JWT Bearer Token
- **内容类型**: `application/json`

## 📋 API 端点列表

### 认证相关
| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/auth/register` | 用户注册 |
| POST | `/auth/login` | 用户登录 |

### 服务器管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/servers` | 获取服务器列表 |
| POST | `/servers` | 创建服务器 |
| GET | `/servers/:id` | 获取单个服务器 |
| PATCH | `/servers/:id` | 更新服务器 |
| DELETE | `/servers/:id` | 删除服务器 |
| POST | `/servers/sync` | 同步服务器数据 |
| GET | `/servers/personal/data` | 获取个人数据 |

### SSH密钥管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/keys` | 获取密钥列表 |
| POST | `/keys` | 创建密钥 |
| GET | `/keys/:id` | 获取单个密钥 |
| PATCH | `/keys/:id` | 更新密钥 |
| DELETE | `/keys/:id` | 删除密钥 |
| POST | `/keys/sync` | 同步密钥数据 |

### 端口转发管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/port-forwards` | 获取端口转发列表 |
| POST | `/port-forwards/:id/start` | 启动端口转发 |
| POST | `/port-forwards/:id/stop` | 停止端口转发 |
| GET | `/port-forwards/:id/status` | 获取端口转发状态 |
| POST | `/port-forwards` | 创建端口转发 |
| GET | `/port-forwards/:id` | 获取单个端口转发 |
| PATCH | `/port-forwards/:id` | 更新端口转发 |
| DELETE | `/port-forwards/:id` | 删除端口转发 |
| POST | `/port-forwards/sync` | 同步端口转发数据 |

### 团队管理
| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/teams/create` | 创建团队 |
| GET | `/teams/my` | 获取我的团队 |
| GET | `/teams/:id` | 获取团队详情 |
| POST | `/teams/:id/members` | 添加团队成员 |
| PATCH | `/teams/:id/members/:memberId` | 更新成员角色 |
| DELETE | `/teams/:id/members/:memberId` | 移除团队成员 |
| POST | `/teams/join` | 加入团队 |
| GET | `/teams/:id/data` | 获取团队数据 |

### 数据管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/data/personal` | 获取个人数据 |
| GET | `/data/teams/:teamId` | 获取团队数据 |

## 🔐 认证与权限

### JWT 认证
所有需要认证的API都需要在请求头中包含JWT令牌：

```
Authorization: Bearer <your-jwt-token>
```

### 权限控制
- **个人数据**: 只有数据所有者可以访问和修改
- **团队数据**: 根据团队成员角色确定权限
  - Owner: 完全控制权
  - Developer: 可以编辑团队数据
  - User: 只能查看团队数据

## 📊 数据同步

系统支持本地数据与服务器数据的双向同步：

1. **同步到服务器**: 将本地数据上传到服务器
2. **从服务器同步**: 从服务器下载数据到本地
3. **冲突解决**: 以服务器数据为准

## 🛠️ 错误处理

所有API在发生错误时都会返回标准格式的响应：

```json
{
  "statusCode": 400,
  "message": "错误描述",
  "error": "Bad Request"
}
```

常见HTTP状态码：
- `200` - 请求成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 权限不足
- `404` - 资源不存在
- `500` - 服务器内部错误

## 📝 示例代码

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// 获取服务器列表
const servers = await api.get('/servers');

// 创建服务器
const newServer = await api.post('/servers', {
  name: 'My Server',
  host: '192.168.1.100',
  port: 22,
  username: 'root',
  authType: 'password'
});
```

### Python
```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# 获取服务器列表
response = requests.get('http://localhost:3000/servers', headers=headers)
servers = response.json()

# 创建服务器
data = {
    'name': 'My Server',
    'host': '192.168.1.100',
    'port': 22,
    'username': 'root',
    'authType': 'password'
}
response = requests.post('http://localhost:3000/servers', 
                        headers=headers, json=data)
```

## 🤝 贡献

如果您发现文档中的错误或有改进建议，请：

1. 提交 Issue 描述问题
2. 创建 Pull Request 修复问题
3. 确保文档格式符合项目规范

## 📞 支持

如果您在使用API时遇到问题：

1. 查看本文档的相关章节
2. 检查错误响应中的详细信息
3. 确认认证令牌是否有效
4. 验证请求参数格式是否正确

---

**注意**: 本文档基于开发环境编写，生产环境请根据实际情况调整基础URL和配置。 