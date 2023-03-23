import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuesetupExtend from "vite-plugin-vue-setup-extend";
import AutoImport from "unplugin-auto-import/vite"; // 全局自动引入api
import Components from "unplugin-vue-components/vite"; // 全局自动注册组件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; // elementui组件库

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default defineConfig({
  plugins: [
    vue(),
    vuesetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ["vue", "vue-router", "pinia"],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
      symbolId: "my-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
