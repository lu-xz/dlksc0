import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
/* Layout */
import DlkscLayout from "@/views/dlksc/Layout";
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: (resolve) => require(["@/views/redirect"], resolve),
      },
    ],
  },
  // 公共路由
  {
    path: "/index",
    component: DlkscLayout,
    redirect: "",
    hidden: true,
    children: [
      {
        path: "/dlksc/index",
        component: (resolve) => require(["@/views/dlksc/index"], resolve),
        name: "Index",
      },
      {
        path: "/dlksc/xq",
        component: (resolve) => require(["@/views/dlksc/xq"], resolve),
        name: "xq",
      },
      {
        path: "/dlksc/ycsj",
        component: (resolve) => require(["@/views/dlksc/ycsj"], resolve),
        name: "ycsj",
      },
      {
        path: "/dlksc/gdtj",
        component: (resolve) => require(["@/views/dlksc/gdtj"], resolve),
        name: "gdtj",
      },
      {
        path: "/dlksc/xsfx",
        component: (resolve) => require(["@/views/dlksc/xsfx"], resolve),
        name: "xsfx",
      },
         {
        path: "/dlksc/xssjqd",
        component: (resolve) => require(["@/views/dlksc/xssjqd"], resolve),
        name: "xssjqd",
      },
    ],
  },
  {
    path: "/login",
    component: (resolve) => require(["@/views/login"], resolve),
    hidden: true,
  },
  {
    path: "/404",
    component: (resolve) => require(["@/views/error/404"], resolve),
    hidden: true,
  },
  {
    path: "/401",
    component: (resolve) => require(["@/views/error/401"], resolve),
    hidden: true,
  },
  {
    path: "/home/index",
    component: Layout,
    redirect: "/home/index",
    hidden: true,
    children: [
      {
        path: "/home/index",
        component: (resolve) => require(["@/views/index"], resolve),
        name: "首页",
        meta: { title: "首页", icon: "dashboard", noCache: true, affix: true },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "profile",
        component: (resolve) =>
          require(["@/views/system/user/profile/index"], resolve),
        name: "Profile",
        meta: { title: "个人中心", icon: "user" },
      },
    ],
  },
  {
    path: "/dict",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "type/data/:dictId(\\d+)",
        component: (resolve) => require(["@/views/system/dict/data"], resolve),
        name: "Data",
        meta: { title: "字典数据", icon: "" },
      },
    ],
  },
  {
    path: "/job",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "log",
        component: (resolve) => require(["@/views/monitor/job/log"], resolve),
        name: "JobLog",
        meta: { title: "调度日志" },
      },
    ],
  },
  {
    path: "/gen",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "edit",
        component: (resolve) =>
          require(["@/views/tool/gen/editTable"], resolve),
        name: "GenEdit",
        meta: { title: "修改生成配置" },
      },
    ],
  },
];

export default new Router({
  mode: JSON.parse(process.env.VUE_APP_IS_STATIC) ? "hash" : "history", // 去掉url中的#
  base: process.env.VUE_APP_BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});
