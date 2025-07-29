import { defineConfig } from "vite";
import path from 'path';
import vue from "@vitejs/plugin-vue";
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from "@primevue/auto-import-resolver";

export default defineConfig({
  plugins: [
    vue(),
    Components({
        resolvers:[
            PrimeVueResolver()
        ]
    }),
    
  ],
  resolve:{
    alias: {
        '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 8080, 
    proxy: {
        '/api': {
        // target: 'https://cmsapi.fairgame888.com',
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path)=> path.replace(/^\/api/,''), 
        secure: false,
      },
    }
  },
});
