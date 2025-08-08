# 配置指南

Terminal Electron 提供了丰富的配置选项，可以根据不同需求进行个性化设置。本文档详细说明了各种配置项及其使用方法。

## 配置概述

### 配置类型

- **应用配置**: 应用界面和功能设置
- **终端配置**: 终端外观和行为设置
- **网络配置**: 连接和代理设置
- **安全配置**: 认证和安全选项
- **数据配置**: 数据存储和同步设置

### 配置文件位置

- **应用配置**: `~/.terminal-electron/config.json`
- **环境变量**: `env/development.env`, `env/production.env`
- **用户数据**: `~/.terminal-electron/data/`

## 应用配置

### 基础设置

```json
{
  "app": {
    "theme": "dark",
    "language": "zh-CN",
    "autoUpdate": true,
    "startupBehavior": "restore-sessions"
  }
}
```

### 主题配置

```json
{
  "theme": {
    "mode": "dark",
    "primaryColor": "#3b82f6",
    "accentColor": "#10b981",
    "backgroundColor": "#1f2937",
    "textColor": "#f9fafb"
  }
}
```

### 语言设置

```json
{
  "language": {
    "locale": "zh-CN",
    "fallback": "en-US",
    "dateFormat": "YYYY-MM-DD",
    "timeFormat": "HH:mm:ss"
  }
}
```

## 终端配置

### 终端外观

```json
{
  "terminal": {
    "fontFamily": "Monaco, Menlo, 'Ubuntu Mono', monospace",
    "fontSize": 14,
    "lineHeight": 1.2,
    "cursorBlink": true,
    "cursorStyle": "block",
    "scrollback": 1000
  }
}
```

### 终端颜色

```json
{
  "terminal": {
    "colors": {
      "background": "#1e1e1e",
      "foreground": "#d4d4d4",
      "black": "#000000",
      "red": "#cd3131",
      "green": "#0dbc79",
      "yellow": "#e5e510",
      "blue": "#2472c8",
      "magenta": "#bc3fbc",
      "cyan": "#11a8cd",
      "white": "#e5e5e5",
      "brightBlack": "#666666",
      "brightRed": "#f14c4c",
      "brightGreen": "#23d18b",
      "brightYellow": "#f5f543",
      "brightBlue": "#3b8eea",
      "brightMagenta": "#d670d6",
      "brightCyan": "#29b8db",
      "brightWhite": "#ffffff"
    }
  }
}
```

### 终端行为

```json
{
  "terminal": {
    "behavior": {
      "bell": "sound",
      "rightClickSelectsWord": true,
      "fastScrollModifier": "alt",
      "fastScrollSensitivity": 5,
      "scrollback": 1000,
      "scrollbackOnUserInput": false
    }
  }
}
```

## 网络配置

### 连接设置

```json
{
  "network": {
    "connection": {
      "timeout": 30000,
      "keepAlive": true,
      "keepAliveInterval": 60000,
      "maxRetries": 3,
      "retryDelay": 1000
    }
  }
}
```

### 代理配置

```json
{
  "network": {
    "proxy": {
      "enabled": false,
      "type": "http",
      "host": "127.0.0.1",
      "port": 8080,
      "username": "",
      "password": "",
      "bypass": ["localhost", "127.0.0.1"]
    }
  }
}
```

### SSH 配置

```json
{
  "ssh": {
    "defaults": {
      "port": 22,
      "username": "",
      "authType": "password",
      "keepAlive": true,
      "keepAliveInterval": 60,
      "compression": false,
      "encryption": "aes128-ctr"
    }
  }
}
```

## 安全配置

### 认证设置

```json
{
  "security": {
    "authentication": {
      "sessionTimeout": 3600000,
      "maxLoginAttempts": 5,
      "lockoutDuration": 300000,
      "requirePassword": true,
      "passwordMinLength": 8
    }
  }
}
```

### 密钥管理

```json
{
  "security": {
    "keys": {
      "defaultType": "rsa",
      "keySize": 2048,
      "passphraseRequired": false,
      "autoBackup": true,
      "backupLocation": "~/.ssh/backup/"
    }
  }
}
```

### 加密设置

```json
{
  "security": {
    "encryption": {
      "algorithm": "aes-256-gcm",
      "keyDerivation": "pbkdf2",
      "iterations": 100000,
      "saltLength": 32
    }
  }
}
```

## 数据配置

### 存储设置

```json
{
  "data": {
    "storage": {
      "type": "local",
      "path": "~/.terminal-electron/data/",
      "maxSize": "1GB",
      "compression": true,
      "encryption": true
    }
  }
}
```

### 同步配置

```json
{
  "data": {
    "sync": {
      "enabled": true,
      "interval": 300000,
      "autoSync": true,
      "conflictResolution": "server-wins",
      "excludePatterns": ["*.tmp", "*.log"]
    }
  }
}
```

### 备份设置

```json
{
  "data": {
    "backup": {
      "enabled": true,
      "schedule": "daily",
      "retention": 30,
      "location": "~/.terminal-electron/backups/",
      "compression": true
    }
  }
}
```

