import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

import Layout from "@/layout/index.vue";

/**
 * 这里的都是静态路由所有人都可以访问
 * @export <Array[Object]>
 * @type {alwaysShow:true} 不显示本级目录只显示子级目录
 * @type {hidden:true} 不显示在目录列表
 * @type {keepalive:true} 是否缓存
 */
export const routes = [
  {
    path: "/login",
    name: "login",
    hidden: true,
    meta: { title: "登录" },
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    component: Layout,
    alwaysShow: true,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        meta: { title: "首页统计", icon: "Wallet" },
        component: () => import("@/views/dashboard/index.vue"),
      },
      {
        path: "emoji",
        name: "emoji",
        meta: { title: "emoji表情和icon组件", icon: "SetUp" },
        component: () => import("@/views/emoji/index.vue"),
      },
    ],
  },
  {
    path: "/404",
    name: "404",
    hidden: true,
    meta: { title: "404" },
    component: () => import("@/views/setting/404/index.vue"),
  },
  // {
  //   path: "/link",
  //   component: Layout,
  //   alwaysShow: true,
  //   meta: { title: "外部链接", icon: "Wallet" },
  //   children: [
  //     {
  //       path: "https://www.baidu.com",
  //       meta: { title: "外连百度的", icon: "Wallet" },
  //     },
  //   ],
  // },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
