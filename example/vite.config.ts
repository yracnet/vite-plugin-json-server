import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { pluginJsonServer } from "../src/index";
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(),
    pluginJsonServer({
      profile: "./db1",
    }),
  ],
});
