import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        // sass 1.79+ 官方弃用项静默：uni-ui 等第三方库内部仍用 @import，无法修改依赖源码
        silenceDeprecations: ["import", "legacy-js-api", "global-builtin", "color-functions"],
      },
    },
  },
  build: {
    // 生产打包（npm run build）时压缩并移除调试代码
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 移除所有 console.* 语句
        drop_debugger: true, // 移除 debugger 语句
      },
    },
  },
});
