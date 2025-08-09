# 下载 Terminal Electron

根据您的设备信息，我们为您推荐最适合的版本。

## 快速下载

<div class="quick-download-section">
  <div class="download-card">
    <div class="platform-info">
      <div class="platform-icon">
        <img id="platform-icon" src="/images/windows.png" alt="检测中..." width="48" height="48" />
      </div>
      <div class="platform-details">
        <h3 id="platform-name">检测中...</h3>
        <p id="platform-desc">正在检测您的设备...</p>
      </div>
    </div>
    <div class="download-actions">
      <div class="download-section">
        <div class="architecture-selector">
          <label class="arch-option">
            <input type="radio" name="architecture" value="x64" checked>
            <span class="arch-label">x64</span>
          </label>
          <label class="arch-option">
            <input type="radio" name="architecture" value="arm64">
            <span class="arch-label">ARM64</span>
          </label>
        </div>
        <a href="#" class="primary-download-btn">
          立即下载
        </a>
      </div>
    </div>
  </div>
</div>

## 所有可用版本

### Windows

#### Windows x64
- **文件大小**: ~120MB
- **系统要求**: Windows 10 或更高版本
- **下载链接**: 
  - [GitHub Releases](https://github.com/shzjj82/terminal-electron/releases/latest/download/Terminal.Electron.Setup-x64.exe)

#### Windows ARM64
- **文件大小**: ~110MB
- **系统要求**: Windows 11 ARM64
- **下载链接**:
  - [GitHub Releases](https://github.com/shzjj82/terminal-electron/releases/latest/download/Terminal.Electron.Setup-arm64.exe)

### macOS

#### macOS Intel (x64)
- **文件大小**: ~130MB
- **系统要求**: macOS 10.15 (Catalina) 或更高版本
- **下载链接**:
  - [GitHub Releases](https://github.com/shzjj82/terminal-electron/releases/latest/download/Terminal.Electron-x64.dmg)

#### macOS Apple Silicon (ARM64)
- **文件大小**: ~125MB
- **系统要求**: macOS 11.0 (Big Sur) 或更高版本
- **下载链接**:
  - [GitHub Releases](https://github.com/shzjj82/terminal-electron/releases/latest/download/Terminal.Electron-arm64.dmg)


## 安装说明

### Windows 安装

1. **下载安装程序**
   - 下载对应的 `.exe` 文件
   - 文件大小约 120MB

2. **运行安装程序**
   - 双击下载的 `.exe` 文件
   - 按照安装向导的提示进行安装
   - 建议使用默认安装路径

3. **启动应用**
   - 安装完成后，从开始菜单启动
   - 或在桌面找到应用图标

### macOS 安装

1. **下载 DMG 文件**
   - 下载对应的 `.dmg` 文件
   - 文件大小约 125-150MB

2. **安装应用**
   - 双击 `.dmg` 文件打开
   - 将应用拖拽到 Applications 文件夹
   - 或双击应用图标直接运行

3. **首次运行**
   - 可能需要在"系统偏好设置 > 安全性与隐私"中允许运行
   - 右键点击应用，选择"打开"

### Linux 安装

#### AppImage 方式（推荐）
```bash
# 下载 AppImage 文件
wget https://github.com/shzjj82/terminal-electron/releases/latest/download/Terminal-Electron-1.0.0-x64.AppImage

# 添加执行权限
chmod +x Terminal-Electron-1.0.0-x64.AppImage

# 运行应用
./Terminal-Electron-1.0.0-x64.AppImage
```

#### Debian/Ubuntu 安装
```bash
# 下载 deb 包
wget https://github.com/shzjj82/terminal-electron/releases/latest/download/terminal-electron_1.0.0_amd64.deb

# 安装
sudo dpkg -i terminal-electron_1.0.0_amd64.deb

# 修复依赖（如果需要）
sudo apt-get install -f
```

#### CentOS/RHEL 安装
```bash
# 下载 rpm 包
wget https://github.com/shzjj82/terminal-electron/releases/latest/download/terminal-electron-1.0.0.x86_64.rpm

# 安装
sudo rpm -i terminal-electron-1.0.0.x86_64.rpm
```

## 系统要求

### 最低要求
- **操作系统**: Windows 10 / macOS 10.15 / Ubuntu 18.04
- **处理器**: 双核 2.0GHz
- **内存**: 4GB RAM
- **存储**: 2GB 可用磁盘空间
- **网络**: 稳定的互联网连接

### 推荐配置
- **操作系统**: Windows 11 / macOS 12.0 / Ubuntu 20.04
- **处理器**: 四核 2.5GHz 或更高
- **内存**: 8GB RAM
- **存储**: 5GB 可用磁盘空间
- **网络**: 高速互联网连接

## 更新说明

### 自动更新
- Terminal Electron 支持自动更新
- 新版本发布时会自动提示
- 可选择立即更新或稍后更新

### 手动更新
1. 访问 [GitHub Releases](https://github.com/shzjj82/terminal-electron/releases)
2. 下载最新版本
3. 按照安装说明进行更新

## 故障排除

### 下载问题
- **下载速度慢**: 尝试使用镜像站点
- **下载失败**: 检查网络连接，重试下载
- **文件损坏**: 重新下载文件

### 安装问题
- **权限不足**: 使用管理员权限运行安装程序
- **依赖缺失**: 安装必要的系统依赖
- **杀毒软件拦截**: 将应用添加到白名单

### 运行问题
- **启动失败**: 检查系统要求，查看错误日志
- **性能问题**: 关闭其他应用，检查系统资源
- **连接问题**: 检查网络设置，防火墙配置

## 支持渠道

### 获取帮助
- **文档**: 查看 [使用指南](./usage.md) 和 [配置指南](./configuration.md)
- **GitHub Issues**: [报告问题](https://github.com/shzjj82/terminal-electron/issues)
- **Discord**: [加入社区](https://discord.gg/terminal-electron)
- **邮箱**: support@terminal-electron.com

### 反馈建议
- **功能建议**: 在 GitHub Discussions 中提出
- **Bug 报告**: 在 GitHub Issues 中报告
- **用户体验**: 通过应用内反馈功能

---

<script>
// 简化的设备检测脚本
(function() {
  'use strict';
  
  // SSR 守卫：在构建（无 window/document）时直接跳过
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  const GITHUB_OWNER = 'shzjj82';
  const GITHUB_REPO = 'terminal-electron';
  const RELEASE_TAG = (window.__RELEASE_TAG__ || '').trim();

  // 若有 tag，则可直接拼出直链（与产物命名一致，无版本号）
  function buildDirectUrl(os, arch){
    if (!RELEASE_TAG) return '';
    if (os === 'windows') {
      return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/Terminal.Electron.Setup-${arch}.exe`;
    }
    if (os === 'macos') {
      return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/Terminal.Electron-${arch}.dmg`;
    }
    return '';
  }
  
  async function fetchLatestAssets() {
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });
      if (!res.ok) throw new Error('Failed to fetch releases');
      const data = await res.json();
      return Array.isArray(data.assets) ? data.assets : [];
    } catch (e) {
      return [];
    }
  }
  
  // 简单的设备检测
  function detectDevice() {
    const userAgent = navigator.userAgent;
    
    let os = 'windows';
    let osName = 'Windows';
    let iconSrc = '/images/windows.png';
    
    if (userAgent.includes('Mac')) {
      os = 'macos';
      osName = 'macOS';
      iconSrc = '/images/mac.png';
    } else if (userAgent.includes('Linux')) {
      os = 'linux';
      osName = 'Linux';
      iconSrc = '/images/linux.png';
    }
    
    return { os, osName, iconSrc };
  }
  
  function getSelectedArchitecture() {
    const selectedArch = document.querySelector('input[name="architecture"]:checked');
    return selectedArch ? selectedArch.value : 'x64';
  }

  function matchAssetFor(os, arch, assets) {
    const isArm = arch === 'arm64';
    const armHints = ['arm64', 'aarch64'];
    const x64Hints = ['x64', 'amd64'];
    const includesAny = (name, arr) => arr.some(k => name.toLowerCase().includes(k));

    if (os === 'windows') {
      const exeAssets = assets.filter(a => a.name.toLowerCase().endsWith('.exe'));
      const filtered = exeAssets.filter(a => isArm ? includesAny(a.name, armHints) : includesAny(a.name, x64Hints) || !includesAny(a.name, armHints));
      const setup = filtered.find(a => a.name.toLowerCase().includes('setup')) || filtered[0];
      return setup;
    }

    if (os === 'macos') {
      const dmgAssets = assets.filter(a => a.name.toLowerCase().endsWith('.dmg'));
      const filtered = dmgAssets.filter(a => isArm ? includesAny(a.name, armHints) : includesAny(a.name, x64Hints) || !includesAny(a.name, armHints));
      return filtered[0] || dmgAssets[0];
    }

    // Linux 下载项已移除

    return null;
  }
  
  async function resolveDownloadInfo(os, arch) {
    // 优先使用 tag 直链
    const direct = buildDirectUrl(os, arch);
    if (direct) return { url: direct, size: '' };

    if (!window.latestReleaseAssets) {
      window.latestReleaseAssets = await fetchLatestAssets();
    }
    const asset = matchAssetFor(os, arch, window.latestReleaseAssets);
    if (asset) {
      return { url: asset.browser_download_url, size: asset.size ? `${(asset.size/1024/1024).toFixed(0)}MB` : '—' };
    }
    return { url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`, size: '—' };
  }
  
  async function updateDownloadLink() {
    const deviceInfo = window.currentDeviceInfo;
    if (!deviceInfo) return;
    const arch = getSelectedArchitecture();
    const downloadInfo = await resolveDownloadInfo(deviceInfo.os, arch);
    const downloadLink = document.querySelector('.primary-download-btn');
    const fileSizeEl = document.getElementById('file-size');
    if (downloadLink) downloadLink.href = downloadInfo.url;
    if (fileSizeEl && downloadInfo.size) fileSizeEl.textContent = `文件大小：约 ${downloadInfo.size}`;
  }
  
  function showLoading() {
    const platformNameEl = document.getElementById('platform-name');
    const platformDescEl = document.getElementById('platform-desc');
    if (platformNameEl) {
      platformNameEl.textContent = '检测中...';
      platformNameEl.classList.add('loading');
    }
    if (platformDescEl) {
      platformDescEl.textContent = '正在检测您的设备...';
      platformDescEl.classList.add('loading');
    }
  }

  function updateUI(deviceInfo) {
    const platformIconEl = document.getElementById('platform-icon');
    const platformNameEl = document.getElementById('platform-name');
    const platformDescEl = document.getElementById('platform-desc');
    if (platformNameEl) platformNameEl.classList.remove('loading');
    if (platformDescEl) platformDescEl.classList.remove('loading');
    if (platformIconEl) {
      platformIconEl.src = deviceInfo.iconSrc;
      platformIconEl.alt = deviceInfo.osName;
    }
    if (platformNameEl) platformNameEl.textContent = deviceInfo.osName;
    if (platformDescEl) platformDescEl.textContent = `选择适合您设备的架构版本`;
    updateDownloadLink();
  }
  
  function init() {
    showLoading();
    setTimeout(async () => {
      const deviceInfo = detectDevice();
      window.currentDeviceInfo = deviceInfo;
      updateUI(deviceInfo);
    }, 300);
    document.addEventListener('change', function(e) {
      if (e.target && e.target.name === 'architecture') {
        updateDownloadLink();
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

<style>
/* 快速下载区域样式 */
.quick-download-section {
  margin: 30px 0;
}

.download-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  display:flex;
  justify-content:space-between;
}

.download-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.platform-info {
  display: flex;
  /* align-items: center; */
  gap: 20px;
  margin-bottom: 20px;
}

.platform-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.platform-details h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
}

.platform-details p {
  margin: 0 0 4px 0;
  color: #6c757d;
  font-size: 14px;
}

.download-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.download-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.architecture-selector {
  display: flex;
  gap: 15px;
}

.arch-option {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.arch-option:hover {
  background-color: #f8f9fa;
}

.arch-option input[type="radio"] {
  transform: scale(0.8);
  margin: 0;
}

.arch-option .arch-label {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.arch-option input[type="radio"]:checked + .arch-label {
  color: #667eea;
  font-weight: 600;
}

.download-icon {
  width: 16px;
  height: 16px;
}

/* 加载动画 */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.loading {
  animation: pulse 1.5s ease-in-out infinite;
}

.file-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.file-info span {
  padding: 5px 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .platform-info {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .download-actions {
    justify-content: center;
  }
  
  .download-section {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .architecture-selector {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }
  
  .file-info {
    justify-content: center;
  }
}
</style> 