# 团队管理 API

## 创建团队

创建新的团队。

**端点**: `POST /teams/create`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
curl -X POST "http://localhost:3000/teams/create" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Development Team"
  }'
```

**请求体**:
```json
{
  "name": "Development Team"
}
```

**参数说明**:
- `name` (string, 必需): 团队名称

**响应示例**:
```json
{
  "id": "team-uuid",
  "name": "Development Team",
  "ownerId": "user-uuid",
  "inviteCode": "ABC123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 获取我的团队

获取当前用户所属的所有团队列表。

**端点**: `GET /teams/my`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/teams/my" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
[
  {
    "id": "team-uuid",
    "name": "Development Team",
    "ownerId": "user-uuid",
    "inviteCode": "ABC123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "role": "owner"
  }
]
```

---

## 获取团队详情

根据团队ID获取团队详细信息。

**端点**: `GET /teams/:id`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 团队ID

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/teams/team-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "id": "team-uuid",
  "name": "Development Team",
  "ownerId": "user-uuid",
  "inviteCode": "ABC123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "members": [
    {
      "id": "member-uuid",
      "teamId": "team-uuid",
      "userId": "user-uuid",
      "role": "owner",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "username": "owner",
        "email": "owner@example.com"
      }
    }
  ]
}
```

---

## 添加团队成员

向团队添加新成员。

**端点**: `POST /teams/:id/members`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 团队ID

**curl 示例**:
```bash
# 添加开发者成员
curl -X POST "http://localhost:3000/teams/team-uuid/members" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "new-user-uuid",
    "role": "developer"
  }'

# 添加普通用户成员
curl -X POST "http://localhost:3000/teams/team-uuid/members" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "another-user-uuid",
    "role": "user"
  }'
```

**请求体**:
```json
{
  "userId": "new-user-uuid",
  "role": "developer"
}
```

**参数说明**:
- `userId` (string, 必需): 要添加的用户ID
- `role` (string, 必需): 成员角色，可选值：`developer`, `user`

**响应示例**:
```json
{
  "id": "member-uuid",
  "teamId": "team-uuid",
  "userId": "new-user-uuid",
  "role": "developer",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "new-user-uuid",
    "username": "newuser",
    "email": "newuser@example.com"
  }
}
```

---

## 更新成员角色

更新团队成员的权限角色。

**端点**: `PATCH /teams/:id/members/:memberId`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 团队ID
- `memberId` (string, 必需): 成员ID

**curl 示例**:
```bash
# 将成员角色更新为开发者
curl -X PATCH "http://localhost:3000/teams/team-uuid/members/member-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "developer"
  }'

# 将成员角色更新为普通用户
curl -X PATCH "http://localhost:3000/teams/team-uuid/members/member-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user"
  }'
```

**请求体**:
```json
{
  "role": "user"
}
```

**参数说明**:
- `role` (string, 必需): 新的角色，可选值：`developer`, `user`

**响应示例**:
```json
{
  "id": "member-uuid",
  "teamId": "team-uuid",
  "userId": "user-uuid",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "user-uuid",
    "username": "member",
    "email": "member@example.com"
  }
}
```

---

## 移除团队成员

从团队中移除指定成员。

**端点**: `DELETE /teams/:id/members/:memberId`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 团队ID
- `memberId` (string, 必需): 成员ID

**curl 示例**:
```bash
curl -X DELETE "http://localhost:3000/teams/team-uuid/members/member-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**响应示例**:
```json
{
  "message": "Member removed successfully"
}
```

---

## 加入团队

使用邀请码加入团队。

**端点**: `POST /teams/join`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**curl 示例**:
```bash
curl -X POST "http://localhost:3000/teams/join" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "inviteCode": "ABC123"
  }'
```

**请求体**:
```json
{
  "inviteCode": "ABC123"
}
```

**参数说明**:
- `inviteCode` (string, 必需): 团队邀请码

**响应示例**:
```json
{
  "id": "member-uuid",
  "teamId": "team-uuid",
  "userId": "user-uuid",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "team": {
    "id": "team-uuid",
    "name": "Development Team",
    "ownerId": "owner-uuid",
    "inviteCode": "ABC123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 获取团队数据

获取指定团队的所有数据（服务器、密钥、端口转发）。

**端点**: `GET /teams/:id/data`

**请求头**:
```
Authorization: Bearer <jwt-token>
```

**路径参数**:
- `id` (string, 必需): 团队ID

**curl 示例**:
```bash
curl -X GET "http://localhost:3000/teams/team-uuid/data" \
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

## 团队角色说明

系统支持以下团队角色：

### Owner (所有者)
- 拥有团队的完全控制权
- 可以添加/移除成员
- 可以更新成员角色
- 可以删除团队

### Developer (开发者)
- 可以查看和编辑团队数据
- 可以创建/更新/删除服务器、密钥、端口转发
- 可以邀请新成员加入团队

### User (用户)
- 可以查看团队数据
- 可以使用团队共享的服务器、密钥、端口转发
- 无法修改团队数据

**注意事项**:
- 只有团队所有者可以添加/移除成员
- 只有团队所有者可以更新成员角色
- 邀请码是唯一的，用于新成员加入团队
- 团队数据与个人数据是分离的，通过namespace区分 