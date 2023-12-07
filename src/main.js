/**
 * @created by pan
 * @updated by helin3 2019-04-06
 * @description 入口文件：加载组件、初始化等
 */
// import 'babel-polyfill' // 针对IE浏览器兼容
//微前端 针对IE浏览器兼容
import 'whatwg-fetch';
import 'custom-event-polyfill';
import 'core-js/stable/promise';
import 'core-js/stable/symbol';
import 'core-js/stable/string/starts-with';
import 'core-js/web/url';

import Vue from 'vue'
import YuwpUI from 'yuwp-ui'
import App from './App'
import store from '@/store'
import router from '@/router'
import '@/utils' // 初始化xy-utils
import '@/config/other/components' // 导入全局使用自定义组件
import '@/config/other/css' // 导入全局使用自定义组件
import '@/config/other/other' // 导入全局其他配置信息
import i18n from '@/locale' // Internationalization
import YuwpUIConfig from '@/config/components' //导入全局修改的组件参数
import '@/utils/yufp'
import {vueMixinButton} from '@/utils/mixin'
import {resigsterApps} from "@yufp/xy-micro";
import microApps from "@/config/micro.js";
import moment from 'moment';
//避免报错 only no instance of babel-polyfill is allowed
if(!global._babelPolyfill) {
  require('babel-polyfill')
}
// const originalPush = router.protoype.push

//import {checkCtrl, download, moneyFormatter} from '@/utils/util'
//import backend from '@/config/constant/app.data.service'

//import {GetPageSchema} from '@/api/common/schema';
//import YuxpRender, {Config as YuxpRenderConfig} from '\@yuxp/compile';

const defaultSettings = require('@/config');
Vue.prototype.$moment = moment;
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


Vue.config.productionTip = false;
Vue.mixin(vueMixinButton);

if (microApps && microApps.length > 0) {
  resigsterApps(microApps);
}

new Vue({
  el: defaultSettings.defaultRootId,
  router,
  store,
  i18n,
  render: h => h(App)
});
console.log(`${defaultSettings.title} ${defaultSettings.version} ${new Date()}`);
