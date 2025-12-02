import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Esto asegura que los assets carguen bien sea cual sea la ruta en WordPress
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});