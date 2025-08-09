# 开发环境

本文档详细介绍了如何配置 Terminal Electron 项目的开发环境，包括系统要求、安装步骤、配置说明等。

## 系统要求

### 操作系统
- **Windows**: 10 或更高版本
- **macOS**: 10.15 (Catalina) 或更高版本
- **Linux**: Ubuntu 18.04+ / CentOS 7+ / Debian 9+

### 硬件要求
- **CPU**: 双核 2.0GHz 或更高
- **内存**: 4GB RAM (推荐 8GB)
- **存储**: 2GB 可用磁盘空间
- **网络**: 稳定的互联网连接

### 软件要求

#### Node.js
- **版本**: 18.x LTS 或更高
- **下载**: [Node.js 官网](https://nodejs.org/)
- **验证**: `node --version` 和 `npm --version`

#### Yarn
- **版本**: 1.22.x 或更高
- **安装**: `npm install -g yarn`
- **验证**: `yarn --version`

#### Git
- **版本**: 2.30.x 或更高
- **下载**: [Git 官网](https://git-scm.com/)
- **验证**: `git --version`

## 环境安装

### 1. 安装 Node.js

#### Windows
```bash
# 下载并安装 Node.js LTS 版本
# 访问 https://nodejs.org/ 下载安装包

# 验证安装
node --version
npm --version
```

#### macOS
```bash
# 使用 Homebrew 安装
brew install node

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts

# 验证安装
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# 安装 Node.js
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. 安装 Yarn

```bash
# 全局安装 Yarn
npm install -g yarn

# 验证安装
yarn --version
```

### 3. 安装 Git

#### Windows
```bash
# 下载并安装 Git for Windows
# 访问 https://git-scm.com/download/win

# 验证安装
git --version
```

#### macOS
```bash
# 使用 Homebrew 安装
brew install git

# 验证安装
git --version
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git

# 验证安装
git --version
```

### 4. 安装开发工具

#### Visual Studio Code (推荐)
- **下载**: [VS Code 官网](https://code.visualstudio.com/)
- **扩展推荐**:
  - TypeScript Importer
  - ESLint
  - Prettier
  - GitLens
  - Auto Rename Tag
  - Bracket Pair Colorizer

#### 其他编辑器
- **WebStorm**: JetBrains 的 JavaScript IDE
- **Atom**: GitHub 的文本编辑器
- **Sublime Text**: 轻量级文本编辑器

## 项目设置

### 1. 克隆项目

```bash
# 克隆项目仓库
git clone https://github.com/shzjj82/terminal-electron.git

# 进入项目目录
cd terminal-electron

# 查看项目结构
ls -la
```

### 2. 安装依赖

```bash
# 安装所有依赖
yarn install

# 验证安装
yarn list --depth=0
```

### 3. 环境变量配置

```bash
# 复制环境变量模板
cp env/env.example env/development.env

# 编辑开发环境配置
# Windows
notepad env/development.env

# macOS/Linux
vim env/development.env
# 或
nano env/development.env
```

#### 环境变量说明

```bash
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置
DB_TYPE=sqlite
DB_DATABASE=apps/service/data/terminal-dev.db

# JWT 配置
JWT_SECRET=your-secret-key-change-in-development
JWT_EXPIRES_IN=7d

# API 配置
API_BASE_URL=http://localhost:3000
API_TIMEOUT=10000

# 开发工具配置
DEBUG=true
LOG_LEVEL=debug
```

### 4. 数据库初始化

```bash
# 进入后端服务目录
cd apps/service

# 启动开发服务器（会自动创建数据库）
yarn dev

# 或手动初始化数据库
yarn db:init
```

## 开发服务器启动

### 1. 启动所有服务

```bash
# 在项目根目录
yarn dev
```

这个命令会同时启动：
- Electron 应用
- NestJS 后端服务
- 文档站点

### 2. 分别启动服务

```bash
# 启动 Electron 应用
yarn dev:app

# 启动后端服务
yarn dev:service

# 启动文档站点
yarn dev:docs
```

### 3. 验证服务状态

```bash
# 检查后端服务
curl http://localhost:3000

# 检查文档站点
curl http://localhost:5173

# 检查 Electron 应用
# 应用窗口应该自动打开
```

## 开发工具配置

### 1. VS Code 配置

创建 `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "files.associations": {
    "*.env": "dotenv"
  }
}
```

### 2. ESLint 配置

项目已包含 ESLint 配置，确保安装了相关扩展：

```bash
# 检查代码
yarn lint

# 自动修复
yarn lint:fix
```

### 3. Prettier 配置

项目已包含 Prettier 配置：

```bash
# 格式化代码
yarn format

# 检查格式
yarn format:check
```

## 调试配置

### 1. Electron 调试

#### 主进程调试
```bash
# 启动调试模式
yarn dev:debug

# 或在 VS Code 中配置调试
```

#### 渲染进程调试
- 打开 Electron 应用
- 按 `Ctrl+Shift+I` (Windows/Linux) 或 `Cmd+Option+I` (macOS)
- 使用 Chrome DevTools 调试

### 2. 后端调试

#### VS Code 调试配置
创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/apps/service/src/main.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

### 3. 数据库调试

```bash
# 查看数据库文件
ls -la apps/service/data/

# 使用 SQLite 工具查看数据
sqlite3 apps/service/data/terminal-dev.db

# 查看表结构
.schema

# 查看数据
SELECT * FROM users;
```

## 测试环境

### 1. 单元测试

```bash
# 运行所有测试
yarn test

# 运行前端测试
yarn test:app

# 运行后端测试
yarn test:service

# 监听模式
yarn test:watch
```

### 2. 集成测试

```bash
# 运行集成测试
yarn test:e2e

# 运行 API 测试
yarn test:api
```

### 3. 测试覆盖率

```bash
# 生成覆盖率报告
yarn test:coverage

# 查看覆盖率报告
open coverage/lcov-report/index.html
```

## 性能监控

### 1. 内存使用

```bash
# 监控 Node.js 进程
node --inspect apps/service/src/main.ts

# 使用 Chrome DevTools 调试
# 访问 chrome://inspect
```

### 2. CPU 使用

```bash
# 使用 Node.js 内置分析器
node --prof apps/service/src/main.ts

# 分析结果
node --prof-process isolate-*.log > processed.txt
```

### 3. 网络监控

```bash
# 使用 curl 测试 API
curl -X GET http://localhost:3000/servers \
  -H "Authorization: Bearer YOUR_TOKEN"

# 使用 Postman 或 Insomnia 进行 API 测试
```

## 常见问题

### 1. 端口冲突

```bash
# 检查端口占用
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# 杀死进程
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### 2. 依赖安装失败

```bash
# 清除缓存
yarn cache clean

# 删除 node_modules
rm -rf node_modules
rm -rf apps/*/node_modules

# 重新安装
yarn install
```

### 3. 数据库连接问题

```bash
# 检查数据库文件权限
ls -la apps/service/data/

# 重新初始化数据库
rm apps/service/data/terminal-dev.db
yarn db:init
```

### 4. Electron 构建问题

```bash
# 清理构建缓存
yarn clean

# 重新安装 Electron
yarn electron:install

# 重新构建
yarn build:electron
```

## 开发最佳实践

### 1. 代码提交

```bash
# 检查代码质量
yarn lint
yarn typecheck

# 运行测试
yarn test

# 提交代码
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature
```

### 2. 分支管理

```bash
# 创建功能分支
git checkout -b feature/your-feature

# 创建修复分支
git checkout -b fix/your-fix

# 创建发布分支
git checkout -b release/v1.0.0
```

### 3. 代码审查

- 所有代码变更通过 Pull Request
- 至少一名维护者审查
- 确保测试覆盖率
- 遵循代码规范

### 4. 文档更新

- 及时更新 API 文档
- 更新用户指南
- 维护开发文档
- 添加必要的注释

## 环境检查清单

### 基础环境
- [ ] Node.js 18.x+ 已安装
- [ ] Yarn 1.22.x+ 已安装
- [ ] Git 2.30.x+ 已安装
- [ ] 项目已克隆到本地

### 项目配置
- [ ] 依赖已安装 (`yarn install`)
- [ ] 环境变量已配置
- [ ] 数据库已初始化
- [ ] 开发服务器可正常启动

### 开发工具
- [ ] VS Code 已安装并配置
- [ ] ESLint 扩展已安装
- [ ] Prettier 扩展已安装
- [ ] TypeScript 扩展已安装

### 测试环境
- [ ] 单元测试可正常运行
- [ ] 集成测试可正常运行
- [ ] 测试覆盖率报告可生成
- [ ] 调试工具已配置

### 文档环境
- [ ] 文档站点可正常访问
- [ ] API 文档已生成
- [ ] 开发文档已更新
- [ ] 用户指南已完善 