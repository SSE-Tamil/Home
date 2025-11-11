import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  base: '/Home/',  // 👈 EXACTLY this (case-sensitive, matches repo name)
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',  // 👈 must be 'dist'
  },
  server: {
    port: 3000,
    open: true,
  },
});
