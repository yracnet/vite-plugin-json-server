import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsonServer from "vite-plugin-json-server";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    jsonServer({
      profile: "./db1",
      delay: 500,
    }),
  ],
})
