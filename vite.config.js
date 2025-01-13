import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'babel',
      include: ['**/*.js', '**/*.jsx'],
      configure: (babelConfig) => {
        babelConfig.plugins.push('@babel/plugin-proposal-export-namespace-from');
        return babelConfig;
      },
    },
  ],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 1800 // Increase the limit to 800 kB
  }
});