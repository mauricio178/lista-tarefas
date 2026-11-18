import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // O build vai direto para a pasta "static" do Spring Boot,
    // assim a API e o front sobem juntos no mesmo servidor.
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    // Em desenvolvimento (npm run dev), as chamadas /api vão para o Spring Boot
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
