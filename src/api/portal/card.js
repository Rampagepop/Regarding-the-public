import { request } from '@/utils'
import backend from '@/config/constant/app.data.service'
const baseUrl = backend.portalService

// 卡片列表
export function findRolePrivCard(params) {
  return request ({
    method: 'post',
    url: `${backend.portalService}/api/xmhcardbench/querycard`,
    params
  })
}
// 用户工作台
export function querySavedUserCard(params) {
  return request ({
    method: 'post',
    url: `${backend.portalService}/api/xmhcardbench/querybench`,
    params
  })
}
// 恢复角色工作台
export function queryDefaultbench(params) {
  return request ({
    method: 'post',
    url: `${backend.portalService}/api/xmhcardbench/querydefaultbench`,
    params
  })
}
// 保存用户工作台
export function saveUserWorkBench(data) {
  return request ({
    url: `${backend.portalService}/api/xmhcardbench/savebench`,
    method: 'post',
    data
  })
}
// 清除用户工作台
export function deleteUserWorkBench(data) {
  let url = `${backend.portalService}/api/xmhcardbench/deleteinvalidcard`
  if (data.roleId) {
    url = `${url}?roleId=${data.roleId}`
  }
  return request ({
    url,
    method: 'post',
    data
  })
}
// 取消用户工作台
export function cardCollect(data) {
  return request ({
    url: `${backend.portalService}/api/xmhcarduser/likecard?cardId=${data.cardId}`,
    method: 'post',
    data
  })
}
