import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  build: {
    root: 'src/',
    outDir: 'build',
    assetsDir: 'src',
    publicDir: './public/',
    base: './',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2024,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: "src/FWDEMV.js",
      }
    },
  },
  server: {
    host: 'bs-local.com',
    port: 5173,
    https: true,
  },
  plugins: [glsl(), mkcert()],
});