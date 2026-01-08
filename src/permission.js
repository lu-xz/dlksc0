import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";

NProgress.configure({ showSpinner: false });

const whiteList = [
  "/login",
  "/dlksc/index",
  "/dlksc/xq",
  "/dlksc/gdtj",
  "/dlksc/ycsj",
  "/dlksc/abnormal",
  "/dlksc/chart",
  "/dlksc/xsfx",
   "/dlksc/xssjqd",
];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (whiteList.indexOf(to.path) !== -1) {
    // 在免登录白名单，直接进入
    next();
  } else if (getToken()) {
    if (store.getters.roles.length === 0) {
      // 判断当前用户是否已拉取完user_info信息
      store
        .dispatch("GetInfo")
        .then(() => {
          store.dispatch("GenerateRoutes").then((accessRoutes) => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes); // 动态添加可访问路由表
            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
          });
        })
        .catch((err) => {
          store.dispatch("LogOut").then(() => {
            Message.error(err);
            next({ path: "/login" });
          });
        });
    } else {
      next();
    }
  } else {
    next("/login"); // 否则全部重定向到首页
    // next('/dlkcw/index') // 否则全部重定向到首页
  }
});

router.afterEach(() => {
  NProgress.done();
});
