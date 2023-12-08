import router from '@/router'
import CREDIT from "./creditSystem"
// 各个系统
export default {
    SYSTEM: {
        // 信贷中台
        CREDIT,
    },
    // 路由跳转, sys=SYSTEM.CREDIT
    routerPush: (sys, group = "cusMgr", name, params, id) => {
        if (sys.menu[group] && sys.menu[group][name]) {
            const routeCfg = sys.menu[group][name];
            const routePrefix = (sys.routeRule.startWith("/") ? "" : "/") + sys.routeRule
            const curparams = deepMergeObj(routeCfg.params || {}, params || {})
            let currentPath = routePrefix + (routeCfg.isEqueRoute ? routeCfg.path + "/microNoList" : routeCfg.path);
            let sessionMicR = window.sessionStorage.getItem('microRouters');
            if (routeCfg.path) {
                // 直接传递path 这里router里面直接注入了整个子应用,所以不用add如果列表和详情一个页面那么详情添加一个动态路由做判断
                if (routeCfg.isadd) {
                    if (routeCfg.isEqueRoute === false) {
                        router.addRoute(currentPath, null, { title: routeCfg.title, ...(routeCfg.meta ? routeCfg.meta : {})}, routeCfg.id);
                    } else {
                        router.addRoute(currentPath, null, { title: routeCfg.title, ...(routeCfg.meta ? routeCfg.meta : {})} );
                    }
                }
                // 用于存储对应的路由的参数,因为新信管这边传参数比较特别 这里不能通过params传递过去, 在meta中添加params数据没添加上
                window.sessionStorage.setItem(currentPath, JSON.stringify(curparams) === "{}" ? '' :JSON.stringify(curparams))
                if (routeCfg.isEqueRoute === false) {
                    setTimeout(() => {
                        router.push({ name: routeCfg.id, path: currentPath, params:curparams.microParams, query: id});
                    })
                } else {
                    setTimeout(() => {
                        router.push({ name: currentPath, path: currentPath, params:curparams.microParams, query: id});
                    })
                }
                return;
            } else if (routeCfg.name) {
                // 使用name,从对应的动态路由表中找,通常是些复用的路由
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
function  deepMergeObj(obj1,obj2) {
    Object.keys(obj2).forEach(key =>
        obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ? deepMergeObj(obj1[key], obj2[key]) : obj2[key]
    )
    return obj1
}