import { defineStore } from "pinia";
const { VITE_BASE_TOKEN_NAME } = import.meta.env;
import { getStorage, setStorage, removeStorage } from "@/utils/storage";
import { login, logout, info } from "@/api";
import { menulist } from "@/api/setting";
import router, { routes } from "@/router";
import admin from "@/router/admin";

const PINIA_USER = defineStore("PINIA_USER", {
  state: () => ({
    get token() {
      return getStorage(VITE_BASE_TOKEN_NAME);
    },
    userInfo: {}, // 用户信息
    menuRotuer: [], // 菜单路由
    searchMenuRotuer: [], // 需要搜索的菜单路由
    keepalive: ["404"], // 缓存的路由标识
  }),
  actions: {
    async login(data = {}) {
      return await login(data)
        .then((res) => {
          setStorage(VITE_BASE_TOKEN_NAME, res.data.token);
          return Promise.resolve("登录成功");
        })
        .catch((err) => Promise.reject(err));
    },
    async logout() {
      return await logout()
        .then((res) => {
          this.token = "";
          this.userInfo = {};
          this.keepalive = ["404"];
          this.searchMenuRotuer = [];
          this.menuRotuer = [];
          removeStorage(VITE_BASE_TOKEN_NAME);
          return Promise.resolve(res);
        })
        .catch((err) => Promise.reject(err));
    },
    async info() {
      await info().then((res) => {
        this.userInfo = res.data;
      });
    },
    async menulist() {
      if (this.userInfo.name == "admin") {
        this.addRoute(admin);
        this.menuRotuer = this.filterRoute(routes.concat(admin));
        this.searchMenuRotuer = this.searchMuen(this.menuRotuer);
        return;
      }
      return await menulist().then((res) => {
        const arr = this.concat(res.data, admin);
        this.addRoute(arr);
        this.menuRotuer = this.filterRoute(routes.concat(arr));
        this.searchMenuRotuer = this.searchMuen(this.menuRotuer);
      });
    },
    // 将后端返回的字符串转化为真实的前端动态路由
    concat(req, admin) {
      let arr = [];
      req.forEach((item, i) => {
        admin.forEach((items, j) => {
          if (item.path === items.path) {
            const obj = {
              path: items.path,
              name: items.name,
              meta: { ...items.meta },
              component: items.component,
            };
            items.redirect && (obj.redirect = items.redirect);
            items.hidden && (obj.hidden = items.hidden);
            items.keepalive && (obj.keepalive = items.keepalive);
            items.alwaysShow && (obj.alwaysShow = items.alwaysShow);
            obj.meta.btn && delete obj.meta.btn;
            if (item.meta?.btn) {
              item.meta.btn.forEach((btn) => {
                obj.meta[btn.path] = true;
              });
            }
            if (items.children?.length) {
              obj.children = this.concat(item.children, items.children);
            }
            arr.push(obj);
          }
        });
      });
      return arr;
    },
    // 过滤alwaysShow:true和 hidden :true
    filterRoute(arr, path = "") {
      const menuRotuer = [];
      arr.forEach((item) => {
        const items = { ...item };
        if (!items.hidden) {
          let paths = router.resolve(items.path).path;
          if (items.children?.length || items.alwaysShow) {
            if (items.alwaysShow) {
              menuRotuer.push(...this.filterRoute(items.children, paths));
            } else {
              items.children = this.filterRoute(items.children, paths);
              menuRotuer.push(items);
            }
          } else {
            if (!items.path.startsWith("http")) {
              items.path = (path == "/" ? "" : path) + paths;
            }
            if (items.keepalive) {
              this.keepalive.push(items.name);
            }
            menuRotuer.push(items);
          }
        }
      });
      return menuRotuer;
    },
    addRoute(route) {
      route.forEach((item) => {
        router.addRoute(item);
      });
      router.addRoute({ path: "/:catchAll(.*)", redirect: "/404" });
    },
    searchMuen(menulist, name = null) {
      let arr = [];
      menulist.forEach((item) => {
        let value = name ? name + ">" + item.meta.title : item.meta.title;
        if (!item.children?.length) {
          arr.push({ path: item.path, value });
        } else {
          const rr = this.searchMuen(item.children, value);
          arr = arr.concat(rr);
        }
      });
      return arr;
    },
  },
});

export default PINIA_USER;
