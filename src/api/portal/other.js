import { request } from 'xy-utils'
import backend from '@/config/constant/app.data.service'

export function getprduelemlist(data) {
  return request({
    method: 'post',
    url: backend.prduUseService + '/prdueleminfo/q/getprduelemlist',
    params: data
  })
}
/**授信 */
export function getApprovalOverview(data) {
  return request({
    method: 'post',
    url: backend.portalService + '/api/xmhCreditStatistics/approvalOverview',
    params: data
  })
}
/**授信未审结 */
export function getCreditUntriedInfo(data) {
  return request({
    method: 'post',
    url: backend.portalService + '/api/xmhCreditStatistics/approvalPending',
    params: data
  })
}

/**
 * 审批人员效率
 */
export function getApprovalEfficiency(data) {
  return request({
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: backend.portalService + '/api/xmhCreditStatistics/approvalEfficiency',
    data: data
  })
}

/* 监控数据上传 */
let monitorList = [];
export function monitorLogUpload(data) {
  // return request({
  //   url: backend.prduUseService + '/api/monitor/upload',
  //   method: 'post',
  //   params: data
  // })
  monitorList = monitorList.concat(data.data);
  console.log('监控数据', monitorList);
  return new Promise((resolve, reject) => {
    resolve({code: 0, message: '上传成功!'});
  })
}

