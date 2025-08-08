# 构建配置

Terminal Electron 支持多种构建配置，包括开发构建、生产构建和多平台构建。本文档详细说明了各种构建选项和配置方法。

## 构建概述

### 构建类型

- **开发构建**: 用于开发和调试
- **生产构建**: 用于发布和部署
- **多平台构建**: 支持 macOS、Windows、Linux
- **多架构构建**: 支持 ARM64 和 x64

### 构建工具

- **Electron Builder**: 桌面应用打包
- **Vite**: 前端构建工具
- **Turborepo**: 构建系统
- **Yarn**: 包管理器

## 基础构建

### 开发构建

```bash
# 启动开发服务器
yarn dev

# 仅构建前端
yarn build:app

# 仅构建后端
yarn build:service
```

### 生产构建

```bash
# 构建所有应用
yarn build

# 构建 Electron 应用
yarn build:electron:mac:arm64
yarn build:electron:win:x64
yarn build:electron:linux:x64
```

## Electron 构建配置

### 构建脚本

项目提供了多种构建脚本：

```bash
# 基础构建
yarn build:electron

# 平台特定构建
yarn build:electron:mac
yarn build:electron:win
yarn build:electron:linux

# 架构特定构建
yarn build:electron:mac:arm64
yarn build:electron:mac:x64
yarn build:electron:win:arm64
yarn build:electron:win:x64
yarn build:electron:linux:arm64
yarn build:electron:linux:x64

# 全平台构建
yarn build:electron:all
yarn build:electron:all:arm64
yarn build:electron:all:x64
```

### 自定义构建脚本

使用 `scripts/build-electron.js` 进行自定义构建：

```bash
# 基本用法
node scripts/build-electron.js [平台] [架构] [环境]

# 示例
node scripts/build-electron.js mac arm64 production
node scripts/build-electron.js win x64 development
node scripts/build-electron.js linux arm64 production
```

## 构建配置详解

### Electron Builder 配置

位于 `apps/app/package.json` 的 `build` 字段：

```json
{
  "build": {
    "appId": "com.terminal.electron",
    "productName": "Terminal Electron",
    "directories": {
      "output": "release"
    },
    "files": [
      "out/**/*",
      "node_modules/**/*"
    ],
    "electronVersion": "37.2.3",
    "mac": {
      "category": "public.app-category.developer-tools",
      "target": [
        {
          "target": "dmg",
          "arch": ["x64", "arm64"]
        },
        {
          "target": "zip",
          "arch": ["x64", "arm64"]
        }
      ],
      "icon": "build/icon.icns"
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "arm64"]
        },
        {
          "target": "portable",
          "arch": ["x64", "arm64"]
        }
      ],
      "icon": "build/icon.ico"
    },
    "linux": {
      "target": [
        {
          "target": "AppImage",
          "arch": ["x64", "arm64"]
        },
        {
          "target": "deb",
          "arch": ["x64", "arm64"]
        }
      ],
      "icon": "build/icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### 平台特定配置

#### macOS 配置

```json
{
  "mac": {
    "category": "public.app-category.developer-tools",
    "target": [
      {
        "target": "dmg",
        "arch": ["x64", "arm64"]
      },
      {
        "target": "zip",
        "arch": ["x64", "arm64"]
      }
    ],
    "icon": "build/icon.icns",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
}
```

#### Windows 配置

```json
{
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64", "arm64"]
      },
      {
        "target": "portable",
        "arch": ["x64", "arm64"]
      }
    ],
    "icon": "build/icon.ico",
    "requestedExecutionLevel": "asInvoker"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "allowElevation": true,
    "installerIcon": "build/icon.ico",
    "uninstallerIcon": "build/icon.ico",
    "installerHeaderIcon": "build/icon.ico",
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

#### Linux 配置

```json
{
  "linux": {
    "target": [
      {
        "target": "AppImage",
        "arch": ["x64", "arm64"]
      },
      {
        "target": "deb",
        "arch": ["x64", "arm64"]
      }
    ],
    "icon": "build/icon.png",
    "category": "Development"
  }
}
```

## 环境变量配置

### 构建环境变量

```bash
# 构建目标
BUILD_TARGET=production
BUILD_PLATFORM=mac
BUILD_ARCH=arm64

# 构建输出
BUILD_OUTPUT_DIR=release
BUILD_APP_ID=com.terminal.electron
BUILD_PRODUCT_NAME=Terminal Electron

# API 配置
API_BASE_URL=http://localhost:4000
API_TIMEOUT=10000
```

### 环境变量加载

构建脚本会自动加载环境变量：

```javascript
// scripts/build-electron.js
const envFile = normalizedTarget === 'development' ? 'env/development.env' : 'env/production.env';
const env = loadEnvFile(envFile);

// 设置环境变量
Object.entries(env).forEach(([key, value]) => {
  process.env[key] = value;
});
```

