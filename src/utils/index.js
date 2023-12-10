/**
 * @created by kongqf
 * @description 公共组件-入口
 */
import Vue from 'vue';
import lookup from '@/config/lookup';
// import license from '@/config/license';
import { requestConfig, requestSuccessFunc, requestFailFunc, responseSuccessFunc, responseFailFunc } from '@/config/interceptors/axios';
import { ChicRequestConfig, chicRequestSuccessFunc, chicRequestFailFunc, chicResponseSuccessFunc, chicResponseFailFunc } from '@/config/interceptors/chic-config';
import XyUtils from 'xy-utils';
import backend from '@/config/constant/app.data.service';
import * as filters from '@/utils/filters'; // global filters
import service from '@/utils/yufp.ajax'

window.backend = backend; // 为方便兼容，直接将对象挂载到全局 // 因app.data.service在mock服务中引用，window对象不存在
// console.log('字典管理配置', [lookup, XyUtils])

// XHR 方式注册拦截 mock api
// 模拟模式，true真实express服务，false XHR拦截方式
if (process.env.VUE_APP_MOCK_ENABLE === 'true' && process.env.VUE_APP_MOCK_MODE !== 'true') {
  console.log('mock >>>')
  const { mockXHR } = require('@/../mocks')
  // 生产环境且开启mock，则只部分接口走mock
  mockXHR(process.env.NODE_ENV === "production")
}
Vue.use(XyUtils, {
  lookup: lookup,
  // license: license,
  request: {
    config: XyUtils.extend({},ChicRequestConfig, requestConfig),
    requestSuccessFunc: [chicRequestSuccessFunc, requestSuccessFunc],
    requestFailFunc: [requestFailFunc,chicRequestFailFunc],
    // 返回数据chic中没有处理,因此不增加此逻辑
    // responseSuccessFunc: [responseSuccessFunc, chicResponseSuccessFunc],
    responseSuccessFunc,
    responseFailFunc: [responseFailFunc, chicResponseFailFunc]
  }
});
// 接口服务名注册至Vue全局
Vue.prototype.$backend = backend;
Vue.prototype.$request = (param) => {
  param.method = param.method || "post"
  // 为兼容旧组件同步方法使用 #TODO 其他方式禁止使用该方式，如果需要实现同步，可使用async/await
  if (param.async === false) {
    return service.request(param)
  } else {
    return XyUtils.request(param);
  }
}

// 全局注入一个date json格式化方法 // TODO 临时存放
/**
  * 日期默认格式
  * @returns {*}
  */
/* eslint no-extend-native: 0 */
Date.prototype.toJSON = function (format = '{y}-{m}-{d}') {
  return XyUtils.dateFormat(this, format);
};

/**
  * 获取当年上个月最好一天
  * 
  */
Date.prototype.toPreMonthLastDay = function() {
  const date = (new Date().getFullYear(), new Date().getMonth() + 1, 0)
  return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
}

// 注册全局工具类过滤器.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
/**
 * 递归触发事件
 * @param {String} eventName 事件名称
 * @param {Object} data 事件发送数据对象
 */
Vue.prototype.$dispatch = function (eventName, data) {
  let parent = this.$parent;
  while (parent) {
    parent.$emit(eventName, data);
    parent = parent.$parent;
  }
};
/**
 * 广播事件
 * @param {String} eventName 事件名称
 * @param {Object} data 事件发送数据对象
 */
Vue.prototype.$broadcase = function (eventName, data) {
  const broadcase = function () {
    this.$children.forEach((child) => {
      child.$emit(eventName, data);
      if (child.$children) {
        broadcase.call(child, eventName, data);
      }
    });
  };
  broadcase.call(this, eventName, data);
};
/**
 * 生成唯一识别号
 * @param {String} len 长度
 * @param {Object} radix
 */
Vue.prototype.genUUID = function (len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    var r;

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
};
/**
 * #TODO 临时补充方法,该方法已经在xy-utils@0.2.5中新增,需要更新package.json并重新拉去依赖
 * @description 判断参数是否为空,如果是字符串,则''为空字符串,如果是对象,{}为空对象
 * @param {Object|String} v 待校验对象或字符串
 * @returns 返回空校验结果
 */
export function isEmpty(v) {
  return XyUtils.isObject(v) ? JSON.stringify === '{}' :(XyUtils.isString(v) && v === '')
}

export * from 'xy-utils'; // 内部已经注册 $lookup、$utils，在 vue 中可以通过 vm.$lookup/vm.$utils 直接使用
