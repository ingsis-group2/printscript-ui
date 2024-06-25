import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode}) => {
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
      'import.meta.env.VITE_AUTH0_AUDIENCE': JSON.stringify(env.AUTH0_AUDIENCE),
      'import.meta.env.VITE_AUTH0_MANAGEMENT_API_TOKEN': JSON.stringify(env.AUTH0_MANAGEMENT_API_TOKEN)
    },
    plugins: [react()],
    preview: {
      host: true,
      port: 5173
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
})