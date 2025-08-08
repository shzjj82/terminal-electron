# 构建流程

本文档详细介绍了 Terminal Electron 项目的构建流程，包括开发构建、生产构建、多平台打包等。

## 构建概述

Terminal Electron 项目采用 Monorepo 架构，使用 Turborepo 进行构建管理，支持多平台打包和自动化部署。

### 构建架构

```
构建流程
├── 前端构建 (Electron)
│   ├── 主进程构建
│   ├── 渲染进程构建
│   └── 预加载脚本构建
├── 后端构建 (NestJS)
│   ├── TypeScript 编译
│   └── 依赖打包
├── 文档构建 (VitePress)
│   └── 静态站点生成
└── 打包部署
    ├── Electron 应用打包
    ├── Docker 镜像构建
    └── 发布包生成
```

## 开发构建

### 1. 前端开发构建

#### 启动开发服务器
```bash
# 启动 Electron 开发服务器
yarn dev:app

# 或使用详细模式
yarn dev:app:verbose
```

#### 构建配置
```typescript
// electron.vite.config.ts
export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'src/renderer/index.html')
        }
      }
    }
  }
})
```

### 2. 后端开发构建

#### 启动开发服务器
```bash
# 启动 NestJS 开发服务器
yarn dev:service

# 或使用监视模式
yarn dev:service:watch
```

#### 构建配置
```typescript
// nest-cli.json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "entryFile": "main",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": true
  }
}
```

### 3. 文档开发构建

#### 启动文档服务器
```bash
# 启动 VitePress 开发服务器
yarn dev:docs

# 或构建静态文件
yarn build:docs
```

## 生产构建

### 1. 前端生产构建

#### 构建 Electron 应用
```bash
# 构建所有平台
yarn build:electron:all

# 构建特定平台
yarn build:electron:mac:arm64
yarn build:electron:mac:x64
yarn build:electron:win:x64
yarn build:electron:linux:x64

# 构建生产版本
yarn build:electron:prod
```

#### 构建配置
```yaml
# electron-builder.yml
appId: com.terminal.electron
productName: Terminal Electron
directories:
  output: release
  buildResources: resources
files:
  - dist
  - node_modules
  - package.json
mac:
  target:
    - target: dmg
      arch: [x64, arm64]
  category: public.app-category.developer-tools
win:
  target:
    - target: nsis
      arch: [x64]
  icon: resources/icon.ico
linux:
  target:
    - target: AppImage
      arch: [x64]
  icon: resources/icon.png
```

### 2. 后端生产构建

#### 构建 NestJS 应用
```bash
# 构建生产版本
yarn build:service

# 构建 Docker 镜像
yarn docker:build:service
```

#### 构建配置
```typescript
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "exclude": [
    "node_modules",
    "test",
    "dist",
    "**/*spec.ts"
  ]
}
```

### 3. 文档生产构建

#### 构建静态站点
```bash
# 构建文档站点
yarn build:docs

# 预览构建结果
yarn preview:docs
```

## 多平台打包

### 1. macOS 打包

#### 系统要求
- macOS 10.15+ (Catalina)
- Xcode Command Line Tools
- 有效的 Apple Developer 证书

#### 打包命令
```bash
# 构建 macOS ARM64
yarn build:electron:mac:arm64

# 构建 macOS x64
yarn build:electron:mac:x64

# 构建通用版本 (ARM64 + x64)
yarn build:electron:mac:universal
```

#### 签名配置
```yaml
# electron-builder.yml
mac:
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist
  identity: "Developer ID Application: Your Name (TEAM_ID)"
```

### 2. Windows 打包

#### 系统要求
- Windows 10+
- Visual Studio Build Tools
- 代码签名证书 (可选)

#### 打包命令
```bash
# 构建 Windows x64
yarn build:electron:win:x64

# 构建 Windows x86
yarn build:electron:win:x86
```

#### 安装程序配置
```yaml
# electron-builder.yml
win:
  target:
    - target: nsis
      arch: [x64]
  artifactName: "${productName}-${version}-${arch}.${ext}"
  nsis:
    oneClick: false
    allowToChangeInstallationDirectory: true
    createDesktopShortcut: true
    createStartMenuShortcut: true
```

### 3. Linux 打包

#### 系统要求
- Ubuntu 18.04+ / CentOS 7+
- 必要的构建工具

#### 打包命令
```bash
# 构建 Linux x64
yarn build:electron:linux:x64

# 构建 AppImage
yarn build:electron:linux:appimage

# 构建 Snap
yarn build:electron:linux:snap
```

#### 包格式配置
```yaml
# electron-builder.yml
linux:
  target:
    - target: AppImage
      arch: [x64]
    - target: deb
      arch: [x64]
    - target: rpm
      arch: [x64]
  category: Development
```

## Docker 构建

### 1. 后端服务 Docker 构建

#### Dockerfile
```dockerfile
# apps/service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN yarn build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["yarn", "start:prod"]
```

#### 构建命令
```bash
# 构建 Docker 镜像
yarn docker:build:service

# 运行容器
yarn docker:run:service

# 推送到镜像仓库
yarn docker:push:service
```

### 2. 完整应用 Docker 构建

#### Docker Compose
```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  terminal-electron:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_TYPE=sqlite
      - DB_DATABASE=/app/data/terminal.db
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

#### 构建命令
```bash
# 构建完整应用
yarn docker:build

# 启动服务
yarn docker:up

