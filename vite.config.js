import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Local preview and GitHub Pages build. Relative assets work at /pai/.
export default defineConfig({
  base: './',
  plugins: [react()],
});
