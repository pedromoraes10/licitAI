import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/pncp': {
        target: 'https://pncp.gov.br/api/consulta/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pncp/, ''),
        secure: false,
      },
      '/api/cnpj': {
        target: 'https://brasilapi.com.br/api/cnpj/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cnpj/, ''),
        secure: false,
      }
    }

  }
})

