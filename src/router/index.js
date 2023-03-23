import { createRouter, createWebHistory } from "vue-router";

import layout from "@/layout/index.vue";

export const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    name: "layout",
    component: layout,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: import("@/views/dashboard/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
