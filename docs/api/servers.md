# 服务器管理 API

## 获取服务器列表

获取当前用户的所有服务器列表。

**端点**: `GET /servers`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**查询参数**:
- `namespace` (string, 可选): 团队命名空间，个人数据为null

**curl 示例**:
```bash
# 获取个人服务器列表
curl -X GET "http://localhost:3000/servers" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# 获取团队服务器列表
curl -X GET "http://localhost:3000/servers?namespace=team-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
[
  {
    "id": "uuid",
    "localId": "local-uuid",
    "name": "My Server",
    "host": "192.168.1.100",
    "port": 22,
    "username": "root",
    "authType": "password",
    "description": "Development server",
    "isActive": true,
    "namespace": null,
    "dataType": "personal",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 创建服务器

创建新的服务器配置。

**端点**: `POST /servers`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
# 创建密码认证的服务器
curl -X POST "http://localhost:3000/servers" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "localId": "local-uuid",
    "name": "My Server",
    "host": "192.168.1.100",
    "port": 22,
    "username": "root",
    "password": "password123",
    "authType": "password",
    "description": "Development server"
  }'

# 创建密钥认证的服务器
curl -X POST "http://localhost:3000/servers" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Key Server",
    "host": "192.168.1.101",
    "port": 22,
    "username": "admin",
    "keyId": "key-uuid",
    "authType": "key",
    "description": "Server with SSH key"
  }'

# 创建团队服务器
curl -X POST "http://localhost:3000/servers?namespace=team-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Server",
    "host": "192.168.1.102",
    "port": 22,
    "username": "team",
    "password": "team123",
    "authType": "password",
    "description": "Team development server"
  }'
```

**请求体**:
```json
{
  "localId": "local-uuid",
  "name": "My Server",
  "host": "192.168.1.100",
  "port": 22,
  "username": "root",
  "password": "password123",
  "authType": "password",
  "description": "Development server"
}
```

**参数说明**:
- `localId` (string, 可选): 本地ID，用于同步
- `name` (string, 必需): 服务器名称
- `host` (string, 必需): 服务器地址
- `port` (number, 必需): SSH端口，范围1-65535
- `username` (string, 必需): SSH用户名
- `password` (string, 可选): SSH密码
- `keyId` (string, 可选): 密钥ID
- `authType` (string, 必需): 认证类型，可选值：`password`, `key`, `keyContent`, `keySelect`
- `description` (string, 可选): 服务器描述

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "My Server",
  "host": "192.168.1.100",
  "port": 22,
  "username": "root",
  "authType": "password",
  "description": "Development server",
  "isActive": true,
  "namespace": null,
  "dataType": "personal",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 获取单个服务器

根据ID获取单个服务器详情。

**端点**: `GET /servers/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 服务器ID

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/servers/server-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "My Server",
  "host": "192.168.1.100",
  "port": 22,
  "username": "root",
  "authType": "password",
  "description": "Development server",
  "isActive": true,
  "namespace": null,
  "dataType": "personal",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 更新服务器

更新服务器配置信息。

**端点**: `PATCH /servers/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 服务器ID

**curl 示例**:
```bash
# 更新服务器配置
curl -X PATCH "http://localhost:3000/servers/server-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Server Name",
    "host": "192.168.1.101",
    "port": 2222,
    "username": "admin",
    "authType": "key",
    "keyId": "key-uuid",
    "description": "Updated description"
  }'

# 部分更新服务器
curl -X PATCH "http://localhost:3000/servers/server-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Server Name",
    "port": 2222
  }'
```

**请求体**:
```json
{
  "name": "Updated Server Name",
  "host": "192.168.1.101",
  "port": 2222,
  "username": "admin",
  "authType": "key",
  "keyId": "key-uuid",
  "description": "Updated description"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "Updated Server Name",
  "host": "192.168.1.101",
  "port": 2222,
  "username": "admin",
  "authType": "key",
  "keyId": "key-uuid",
  "description": "Updated description",
  "isActive": true,
  "namespace": null,
  "dataType": "personal",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 删除服务器

删除指定的服务器配置。

**端点**: `DELETE /servers/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 服务器ID

**curl 示例**:
```bash
curl -X DELETE "http://localhost:3000/servers/server-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "message": "Server deleted successfully"
}
```

---

## 同步服务器数据

将本地服务器数据同步到服务器。

**端点**: `POST /servers/sync`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
# 同步多个服务器配置
curl -X POST "http://localhost:3000/servers/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "localId": "local-uuid-1",
      "name": "Server 1",
      "host": "192.168.1.100",
      "port": 22,
      "username": "root",
      "authType": "password",
      "description": "Server 1 description"
    },
    {
      "localId": "local-uuid-2",
      "name": "Server 2",
      "host": "192.168.1.101",
      "port": 22,
      "username": "admin",
      "authType": "key",
      "keyId": "key-uuid",
      "description": "Server 2 description"
    }
  ]'

# 同步单个服务器配置
curl -X POST "http://localhost:3000/servers/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "localId": "local-uuid",
      "name": "Single Server",
      "host": "192.168.1.100",
      "port": 22,
      "username": "root",
      "authType": "password",
      "description": "Single server description"
    }
  ]'
```

**请求体**:
```json
[
  {
    "localId": "local-uuid-1",
    "name": "Server 1",
    "host": "192.168.1.100",
    "port": 22,
    "username": "root",
    "authType": "password",
    "description": "Server 1 description"
  },
  {
    "localId": "local-uuid-2",
    "name": "Server 2",
    "host": "192.168.1.101",
    "port": 22,
    "username": "admin",
    "authType": "key",
    "keyId": "key-uuid",
    "description": "Server 2 description"
  }
]
```

**响应示例**:
```json
{
  "message": "Servers synced successfully",
  "syncedCount": 2
}
```

---

## 获取个人数据

获取用户的个人服务器数据。

**端点**: `GET /servers/personal/data`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/servers/personal/data" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "servers": [
    {
      "id": "uuid",
      "name": "My Server",
      "host": "192.168.1.100",
      "port": 22,
      "username": "root",
      "authType": "password",
      "description": "Development server",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
``` 