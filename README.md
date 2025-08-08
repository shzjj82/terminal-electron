# Terminal Electron

一个基于 Electron 的 SSH 终端应用，带有 NestJS 后端。

## 技术栈

- **前端**: Electron + React + TypeScript + MobX
- **后端**: NestJS + TypeORM + SQLite
- **包管理**: Yarn + Turborepo
- **终端**: xterm.js + ssh2
- **容器化**: Docker + Docker Compose

## 项目结构

```
terminal-electron/
├── apps/
│   ├── app/          # Electron 前端应用
│   └── service/      # NestJS 后端服务
├── docker/           # Docker 配置
│   ├── docker-compose.yml  # 生产环境 Docker Compose 配置
│   └── README.md     # Docker 使用说明
├── env/              # 环境变量文件
│   ├── development.env    # 开发环境配置
│   ├── production.env     # 生产环境配置
│   └── env.example       # 环境变量模板
├── scripts/          # 构建脚本
│   └── build-electron.js  # Electron 构建脚本
└── package.json      # 根目录配置
```

## 环境变量配置

### 环境变量文件

项目使用 `env/` 目录来管理不同环境的配置：

- `env/development.env` - 开发环境配置
- `env/production.env` - 生产环境配置
- `env/env.example` - 环境变量模板

### 配置说明

| 变量名 | 说明 | 开发环境 | 生产环境 |
|--------|------|----------|----------|
| API_BASE_URL | API 基础地址 | http://localhost:3000 | http://localhost:3000 |
| API_TIMEOUT | API 超时时间 | 10000ms | 10000ms |
| DB_TYPE | 数据库类型 | sqlite | sqlite |
| DB_DATABASE | 数据库文件路径 | apps/service/data/terminal-dev.db | /app/data/terminal.db |
| JWT_SECRET | JWT 密钥 | dev-secret-key | your-secret-key |
| JWT_EXPIRES_IN | JWT 过期时间 | 7d | 7d |
| SERVICE_PORT | 服务端口 | 3000 | 3000 |
| BUILD_PLATFORM | 构建平台 | mac | mac |
| BUILD_ARCH | 构建架构 | arm64 | arm64 |
| BUILD_TARGET | 构建目标 | development | production |

### 自定义配置

1. 复制环境变量模板：
```bash
cp env/env.example env/development.env
cp env/env.example env/production.env
```

2. 根据需要修改配置文件中的值

3. 重启应用以应用新配置

## 开发环境设置

### 1. 安装依赖

```bash
# 安装 yarn (如果还没有安装)
npm install -g yarn

# 安装项目依赖
yarn install
```

### 2. 环境变量配置

复制环境变量模板：

```bash
cp env/env.example env/development.env
```

根据需要修改 `env/development.env` 中的配置。

### 3. 启动开发服务器

```bash
# 启动所有应用 (前端 + 后端) - 推荐
yarn dev

# 或者分别启动
yarn dev:app         # 启动 Electron 应用
yarn dev:service     # 启动 NestJS 服务
```

## 构建

### 基础构建

```bash
# 构建所有应用
yarn build

# 构建特定应用
yarn build:app       # 构建 Electron 应用
yarn build:service   # 构建 NestJS 服务
```

### Electron 应用构建

#### 快速构建

```bash
# 默认构建 (mac arm64 production)
yarn build:electron

# 开发环境构建
yarn build:electron:dev

# 生产环境构建
yarn build:electron:prod
```

#### 平台特定构建

```bash
# macOS 构建
yarn build:electron:mac           # 默认架构
yarn build:electron:mac:arm64     # ARM64 架构
yarn build:electron:mac:x64       # x64 架构

# Windows 构建
yarn build:electron:win           # 默认架构
yarn build:electron:win:arm64     # ARM64 架构
yarn build:electron:win:x64       # x64 架构

# Linux 构建
yarn build:electron:linux         # 默认架构
yarn build:electron:linux:arm64   # ARM64 架构
yarn build:electron:linux:x64     # x64 架构

# 全平台构建
yarn build:electron:all           # 所有平台默认架构
```

#### 自定义构建

```bash
# 使用构建脚本 (平台 架构 环境)
node scripts/build-electron.js mac arm64 production
node scripts/build-electron.js win x64 development
node scripts/build-electron.js linux arm64 production
```

### 构建输出

构建完成后，应用文件将输出到 `apps/app/release/` 目录：

- **macOS**: `.dmg` 和 `.zip` 文件
- **Windows**: `.exe` 安装程序和便携版
- **Linux**: `.AppImage` 和 `.deb` 包

