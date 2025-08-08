# Docker 部署说明

## 概述

本项目使用 Docker 和 Docker Compose 来部署 NestJS 后端服务。SQLite 数据库文件存储在 Docker 卷中，确保数据持久化。

## 文件结构

```
docker/
├── docker-compose.yml # 生产环境 Docker Compose 配置
└── README.md         # 本说明文档
```

## 快速开始

### 1. 构建镜像

```bash
# 从项目根目录运行
yarn docker:build

# 或者直接使用 docker-compose
docker-compose -f docker/docker-compose.yml --env-file env/production.env build
```

### 2. 启动服务

```bash
# 从项目根目录运行
yarn docker:up

# 或者直接使用 docker-compose
docker-compose -f docker/docker-compose.yml --env-file env/production.env up -d
```

### 3. 查看日志

```bash
# 从项目根目录运行
yarn docker:logs

# 或者直接使用 docker-compose
docker-compose -f docker/docker-compose.yml --env-file env/production.env logs -f
```

### 4. 停止服务

```bash
# 从项目根目录运行
yarn docker:down

# 或者直接使用 docker-compose
docker-compose -f docker/docker-compose.yml --env-file env/production.env down
```

## 环境变量

服务使用以下环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| NODE_ENV | production | 运行环境 |
| DB_TYPE | sqlite | 数据库类型 |
| DB_DATABASE | /app/data/terminal.db | 数据库文件路径 |
| JWT_SECRET | your-secret-key-change-in-production | JWT 密钥 |
| JWT_EXPIRES_IN | 7d | JWT 过期时间 |
| PORT | 3000 | 服务端口 |
| DOCKER_CONTAINER_NAME | terminal-service | Docker 容器名称 |
| SERVICE_PORT | 3000 | 服务端口映射 |

### 环境变量文件

Docker Compose 使用 `env/production.env` 文件来加载环境变量：

```bash
# 环境变量文件位置
env/production.env

# 在 docker-compose.yml 中引用
env_file:
  - ../env/production.env
```

### 自定义环境变量

1. 修改 `env/production.env` 文件中的值
2. 重新启动 Docker 容器以应用新配置

## 数据持久化

- 数据库文件存储在 `service_data` Docker 卷中
- 数据在容器重启后仍然保留
- 可以通过 Docker 卷管理进行备份和恢复

## 网络配置

- 服务运行在 `terminal-network` 网络中
- 端口 3000 映射到主机
- 可以通过 `http://localhost:3000` 访问

## 故障排除

### 1. 端口冲突

如果端口 3000 被占用，可以修改 `env/production.env` 中的端口配置：

```bash
# 修改 SERVICE_PORT
SERVICE_PORT=3001
```

### 2. 权限问题

如果遇到权限问题，确保 Docker 有足够的权限访问项目目录。

### 3. 数据丢失

如果数据丢失，检查 Docker 卷是否正确创建：

```bash
docker volume ls | grep service_data
```

### 4. 构建上下文问题

如果遇到构建上下文错误，确保从项目根目录运行命令：

```bash
# 正确：从项目根目录运行
cd /path/to/terminal-electron
yarn docker:build

# 错误：从 docker 目录运行
cd docker
docker-compose up -d
```

### 5. 环境变量问题

如果遇到环境变量问题：

```bash
# 检查环境变量文件是否存在
ls -la env/production.env

# 验证环境变量是否正确加载
docker-compose -f docker/docker-compose.yml --env-file env/production.env config
```

## 生产环境建议

1. **修改 JWT_SECRET**: 在生产环境中使用强密钥
2. **配置 HTTPS**: 在生产环境中使用反向代理配置 HTTPS
3. **监控**: 配置日志监控和健康检查
4. **备份**: 定期备份数据库文件
5. **环境变量**: 确保生产环境的环境变量文件安全且正确配置 