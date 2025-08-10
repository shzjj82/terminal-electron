import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      define: {
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || process.env.NODE_ENV),
        'process.env.BUILD_TARGET': JSON.stringify(env.BUILD_TARGET || process.env.BUILD_TARGET),
        'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || process.env.API_BASE_URL),
        'process.env.API_TIMEOUT': JSON.stringify(env.API_TIMEOUT || process.env.API_TIMEOUT)
      }
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      define: {
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || process.env.NODE_ENV),
        'process.env.BUILD_TARGET': JSON.stringify(env.BUILD_TARGET || process.env.BUILD_TARGET),
        'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || process.env.API_BASE_URL),
        'process.env.API_TIMEOUT': JSON.stringify(env.API_TIMEOUT || process.env.API_TIMEOUT)
      }
    },
    renderer: {
      resolve: {
        alias: {
          '@': resolve('src/renderer/src'),
          '@renderer': resolve('src/renderer/src')
        }
      },
      plugins: [react(), tailwindcss()],
      server: {
        host: '0.0.0.0',
        port: 5173
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || process.env.NODE_ENV),
        'process.env.BUILD_TARGET': JSON.stringify(env.BUILD_TARGET || process.env.BUILD_TARGET),
        'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || process.env.API_BASE_URL),
        'process.env.API_TIMEOUT': JSON.stringify(env.API_TIMEOUT || process.env.API_TIMEOUT)
      }
    }
  }
})
