# 端口转发管理 API

## 获取端口转发列表

获取当前用户的所有端口转发配置列表。

**端点**: `GET /port-forwards`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**查询参数**:
- `namespace` (string, 可选): 团队命名空间，个人数据为null
- `status` (string, 可选): 状态过滤，可选值：`active`, `inactive`

**curl 示例**:
```bash
# 获取个人端口转发列表
curl -X GET "http://localhost:3000/port-forwards" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# 获取团队端口转发列表
curl -X GET "http://localhost:3000/port-forwards?namespace=team-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# 获取活跃的端口转发
curl -X GET "http://localhost:3000/port-forwards?status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# 获取团队中活跃的端口转发
curl -X GET "http://localhost:3000/port-forwards?namespace=team-uuid&status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
[
  {
    "id": "uuid",
    "localId": "local-uuid",
    "name": "Web Server Forward",
    "type": "local",
    "localHost": "127.0.0.1",
    "localPort": 8080,
    "remoteHost": "192.168.1.100",
    "remotePort": 80,
    "bindAddress": "0.0.0.0",
    "bindPort": 8080,
    "serverId": "server-uuid",
    "status": "inactive",
    "lastUsed": null,
    "tunnelId": null,
    "connectionId": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 启动端口转发

启动指定的端口转发，将状态设置为 `active`。

**端点**: `POST /port-forwards/:id/start`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 端口转发ID

**curl 示例**:
```bash
curl -X POST "http://localhost:3000/port-forwards/forward-uuid/start" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "Web Server Forward",
  "type": "local",
  "localHost": "127.0.0.1",
  "localPort": 8080,
  "remoteHost": "192.168.1.100",
  "remotePort": 80,
  "bindAddress": "0.0.0.0",
  "bindPort": 8080,
  "serverId": "server-uuid",
  "status": "active",
  "lastUsed": "2024-01-01T00:00:00.000Z",
  "tunnelId": "tunnel-uuid",
  "connectionId": "connection-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 停止端口转发

停止指定的端口转发，将状态设置为 `inactive`。

**端点**: `POST /port-forwards/:id/stop`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 端口转发ID

**curl 示例**:
```bash
curl -X POST "http://localhost:3000/port-forwards/forward-uuid/stop" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "Web Server Forward",
  "type": "local",
  "localHost": "127.0.0.1",
  "localPort": 8080,
  "remoteHost": "192.168.1.100",
  "remotePort": 80,
  "bindAddress": "0.0.0.0",
  "bindPort": 8080,
  "serverId": "server-uuid",
  "status": "inactive",
  "lastUsed": "2024-01-01T00:00:00.000Z",
  "tunnelId": null,
  "connectionId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 获取端口转发状态

获取指定端口转发的详细状态信息。

**端点**: `GET /port-forwards/:id/status`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 端口转发ID

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/port-forwards/forward-uuid/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "id": "uuid",
  "status": "active",
  "lastUsed": "2024-01-01T00:00:00.000Z",
  "tunnelId": "tunnel-uuid",
  "connectionId": "connection-uuid",
  "isActive": true,
  "name": "Web Server Forward",
  "type": "local",
  "localHost": "127.0.0.1",
  "localPort": 8080,
  "remoteHost": "192.168.1.100",
  "remotePort": 80,
  "bindAddress": "0.0.0.0",
  "bindPort": 8080
}
```

---

## 创建端口转发

创建新的端口转发配置。

**端点**: `POST /port-forwards`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
# 创建本地端口转发
curl -X POST "http://localhost:3000/port-forwards" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "localId": "local-uuid",
    "name": "Web Server Forward",
    "type": "local",
    "localHost": "127.0.0.1",
    "localPort": 8080,
    "remoteHost": "192.168.1.100",
    "remotePort": 80,
    "bindAddress": "0.0.0.0",
    "bindPort": 8080,
    "serverId": "server-uuid"
  }'