# 停止服务
yarn docker:down
```

## 自动化构建

### 1. CI/CD 配置

#### GitHub Actions
```yaml
# .github/workflows/build.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Build application
        run: yarn build:electron:${{ matrix.os }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: terminal-electron-${{ matrix.os }}
          path: release/
```

### 2. 构建脚本

#### 主构建脚本
```javascript
// scripts/build-electron.js
const { execSync } = require('child_process');
const path = require('path');

const platforms = ['mac', 'win', 'linux'];
const architectures = ['x64', 'arm64'];

async function build() {
  console.log('开始构建 Electron 应用...');
  
  for (const platform of platforms) {
    for (const arch of architectures) {
      if (platform === 'win' && arch === 'arm64') continue;
      
      console.log(`构建 ${platform} ${arch}...`);
      try {
        execSync(`yarn build:electron:${platform}:${arch}`, {
          stdio: 'inherit'
        });
        console.log(`✅ ${platform} ${arch} 构建成功`);
      } catch (error) {
        console.error(`❌ ${platform} ${arch} 构建失败:`, error.message);
      }
    }
  }
  
  console.log('构建完成！');
}

build().catch(console.error);
```

#### 类型检查脚本
```javascript
// scripts/fix-typescript-errors.js
const { execSync } = require('child_process');

function fixTypeScriptErrors() {
  console.log('修复 TypeScript 错误...');
  
  try {
    // 运行类型检查
    execSync('yarn typecheck', { stdio: 'inherit' });
    console.log('✅ TypeScript 检查通过');
  } catch (error) {
    console.log('❌ 发现 TypeScript 错误，尝试修复...');
    
    // 自动修复可修复的错误
    try {
      execSync('yarn lint:fix', { stdio: 'inherit' });
      console.log('✅ 自动修复完成');
    } catch (fixError) {
      console.error('❌ 自动修复失败，请手动修复');
      process.exit(1);
    }
  }
}

fixTypeScriptErrors();
```

## 构建优化

### 1. 构建性能优化

#### Turborepo 缓存
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

#### 并行构建
```bash
# 并行构建所有应用
yarn build:parallel

# 并行运行测试
yarn test:parallel
```

### 2. 包大小优化

#### 代码分割
```typescript
// 路由级别代码分割
const Auth = lazy(() => import('./pages/auth'));
const Servers = lazy(() => import('./pages/servers'));
const Keys = lazy(() => import('./pages/keys'));
```

#### 依赖优化
```json
// package.json
{
  "dependencies": {
    // 生产依赖
  },
  "devDependencies": {
    // 开发依赖
  },
  "optionalDependencies": {
    // 可选依赖
  }
}
```

### 3. 构建产物优化

#### 资源压缩
```typescript
// electron.vite.config.ts
export default defineConfig({
  renderer: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
          }
        }
      }
    }
  }
})
```

#### 图片优化
```bash
# 压缩图片资源
yarn optimize:images

# 生成 WebP 格式
yarn generate:webp
```

## 构建验证

### 1. 构建测试

#### 自动化测试
```bash
# 运行构建后测试
yarn test:build

# 运行集成测试
yarn test:integration

# 运行端到端测试
yarn test:e2e
```

#### 构建验证
```bash
# 验证构建产物
yarn verify:build

# 检查包完整性
yarn verify:package

# 验证签名
yarn verify:signature
```

### 2. 性能测试

#### 启动性能
```bash
# 测试应用启动时间
yarn benchmark:startup

# 测试内存使用
yarn benchmark:memory

# 测试 CPU 使用
yarn benchmark:cpu
```

#### 构建性能
```bash
# 测试构建时间
yarn benchmark:build

# 测试包大小
yarn benchmark:size

# 测试加载性能
yarn benchmark:load
```

## 发布流程

### 1. 版本管理

#### 语义化版本
```bash
# 发布补丁版本
yarn release:patch

# 发布次要版本
yarn release:minor

# 发布主要版本
yarn release:major
```

#### 版本标签
```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0
```

### 2. 发布包生成

#### 自动发布
```bash
# 生成发布包
yarn release:generate

# 上传到 GitHub Releases
yarn release:upload

# 发布到 npm (如果适用)
yarn release:npm
```

#### 手动发布
```bash
# 构建所有平台
yarn build:electron:all

# 生成安装包
yarn package:installers

# 创建发布说明
yarn release:notes
```

## 构建故障排除

### 1. 常见构建错误

#### 依赖问题
```bash
# 清理依赖缓存
yarn cache clean

# 重新安装依赖
rm -rf node_modules
yarn install

# 检查依赖冲突
yarn why <package-name>
```

#### 编译错误
```bash
# 检查 TypeScript 错误
yarn typecheck

# 修复 ESLint 错误
yarn lint:fix

# 检查构建配置
yarn verify:config
```

### 2. 平台特定问题

#### macOS 问题
```bash
# 检查 Xcode 工具
xcode-select --install

# 检查证书
security find-identity -v -p codesigning

# 重置构建缓存
yarn clean:mac
```

#### Windows 问题
```bash
# 检查 Visual Studio 工具
npm install --global windows-build-tools

# 检查 Python 环境
python --version

# 重置构建缓存
yarn clean:win
```

#### Linux 问题
```bash
# 安装构建依赖
sudo apt-get install build-essential

# 检查库文件
ldd --version

# 重置构建缓存
yarn clean:linux
```

## 构建最佳实践

### 1. 构建配置

- 使用环境变量管理配置
- 分离开发和生产配置
- 启用构建缓存
- 配置适当的日志级别

### 2. 性能优化

- 使用代码分割减少包大小
- 启用 Tree Shaking
- 压缩静态资源
- 优化依赖加载

### 3. 安全考虑

- 验证依赖包完整性
- 检查安全漏洞
- 使用 HTTPS 下载依赖
- 定期更新依赖版本

### 4. 质量保证

- 运行自动化测试
- 检查代码覆盖率
- 验证构建产物
- 进行性能基准测试 