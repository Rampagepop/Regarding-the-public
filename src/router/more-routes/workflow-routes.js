/**
 * @created by helin3 2019-04-10
 * @updated by
 * @description 演示示例路由
 * 路由参数配置，详见@/router/constant-routes 文件头注释
 */
/* Layout */
import NestedMenu from '@/components/layout/NestedMenu'
import { getI18nMessage } from '@/locale'

const workflowRoutes = [
  {
    path: '/',
    component: NestedMenu,
    meta: { title: getI18nMessage('route.workflow'), noCache: true },
    children: [
      {
        path: 'runInstanceInfo',
        component: () => import('@/views/workflow/instance/monitorinfo/runInstanceInfo.vue'),
        meta: { title: getI18nMessage('route.runInstanceInfo'), icon: 'yu-icon-home', noCache: true },
        name: 'runInstanceInfo',
        hidden: true // 不显示该路由到菜单上
      },
      {
        path: 'instanceInfo',
        component: () => import('@/views/workflow/instance/common/instanceInfo.vue'),
        name: 'instanceInfo',
        meta: { title: getI18nMessage('route.instanceInfo'), icon: 'yu-icon-home', noCache: false },
        hidden: false // 显示该路由到菜单上  //由于后期要改详情回到业务办理页面的时候没页面的问题
      },
      {
        path: 'instanceInfoLite', // 已办/办结/发起-办理中/发起-已办结详情页面
        component: () => import('@/views/workflow/instance/common/instanceInfoLite.vue'),
        meta: { title: getI18nMessage('route.instanceInfoLite'), icon: 'yu-icon-home', noCache: true },
        name: 'instanceInfoLite',
        hidden: true // 不显示该路由到菜单上
      },
      {
        path: 'taskpoolinfo', // 任务池详情页面
        component: () => import('@/views/workflow/bench/taskpool/taskpoolinfo.vue'),
        name: 'taskpoolinfo',
        hidden: true // 不显示该路由到菜单上
      },
      {
        path: 'gatherHandlePage', // 会办详情页面
        component: () => import('@/views/workflow/instance/metting/mettingPage.vue'),
        name: 'gatherHandlePage',
        hidden: true // 不显示该路由到菜单上
      },
      {
        path: 'nwfTrack', // 流程轨迹页面
        component: () => import('@/views/workflow/demo/nwftrack/nwftrack.vue'),
        name: 'nwfTrack',
        hidden: true // 不显示该路由到菜单上
      },
      {
        path: 'wfruninstance', // 流程监控
        component: () => import('@/views/workflow/studio/wfmonitor/wfruninstance.vue'),
        meta: { title: '运行实例监控', icon: 'yu-icon-home', noCache: true },
        name: 'wfruninstance',
        hidden: true // 不显示该路由到菜单上
      },
      // {
      //   path: 'exampleInfo', // 示例业务页面
      //   component: () => import('@/views/workflow/demo/bizpage/exampleInfo.vue'),
      //   name: 'exampleInfo',
      //   hidden: true // 不显示该路由到菜单上
      // }
    ]
  }
]

export default workflowRoutes
