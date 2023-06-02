import setting from "./setting";
const Layout = () => import("@/layout/index.vue");

/**
 * 所有的动态路由 要和接口中的数据做对比
 * @export <Array[Object]>
 * @type {alwaysShow:true} 不显示本级目录只显示子级目录
 * @type {hidden:true} 不显示在目录列表
 * @type {keepalive:true} 是否缓存
 * @type {path<String>} *路由路径(所有路由路径必须唯一,动态路由使用此字段判断),
 * @type {name<String>} 路由名称(所有路由名称必须唯一,否则跳转重复路由会404)
 * @type {meta<Object>} 路由携带的自定义参数(title为必须的，路由的汉字名称) 当有alwaysShow字段且为true时meta字段可省略不写
 * @type {component<Component>} *对应的组件
 */
export default [
  {
    path: "/calculator",
    name: "calculator",
    meta: { title: "特色功能", icon: "Platform" },
    // alwaysShow: true,
    component: Layout,
    redirect: "/calculator/cellphone",
    children: [
      {
        path: "cellphone",
        name: "cellphone",
        meta: { title: "计算器", icon: "Cellphone" },
        component: () => import("@/views/calculator/index.vue"),
      },
    ],
  },
  ...setting,
];
