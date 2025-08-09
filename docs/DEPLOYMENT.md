# 文档部署指南

本文档说明如何将 Terminal Electron 的文档部署到 GitHub Pages。

## 自动部署

项目已配置 GitHub Actions 工作流，当 `docs/` 目录下的文件发生变更时，会自动构建并部署到 GitHub Pages。

### 工作流触发条件

- 推送到 `main` 分支时
- 创建 Pull Request 时
- 手动触发（在 GitHub Actions 页面）

### 部署流程

1. **构建阶段**：
   - 安装 Node.js 18
   - 安装项目依赖
   - 构建 VitePress 文档
   - 上传构建产物

2. **部署阶段**：
   - 配置 GitHub Pages
   - 部署到 GitHub Pages

## 手动设置 GitHub Pages

如果您需要手动设置 GitHub Pages，请按以下步骤操作：

### 1. 启用 GitHub Pages

1. 进入仓库设置页面
2. 点击 "Pages" 选项
3. 在 "Source" 部分选择 "GitHub Actions"

### 2. 配置仓库设置

确保仓库设置中启用了以下功能：
- GitHub Pages
- GitHub Actions

### 3. 检查部署状态

部署完成后，您可以在以下位置查看文档：
- `https://your-username.github.io/terminal-electron/`

## 本地开发

### 安装依赖

```bash
cd docs
yarn install
```

### 启动开发服务器

```bash
yarn docs:dev
```

### 构建文档

```bash
yarn docs:build
```

### 预览构建结果

```bash
yarn docs:preview
```

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本（需要 18+）
   - 确保所有依赖已正确安装
   - 查看 GitHub Actions 日志

2. **页面无法访问**
   - 确认 GitHub Pages 已启用
   - 检查仓库设置中的 Pages 配置
   - 等待部署完成（可能需要几分钟）

3. **样式或链接问题**
   - 检查 `base` 路径配置
   - 确保所有资源路径正确
   - 验证相对路径链接

### 调试步骤

1. 查看 GitHub Actions 运行日志
2. 检查构建产物是否正确生成
3. 验证 GitHub Pages 设置
4. 清除浏览器缓存

## 配置说明

### VitePress 配置

文档使用 VitePress 构建，主要配置在 `.vitepress/config.ts` 中：

- `base`: 设置基础路径为 `/terminal-electron/`
- `title`: 文档标题
- `themeConfig`: 主题配置，包括导航、侧边栏等

### GitHub Actions 配置

工作流文件位于 `.github/workflows/docs.yml`，包含：

- 触发条件配置
- 构建和部署步骤
- 权限设置
- 并发控制

## 更新文档

要更新文档，只需：

1. 修改 `docs/` 目录下的 Markdown 文件
2. 提交并推送到 `main` 分支
3. GitHub Actions 会自动构建和部署

文档通常在几分钟内更新完成。 