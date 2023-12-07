/**
 * @created by helin3 2019-04-18
 * @updated by
 * @description 字典请求API
 */
import { request } from 'xy-utils'
import backend from '@/config/constant/app.data.service'

/**
 * 查询列表数据
 * @param {*} param
 */
export function queryListFn (data) {
  return request({
    method: 'post',
    url: backend.mockExampleService + '/crud/list',
    data
  })
}

/**
 * 保存数据（新增或修改）
 * @param {*} data
 */
export function saveFn(data) {
  return request({
    url: backend.mockExampleService + '/crud/save',
    method: 'post',
    data
  })
}

/**
 * 删除数据
 * @param {*} data
 */
export function deleteFn(data) {
  return request({
    url: backend.mockExampleService + '/crud/delete',
    method: 'post',
    data
  })
}
