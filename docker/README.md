# Docker 部署说明

## 开发环境

### 快速启动数据库

```bash
# 启动 PostgreSQL 数据库
yarn docker:dev:up

# 查看数据库日志
yarn docker:dev:logs

# 停止数据库
yarn docker:dev:down

# 清理数据
yarn docker:dev:clean
```

### 开发环境配置

开发环境使用 `docker/docker-compose.dev.yml` 和 `env/development.env`：

- **数据库**: PostgreSQL 15
- **端口**: 5432 (可配置)
- **数据卷**: postgres_dev_data
- **网络**: terminal-dev-network

## 生产环境

### 快速启动

```bash
# 启动所有服务
yarn docker:up

# 查看日志
yarn docker:logs

# 停止服务
yarn docker:down
```

### 服务说明

- **PostgreSQL**: 数据库服务，端口 5432
- **Service**: NestJS 应用服务，端口 3000

## 环境变量

服务会自动从对应的环境变量文件读取配置：

- **开发环境**: `env/development.env`
- **生产环境**: `env/production.env`

## 数据持久化

- **开发环境**: PostgreSQL 数据存储在 Docker 卷 `postgres_dev_data` 中
- **生产环境**: PostgreSQL 数据存储在 Docker 卷 `postgres_data` 中 