import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Config from "../shared/config.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(Config.urls.client.split(":").pop() || "8080"),
  },
});
