export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://snippet-operations:8080";
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
export const AUTH0_USERNAME = import.meta.env.VITE_AUTH0_USERNAME as string
export const AUTH0_PASSWORD = import.meta.env.VITE_AUTH0_PASSWORD as string
export const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || "";
export const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || "";
export const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || "";

