/**
 * @created by helin3 2019-04-10
 * @updated by
 * @description constantRoutes 静态路由，代表不需要动态判断权限的路由，如登录页、404、等通用页面
 * {
 *   path                         // 路由路径
 *   component                    // 路由视图组件
 *   children                     // 嵌套路由
 *   hidden: true                 // 当设置true的时候该路由不会再侧边栏出现（默认:false），如：401,404,login等
 *   alwaysShow: true             // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                   只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                   若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                   你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 *
 *   redirect: noRedirect         // 当设置 noRedirect 的时候，该路由在面包屑导航中不可被点击
 *   name:'router-name'           // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 *   meta : {
 *     roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
 *     title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字，推荐设置
 *     icon: 'svg-name'             // 设置该路由的图标
 *     noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 *     breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
 *     affix: true                  // 如果设置为true，将会始终固定在页签上(默认 false)，如: dashboard
 *     activeMenu: '/example/list'  // 如果设置了值，则会高亮设定值的菜单
 *   }
 * }
 */
// const Layout = loadView(/* webpackChunkName: "Layout" */ '@/components/layout')
import Layout from '@/components/layout'
import NestedMenu from '@/components/layout/NestedMenu'
import constantMoreRoutes from './constant-more-routes'
import {storage} from 'xy-utils'
import {loadView} from '@/utils/loadView'
import {DYNAMIC_ROUTES} from '@/config/constant/app.data.common'
import {getI18nMessage} from '@/locale'

const SHOW_MORE_ROUTES = true // 是否加载本地路由（菜单）

let constantRoutes = [
  {
    path: '/redirect', // 通用跳转（重定向）路由
    component: NestedMenu, // 该部分不能删除，否则出现 redirect中 next无法执行
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: loadView('common/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/base/Login'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: loadView('common/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    name: '401',
    component: loadView('common/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: NestedMenu,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/common/dashboard/index'),
        name: 'Dashboard',
        meta: {title: getI18nMessage('route.dashboard'), icon: 'yu-icon-home', noCache: false, affix: true}
      }
    ]
  },
  {
    path: '/scheduleLog', // 定时任务-日志列表
    component: NestedMenu,
    redirect: '/systemManager/schedule/log/log',
    meta: {title: getI18nMessage('route.timedTask'), noCache: true},
    children: [
      {
        path: '/systemManager/schedule/log/log',
        component: loadView('content/systemManager/schedule/log/log'),
        meta: {title: getI18nMessage('route.logList'), noCache: true}
      }
    ]
  },
  {
    path: '/guide',
    component: NestedMenu,
    hidden: true,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: loadView('common/guide/index'),
        name: 'Guide',
        meta: {title: 'guide', icon: 'guide', noCache: true}
      }
    ]
  },
  {
    path: '/designer',
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/designer',
      name: 'designer',
      component: loadView('yuxp/designer/main'),
      hidden: true
    }]
  },
  {
    path: '/dragable', // 卡片拖拽
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/dragable', // 卡片拖拽
      name: 'Dragable',
      component: loadView('portal/card/dragable'),
      meta: {title: getI18nMessage('route.dragable'), icon: 'yu-icon-box', noCache: false},
      hidden: true
    }]
  },
  {
    path: '/forgetPwd',
    name: 'forgetPwd',
    component: () => import('@/components/base/ForgetPwd'),
    hidden: true
  },
  // 资讯详细信息
  {
    path: '/askcenter/:id',
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/askcenter/:id',
      name: 'AskCenterDetail',
      component: () => import('@/views/common/dashboard/AskCenter/askCenterDetail.vue'),
      meta: {title: getI18nMessage('route.askCenterDetail'), icon: 'yu-icon-box', noCache: true},
      hidden: true
    }]
  },
  // //微前端路由添加
  {
    path: '/cdpWeb/*',
    // name: 'yusp-plus',
    hidden: true,
    // meta: {
    //   title: 'micro-yusp'
    // }
  },
  // 资讯清单
  {
    path: '/askcenterlist',
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/askcenterlist',
      name: 'AskCenterList',
      component: loadView('common/dashboard/AskCenter/askCenterList'),
      meta: {title: getI18nMessage('route.askCenter'), icon: 'yu-icon-box', noCache: true},
      hidden: true
    }]
  },
  {
    path: '/allPrepare',
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/allPrepare',
      name: 'allPrepare',
      component: () => import('@/views/portal/card/processCenter/allPrepare.vue'),
      meta: {title: getI18nMessage('route.allPrepare'), icon: 'yu-icon-box', noCache: true},
      hidden: true
    }]
  },
  {
    path: '/processTrack',
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/processTrack',
      name: 'processTrack',
      component: () => import('@/views/portal/card/processCenter/processTrack.vue'),
      meta: {title: getI18nMessage('route.processTrace'), icon: 'yu-icon-box', noCache: true},
      hidden: true
    }]
  },
  {
    path: '/reminderList',
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/reminderList',
      name: 'reminderList',
      component: () => import('@/views/portal/card/processCenter/reminderList.vue'),
      meta: {title: '催办清单', icon: 'yu-icon-box', noCache: true},
      hidden: true
    }]
  },
  {
    path: '/riskWarning',
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/riskWarning',
      name: 'riskWarning',
      component: () => import('@/views/portal/card/processCenter/riskWarning.vue'),
      meta: {title: '风险预警', icon: 'yu-icon-box', noCache: true},
      hidden: true
    }]
  },
  {
    path: '/conciseForm',
    component: NestedMenu,
    hidden: true,
    children: [{
      path: '/conciseForm',
      name: 'conciseForm',
      component: () => import('@/views/example/conciseForm/conciseForm.vue'),
      meta: {title: '简洁表单'},
      hidden: true
    }]
  },
]
// 合并动态路由数据
const dynamicRouters = storage.get(DYNAMIC_ROUTES)
if (dynamicRouters) {
  const dynamicRoutes = JSON.parse(dynamicRouters).dRoute;
  for (let i = 0; i < dynamicRoutes.length; i++) {
    // dynamicRoutes[i].children[0].component = () => Promise.resolve(require('@/views' + dynamicRoutes[i].children[0].commentsRouter).default);
    if (dynamicRoutes[i] && dynamicRoutes[i].children) {
      // null为微前端组件
      if (dynamicRoutes[i].children[0].component != null) {
        dynamicRoutes[i].children[0].component = getComponent(dynamicRoutes[i].children[0].commentsRouter);
      }
    } else {
      if (dynamicRoutes[i].component != null) {
        dynamicRoutes[i].component = getComponent(dynamicRoutes[i].commentsRouter);
      }
    }
  }
  constantRoutes = [...constantRoutes, ...dynamicRoutes]
}

function getComponent(path) {
  return loadView(path);
}
if (SHOW_MORE_ROUTES) {
  constantRoutes = [...constantRoutes, ...constantMoreRoutes]
}
export default constantRoutes
