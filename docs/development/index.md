# 开发指南

欢迎参与 Terminal Electron 的开发！本指南将帮助你了解项目结构、技术栈和开发流程。

## 项目概览

Terminal Electron 是一个基于 Electron 的现代化 SSH 终端应用，采用 Monorepo 架构，使用 Yarn + Turborepo 进行项目管理。

### 技术栈

#### 前端技术
- **Electron**: 跨平台桌面应用框架
- **React**: 用户界面库
- **TypeScript**: 类型安全的 JavaScript
- **Tailwind CSS**: 实用优先的 CSS 框架
- **xterm.js**: 终端模拟器
- **MobX**: 状态管理

#### 后端技术
- **NestJS**: Node.js 框架
- **TypeORM**: 数据库 ORM
- **SQLite**: 轻量级数据库
- **JWT**: 身份认证

#### 开发工具
- **Yarn**: 包管理器
- **Turborepo**: 构建系统
- **Vite**: 构建工具
- **Docker**: 容器化部署

## 项目结构

```
terminal-electron/
├── apps/
│   ├── app/                 # Electron 应用
│   │   ├── src/
│   │   │   ├── main/       # 主进程
│   │   │   ├── preload/    # 预加载脚本
│   │   │   └── renderer/   # 渲染进程
│   │   └── package.json
│   └── service/            # NestJS 后端服务
│       ├── src/
│       │   ├── auth/       # 认证模块
│       │   ├── servers/    # 服务器管理
│       │   ├── keys/       # 密钥管理
│       │   └── teams/      # 团队管理
│       └── package.json
├── docs/                   # 文档站点
├── env/                    # 环境变量配置
├── docker/                 # Docker 配置
├── scripts/                # 构建脚本
└── package.json           # 根目录配置
```

## 开发环境设置

### 1. 克隆项目
```bash
git clone https://github.com/shzjj82/terminal-electron.git
cd terminal-electron
```

### 2. 安装依赖
```bash
yarn install
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp env/env.example env/development.env

# 编辑开发环境配置
vim env/development.env
```

### 4. 启动开发服务器
```bash
# 启动所有服务
yarn dev

# 或分别启动
yarn dev:app      # 启动 Electron 应用
yarn dev:service  # 启动后端服务
```

## 开发流程

### 1. 创建功能分支
```bash
git checkout -b feature/your-feature-name
```

### 2. 开发功能
- 在 `apps/app/src/renderer/src/` 中开发前端功能
- 在 `apps/service/src/` 中开发后端功能
- 遵循项目的代码规范和架构设计

### 3. 测试功能
```bash
# 运行类型检查
yarn typecheck

# 运行代码检查
yarn lint

# 运行测试
yarn test
```

### 4. 提交代码
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request
- 在 GitHub 上创建 Pull Request
- 填写详细的描述和测试说明
- 等待代码审查

## 代码规范

### TypeScript 规范
- 使用严格的 TypeScript 配置
- 为所有函数和变量添加类型注解
- 避免使用 `any` 类型

### React 规范
- 使用函数组件和 Hooks
- 遵循 React 最佳实践
- 使用 TypeScript 进行类型检查

### 命名规范
- 使用 camelCase 命名变量和函数
- 使用 PascalCase 命名组件和类
- 使用 kebab-case 命名文件和目录

### 注释规范
- 为复杂逻辑添加注释
- 使用 JSDoc 格式注释函数
- 保持注释的及时更新

## 构建和部署

### 开发构建
```bash
# 构建 Electron 应用
yarn build:electron:mac:arm64
yarn build:electron:win:x64
yarn build:electron:linux:x64

# 构建所有平台
yarn build:electron:all
```

### 生产构建
```bash
# 使用生产环境配置
yarn build:electron:prod
```

### Docker 部署
```bash
# 构建 Docker 镜像
yarn docker:build

# 启动服务
yarn docker:up

# 查看日志
yarn docker:logs
```

## 调试技巧

### Electron 调试
- 使用 Chrome DevTools 调试渲染进程
- 使用 Node.js 调试器调试主进程
- 查看 Electron 日志获取错误信息

### 后端调试
- 使用 NestJS 内置的调试工具
- 查看应用日志和错误堆栈
- 使用数据库工具查看数据

### 网络调试
- 使用浏览器开发者工具查看网络请求
- 检查 API 接口的请求和响应
- 验证环境变量配置

## 贡献指南

### 提交规范
使用 Conventional Commits 规范：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 代码审查
- 所有代码变更都需要通过 Pull Request
- 至少需要一名维护者审查
- 确保代码质量和测试覆盖率

### 问题报告
- 使用 GitHub Issues 报告问题
- 提供详细的复现步骤
- 包含系统信息和错误日志

## 下一步

- [项目结构](./structure.md) - 详细了解项目架构和模块组织
- [技术栈](./tech-stack.md) - 深入了解前端、后端和开发工具技术选择
- [开发环境](./environment.md) - 配置开发环境，包括系统要求和安装步骤
- [构建流程](./build.md) - 了解开发构建、生产构建和多平台打包流程
- [贡献指南](./contributing.md) - 参与项目开发，包括代码贡献和社区参与 