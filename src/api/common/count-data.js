/*
 * @Author: chenzy13
 * @Date: 2022-10-31 10:16:15 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-11-07 15:07:19
 * 埋点相关接口
 */

import {request} from 'xy-utils'
import backend from '@/config/constant/app.data.service'

/**
  * 统计登录次数
  */
export function getLoginNum() {
  return request({
    url: backend.portalService + '/api/xmhsysanalysis/marklogin',
    method: 'post',
    needToken: true,
  })
}

/**
  * 统计点击事件
  */
export function getClickNum() {
  return request({
    url: backend.portalService + '/api/xmhsysanalysis/mark',
    method: 'post',
    needToken: true,
  })
}
  