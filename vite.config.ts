import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'import.meta.env.VITE_SNIPPET_RUNNER_URL': JSON.stringify(env.SNIPPET_RUNNER_URL),
      'import.meta.env.VITE_SNIPPET_OPERATIONS_URL': JSON.stringify(env.SNIPPET_OPERATIONS_URL),
      'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(env.FRONTEND_URL),
      'import.meta.env.VITE_AUTH0_USERNAME': JSON.stringify(env.AUTH0_USERNAME),
      'import.meta.env.VITE_AUTH0_PASSWORD': JSON.stringify(env.AUTH0_PASSWORD),
      'import.meta.env.VITE_AUTH0_DOMAIN': JSON.stringify(env.AUTH0_DOMAIN),
      'import.meta.env.VITE_AUTH0_CLIENT_ID': JSON.stringify(env.AUTH0_CLIENT_ID),
    },
    plugins: [react()],
    preview: {
      host: true,
      port: 5173,
    }
  };
});