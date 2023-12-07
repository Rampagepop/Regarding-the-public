import '@/assets/common/icons' // icon
import '@/utils/error-log' // error log
import '@/router/router-filter'
/* 监控 */
if (process.env.VUE_APP_MONITOR_ENABLE === 'true') {
  // 埋点初始化配置
  window['__ga'] = {
    appId: '10000033', // 该值需要在对应得管理系统中新增应用获取，用于唯一标识
    url: '//120.133.60.64:18080/log/log' // 上报接口地址
  }
  require('@yump/yuga-sdk-pc')
  // require('@/utils/clickevent')
}
if (process.env.VUE_APP_WATERMARK_ENABLE === 'true') {
  require('@/utils/yufp.watermark')
}