# 创建远程端口转发
curl -X POST "http://localhost:3000/port-forwards" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Database Forward",
    "type": "remote",
    "localHost": "0.0.0.0",
    "localPort": 9000,
    "remoteHost": "192.168.1.101",
    "remotePort": 3306,
    "bindAddress": "0.0.0.0",
    "bindPort": 9000,
    "serverId": "server-uuid"
  }'

# 创建动态端口转发
curl -X POST "http://localhost:3000/port-forwards" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SOCKS Proxy",
    "type": "dynamic",
    "bindAddress": "0.0.0.0",
    "bindPort": 1080,
    "serverId": "server-uuid"
  }'

# 手动输入服务器信息创建端口转发
curl -X POST "http://localhost:3000/port-forwards" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manual Server Forward",
    "type": "local",
    "localHost": "127.0.0.1",
    "localPort": 8080,
    "remoteHost": "192.168.1.100",
    "remotePort": 80,
    "serverAddress": "192.168.1.100",
    "username": "root",
    "authType": "password",
    "password": "password123"
  }'
```

**请求体**:
```json
{
  "localId": "local-uuid",
  "name": "Web Server Forward",
  "type": "local",
  "localHost": "127.0.0.1",
  "localPort": 8080,
  "remoteHost": "192.168.1.100",
  "remotePort": 80,
  "bindAddress": "0.0.0.0",
  "bindPort": 8080,
  "serverId": "server-uuid"
}
```

**参数说明**:
- `localId` (string, 可选): 本地ID，用于同步
- `name` (string, 必需): 端口转发名称
- `type` (string, 必需): 转发类型，可选值：`dynamic`, `local`, `remote`
- `localHost` (string, 可选): 本地主机地址
- `localPort` (number, 可选): 本地端口，范围0-65535
- `remoteHost` (string, 可选): 远程主机地址
- `remotePort` (number, 可选): 远程端口，范围0-65535
- `bindAddress` (string, 可选): 绑定地址
- `bindPort` (number, 可选): 绑定端口，范围1-65535
- `serverId` (string, 可选): 关联的服务器ID

**手动输入服务器信息时的字段**:
- `serverAddress` (string, 可选): 服务器地址
- `username` (string, 可选): SSH用户名
- `authType` (string, 可选): 认证类型，可选值：`password`, `key`
- `password` (string, 可选): SSH密码
- `keyPath` (string, 可选): 密钥文件路径
- `keyContent` (string, 可选): 密钥内容
- `passphrase` (string, 可选): 密钥密码

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "Web Server Forward",
  "type": "local",
  "localHost": "127.0.0.1",
  "localPort": 8080,
  "remoteHost": "192.168.1.100",
  "remotePort": 80,
  "bindAddress": "0.0.0.0",
  "bindPort": 8080,
  "serverId": "server-uuid",
  "status": "inactive",
  "lastUsed": null,
  "tunnelId": null,
  "connectionId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 获取单个端口转发

根据ID获取单个端口转发详情。

**端点**: `GET /port-forwards/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 端口转发ID

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/port-forwards/forward-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "Web Server Forward",
  "type": "local",
  "localHost": "127.0.0.1",
  "localPort": 8080,
  "remoteHost": "192.168.1.100",
  "remotePort": 80,
  "bindAddress": "0.0.0.0",
  "bindPort": 8080,
  "serverId": "server-uuid",
  "status": "inactive",
  "lastUsed": null,
  "tunnelId": null,
  "connectionId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 更新端口转发

更新端口转发配置信息。

**端点**: `PATCH /port-forwards/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 端口转发ID

**curl 示例**:
```bash
# 更新端口转发配置
curl -X PATCH "http://localhost:3000/port-forwards/forward-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Forward Name",
    "type": "remote",
    "localHost": "0.0.0.0",
    "localPort": 9000,
    "remoteHost": "192.168.1.101",
    "remotePort": 3306,
    "bindAddress": "0.0.0.0",
    "bindPort": 9000
  }'

# 部分更新端口转发
curl -X PATCH "http://localhost:3000/port-forwards/forward-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "localPort": 9090
  }'
