import { defineConfig } from 'vitepress'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/terminal-electron/' : '/',
  title: 'Terminal Electron',
  description: '基于 Electron 的 SSH 终端应用',
  lang: 'zh-CN',
  ignoreDeadLinks:true,
  themeConfig: {
    siteTitle: 'Terminal Electron',
    nav: [
      { text: '首页', link: '/' },
      { text: '下载', link: '/guide/download' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '部署', link: '/deployment/' },
      { text: '开发', link: '/development/' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '快速开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '下载', link: '/guide/download' },
            { text: '安装', link: '/guide/installation' },
            { text: '配置', link: '/guide/configuration' },
            { text: '使用', link: '/guide/usage' }
          ]
        },
        {
          text: '功能特性',
          items: [
            { text: 'SSH 连接', link: '/guide/features/ssh' },
            { text: '端口转发', link: '/guide/features/port-forwarding' },
            { text: '密钥管理', link: '/guide/features/keys' },
            { text: '团队协作', link: '/guide/features/teams' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: '概述', link: '/api/' },
            { text: '认证', link: '/api/auth' },
            { text: '服务器管理', link: '/api/servers' },
            { text: 'SSH密钥管理', link: '/api/keys' },
            { text: '端口转发管理', link: '/api/port-forwards' },
            { text: '团队管理', link: '/api/teams' },
            { text: '数据管理', link: '/api/data' }
          ]
        }
      ],
      '/deployment/': [
        {
          text: '部署指南',
          items: [
            { text: '概述', link: '/deployment/' },
            { text: 'Docker 部署', link: '/deployment/docker' },
            { text: '环境变量', link: '/deployment/environment' },
            { text: '构建配置', link: '/deployment/build' }
          ]
        }
      ],
      '/development/': [
        {
          text: '开发指南',
          items: [
            { text: '概述', link: '/development/' },
            { text: '项目结构', link: '/development/structure' },
            { text: '技术栈', link: '/development/tech-stack' },
            { text: '开发环境', link: '/development/environment' },
            { text: '构建流程', link: '/development/build' },
            { text: '贡献指南', link: '/development/contributing' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shzjj82/terminal-electron' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Terminal Electron'
    }
  }
}) 