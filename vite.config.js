import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Serve files from the `src` folder during dev/build so Vite finds `src/index.html`.
  root: "src",
  build: { outDir: "dist" }
});