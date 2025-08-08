import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BUILD_TARGET': JSON.stringify(process.env.BUILD_TARGET),
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
      'process.env.API_TIMEOUT': JSON.stringify(process.env.API_TIMEOUT)
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BUILD_TARGET': JSON.stringify(process.env.BUILD_TARGET),
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
      'process.env.API_TIMEOUT': JSON.stringify(process.env.API_TIMEOUT)
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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BUILD_TARGET': JSON.stringify(process.env.BUILD_TARGET),
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
      'process.env.API_TIMEOUT': JSON.stringify(process.env.API_TIMEOUT)
    }
  }
})
