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
        resume: resolve(__dirname, "resume/index.html"),
        "resume-legacy": resolve(__dirname, "resume.html"),
        "resume-en-legacy": resolve(__dirname, "resume-en.html"),
      },
    },
  },
});
