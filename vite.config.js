import { defineConfig } from "vite";

// export default defineConfig({
//   // Tailwind is loaded via PostCSS in postcss.config.js

// });

export default defineConfig({
  base: "/",

  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        case: "case.html",
      },
    },
  },
});
