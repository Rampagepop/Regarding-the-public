import router from '@/router'
import CREDIT from "./creditSystem"
// 各个系统
export default { 
  SYSTEM: {
    // 信贷中台
    CREDIT,
  },
  // 路由跳转，sys=SYSTEM.CREDIT
  routePush: (sys, group = "cusMgr", name, params) => {
    if (sys.menu[group] && sys.menu[group][name]) {
      const routeCfg = sys.menu[group][name];
      const routePrefix = (sys.routeRule.startsWith("/") ? "" : "/") + sys.routeRule
      if (routeCfg.path) {
        // 直接传递path
        router.addRoute(routePrefix + routeCfg.path, null, {title: routeCfg.title, ...(routeCfg.meta ? routeCfg.meta : {})});
        router.push({name: routePrefix + routeCfg.path});
        return;
      } else if (routeCfg.name) {
        // 使用name，从对应的动态路由表中找，通常是些复用的路由
        const route = sys.dynamicRoutes[routeCfg.name];
        if (route) {
          router.addRoute(route.name, null, (route.meta ? route.meta : {}), routePrefix + route.path);
          router.push({
            name: route.name,
            params: deepMergeObj(routeCfg.params || {}, params || {})
          });
          return;
        }
      }
    }
    this.$message.warning("未配置路由:" + group + "." + name)
  }
}

// 深度合并
function deepMergeObj(obj1, obj2) {
  Object.keys(obj2).forEach(key =>
    obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ? deepMergeObj(obj1[key], obj2[key]) : obj2[key]
  )
  return obj1
}
