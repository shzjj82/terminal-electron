# 环境变量配置

Terminal Electron 使用环境变量来管理不同环境的配置。本文档详细说明了所有可用的环境变量及其配置方法。

## 环境变量文件

项目使用以下环境变量文件：

- `env/development.env` - 开发环境配置
- `env/production.env` - 生产环境配置
- `env/env.example` - 环境变量模板

## 基础配置

### API 配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `API_BASE_URL` | string | `http://localhost:3000` | API 服务基础 URL |
| `API_TIMEOUT` | number | `10000` | API 请求超时时间（毫秒） |

```bash
# 开发环境
API_BASE_URL=http://localhost:3000
API_TIMEOUT=10000

# 生产环境
API_BASE_URL=https://api.yourdomain.com
API_TIMEOUT=30000
```

### 数据库配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `DB_TYPE` | string | `sqlite` | 数据库类型 |
| `DB_DATABASE` | string | `terminal.db` | 数据库文件路径 |

```bash
# SQLite 配置
DB_TYPE=sqlite
DB_DATABASE=apps/service/data/terminal-dev.db

# PostgreSQL 配置（可选）
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=terminal
DB_PASSWORD=your-password
DB_DATABASE=terminal
```

### JWT 认证配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `JWT_SECRET` | string | `dev-secret-key` | JWT 签名密钥 |
| `JWT_EXPIRES_IN` | string | `7d` | JWT 过期时间 |

```bash
# 开发环境
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 生产环境（请使用强密钥）
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
```

## 服务配置

### 服务端口

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `SERVICE_PORT` | number | `3000` | 服务监听端口 |

```bash
# 开发环境
SERVICE_PORT=3000

# 生产环境
SERVICE_PORT=3000
```

### Electron 配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `ELECTRON_DEV_SERVER_URL` | string | `http://localhost:5173` | 开发服务器 URL |

```bash
# 开发环境
ELECTRON_DEV_SERVER_URL=http://localhost:5173
```

## Docker 配置

### 容器配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `DOCKER_IMAGE_NAME` | string | `terminal-service` | Docker 镜像名称 |
| `DOCKER_CONTAINER_NAME` | string | `terminal-service` | Docker 容器名称 |

```bash
# Docker 配置
DOCKER_IMAGE_NAME=terminal-service
DOCKER_CONTAINER_NAME=terminal-service
```

## 构建配置

### 构建目标

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `BUILD_TARGET` | string | `development` | 构建目标环境 |
| `BUILD_PLATFORM` | string | `mac` | 目标平台 |
| `BUILD_ARCH` | string | `arm64` | 目标架构 |

```bash
# 开发构建
BUILD_TARGET=development
BUILD_PLATFORM=mac
BUILD_ARCH=arm64

# 生产构建
BUILD_TARGET=production
BUILD_PLATFORM=mac
BUILD_ARCH=arm64
```

### 构建输出

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `BUILD_OUTPUT_DIR` | string | `release` | 构建输出目录 |
| `BUILD_APP_ID` | string | `com.terminal.electron` | 应用 ID |
| `BUILD_PRODUCT_NAME` | string | `Terminal Electron` | 产品名称 |

```bash
# 构建输出配置
BUILD_OUTPUT_DIR=release
BUILD_APP_ID=com.terminal.electron
BUILD_PRODUCT_NAME=Terminal Electron
```

## 环境特定配置

### 开发环境 (`env/development.env`)

```bash
# 开发环境配置
API_BASE_URL=http://localhost:3000
API_TIMEOUT=10000

# 数据库配置
DB_TYPE=sqlite
DB_DATABASE=apps/service/data/terminal-dev.db

# JWT 配置
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 服务端口
SERVICE_PORT=3000

# Electron 配置
ELECTRON_DEV_SERVER_URL=http://localhost:5173

# 构建配置
BUILD_TARGET=development
BUILD_PLATFORM=mac
BUILD_ARCH=arm64
BUILD_OUTPUT_DIR=release
```

### 生产环境 (`env/production.env`)

