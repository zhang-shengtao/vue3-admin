import router from "@/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });
import PINIA_USER from "@/stores/user";

// 路由白名单
const whiteList = ["/login", "/404"];

router.beforeEach(async (to, from, next) => {
  const { token, userInfo, info, menulist } = await PINIA_USER();
  NProgress.start();
  document.title = to.meta?.title;
  if (token) {
    if (to.path === "/login") {
      next("/");
      NProgress.done();
    } else {
      if (userInfo.name) {
        next();
        NProgress.done();
      } else {
        try {
          await info(); // 用户信息
          await menulist(); // 动态路由
          next({ ...to, replace: true });
        } catch (err) {
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
