import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        repair: resolve(__dirname, "repair-case.html"),
        beauty: resolve(__dirname, "beauty-case.html"),
        website: resolve(__dirname, "website-development.html"),
      },
    },
  },
});
