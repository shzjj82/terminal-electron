# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# 安装依赖
RUN yarn install --production=false

# 构建阶段
FROM base AS builder

# 复制源代码
COPY . .

# 构建应用
RUN yarn build

# 生产阶段
FROM node:18-alpine AS production

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# 安装生产依赖
RUN yarn install --production=true && yarn cache clean

# 从构建阶段复制构建产物
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["yarn", "start:prod"] 