```bash
# 生产环境配置
API_BASE_URL=http://localhost:4000
API_TIMEOUT=10000

# 数据库配置
DB_TYPE=sqlite
DB_DATABASE=/app/data/terminal.db

# JWT 配置
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 服务端口
SERVICE_PORT=3000

# Docker 配置
DOCKER_IMAGE_NAME=terminal-service
DOCKER_CONTAINER_NAME=terminal-service

# 构建配置
BUILD_TARGET=production
BUILD_PLATFORM=mac
BUILD_ARCH=arm64
BUILD_OUTPUT_DIR=release
BUILD_APP_ID=com.terminal.electron
BUILD_PRODUCT_NAME=Terminal Electron
```

## 环境变量加载

### 前端环境变量加载

前端应用通过 `apps/app/src/renderer/src/utils/env.ts` 加载环境变量：

```typescript
// 初始化环境变量
export const initEnvironment = async (): Promise<void> => {
  try {
    // 根据构建目标确定环境变量文件路径
    const buildTarget = process.env.BUILD_TARGET || 'development';
    const envFileName = buildTarget === 'production' ? 'production.env' : 'development.env';
    const envFilePath = `../../env/${envFileName}`;
    
    // 尝试加载环境变量文件
    const envFromFile = await loadEnvFile(envFilePath);
    
    // 合并环境变量
    const config = loadEnvironmentConfig();
    const mergedConfig = {
      ...config,
      ...envFromFile
    };
    
    // 设置到 process.env
    Object.entries(mergedConfig).forEach(([key, value]) => {
      if (typeof process !== 'undefined' && process.env) {
        process.env[key] = value.toString();
      }
    });
  } catch (error) {
    console.error('Failed to initialize environment:', error);
  }
};
```

### 后端环境变量加载

后端服务通过 `apps/service/src/config/env.config.ts` 加载环境变量：

```typescript
// 初始化环境变量
export const initEnvironment = async (): Promise<void> => {
  try {
    const buildTarget = process.env.BUILD_TARGET || 'development';
    const envFileName = buildTarget === 'production' ? 'production.env' : 'development.env';
    const envFilePath = path.join(process.cwd(), '..', 'env', envFileName);
    
    const envFromFile = loadEnvFile(envFilePath);
    
    // 设置环境变量
    Object.entries(envFromFile).forEach(([key, value]) => {
      process.env[key] = value;
    });
  } catch (error) {
    console.error('Failed to initialize environment:', error);
  }
};
```

## 安全最佳实践

### 1. 密钥管理

```bash
# 使用强密钥
JWT_SECRET=$(openssl rand -base64 32)

# 使用环境变量文件
echo "JWT_SECRET=$JWT_SECRET" >> .env.local
```

### 2. 生产环境配置

```bash
# 生产环境检查清单
- [ ] 使用强 JWT 密钥
- [ ] 配置 HTTPS
- [ ] 设置适当的超时时间
- [ ] 配置日志级别
- [ ] 设置备份策略
```

### 3. 环境变量验证

```typescript
// 验证必需的环境变量
const requiredEnvVars = [
  'API_BASE_URL',
  'JWT_SECRET',
  'DB_TYPE'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

## 故障排除

### 常见问题

#### 1. 环境变量未加载
```bash
# 检查环境变量文件是否存在
ls -la env/

# 检查文件权限
chmod 600 env/production.env

# 验证文件格式
cat env/production.env | grep -v '^#' | grep -v '^$'
```

#### 2. 环境变量值错误
```bash
# 检查变量值
echo $API_BASE_URL

# 重新加载环境变量
source env/production.env

# 验证配置
node -e "console.log(process.env.API_BASE_URL)"
```

#### 3. Docker 环境变量问题
```bash
# 检查 Docker 环境变量
docker exec terminal-service env | grep API

# 重新构建容器
yarn docker:build
yarn docker:up
```

### 调试技巧

```bash
# 查看所有环境变量
env | sort

# 查看特定应用的环境变量
node -e "console.log(JSON.stringify(process.env, null, 2))"

# 在 Docker 中查看环境变量
docker exec terminal-service env
```

## 下一步

- [Docker 部署](./docker.md) - 使用 Docker 部署应用
- [构建配置](./build.md) - 自定义构建配置
- [监控和维护](../development/monitoring.md) - 生产环境监控 