# 项目结构

本文档详细介绍了 Terminal Electron 项目的目录结构和各个模块的职责。

## 整体架构

Terminal Electron 采用 Monorepo 架构，使用 Yarn Workspaces 和 Turborepo 进行项目管理。项目分为前端应用（Electron）和后端服务（NestJS）两个主要部分。

```
terminal-electron/
├── apps/                    # 应用目录
│   ├── app/                # Electron 前端应用
│   └── service/            # NestJS 后端服务
├── docs/                   # 文档站点
├── env/                    # 环境变量配置
├── docker/                 # Docker 配置
├── scripts/                # 构建脚本
├── package.json           # 根目录配置
├── turbo.json             # Turborepo 配置
└── yarn.lock              # 依赖锁定文件
```

## 前端应用结构 (apps/app/)

### 目录结构
```
apps/app/
├── src/
│   ├── main/              # 主进程代码
│   │   ├── index.ts       # 主进程入口
│   │   └── services/      # 主进程服务
│   │       ├── index.ts
│   │       ├── sshConnectionService.ts
│   │       ├── sshService.ts
│   │       └── portForwardingService.ts
│   ├── preload/           # 预加载脚本
│   │   ├── index.ts       # 预加载脚本入口
│   │   └── index.d.ts     # 类型定义
│   └── renderer/          # 渲染进程代码
│       ├── index.html     # HTML 模板
│       └── src/
│           ├── main.tsx   # React 应用入口
│           ├── App.tsx    # 主应用组件
│           ├── components/ # React 组件
│           │   ├── auth/  # 认证相关组件
│           │   ├── layout/ # 布局组件
│           │   ├── servers/ # 服务器管理组件
│           │   ├── keys/  # 密钥管理组件
│           │   ├── portForwarding/ # 端口转发组件
│           │   ├── terminal/ # 终端组件
│           │   └── ui/    # UI 组件库
│           ├── pages/      # 页面组件
│           │   ├── auth/  # 认证页面
│           │   ├── ssh/   # SSH 相关页面
│           │   └── team/  # 团队管理页面
│           ├── stores/     # 状态管理
│           │   ├── authStore.ts
│           │   ├── serversStore.ts
│           │   ├── keysStore.ts
│           │   └── portForwardingStore.ts
│           ├── hooks/      # 自定义 Hooks
│           │   ├── useServers.ts
│           │   ├── useKeys.ts
│           │   └── usePortForwarding.ts
│           ├── services/   # 前端服务
│           │   ├── sshService.ts
│           │   ├── dataService.ts
│           │   └── syncService.ts
│           ├── types/      # TypeScript 类型定义
│           │   ├── servers.ts
│           │   ├── keys.ts
│           │   └── portForwarding.ts
│           ├── utils/      # 工具函数
│           │   ├── env.ts
│           │   └── permissions.ts
│           └── styles/     # 样式文件
│               └── globals.css
├── electron.vite.config.ts # Electron Vite 配置
├── electron-builder.yml    # Electron Builder 配置
└── package.json           # 前端应用配置
```

### 主要模块说明

