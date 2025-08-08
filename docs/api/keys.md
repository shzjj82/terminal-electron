# SSH密钥管理 API

## 获取密钥列表

获取当前用户的所有SSH密钥列表。

**端点**: `GET /keys`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**查询参数**:
- `namespace` (string, 可选): 团队命名空间，个人数据为null

**curl 示例**:
```bash
# 获取个人密钥列表
curl -X GET "http://localhost:3000/keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# 获取团队密钥列表
curl -X GET "http://localhost:3000/keys?namespace=team-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
[
  {
    "id": "uuid",
    "localId": "local-uuid",
    "name": "My SSH Key",
    "type": "rsa",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
    "passphrase": null,
    "description": "Development key",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 创建密钥

创建新的SSH密钥。

**端点**: `POST /keys`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
# 创建RSA密钥
curl -X POST "http://localhost:3000/keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "localId": "local-uuid",
    "name": "My SSH Key",
    "type": "rsa",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...",
    "passphrase": "optional-passphrase",
    "description": "Development key"
  }'

# 创建Ed25519密钥
curl -X POST "http://localhost:3000/keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ed25519 Key",
    "type": "ed25519",
    "privateKey": "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
    "description": "Ed25519 key for better security"
  }'

# 创建带密码的密钥
curl -X POST "http://localhost:3000/keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Protected Key",
    "type": "rsa",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
    "passphrase": "my-secure-passphrase",
    "description": "Key with passphrase protection"
  }'

# 创建团队密钥
curl -X POST "http://localhost:3000/keys?namespace=team-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Key",
    "type": "rsa",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
    "description": "Team shared SSH key"
  }'
```

**请求体**:
```json
{
  "localId": "local-uuid",
  "name": "My SSH Key",
  "type": "rsa",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...",
  "passphrase": "optional-passphrase",
  "description": "Development key"
}
```

**参数说明**:
- `localId` (string, 可选): 本地ID，用于同步
- `name` (string, 必需): 密钥名称
- `type` (string, 必需): 密钥类型，可选值：`password`, `rsa`, `ed25519`, `ecdsa`, `keySelect`
- `privateKey` (string, 必需): 私钥内容
- `passphrase` (string, 可选): 密钥密码
- `description` (string, 可选): 密钥描述

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "My SSH Key",
  "type": "rsa",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
  "passphrase": null,
  "description": "Development key",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 获取单个密钥

根据ID获取单个SSH密钥详情。

**端点**: `GET /keys/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 密钥ID

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/keys/key-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "My SSH Key",
  "type": "rsa",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
  "passphrase": null,
  "description": "Development key",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 更新密钥

更新SSH密钥信息。

**端点**: `PATCH /keys/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 密钥ID

**curl 示例**:
```bash
# 更新密钥配置
curl -X PATCH "http://localhost:3000/keys/key-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Key Name",
    "type": "ed25519",
    "privateKey": "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
    "passphrase": "new-passphrase",
    "description": "Updated description"
  }'

# 部分更新密钥
curl -X PATCH "http://localhost:3000/keys/key-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Key Name",
    "description": "Updated description"
  }'
```

**请求体**:
```json
{
  "name": "Updated Key Name",
  "type": "ed25519",
  "privateKey": "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
  "passphrase": "new-passphrase",
  "description": "Updated description"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "localId": "local-uuid",
  "name": "Updated Key Name",
  "type": "ed25519",
  "privateKey": "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
  "passphrase": "new-passphrase",
  "description": "Updated description",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 删除密钥

删除指定的SSH密钥。

**端点**: `DELETE /keys/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 密钥ID

**curl 示例**:
```bash
curl -X DELETE "http://localhost:3000/keys/key-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "message": "Key deleted successfully"
}
```

---

## 同步密钥数据

将本地SSH密钥数据同步到服务器。

**端点**: `POST /keys/sync`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
# 同步多个密钥配置
curl -X POST "http://localhost:3000/keys/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "localId": "local-uuid-1",
      "name": "Key 1",
      "type": "rsa",
      "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
      "passphrase": null,
      "description": "Key 1 description"
    },
    {
      "localId": "local-uuid-2",
      "name": "Key 2",
      "type": "ed25519",
      "privateKey": "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
      "passphrase": "passphrase",
      "description": "Key 2 description"
    }
  ]'

# 同步单个密钥配置
curl -X POST "http://localhost:3000/keys/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "localId": "local-uuid",
      "name": "Single Key",
      "type": "rsa",
      "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
      "passphrase": null,
      "description": "Single key description"
    }
  ]'
```

**请求体**:
```json
[
  {
    "localId": "local-uuid-1",
    "name": "Key 1",
    "type": "rsa",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
    "passphrase": null,
    "description": "Key 1 description"
  },
  {
    "localId": "local-uuid-2",
    "name": "Key 2",
    "type": "ed25519",
    "privateKey": "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
    "passphrase": "passphrase",
    "description": "Key 2 description"
  }
]
```

**响应示例**:
```json
{
  "message": "Keys synced successfully",
  "syncedCount": 2
}
```

---

## 密钥类型说明

系统支持以下SSH密钥类型：

- **password**: 密码认证
- **rsa**: RSA密钥对
- **ed25519**: Ed25519密钥对
- **ecdsa**: ECDSA密钥对
- **keySelect**: 从现有密钥中选择

**注意事项**:
- 私钥内容应该包含完整的密钥格式（包括头部和尾部）
- 如果密钥有密码保护，请提供正确的passphrase
- 密钥类型必须与实际的密钥格式匹配
- 删除密钥前请确保没有服务器正在使用该密钥 