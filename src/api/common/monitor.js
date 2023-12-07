
/**
 * 前端数据采集上报接口
 */
import { request } from 'xy-utils'
import backend from '@/config/constant/app.data.service'
import { extend } from '@/utils'
/* 监控数据上传 */
const monitorList = [];

export function getprduelemlist(data) {
  return request({
    method: 'post',
    url: backend.prduUseService + '/prdueleminfo/q/getprduelemlist',
    params: data
  })
}
/**
 * 监控数据上传
 */
export function monitorLogUpload(data) {
  return request({
    url: backend.msmFrontWebService + '/api/monitor/webmonitordata/',
    method: 'post',
    data
  })
  // monitorList = monitorList.concat(data.data);
  // console.log('监控数据', monitorList);
  // return new Promise((resolve, reject) => {
  //   resolve({code: 0, message: '上传成功!'});
  // })
}

/**
 * 按钮日志上传
 */
export function auditlogdata(data) {
  const baseInfo = {
    userId: yufp.session.userId || '',
    userName: yufp.session.userName || '',
    orgId: yufp.session.org ? yufp.session.org.code : '',
    orgName: yufp.session.org ? yufp.session.org.name : '',
  }
  
  return request({
    url: backend.appOcaService + '/api/monitor/auditlogdata',
    method: 'post',
    data: extend(data, baseInfo)
  })
}

/**
 * 客户管理点击埋点
 */
export function getClickEvent(data, e) {
  const baseInfo = {
    loadPage:0,
    whiteScreenTime:0,
    pageUseTime:0,
    pageViewTimes:0,
    'datetime': new Date().getTime() + "",
    'navigatorInfo':window.navigator.userAgent,
    pageLevel:1, //默认一级页面 2为二级
    eventType:e ? 1 : 0, // 默认为按钮1， 2链接
    outLink:0, //默认不是外链
    module:0, //默认为工作台卡片
    eventText:e ? e.target.innerText : '', //获取当前按钮对象然后获取到按钮标题
    recordType:0 //默认点击，2，错误 3 停留时长 4 浏览次数 5 登陆
  }
  //当个对象--点击事件 多个数组--报错页面停留时间等
  Array.isArray(data)
  if(!Array.isArray(data)) {
    if(e) {
      baseInfo.module = 3
    }else if(data.eventType) {
      //工作台管理 使用url判断 
      baseInfo.recordType = 1
    }
    if(data.errorInfo) {
      //错误
      baseInfo.recordType = 2
    }else if(data.eventType) {
      //点击
      baseInfo.recordType = 1
    }
    data = [extend(data, baseInfo)]
  }
  return request({
    url: backend.portalService + '/api/xmhsysanalysis/mark',
    method: 'post',
    data: data
  })
}