### 构建配置

构建配置在 `apps/app/package.json` 的 `build` 字段中定义：

- **应用信息**: `appId`, `productName`
- **输出目录**: `release/`
- **目标平台**: macOS, Windows, Linux
- **目标架构**: ARM64, x64
- **打包格式**: DMG, ZIP, NSIS, AppImage, DEB

## 代码质量

```bash
# 代码检查
yarn lint

# 类型检查
yarn typecheck

# 代码格式化
yarn format

# 清理构建文件
yarn clean
```

## Docker 部署

### 生产环境部署

```bash
# 构建 Docker 镜像
yarn docker:build

# 启动 Docker 容器
yarn docker:up

# 查看容器日志
yarn docker:logs

# 重启服务
yarn docker:restart

# 停止并清理容器
yarn docker:down

# 完全清理 (包括数据卷)
yarn docker:clean
```

### Docker 配置说明

- **数据库**: 使用 SQLite 文件数据库，数据持久化在 Docker 卷中
- **服务**: NestJS 应用运行在容器中，端口 3000
- **数据持久化**: 数据库文件存储在 `service_data` 卷中
- **网络**: 使用 `terminal-network` 网络进行容器间通信
- **环境变量**: 从 `env/production.env` 文件加载配置

### 环境变量

Docker 容器使用以下环境变量：

```bash
NODE_ENV=production
DB_TYPE=sqlite
DB_DATABASE=/app/data/terminal.db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
```

### 数据备份

数据库文件存储在 Docker 卷中，可以通过以下方式备份：

```bash
# 备份数据库
docker run --rm -v terminal-electron_service_data:/data -v $(pwd):/backup alpine tar czf /backup/terminal-db-backup.tar.gz -C /data .

# 恢复数据库
docker run --rm -v terminal-electron_service_data:/data -v $(pwd):/backup alpine tar xzf /backup/terminal-db-backup.tar.gz -C /data
```

## 主要功能

- SSH 终端连接
- 服务器管理
- SSH 密钥管理
- 端口转发
- 团队协作
- 用户认证

## 开发指南

### 添加新依赖

```bash
# 添加到根项目
yarn add <package-name>

# 添加到特定工作区
yarn workspace terminal add <package-name>
yarn workspace service add <package-name>
```

### 运行测试

```bash
# 运行所有测试
yarn test

# 运行特定工作区的测试
yarn workspace service test
```

## 故障排除

### Electron 相关问题

如果遇到 Electron 相关的问题，可以尝试：

```bash
# 重新安装 Electron
yarn workspace terminal add electron@latest

# 清理并重新安装依赖
yarn clean
yarn install
```

### 构建问题

如果遇到构建问题：

```bash
# 清理构建缓存
yarn clean

# 重新安装依赖
yarn install

# 重新构建
yarn build:electron
```

### 数据库问题

如果遇到数据库问题：

```bash
# 删除数据库文件
rm apps/service/*.db

# 重新启动服务
yarn workspace service start:dev
```

### Docker 相关问题

如果遇到 Docker 相关问题：

```bash
# 清理所有 Docker 资源
yarn docker:clean

# 重新构建镜像
yarn docker:build

# 启动服务
yarn docker:up
```

### 环境变量问题

如果遇到环境变量问题：

```bash
# 检查环境变量文件是否存在
ls -la env/

# 重新复制环境变量模板
cp env/env.example env/development.env

# 重启应用
yarn dev
```

## 迁移状态

✅ **已成功从 pnpm 迁移到 yarn**

- 使用 Yarn 作为包管理工具
- 配置了 Turborepo 进行构建优化
- 支持工作区管理
- 解决了 Electron 在 monorepo 中的兼容性问题
- ✅ **开发环境完全正常工作**：`yarn dev` 可以同时启动前端和后端
- ✅ **Docker 生产环境配置完成**：支持容器化部署
- ✅ **环境变量管理完成**：支持开发和生产环境配置
- ✅ **Electron 构建配置完成**：支持多平台多架构构建

## 开发服务器状态

- **Electron 应用**: http://localhost:5173/
- **NestJS 服务**: http://localhost:3000/
- **状态**: ✅ 两个服务都正常运行

## 生产环境状态

- **Docker 服务**: http://localhost:3000/
- **数据库**: SQLite (持久化存储)
- **状态**: ✅ 生产环境配置完成

## 构建状态

- **支持平台**: macOS, Windows, Linux
- **支持架构**: ARM64, x64
- **构建工具**: electron-builder
- **状态**: ✅ 多平台多架构构建配置完成 