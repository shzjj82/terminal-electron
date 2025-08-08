# Terminal Electron 文档

这是 Terminal Electron 应用的官方文档站点，基于 VitePress 构建。

## 快速开始

### 安装依赖
```bash
cd docs
yarn install
```

### 启动开发服务器
```bash
# 在 docs 目录下
yarn docs:dev

# 或在根目录下
yarn docs:dev
```

### 构建文档
```bash
# 在 docs 目录下
yarn docs:build

# 或在根目录下
yarn docs:build
```

### 预览构建结果
```bash
# 在 docs 目录下
yarn docs:preview

# 或在根目录下
yarn docs:preview
```

## 文档结构

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress 配置
├── guide/                 # 用户指南
│   ├── index.md          # 介绍
│   ├── installation.md   # 安装指南
│   ├── configuration.md  # 配置指南
│   └── usage.md         # 使用指南
├── api/                  # API 文档
│   ├── index.md         # API 概述
│   ├── auth.md          # 认证 API
│   ├── servers.md       # 服务器 API
│   ├── keys.md          # 密钥 API
│   └── teams.md         # 团队 API
├── deployment/          # 部署指南
│   ├── index.md        # 部署概述
│   ├── docker.md       # Docker 部署
│   ├── environment.md  # 环境变量
│   └── build.md        # 构建配置
├── development/        # 开发指南
│   ├── index.md       # 开发概述
│   ├── structure.md   # 项目结构
│   ├── tech-stack.md  # 技术栈
│   └── contributing.md # 贡献指南
└── index.md           # 文档首页
```

## 编写文档

### Markdown 语法
文档使用 Markdown 语法编写，支持以下特性：
- 标题、段落、列表
- 代码块和语法高亮
- 表格和链接
- 图片和视频

### 特殊语法
- 使用 `::: tip` 添加提示框
- 使用 `::: warning` 添加警告框
- 使用 `::: danger` 添加危险框
- 使用 `::: details` 添加折叠内容

### 示例
```markdown
::: tip 提示
这是一个提示信息。
:::

::: warning 警告
这是一个警告信息。
:::

::: danger 危险
这是一个危险信息。
:::

::: details 点击展开
这是折叠的内容。
:::
```

## 部署

### 自动部署
文档会自动部署到 GitHub Pages：
1. 推送到 `main` 分支
2. GitHub Actions 自动构建
3. 部署到 `gh-pages` 分支

### 手动部署
```bash
# 构建文档
yarn docs:build

# 部署到服务器
# 将 .vitepress/dist 目录上传到 Web 服务器
```

## 贡献

### 添加新页面
1. 在对应目录下创建 `.md` 文件
2. 在 `config.ts` 中添加导航链接
3. 提交 Pull Request

### 修改现有页面
1. 直接编辑对应的 `.md` 文件
2. 确保内容准确和完整
3. 提交 Pull Request

### 本地预览
在提交前，建议在本地预览修改效果：
```bash
yarn docs:dev
```

## 联系方式

如有问题或建议，请：
- 提交 GitHub Issue
- 发送邮件到项目维护者
- 参与社区讨论 