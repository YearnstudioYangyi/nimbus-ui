import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  const isPlayground = mode === "playground" || (command === "serve" && mode !== "lib");

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    },
    build: isPlayground
      ? {
          outDir: "dist-playground"
        }
      : {
          outDir: "dist",
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "NimbusUI",
            fileName: (format) => `nimbus-ui.${format === "es" ? "js" : "umd.cjs"}`
          },
          rollupOptions: {
            external: ["vue"],
            output: {
              exports: "named",
              globals: {
                vue: "Vue"
              },
              assetFileNames: (assetInfo) => {
                if (assetInfo.names?.some((n) => n.endsWith(".css"))) return "style.css";
                return assetInfo.names?.[0] || "";
              }
            }
          }
        }
  };
});
