---
layout: home
hero:
  name: Terminal Electron
  text: 基于 Electron 的现代化 SSH 终端应用
  tagline: 安全、高效、易用的 SSH 终端解决方案
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: 查看源码
      link: https://github.com/your-username/terminal-electron

features:
  - icon: 🔐
    title: 安全连接
    details: 支持多种认证方式，包括密码、SSH 密钥等，确保连接安全可靠
  - icon: 🚀
    title: 高性能
    details: 基于 Electron 和 xterm.js，提供流畅的终端体验
  - icon: 🔄
    title: 端口转发
    details: 支持本地和远程端口转发，满足各种网络需求
  - icon: 👥
    title: 团队协作
    details: 支持团队管理，共享服务器配置和密钥
  - icon: 📱
    title: 跨平台
    details: 支持 macOS、Windows、Linux 等多个平台
  - icon: 🛠️
    title: 易于部署
    details: 提供 Docker 部署方案，快速搭建生产环境
---

## 技术栈

<div class="tech-stack">
  <div class="tech-item">
    <h3>前端</h3>
    <ul>
      <li>Electron - 跨平台桌面应用框架</li>
      <li>React - 用户界面库</li>
      <li>TypeScript - 类型安全的 JavaScript</li>
      <li>Tailwind CSS - 实用优先的 CSS 框架</li>
      <li>xterm.js - 终端模拟器</li>
    </ul>
  </div>
  
  <div class="tech-item">
    <h3>后端</h3>
    <ul>
      <li>NestJS - Node.js 框架</li>
      <li>TypeORM - 数据库 ORM</li>
      <li>SQLite - 轻量级数据库</li>
      <li>JWT - 身份认证</li>
    </ul>
  </div>
  
  <div class="tech-item">
    <h3>工具链</h3>
    <ul>
      <li>Yarn - 包管理器</li>
      <li>Turborepo - 构建系统</li>
      <li>Docker - 容器化部署</li>
      <li>Vite - 构建工具</li>
    </ul>
  </div>
</div>

<style>
.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.tech-item {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.tech-item h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-brand);
}

.tech-item ul {
  margin: 0;
  padding-left: 1.5rem;
}

.tech-item li {
  margin: 0.5rem 0;
}
</style> 