## 构建流程

### 1. 依赖安装

```bash
# 安装所有依赖
yarn install

# 安装 Electron 依赖
yarn workspace terminal postinstall
```

### 2. 类型检查

```bash
# 运行 TypeScript 类型检查
yarn typecheck

# 检查前端类型
yarn workspace terminal typecheck:web

# 检查后端类型
yarn workspace service typecheck
```

### 3. 代码检查

```bash
# 运行 ESLint 检查
yarn lint

# 格式化代码
yarn format
```

### 4. 构建应用

```bash
# 构建前端
yarn workspace terminal build

# 构建后端
yarn workspace service build

# 构建 Electron 应用
yarn build:electron:mac:arm64
```

## 构建优化

### 代码分割

```typescript
// 动态导入优化
const { syncApi } = await import('@/api/sync');
const { DataService } = await import('../services/dataService');
```

### 资源优化

```json
{
  "build": {
    "files": [
      "out/**/*",
      "node_modules/**/*"
    ],
    "extraResources": [
      {
        "from": "assets",
        "to": "assets"
      }
    ]
  }
}
```

### 压缩配置

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

## 签名配置

### macOS 签名

```json
{
  "mac": {
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
}
```

### Windows 签名

```json
{
  "win": {
    "certificateFile": "path/to/certificate.p12",
    "certificatePassword": "password"
  }
}
```

## 构建输出

### 输出目录结构

```
release/
├── mac/
│   ├── Terminal Electron-1.0.0-arm64.dmg
│   ├── Terminal Electron-1.0.0-arm64.zip
│   ├── Terminal Electron-1.0.0-x64.dmg
│   └── Terminal Electron-1.0.0-x64.zip
├── win/
│   ├── Terminal Electron Setup 1.0.0-arm64.exe
│   ├── Terminal Electron Setup 1.0.0-x64.exe
│   ├── Terminal Electron-1.0.0-arm64.exe
│   └── Terminal Electron-1.0.0-x64.exe
└── linux/
    ├── Terminal Electron-1.0.0-arm64.AppImage
    ├── Terminal Electron-1.0.0-x64.AppImage
    ├── terminal-electron_1.0.0_arm64.deb
    └── terminal-electron_1.0.0_amd64.deb
```

### 文件大小优化

```bash
# 分析构建产物大小
du -sh release/*

# 压缩构建产物
tar -czf terminal-electron-builds.tar.gz release/
```

## 自动化构建

### GitHub Actions

```yaml
name: Build Electron App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
        arch: [x64, arm64]

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - run: yarn install
      - run: yarn typecheck
      - run: yarn lint
      
      - name: Build Electron App
        run: |
          if [ "${{ matrix.os }}" = "macos-latest" ]; then
            yarn build:electron:mac:${{ matrix.arch }}
          elif [ "${{ matrix.os }}" = "windows-latest" ]; then
            yarn build:electron:win:${{ matrix.arch }}
          else
            yarn build:electron:linux:${{ matrix.arch }}
          fi
      
      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: terminal-electron-${{ matrix.os }}-${{ matrix.arch }}
          path: apps/app/release/
```

### 本地自动化脚本

```bash
#!/bin/bash
# build-all.sh

set -e

echo "开始构建所有平台..."

# 构建 macOS
echo "构建 macOS..."
yarn build:electron:mac:arm64
yarn build:electron:mac:x64

# 构建 Windows
echo "构建 Windows..."
yarn build:electron:win:arm64
yarn build:electron:win:x64

# 构建 Linux
echo "构建 Linux..."
yarn build:electron:linux:arm64
yarn build:electron:linux:x64

echo "构建完成！"
```

## 故障排除

### 常见构建问题

#### 1. 依赖安装失败
```bash
# 清理缓存
yarn cache clean
rm -rf node_modules
yarn install
```

#### 2. 类型检查失败
```bash
# 检查 TypeScript 配置
yarn typecheck

# 修复类型错误
# 根据错误信息修复代码
```

#### 3. 构建超时
```bash
# 增加构建超时时间
export ELECTRON_BUILDER_TIMEOUT=300000

# 使用更快的网络
yarn config set registry https://registry.npmmirror.com
```

#### 4. 签名失败
```bash
# 检查证书
security find-identity -v -p codesigning

# 重新安装证书
security import certificate.p12 -k login.keychain
```

### 调试技巧

```bash
# 查看构建日志
yarn build:electron:mac:arm64 --verbose

# 检查构建配置
node -e "console.log(require('./apps/app/package.json').build)"

# 验证构建产物
file apps/app/release/mac/*.dmg
```

## 下一步

- [Docker 部署](./docker.md) - 使用 Docker 部署应用
- [环境变量配置](./environment.md) - 环境变量管理
- [发布流程](../development/release.md) - 应用发布指南 