#### 主进程 (main/)
- **index.ts**: 主进程入口，负责创建窗口和管理应用生命周期
- **services/**: 主进程服务模块
  - `sshConnectionService.ts`: SSH 连接管理
  - `sshService.ts`: SSH 服务封装
  - `portForwardingService.ts`: 端口转发服务

#### 渲染进程 (renderer/)
- **components/**: React 组件库
  - `auth/`: 认证相关组件（登录、注册、权限控制）
  - `layout/`: 布局组件（侧边栏、头部、主布局）
  - `servers/`: 服务器管理组件（列表、表单、详情）
  - `keys/`: 密钥管理组件（列表、创建、编辑）
  - `portForwarding/`: 端口转发组件（配置、状态管理）
  - `terminal/`: 终端组件（xterm.js 集成）
  - `ui/`: 通用 UI 组件（按钮、输入框、对话框等）

- **pages/**: 页面级组件
  - `auth/`: 认证页面（登录、注册、忘记密码）
  - `ssh/`: SSH 功能页面（服务器、密钥、端口转发）
  - `team/`: 团队管理页面（团队列表、成员管理）

- **stores/**: 状态管理（MobX）
  - `authStore.ts`: 认证状态管理
  - `serversStore.ts`: 服务器数据状态
  - `keysStore.ts`: 密钥数据状态
  - `portForwardingStore.ts`: 端口转发状态

- **hooks/**: 自定义 React Hooks
  - `useServers.ts`: 服务器相关逻辑
  - `useKeys.ts`: 密钥相关逻辑
  - `usePortForwarding.ts`: 端口转发相关逻辑

- **services/**: 前端服务层
  - `sshService.ts`: SSH 相关 API 调用
  - `dataService.ts`: 数据同步服务
  - `syncService.ts`: 本地与服务器数据同步

## 后端服务结构 (apps/service/)

### 目录结构
```
apps/service/
├── src/
│   ├── main.ts            # 应用入口
│   ├── app.module.ts      # 根模块
│   ├── app.controller.ts  # 根控制器
│   ├── app.service.ts     # 根服务
│   ├── config/            # 配置模块
│   │   └── env.config.ts  # 环境配置
│   ├── auth/              # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │       └── auth.dto.ts
│   ├── servers/           # 服务器管理模块
│   │   ├── servers.controller.ts
│   │   ├── servers.service.ts
│   │   ├── servers.module.ts
│   │   └── dto/
│   │       └── server.dto.ts
│   ├── keys/              # 密钥管理模块
│   │   ├── keys.controller.ts
│   │   ├── keys.service.ts
│   │   ├── keys.module.ts
│   │   └── dto/
│   │       └── key.dto.ts
│   ├── port-forwards/     # 端口转发模块
│   │   ├── port-forwards.controller.ts
│   │   ├── port-forwards.service.ts
│   │   ├── port-forwards.module.ts
│   │   └── dto/
│   │       └── port-forward.dto.ts
│   ├── teams/             # 团队管理模块
│   │   ├── teams.controller.ts
│   │   ├── teams.service.ts
│   │   ├── teams.module.ts
│   │   └── dto.ts
│   ├── data/              # 数据管理模块
│   │   ├── data.controller.ts
│   │   ├── data.service.ts
│   │   └── data.module.ts
│   ├── entities/          # 数据库实体
│   │   ├── user.entity.ts
│   │   ├── server.entity.ts
│   │   ├── key.entity.ts
│   │   ├── port-forward.entity.ts
│   │   ├── team.entity.ts
│   │   └── team-member.entity.ts
│   └── common/            # 公共模块
│       └── decorators/
│           └── user-context.decorator.ts
├── data/                  # 数据库文件
│   └── app.db            # SQLite 数据库
├── Dockerfile            # Docker 配置
├── nest-cli.json        # NestJS CLI 配置
└── package.json         # 后端服务配置
```

### 主要模块说明

#### 认证模块 (auth/)
- **auth.controller.ts**: 处理用户注册、登录等认证请求
- **auth.service.ts**: 认证业务逻辑，JWT 令牌生成
- **jwt-auth.guard.ts**: JWT 认证守卫
- **jwt.strategy.ts**: JWT 策略配置

#### 服务器管理模块 (servers/)
- **servers.controller.ts**: 服务器 CRUD 操作 API
- **servers.service.ts**: 服务器业务逻辑
- **server.dto.ts**: 服务器数据传输对象

#### 密钥管理模块 (keys/)
- **keys.controller.ts**: 密钥 CRUD 操作 API
- **keys.service.ts**: 密钥业务逻辑
- **key.dto.ts**: 密钥数据传输对象

#### 端口转发模块 (port-forwards/)
- **port-forwards.controller.ts**: 端口转发 CRUD 操作 API
- **port-forwards.service.ts**: 端口转发业务逻辑
- **port-forward.dto.ts**: 端口转发数据传输对象

#### 团队管理模块 (teams/)
- **teams.controller.ts**: 团队管理 API
- **teams.service.ts**: 团队业务逻辑
- **dto.ts**: 团队相关数据传输对象

#### 数据管理模块 (data/)
- **data.controller.ts**: 数据获取 API
- **data.service.ts**: 数据业务逻辑

#### 数据库实体 (entities/)
- **user.entity.ts**: 用户实体
- **server.entity.ts**: 服务器实体
- **key.entity.ts**: 密钥实体
- **port-forward.entity.ts**: 端口转发实体
- **team.entity.ts**: 团队实体
- **team-member.entity.ts**: 团队成员实体

## 文档结构 (docs/)

```
docs/
├── .vitepress/            # VitePress 配置
│   └── config.ts         # 文档站点配置
├── api/                  # API 文档
│   ├── index.md         # API 概览
│   ├── auth.md          # 认证 API
│   ├── servers.md       # 服务器 API
│   ├── keys.md          # 密钥 API
│   ├── port-forwards.md # 端口转发 API
│   ├── teams.md         # 团队 API
│   └── data.md          # 数据 API
├── guide/               # 用户指南
│   ├── index.md        # 指南概览
│   ├── installation.md # 安装指南
│   ├── configuration.md # 配置指南
│   └── usage.md        # 使用指南
├── deployment/          # 部署文档
│   ├── index.md        # 部署概览
│   ├── docker.md       # Docker 部署
│   ├── environment.md  # 环境配置
│   └── build.md        # 构建配置
├── development/         # 开发文档
│   ├── index.md        # 开发概览
│   ├── structure.md    # 项目结构
│   ├── tech-stack.md   # 技术栈
│   ├── environment.md  # 开发环境
│   ├── build.md        # 构建流程
│   └── contributing.md # 贡献指南
└── index.md            # 文档首页
```

## 环境配置 (env/)

```
env/
├── development.env      # 开发环境配置
├── production.env      # 生产环境配置
└── env.example         # 环境变量模板
```

## Docker 配置 (docker/)

```
docker/
├── docker-compose.yml  # Docker Compose 配置
└── README.md          # Docker 使用说明
```

## 构建脚本 (scripts/)

```
scripts/
├── build-electron.js   # Electron 构建脚本
├── fix-typescript-errors.js # TypeScript 错误修复
└── README.md          # 脚本使用说明
```

## 架构设计原则

### 1. 模块化设计
- 每个功能模块都有独立的目录结构
- 控制器、服务、DTO 分离
- 清晰的依赖关系

### 2. 类型安全
- 全面使用 TypeScript
- 严格的类型定义
- 完整的类型检查

### 3. 状态管理
- 前端使用 MobX 进行状态管理
- 后端使用 NestJS 的依赖注入
- 清晰的数据流

### 4. 安全性
- JWT 认证机制
- 权限控制
- 数据验证

### 5. 可扩展性
- 模块化架构
- 插件化设计
- 配置驱动

## 开发建议

### 1. 代码组织
- 遵循目录结构规范
- 保持模块独立性
- 合理使用抽象层

### 2. 命名规范
- 使用有意义的命名
- 保持命名一致性
- 遵循项目约定

### 3. 文档维护
- 及时更新文档
- 保持文档同步
- 添加必要的注释

### 4. 测试覆盖
- 编写单元测试
- 进行集成测试
- 确保代码质量 