## 性能配置

### 内存管理

```json
{
  "performance": {
    "memory": {
      "maxHeapSize": "512MB",
      "gcInterval": 300000,
      "enableCompression": true,
      "cacheSize": "256MB"
    }
  }
}
```

### 缓存设置

```json
{
  "performance": {
    "cache": {
      "enabled": true,
      "maxSize": "100MB",
      "ttl": 3600000,
      "cleanupInterval": 600000
    }
  }
}
```

### 并发设置

```json
{
  "performance": {
    "concurrency": {
      "maxConnections": 10,
      "maxSessions": 5,
      "connectionPoolSize": 20,
      "timeout": 30000
    }
  }
}
```

## 环境变量配置

### 开发环境

```bash
# env/development.env
API_BASE_URL=http://localhost:3000
API_TIMEOUT=10000
DB_TYPE=sqlite
DB_DATABASE=apps/service/data/terminal-dev.db
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
SERVICE_PORT=3000
ELECTRON_DEV_SERVER_URL=http://localhost:5173
BUILD_TARGET=development
BUILD_PLATFORM=mac
BUILD_ARCH=arm64
BUILD_OUTPUT_DIR=release
```

### 生产环境

```bash
# env/production.env
API_BASE_URL=http://localhost:4000
API_TIMEOUT=10000
DB_TYPE=sqlite
DB_DATABASE=/app/data/terminal.db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
SERVICE_PORT=3000
DOCKER_IMAGE_NAME=terminal-service
DOCKER_CONTAINER_NAME=terminal-service
BUILD_TARGET=production
BUILD_PLATFORM=mac
BUILD_ARCH=arm64
BUILD_OUTPUT_DIR=release
BUILD_APP_ID=com.terminal.electron
BUILD_PRODUCT_NAME=Terminal Electron
```

## 配置管理

### 配置文件结构

```
~/.terminal-electron/
├── config.json          # 主配置文件
├── data/               # 数据目录
│   ├── servers.json    # 服务器配置
│   ├── keys.json       # 密钥配置
│   └── sessions.json   # 会话配置
├── logs/               # 日志目录
│   ├── app.log        # 应用日志
│   ├── error.log      # 错误日志
│   └── access.log     # 访问日志
└── backups/           # 备份目录
    └── auto/          # 自动备份
```

### 配置验证

```typescript
// 配置验证函数
function validateConfig(config: any): boolean {
  const required = ['app', 'terminal', 'network', 'security'];
  
  for (const key of required) {
    if (!config[key]) {
      console.error(`Missing required config section: ${key}`);
      return false;
    }
  }
  
  return true;
}
```

### 配置迁移

```typescript
// 配置迁移函数
function migrateConfig(oldConfig: any): any {
  const newConfig = { ...oldConfig };
  
  // 迁移旧版本配置
  if (oldConfig.version < '2.0.0') {
    newConfig.app = {
      ...newConfig.app,
      theme: oldConfig.theme || 'dark',
      language: oldConfig.language || 'zh-CN'
    };
  }
  
  return newConfig;
}
```

## 配置最佳实践

### 1. 安全性

```json
{
  "security": {
    "bestPractices": {
      "useStrongPasswords": true,
      "enableTwoFactor": true,
      "encryptSensitiveData": true,
      "regularKeyRotation": true,
      "auditLogging": true
    }
  }
}
```

### 2. 性能优化

```json
{
  "performance": {
    "optimizations": {
      "enableCaching": true,
      "useCompression": true,
      "optimizeMemory": true,
      "backgroundProcessing": true
    }
  }
}
```

### 3. 用户体验

```json
{
  "ux": {
    "improvements": {
      "autoSave": true,
      "autoComplete": true,
      "smartSuggestions": true,
      "keyboardShortcuts": true
    }
  }
}
```

## 故障排除

### 常见配置问题

#### 1. 配置文件损坏
```bash
# 备份当前配置
cp ~/.terminal-electron/config.json ~/.terminal-electron/config.json.backup

# 重置配置
rm ~/.terminal-electron/config.json
# 重新启动应用，会生成默认配置
```

#### 2. 权限问题
```bash
# 检查文件权限
ls -la ~/.terminal-electron/

# 修复权限
chmod 600 ~/.terminal-electron/config.json
chmod 700 ~/.terminal-electron/
```

#### 3. 配置冲突
```bash
# 检查环境变量
env | grep TERMINAL

# 清理环境变量
unset TERMINAL_ELECTRON_CONFIG
```

### 调试技巧

```bash
# 查看当前配置
cat ~/.terminal-electron/config.json | jq '.'

# 验证配置语法
node -e "console.log(JSON.parse(require('fs').readFileSync('~/.terminal-electron/config.json')))"

# 测试配置加载
yarn dev --config-debug
```

## 下一步

- [使用指南](./usage.md) - 学习如何使用各种功能
- [环境变量配置](../deployment/environment.md) - 环境变量管理
- [故障排除](../development/troubleshooting.md) - 常见问题解决 