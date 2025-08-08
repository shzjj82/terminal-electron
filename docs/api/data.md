# 数据管理 API

## 获取个人数据

获取当前用户的所有个人数据（服务器、密钥、端口转发）。

**端点**: `GET /data/personal`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/data/personal" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "servers": [
    {
      "id": "server-uuid",
      "localId": "local-uuid",
      "name": "My Personal Server",
      "host": "192.168.1.100",
      "port": 22,
      "username": "root",
      "authType": "password",
      "description": "Personal development server",
      "isActive": true,
      "namespace": null,
      "dataType": "personal",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "keys": [
    {
      "id": "key-uuid",
      "localId": "local-uuid",
      "name": "My Personal Key",
      "type": "rsa",
      "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
      "passphrase": null,
      "description": "Personal SSH key",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "portForwards": [
    {
      "id": "forward-uuid",
      "localId": "local-uuid",
      "name": "My Personal Forward",
      "type": "local",
      "localHost": "127.0.0.1",
      "localPort": 8080,
      "remoteHost": "192.168.1.100",
      "remotePort": 80,
      "bindAddress": "0.0.0.0",
      "bindPort": 8080,
      "serverId": "server-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 获取团队数据

获取指定团队的所有数据（服务器、密钥、端口转发）。

**端点**: `GET /data/teams/:teamId`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `teamId` (string, 必需): 团队ID

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/data/teams/team-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "team": {
    "id": "team-uuid",
    "name": "Development Team",
    "ownerId": "owner-uuid",
    "inviteCode": "ABC123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "servers": [
    {
      "id": "server-uuid",
      "localId": "local-uuid",
      "name": "Team Server",
      "host": "192.168.1.100",
      "port": 22,
      "username": "root",
      "authType": "password",
      "description": "Team development server",
      "isActive": true,
      "namespace": "team-uuid",
      "dataType": "team",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "keys": [
    {
      "id": "key-uuid",
      "localId": "local-uuid",
      "name": "Team Key",
      "type": "rsa",
      "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
      "passphrase": null,
      "description": "Team SSH key",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "portForwards": [
    {
      "id": "forward-uuid",
      "localId": "local-uuid",
      "name": "Team Forward",
      "type": "local",
      "localHost": "127.0.0.1",
      "localPort": 8080,
      "remoteHost": "192.168.1.100",
      "remotePort": 80,
      "bindAddress": "0.0.0.0",
      "bindPort": 8080,
      "serverId": "server-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 数据同步说明

系统支持个人数据和团队数据的双向同步：

### 个人数据同步
- 个人数据存储在用户的个人命名空间中
- 通过 `namespace=null` 或省略namespace参数来访问
- 只有数据所有者可以修改个人数据

### 团队数据同步
- 团队数据存储在团队的命名空间中
- 通过 `namespace=teamId` 来访问团队数据
- 团队成员根据角色权限可以查看/修改团队数据

### 同步策略
1. **本地到服务器**: 将本地数据上传到服务器
2. **服务器到本地**: 从服务器下载数据到本地
3. **冲突解决**: 以服务器数据为准，本地数据会被覆盖

### 数据隔离
- 个人数据和团队数据完全隔离
- 通过namespace字段区分数据归属
- 用户只能访问自己有权限的数据

**注意事项**:
- 同步操作会覆盖本地数据，请谨慎操作
- 团队数据需要相应的权限才能访问
- 删除操作会同时删除本地和服务器数据
- 建议定期备份重要数据 