import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuesetupExtend from "vite-plugin-vue-setup-extend"; // 优雅的修改组件name
import AutoImport from "unplugin-auto-import/vite"; // 全局自动引入api
import Components from "unplugin-vue-components/vite"; // 全局自动注册组件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; // elementui组件库
import viteCompression from "vite-plugin-compression"; // 打包压缩文件
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// import { Plugin as importToCDN } from "vite-plugin-cdn-import"; // 公共资源走cnd加载
const libNameReg = /\/node_modules\/([^/]+)\//;

const manualChunks = (id) => {
  if (libNameReg.test(id.toString())) {
    const libName = RegExp.$1;
    switch (libName) {
      case "@vue":
      case "echarts":
      case "three":
      case "three.js":
      case "@popperjs":
      case "element-plus":
      case "@element-plus":
        return libName;
      default:
        return "vendor";
    }
  }
};

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
    viteCompression({
      threshold: 512000, // 超过500k就压缩
      algorithm: "gzip",
      deleteOriginFile: false,
    }),
    // importToCDN({
    //   modules: [
    //     {
    //       name: "vue",
    //       var: "Vue",
    //       path: "https://unpkg.com/vue@3.2.31",
    //     },
    //     {
    //       name: "element-plus",
    //       var: "ElementPlus",
    //       path: "https://unpkg.com/element-plus@2.1.9",
    //       css: "https://unpkg.com/element-plus/dist/index.css",
    //     },
    //     {
    //       name: "vue-demi",
    //       var: "VueDemi",
    //       path: "https://cdn.bootcdn.net/ajax/libs/vue-demi/0.13.11/index.iife.min.js",
    //     },
    //   ],
    // }),
  ],
  build: {
    minify: "terser",
    reportCompressedSize: false,
    rollupOptions: {
      manualChunks,
      // external: ["vue", "element-plus", "vue-demi"],
      // plugins: [
      //   externalGlobals({
      //     vue: "Vue",
      //     "element-plus": "ElementPlus",
      //     // 配置 vue-demi 全局变量
      //     "vue-demi": "VueDemi",
      //   }),
      // ],
    }, // 打包分包
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    // 本地开启https的连接
    // https: {
    //   key: fs.readFileSync(`${__dirname}/localhost-key.pem`),
    //   cert: fs.readFileSync(`${__dirname}/localhost.pem`),
    // },

    // proxy: {
    //   api: {},
    // },
  },
});