```

**请求体**:
```json
{
  "name": "Updated Forward Name",
  "type": "remote",
  "localHost": "0.0.0.0",
  "localPort": 9000,
  "remoteHost": "192.168.1.101",
  "remotePort": 3306,
  "bindAddress": "0.0.0.0",
  "bindPort": 9000
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "Updated Forward Name",
  "type": "remote",
  "localHost": "0.0.0.0",
  "localPort": 9000,
  "remoteHost": "192.168.1.101",
  "remotePort": 3306,
  "bindAddress": "0.0.0.0",
  "bindPort": 9000,
  "serverId": "server-uuid",
  "status": "inactive",
  "lastUsed": null,
  "tunnelId": null,
  "connectionId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 删除端口转发

删除指定的端口转发配置。

**端点**: `DELETE /port-forwards/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 端口转发ID

**curl 示例**:
```bash
curl -X DELETE "http://localhost:3000/port-forwards/forward-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "message": "Port forward deleted successfully"
}
```

---

## 同步端口转发数据

将本地端口转发数据同步到服务器。

**端点**: `POST /port-forwards/sync`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
# 同步多个端口转发配置
curl -X POST "http://localhost:3000/port-forwards/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "localId": "local-uuid-1",
      "name": "Forward 1",
      "type": "local",
      "localHost": "127.0.0.1",
      "localPort": 8080,
      "remoteHost": "192.168.1.100",
      "remotePort": 80,
      "serverId": "server-uuid-1"
    },
    {
      "localId": "local-uuid-2",
      "name": "Forward 2",
      "type": "remote",
      "localHost": "0.0.0.0",
      "localPort": 9000,
      "remoteHost": "192.168.1.101",
      "remotePort": 3306,
      "serverId": "server-uuid-2"
    }
  ]'

# 同步单个端口转发配置
curl -X POST "http://localhost:3000/port-forwards/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "localId": "local-uuid",
      "name": "Single Forward",
      "type": "local",
      "localHost": "127.0.0.1",
      "localPort": 8080,
      "remoteHost": "192.168.1.100",
      "remotePort": 80,
      "serverId": "server-uuid"
    }
  ]'
```

**请求体**:
```json
[
  {
    "localId": "local-uuid-1",
    "name": "Forward 1",
    "type": "local",
    "localHost": "127.0.0.1",
    "localPort": 8080,
    "remoteHost": "192.168.1.100",
    "remotePort": 80,
    "serverId": "server-uuid-1"
  },
  {
    "localId": "local-uuid-2",
    "name": "Forward 2",
    "type": "remote",
    "localHost": "0.0.0.0",
    "localPort": 9000,
    "remoteHost": "192.168.1.101",
    "remotePort": 3306,
    "serverId": "server-uuid-2"
  }
]
```

**响应示例**:
```json
{
  "message": "Port forwards synced successfully",
  "syncedCount": 2
}
```

---

## 端口转发类型说明

系统支持以下端口转发类型：

### Local Forwarding (本地转发)
- 将本地端口转发到远程服务器
- 示例：本地8080端口 → 远程服务器80端口

### Remote Forwarding (远程转发)
- 将远程服务器端口转发到本地
- 示例：远程服务器3306端口 → 本地9000端口

### Dynamic Forwarding (动态转发)
- 创建SOCKS代理
- 通过SSH隧道进行动态端口转发

## 端口转发状态说明

### Active (活跃)
- 端口转发正在运行
- 可以正常使用
- 包含 `tunnelId` 和 `connectionId`

### Inactive (非活跃)
- 端口转发已停止
- 需要手动启动才能使用
- `tunnelId` 和 `connectionId` 为 null

**注意事项**:
- 端口号必须在有效范围内（1-65535）
- 绑定地址通常为`0.0.0.0`表示监听所有接口
- 删除端口转发前请确保没有活跃的连接
- 动态转发不需要指定具体的本地和远程端口
- 启动端口转发会自动更新 `lastUsed` 时间戳
- 停止端口转发会清除 `tunnelId` 和 `connectionId` 