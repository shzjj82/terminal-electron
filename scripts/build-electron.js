#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 显示帮助信息
function showHelp() {
  console.log(`
Electron 构建脚本

用法: node scripts/build-electron.js [平台] [架构] [环境]

参数:
  平台      mac, win, linux, all (默认: mac)
  架构      arm64, x64 (默认: arm64)
  环境      development, production (默认: production)

示例:
  node scripts/build-electron.js                    # mac arm64 production
  node scripts/build-electron.js mac arm64 dev     # mac arm64 development
  node scripts/build-electron.js win x64           # win x64 production
  node scripts/build-electron.js linux arm64 prod  # linux arm64 production
  node scripts/build-electron.js all x64           # 所有平台 x64 production

支持的平台和架构:
  macOS:   arm64, x64
  Windows: arm64, x64
  Linux:   arm64, x64
`);
}

// 读取环境变量文件
function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const env = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
    
    return env;
  } catch (error) {
    console.warn('Failed to load env file:', error);
    return {};
  }
}

// 获取命令行参数
const args = process.argv.slice(2);

// 检查帮助参数
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const platform = args[0] || 'mac';
const arch = args[1] || 'arm64';
const target = args[2] || 'production';

// 验证参数
const validPlatforms = ['mac', 'win', 'linux', 'all'];
const validArchs = ['arm64', 'x64'];
const validTargets = ['development', 'production', 'dev', 'prod'];

if (!validPlatforms.includes(platform)) {
  console.error(`❌ 无效的平台: ${platform}`);
  console.error(`支持的平台: ${validPlatforms.join(', ')}`);
  process.exit(1);
}

if (!validArchs.includes(arch)) {
  console.error(`❌ 无效的架构: ${arch}`);
  console.error(`支持的架构: ${validArchs.join(', ')}`);
  process.exit(1);
}

if (!validTargets.includes(target)) {
  console.error(`❌ 无效的环境: ${target}`);
  console.error(`支持的环境: ${validTargets.join(', ')}`);
  process.exit(1);
}

// 标准化环境名称
const normalizedTarget = target === 'dev' ? 'development' : target === 'prod' ? 'production' : target;

console.log(`Building Electron app for ${platform} (${arch}) in ${normalizedTarget} mode...`);

// 加载环境变量
const envFile = normalizedTarget === 'development' ? 'env/development.env' : 'env/production.env';
const env = loadEnvFile(envFile);

// 设置环境变量
Object.entries(env).forEach(([key, value]) => {
  process.env[key] = value;
});

// 设置构建特定的环境变量
process.env.BUILD_PLATFORM = platform;
process.env.BUILD_ARCH = arch;
process.env.BUILD_TARGET = normalizedTarget;

// 确保关键环境变量被设置
if (!process.env.API_BASE_URL) {
  process.env.API_BASE_URL = normalizedTarget === 'development' ? 'http://localhost:3000' : 'http://localhost:4000';
}

console.log('Environment variables set for build:', {
  BUILD_TARGET: process.env.BUILD_TARGET,
  API_BASE_URL: process.env.API_BASE_URL,
  BUILD_PLATFORM: process.env.BUILD_PLATFORM,
  BUILD_ARCH: process.env.BUILD_ARCH
});

// 确定构建命令
let buildCommand;
switch (platform) {
  case 'mac':
    buildCommand = arch === 'arm64' ? 'build:mac:arm64' : 'build:mac:x64';
    break;
  case 'win':
    buildCommand = arch === 'arm64' ? 'build:win:arm64' : 'build:win:x64';
    break;
  case 'linux':
    buildCommand = arch === 'arm64' ? 'build:linux:arm64' : 'build:linux:x64';
    break;
  case 'all':
    buildCommand = arch === 'arm64' ? 'build:all:arm64' : 'build:all:x64';
    break;
  default:
    buildCommand = 'build:mac';
}

console.log(`Using build command: ${buildCommand}`);

// 执行构建
const buildProcess = spawn('yarn', [buildCommand], {
  cwd: path.join(__dirname, '../apps/app'),
  stdio: 'inherit',
  env: process.env
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`✅ Electron build completed successfully for ${platform} (${arch})`);
  } else {
    console.error(`❌ Electron build failed with code ${code}`);
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('Build process error:', error);
  process.exit(1);
}); 