import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from '@vercel/analytics/plugin';

export default defineConfig({
  plugins: [react(), vercel()],
});