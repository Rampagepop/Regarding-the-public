/**
 * @created by pan
 * @updated by helin3 2019-04-06
 * @description 入口文件：加载组件、初始化等
 */
// import '@babel/polyfill' // 针对IE浏览器兼容
import Vue from 'vue'
import ElementUI from 'element-ui'
import YuwpUI from 'yuwp-ui'
import App from './App'
import store from '@/store'
import router from '@/router'
import { sessionStore } from '@/utils' // 初始化xy-utils
import '@/config/other/components' // 导入全局使用自定义组件
import '@/config/other/css' // 导入全局使用自定义组件
import '@/config/other/other' // 导入全局其他配置信息
import i18n from '@/locale' // Internationalization
import YuwpUIConfig from '@/config/components' //导入全局修改的组件参数
import '@/utils/yufp'
import { vueMixinButton } from '@/utils/mixin'
import { COMMON_TOKEN } from '@/config/constant/app.data.common'
import { judgeUrlToAuthen } from '@/utils/unifiedAuthentication'
// import {resigsterApps} from "\@yufp/xy-micro";
// import microApps from "@/config/micro.js";
// import {checkCtrl, download, moneyFormatter} from '@/utils/util'
// import backend from '@/config/constant/app.data.service'

// import {GetPageSchema} from '@/api/common/schema';
// import YuxpRender, {Config as YuxpRenderConfig} from '\@yuxp/compile';

document.getElementById("loading").style.display = 'none'
// 微前端和没有统一认证token的时候调用
if (!sessionStore.get(COMMON_TOKEN)) {
  judgeUrlToAuthen();
}
// 避免报错only no instance of babel-polyfil is allowed
if (!global._babelPolyfill) {
  require('babel-polyfill')
}
const defaultSettings = require('@/config');

Vue.prototype.$message = ElementUI.Message;

// 遍历所有element-ui组件,新增组件名称
Object.keys(ElementUI).forEach(component => {
  var com = ElementUI[component]
  if (com.name && com.install) {
    com['xtype'] = com.name.replace('El','Yu')
    Vue.component(com.xtype, com);
  }
});
Vue.use(ElementUI)
Vue.use(YuwpUI, YuwpUIConfig);

// YuwpUI.validatorInstance.add('customNo', function (rule, value, callback) {
//   const reg = /^pln+.?/
//   if (value && reg.test(value)) {
//     callback()
//   } else if (value && !reg.test(value)) {
//     callback(new Error('必须以pln开头'))
//   } else {
//     callback()
//   }
// })

// YuxpRenderConfig({
//   production: true,
//   loggerLevel: 4,
//   service: {
//     request: Vue.prototype.$request,
//     getPageSchema: GetPageSchema,
//   },
//   util: {
//     download: download,
//     checkCtrl: checkCtrl,
//   },
//   formatter: {
//     moneyFormatter: function (ctx, row, column) {
//       return moneyFormatter(row[column.property] ? row[column.property] : 0)
//     }
//   },
//   data: {
//     backend: backend
//   }
// });
// Vue.use(YuxpRender);

Vue.config.productionTip = false;
Vue.mixin(vueMixinButton);

// if (microApps && microApps.length > 0) {
//   resigsterApps(microApps);
// }

new Vue({
  el: defaultSettings.defaultRootId,
  router,
  store,
  i18n,
  render: h => h(App)
});
console.log(`${defaultSettings.title} ${defaultSettings.version} ${new Date()}`);
