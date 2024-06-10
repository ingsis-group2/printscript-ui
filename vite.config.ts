import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.VITE_FRONTEND_URL': JSON.stringify(env.VITE_FRONTEND_URL),
      'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL),
      'process.env.VITE_REACT_APP_AUTH0_DOMAIN': JSON.stringify(env.VITE_REACT_APP_AUTH0_DOMAIN),
      'process.env.VITE_REACT_APP_AUTH0_CLIENT_ID': JSON.stringify(env.VITE_REACT_APP_AUTH0_CLIENT_ID)
    },
    plugins: [react()],
    preview: {
      host: true,
      port: 5173,
    }
  }
})
