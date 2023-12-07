/**
 * @created by helin3 2019-04-11
 * @updated by
 * @description 字典请求API
 */
import { request } from 'xy-utils'
import backend from '@/config/constant/app.data.service'
// import service from '@/utils/yufp.ajax'

/**
 * 数据字典查询
 * @param {*} param
 */
// export function lookupQueryFn(params) {
//   return service.request({
//     url: backend.appOcaService + '/api/adminsmlookupdict/querylookupcode',
//     method: 'get',
//     data: params,
//     async: false,
//   })
// }
export function lookupQueryFn(params) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/adminsmlookupdict/querylookupcode',
    params
  })
}
