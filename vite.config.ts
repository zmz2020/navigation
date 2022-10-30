import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'



// https://vitejs.dev/config/
const viteConfig =  defineConfig((mode: any) =>{
  const env = loadEnv(mode.mode, process.cwd())
  return {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT as any,
      open: env.VITE_OPEN,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/theme/main.scss";',
        }
      }
    }
  }
 
})

export default viteConfig;