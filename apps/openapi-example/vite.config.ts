import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import version from "vite-plugin-package-version";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    svgr(),
    version(),
    tsconfigPaths(),
  ],
  build: {
    outDir: path.join(__dirname, "build"),
  },
});
