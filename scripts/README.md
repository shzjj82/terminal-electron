# 构建脚本说明

## 概述

本项目提供了完整的 Electron 应用构建脚本，支持多平台多架构构建，并集成了环境变量管理。

## 构建脚本

### `build-electron.js`

主要的 Electron 构建脚本，支持以下功能：

- **多平台支持**: macOS, Windows, Linux
- **多架构支持**: ARM64, x64
- **环境变量集成**: 自动加载开发/生产环境配置
- **参数验证**: 验证平台、架构和环境参数
- **帮助信息**: 提供详细的使用说明

## 使用方法

### 基本用法

```bash
# 从项目根目录运行
node scripts/build-electron.js [平台] [架构] [环境]
```

### 参数说明

| 参数 | 可选值 | 默认值 | 说明 |
|------|--------|--------|------|
| 平台 | mac, win, linux, all | mac | 目标平台 |
| 架构 | arm64, x64 | arm64 | 目标架构 |
| 环境 | development, production, dev, prod | production | 构建环境 |

### 使用示例

```bash
# 默认构建 (mac arm64 production)
node scripts/build-electron.js

# macOS ARM64 开发环境
node scripts/build-electron.js mac arm64 dev

# Windows x64 生产环境
node scripts/build-electron.js win x64 prod

# Linux ARM64 生产环境
node scripts/build-electron.js linux arm64

# 所有平台 x64 生产环境
node scripts/build-electron.js all x64
```

### 帮助信息

```bash
# 查看帮助
node scripts/build-electron.js --help
node scripts/build-electron.js -h
```

## 环境变量

构建脚本会自动加载环境变量文件：

- **开发环境**: `env/development.env`
- **生产环境**: `env/production.env`

### 构建相关环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| BUILD_PLATFORM | 构建平台 | mac, win, linux |
| BUILD_ARCH | 构建架构 | arm64, x64 |
| BUILD_TARGET | 构建目标 | development, production |
| BUILD_OUTPUT_DIR | 输出目录 | release |
| BUILD_APP_ID | 应用 ID | com.terminal.electron |
| BUILD_PRODUCT_NAME | 产品名称 | Terminal Electron |

## 构建输出

构建完成后，应用文件将输出到 `apps/app/release/` 目录：

### macOS
- `.dmg` - 安装包
- `.zip` - 压缩包

### Windows
- `.exe` - 安装程序
- `.exe` - 便携版

### Linux
- `.AppImage` - AppImage 格式
- `.deb` - Debian 包

## 故障排除

### 常见问题

1. **权限问题**
   ```bash
   chmod +x scripts/build-electron.js
   ```

2. **依赖问题**
   ```bash
   yarn install
   yarn workspace terminal postinstall
   ```

3. **构建失败**
   ```bash
   # 清理缓存
   yarn clean
   
   # 重新安装依赖
   yarn install
   
   # 重新构建
   node scripts/build-electron.js
   ```

### 调试模式

```bash
# 启用详细日志
DEBUG=electron-builder node scripts/build-electron.js
```

## 集成到 CI/CD

### GitHub Actions 示例

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
        os: [macos-latest, ubuntu-latest, windows-latest]
        arch: [arm64, x64]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: yarn install
      
      - name: Build Electron app
        run: |
          node scripts/build-electron.js ${{ matrix.os == 'macos-latest' && 'mac' || matrix.os == 'windows-latest' && 'win' || 'linux' }} ${{ matrix.arch }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: electron-app-${{ matrix.os }}-${{ matrix.arch }}
          path: apps/app/release/
```

## 注意事项

1. **跨平台构建**: 在 macOS 上可以构建 macOS 应用，在 Windows 上可以构建 Windows 应用，在 Linux 上可以构建 Linux 应用
2. **架构限制**: ARM64 构建需要相应的硬件支持
3. **签名**: 生产环境构建需要相应的代码签名证书
4. **依赖**: 确保所有原生依赖都正确安装 