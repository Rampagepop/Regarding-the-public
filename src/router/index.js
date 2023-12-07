/**
 * @created by pan
 * @updated by helin3 2019-04-06
 * @description 路由配置
 * 注：使用router.addRoutes的代码，请注意通过resetRouter恢复初始状态（去除通配符路由）
 */
import Vue from 'vue'
import Router from 'vue-router'
import { isdebug } from '@/config/index'
import NestedMenu from '@/components/layout/NestedMenu'
import { isString, isObject, extend, logger, clone, storage } from '@/utils'
import { resolveQueryParameters } from '@/utils/util'
import { MENU_STOREOG_KEY, ROUTER_STORE_KEY, DYNAMIC_ROUTES } from '@/config/constant/app.data.common'
import { loadView } from '@/utils/loadView'
import store from '@/store'
// 静态（不做权限控制）路由
import constantRoutes from './constant-routes'

Vue.use(Router)
/**
 * 创建路由，并赋值静态（不做权限控制）路由
 */
const createRouter = () => new Router({
  // mode: 'history', // 需要后台服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
//处理路由名字
function handleRouteName(path) {
  const REG = /([^/]+)$/;
  const RANDOM = parseInt((Math.random() * 9 + 1) * 100000);
  return path.substring(path.lastIndexOf("/") + 1, path.length) + '-' + RANDOM;
}

//处理默认meta
function setMeta(rname) {
  return {
    title: rname,
    hidden: true,
    showTab: false,
    noCache: false,
    data: null
  }
}
// 初始化路由
const router = createRouter()
// 添加通配符路由（跳转404页面）
router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
/**
 * 自定义方法添加动态路由
 * @param {Object|String} route 路由对象或路由路径
 * @param {String} title 路由参数或路由标题
 * @param {Object} meta 路由参数
 * @param {String} path 路由名称，当route与当前页路径不同时存在
 * @description 注，动态添加得路由刷新时会跳转到404
 */
Router.prototype.addRoute = function (route, title, meta, path) {
  if (isString(route)) {
    // 判断是否微应用，微应用无需设置路由component
    const mMico = window.MICRO ? window.MICRO.getMICROSubRoute(path || route) : false;
    const paramRouter = {
      path: path || route,
      name: route || path,
      hidden: true,
      meta: extend(isString(title) ? {
        title: title,
        activeMenu: meta && meta.activeMenu,
        params: meta && meta.params,
        subPath: meta && meta.path,
        ...meta
      } : meta, {}),
      commentsRouter: route,
      // #TODO fixed: Critical dependency: the request of a dependency is an expression
      // #TODO fixed: Cannot read property 'range' of null
      // component: resolve => require([`@/views/${route}`], resolve) // () => import(`@/views/${route}`)
      // component: () => import('@/views/' + route)
      component: mMico ? null : loadView(route)
      // component: () => Promise.resolve(require('@/views/' + route).default)
    }
    // 将动态路由添加到session中
    let dynamicRoutesParms = JSON.parse(storage.get(DYNAMIC_ROUTES));
    const sessionParm = clone(paramRouter, {});
    sessionParm.component = paramRouter.component == null ? null : {}
    // sessionParm.component = {}
    //判断是否是首次加载
    if (dynamicRoutesParms && dynamicRoutesParms.dRoute.length > 0) {
      if (JSON.stringify(dynamicRoutesParms.dRoute).indexOf(JSON.stringify(sessionParm)) === -1) {
        dynamicRoutesParms.dRoute.push(sessionParm)
        storage.set(DYNAMIC_ROUTES, JSON.stringify(dynamicRoutesParms))
      }
    } else {
      dynamicRoutesParms = {};
      storage.set(DYNAMIC_ROUTES, JSON.stringify({ dRoute: [sessionParm] }))
    }
    // router.options.routes = router.options.routes.concat([paramRouter]);
    router.addRoutes([paramRouter])
  } else if (isObject(route)) {
    route['name'] && (route['name'] = route.path)
    // router.options.routes = router.options.routes.concat([route]);
    router.addRoutes([route])
  }
  isdebug && logger.warn('【router/index addRoute】', route)
}

const _routeReplace = Router.prototype.replace
/**
 * 注入路由replace信息
 * @param {Object} location 路由对象
 * @param {Function} onComplete 替换完成时回调
 * @param {Function} onAbort 终止时回调
*/
Router.prototype.replace = function (location, onComplete, onAbort) {
  if (location.params && !location.rollback) {
    location.params['_routeType'] = 'replace' // 不添加页签
    // location.params['_form'] = this.history.current
    location.params['_form'] = { name: this.history.current.name, params: this.history.current.params }
    window.sessionStorage.setItem('routeType', 'replace');
  }
  if (location.query && !location.rollback) {
    location.query['_routeType'] = 'replace'; // 不添加页签
  }
  //加catch解决同一个菜单多次点击报错问题 NavigationDuplicated
  _routeReplace.call(this, location, onComplete, onAbort).catch(err => err)
}
/**
 * 回退
 * @param {Object} location 路由对象
 * @param {Function} onComplete 替换完成时回调
 * @param {Function} onAbort 终止时回调
*/
Router.prototype.rollback = function (location, onComplete, onAbort) {
  // #TODO 注意此处多参数处理及query参数处理
  this.replace({ name: location.name, params: location.params, rollback: true })
}

/****
 * 打开无tab页签页面,支持路由回退
 * @param {Object} location 路由对象
 *
 */
const _routePush = Router.prototype.push
Router.prototype.routePush = function (location, onResolve, onReject) {
  // vue-router如果提供了 path，params 会被忽略，故如果传path，改query参数
  location.params = location.params || {};
  location.query = location.query || {};
  location.meta = location.meta || {};
  location.meta.params = location.params;
  if (location.name) {
    location.params['_routeType'] = 'push' // 不添加页签
    // window.sessionStorage.setItem('routeType', 'push');
  } else if (location.path) {
    location.query['_routeType'] = 'push' // 不添加页签
    // location.query['_form'] = this.history.current
  }
  if (onResolve || onReject) return _routePush.call(this, location, onResolve, onReject)
  _routePush.call(this, location).catch(err => err)
}
//解决vue路由重复导航错误 解决由于使用微前端router升级到3.5的版本使用的promise 跳转相同路由未捕获到报错就会出现NavigationDuplicated报错
//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
/**
 * 手动删除tab
 * @param routeName 路由name，菜单的menuId, 也可以支持path，路径中带有'/'默认为path;
*/
Router.prototype.removeTab = function (routeName) {
  const visitedViews = store.state.tagsView.visitedViews;
  if (visitedViews.length > 0 && routeName) {
    if (routeName.indexOf('/') != -1) {
      visitedViews.forEach((item, i) => {
        if (item.path === routeName || item.fullPath === routeName) {
          store.dispatch('tagsView/delVisitedView', { name: item.name });
          store.dispatch('tagsView/delCachedView', { name: item.name });
          visitedViews.splice(i, 1);
          const lastView = visitedViews[visitedViews.length - 1];
          router.push({ path: lastView.path })
        }
      })
    } else {
      store.dispatch('tagsView/delVisitedView', { name: routeName });
      store.dispatch('tagsView/delCachedView', { name: routeName });
    }
  } else {
    console.error(`未找到${routeName}的历史访问记录`);
  }
}
/**
 * 添加tab标签
 * @param {Object} route 路由信息对象
 */
Router.prototype.addTab = function (route) {
  const menuList = storage.get(MENU_STOREOG_KEY)
  const menuFunId = [];
  const { data, params } = route;
  const meta = {};
  let newName = '';
  let { name } = route;
  if (data) {
    meta.params = data;
  }
  if (route.title) {
    meta.title = route.title || "no-name";
  }

  /*菜单高亮 -- 添加菜单高亮activeMenu*/
  for (var i = 0; i < menuList.length; i++) {
    menuFunId.push(menuList[i].funcId);
  }
  // 激活当前非菜单路由父级菜单高亮
  if (params && params.activeMenu && params.activeMenu !== router.currentRoute.fullPath) {
    meta.activeMenu = router.currentRoute.fullPath
  }
  if (menuFunId.indexOf(name) === -1) {
    meta.activeMenu = router.currentRoute.fullPath
  } else {
    meta.activeMenu = "/" + menuList[menuFunId.indexOf(name)].funcUrl
  }
  if (route.data && route.data.activeMenu) {
    meta.activeMenu = route.data.activeMenu
  } else {
    meta.activeMenu = router.currentRoute.fullPath
  }
  /*同名tab多开 & 添加动态路由*/
  if (route.name && route.key) {
    newName = getRouterUrl(route.name) || name
    name = newName + '/' + route.key;
    if (newName.indexOf('/') === 0) {
      newName = newName.substr(1)
    }
    if (!getRouterUrl(name)) {
      this.addRoute(newName, route.title, meta, name)
    }
  }
  /*路由参数*/
  if (name) {
    const param = {
      name: name,
      meta,
      fullPath: name,
      params: data
    }
    router.push(param);
  } else {
    isdebug && logger.error('【addTab】', route)
  }
}

// 通过路由名称获取路由路径
export const getRouterUrl = name => {
  const routerList = storage.get(ROUTER_STORE_KEY);
  const routerArr = [];

  function transfer(treeData) {
    if (!(!(treeData.hasOwnProperty('name') || treeData.hasOwnProperty('children')) || !treeData)) {
      let arr = []
      const obj = {}
      obj.name = treeData.name || "";
      obj.path = treeData.path;
      if (treeData.meta && treeData.meta.filePath) {
        obj.path = treeData.meta.filePath;
      }
      if (treeData.children && treeData.children.length > 0) {
        obj.children = treeData.children.map(value => {
          return value.name
        })
        treeData.children.forEach(value => {
          arr = arr.concat(transfer(value))
        })
      }
      arr.push(obj)

      return arr
    } else {
      return []
    }
  }
  for (var i = 0; i < routerList.length; i++) {
    routerArr.push(...transfer(routerList[i]))
  }
  for (var j = 0; j < routerArr.length; j++) {
    if (name === routerArr[j].name) {
      return routerArr[j].path
    }
  }
  return ""
}
// 外链（浏览器标签页打开）匹配正则
const externalLink = /^https?:\/\//
// 外链（iframe方式打开）匹配正则
const iframeLink = /^iframelink=(http(s)?)?/
/**
 * 菜单数据转换为路由
 * 1.若是顶级菜单(非叶子菜单)，则路由component是布局组件: Layout,此方法无法判断是否为一级菜单路由，则暂且设置为NestedMenu
 * 2.若非叶子菜单(且不是顶级菜单)，则路由component是嵌套组件: NestedMenu
 * 3.若是叶子菜单，则是routeUrl对应页面(懒加载): () => import(`@/views/${routeUrl}`)
 * @param {*} node 菜单节点
 */
export const getRouteData = node => {
  const { mId, mText, mPid, mIcon, routeId, routeUrl, children } = node
  let path = '/' + (routeUrl || mId)
  const queryParams = resolveQueryParameters(path)
  path = path && path.indexOf('?') > -1 ? path.substr(0, path.indexOf('?')) : path
  const route = {
    path: path,
    name: mId,
    meta: {
      id: mId,
      title: mText,
      pid: mPid,
      icon: mIcon,
      routeId: routeId,
      routeUrl: routeUrl
    },
    children: children || []
  }
  if (routeUrl) { // 存在即表示叶子节点
    if (externalLink.test(routeUrl)) {
      // 外链（浏览器标签页打开），不添加component属性
      route.meta.noCache = true
      route.component = undefined
      route.children.push({ path: path, meta: route.meta })
    } else if (iframeLink.test(routeUrl)) {
      // 外链（iframe方式打开），跳转公共iframe组件
      route.meta.noCache = true
      route.path = `/iframelink/${mId}`
      route.component = () => import('@/views/common/iframe-link/index')
    } else {
      // 如果path第一个字符是/就去掉
      if (path.indexOf('/') === 0) {
        path = path.substr(1)
      }
      // #TODO fixed: Critical dependency: the request of a dependency is an expression
      // #TODO fixed: Cannot read property 'range' of null
      // route.component = resolve => require([`@/views/${route}`], resolve) // () => import(`@/views/${path}`)
      // route.component = () => import('@/views/' + path)
      // route.component = () => Promise.resolve(require('@/views/' + path).default)
      const mMico = window.MICRO ? window.MICRO.getMICROSubRoute(path) : false;
      !mMico && (route.component = loadView(path, mId));
      // route.component = loadView(path)
    }
  } else {
    route.redirect = 'noRedirect'
    route.component = NestedMenu
  }
  if (queryParams) {
    route.query = queryParams
  }
  return route
}

/**
 * 重置路由为初始状态
 */
export function resetRouter() {
  // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由为初始状态
}

export default router
