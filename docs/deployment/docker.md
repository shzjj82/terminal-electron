# Docker 部署

Terminal Electron 支持使用 Docker 进行容器化部署，提供快速、一致的环境配置。

## 系统要求

### Docker 环境
- **Docker**: 20.10+ 
- **Docker Compose**: 2.0+
- **内存**: 最少 2GB RAM
- **存储**: 最少 10GB 可用空间

### 网络要求
- 开放端口: 3000 (API 服务)
- 网络连接: 稳定的网络连接

## 快速部署

### 1. 克隆项目
```bash
git clone https://github.com/your-username/terminal-electron.git
cd terminal-electron
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp env/env.example env/production.env

# 编辑生产环境配置
vim env/production.env
```

### 3. 启动服务
```bash
# 构建并启动服务
yarn docker:build
yarn docker:up

# 查看服务状态
yarn docker:logs
```

### 4. 验证部署
```bash
# 检查服务状态
curl http://localhost:3000/health

# 查看容器状态
docker ps
```

## 详细配置

### Docker Compose 配置

项目使用 `docker/docker-compose.yml` 文件进行服务编排：

```yaml
services:
  # NestJS 服务
  service:
    build:
      context: ../apps/service
      dockerfile: Dockerfile
    container_name: ${DOCKER_CONTAINER_NAME:-terminal-service}
    ports:
      - "${SERVICE_PORT:-3000}:3000"
    env_file:
      - ../env/production.env
    environment:
      - NODE_ENV=production
      - DB_TYPE=${DB_TYPE:-sqlite}
      - DB_DATABASE=${DB_DATABASE:-/app/data/terminal.db}
      - JWT_SECRET=${JWT_SECRET:-your-secret-key-change-in-production}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-7d}
      - PORT=${SERVICE_PORT:-3000}
    volumes:
      - service_data:/app/data
    networks:
      - terminal-network
    restart: unless-stopped

volumes:
  service_data:
    driver: local

networks:
  terminal-network:
    driver: bridge
```

### Dockerfile 配置

后端服务的 Dockerfile 位于 `apps/service/Dockerfile`：

```dockerfile
# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile --production=false

# 复制源代码
COPY . .

# 构建应用
RUN yarn build

# 移除开发依赖
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["yarn", "start:prod"]
```

## 环境变量配置

### 必需环境变量

```bash
# API 配置
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
```

### 可选环境变量

```bash
# 构建配置
BUILD_TARGET=production
BUILD_PLATFORM=mac
BUILD_ARCH=arm64
BUILD_OUTPUT_DIR=release
BUILD_APP_ID=com.terminal.electron
BUILD_PRODUCT_NAME=Terminal Electron
```

## 管理命令

### 启动服务
```bash
# 构建并启动
yarn docker:build
yarn docker:up

# 仅启动（如果已构建）
yarn docker:up
```

### 停止服务
```bash
# 停止服务
yarn docker:down

# 停止并清理数据
yarn docker:clean
```

### 查看日志
```bash
# 查看实时日志
yarn docker:logs

# 查看特定容器日志
docker logs terminal-service
```

### 重启服务
```bash
# 重启服务
yarn docker:restart
```

## 数据持久化

### 数据卷配置
- **数据库文件**: `/app/data/terminal.db`
- **日志文件**: `/app/logs/`
- **配置文件**: `/app/config/`

### 备份数据
```bash
# 备份数据库
docker exec terminal-service cp /app/data/terminal.db /app/data/terminal.db.backup

# 导出数据卷
docker run --rm -v terminal-electron_service_data:/data -v $(pwd):/backup alpine tar czf /backup/terminal-data.tar.gz -C /data .
```

### 恢复数据
```bash
# 恢复数据库
docker exec terminal-service cp /app/data/terminal.db.backup /app/data/terminal.db

# 导入数据卷
docker run --rm -v terminal-electron_service_data:/data -v $(pwd):/backup alpine tar xzf /backup/terminal-data.tar.gz -C /data
```

## 性能优化

### 资源限制
```yaml
services:
  service:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

### 健康检查
```yaml
services:
  service:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 安全配置

### 网络安全
```yaml
services:
  service:
    networks:
      - terminal-network
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx
```

### 环境变量安全
```bash
# 使用 Docker secrets
echo "your-secret-key" | docker secret create jwt_secret -

# 在 docker-compose.yml 中使用
services:
  service:
    secrets:
      - jwt_secret
    environment:
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
```

## 监控和日志

### 日志配置
```yaml
services:
  service:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 监控配置
```yaml
services:
  service:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.terminal.rule=Host(`terminal.example.com`)"
      - "traefik.http.services.terminal.loadbalancer.server.port=3000"
```

## 故障排除

### 常见问题

#### 1. 容器启动失败
```bash
# 查看容器日志
docker logs terminal-service

# 检查端口占用
netstat -tulpn | grep :3000

# 检查磁盘空间
df -h
```

#### 2. 数据库连接失败
```bash
# 检查数据卷
docker volume ls

# 检查数据库文件权限
docker exec terminal-service ls -la /app/data/
```

#### 3. 网络连接问题
```bash
# 检查网络配置
docker network ls
docker network inspect terminal-electron_terminal-network

# 测试容器间通信
docker exec terminal-service ping other-service
```

### 调试命令
```bash
# 进入容器
docker exec -it terminal-service sh

# 查看进程
docker exec terminal-service ps aux

# 查看环境变量
docker exec terminal-service env
```

## 生产环境部署

### 1. 准备服务器
```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 配置防火墙
```bash
# 开放必要端口
sudo ufw allow 3000/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 3. 配置 SSL
```bash
# 使用 Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

### 4. 设置自动更新
```bash
# 创建更新脚本
cat > update.sh << 'EOF'
#!/bin/bash
cd /path/to/terminal-electron
git pull
yarn docker:build
yarn docker:down
yarn docker:up
EOF

chmod +x update.sh

# 添加到 crontab
echo "0 2 * * 0 /path/to/update.sh" | crontab -
```

## 下一步

- [环境变量配置](./environment.md) - 详细的环境变量说明
- [构建配置](./build.md) - 自定义构建配置
- [监控和维护](../development/monitoring.md) - 生产环境监控 