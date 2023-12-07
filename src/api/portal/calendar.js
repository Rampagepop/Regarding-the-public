import {request} from 'xy-utils'
import backend from '@/config/constant/app.data.service'
/**
 * 获取日历日程API调用
 * @param {*} params
 */
export function getCalendarEvent(params) {
  return request({
    method: 'post',
    url: backend.portalService + '/api/xmhcalender/getmonthevent',
    params
  })
}
/**
 * 获取日历日程详情API调用
 * @param {*} params
 */
export function getCalendarEventDetail(params) {
  return request({
    method: 'post',
    url: backend.portalService + '/api/xmhcalender/info/' + params.id,
    params
  })
}
/**
 * 保存日历API调用
 * @param {*} params
 */
export function saveCalendarEvent(data) {
  return request({
    url: backend.portalService + '/api/xmhcalender/save',
    method: 'post',
    data
  })
}
/**
 * 删除日历API调用
 * @param {*} params
 */
export function deleteCalendarEvent(data) {
  return request({
    url: backend.portalService + '/api/xmhcalender/deletebytype',
    method: 'post',
    data
  })
}
