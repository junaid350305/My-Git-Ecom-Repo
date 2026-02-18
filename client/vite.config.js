import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    deps: {
      inline: ['@mui/icons-material']
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/components/Header.jsx',
        'src/components/ProductCard.jsx',
        'src/context/CartContext.jsx'
      ],
      exclude: [
        'src/test/**',
        'src/__tests__/**'
      ]
    }
  }
});