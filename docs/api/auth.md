# 认证 API

## 用户注册

注册新用户账户。

**端点**: `POST /auth/register`

**curl 示例**:
```bash
curl -X POST "http://localhost:3000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }'
```

**请求体**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**参数说明**:
- `email` (string, 必需): 用户邮箱地址
- `username` (string, 必需): 用户名，最少3个字符
- `password` (string, 必需): 密码，最少6个字符

**响应示例**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**错误响应**:
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

---

## 用户登录

用户登录并获取JWT令牌。

**端点**: `POST /auth/login`

**curl 示例**:
```bash
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**参数说明**:
- `email` (string, 必需): 用户邮箱地址
- `password` (string, 必需): 用户密码

**响应示例**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  }
}
```

**错误响应**:
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

## 使用JWT令牌

登录成功后，您需要在后续的API请求中包含JWT令牌：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意事项**:
- JWT令牌有效期为7天
- 令牌过期后需要重新登录
- 所有需要认证的API都需要在请求头中包含有效的JWT令牌 