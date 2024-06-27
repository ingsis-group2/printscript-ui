import { defineConfig } from "cypress";
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents(_, config) {
      // Load environment variables from .env file
      config.env = {
        BACKEND_URL: process.env.BACKEND_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        AUTH0_USERNAME: process.env.AUTH0_USERNAME,
        AUTH0_PASSWORD: process.env.AUTH0_PASSWORD,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
      };
      return config;
    },
    experimentalStudio: true,
    baseUrl: process.env.FRONTEND_URL,  // use process.env instead of VITE_ prefix
  },
});
