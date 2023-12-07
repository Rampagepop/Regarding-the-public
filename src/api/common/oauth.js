/**
 * @created by helin3 2019-04-06
 * @updated by
 * @description 认证相关api模块：登录、注销、获取权限（用户、菜单）
 */
import {request} from 'xy-utils'
import backend from '@/config/constant/app.data.service'
 
/**
  * 主体API调用
  * @param {*} params
  */
export function orgListFn(params) {
  return request({
    url: backend.appOcaService + '/api/adminsmuser/listorgroles/' + params.loginCode,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    needToken: true,
  })
}
 
/**
  * 主体保存
  * 
  */
export function saveUserLastorgRoles(data) {
  return request({
    url: backend.appOcaService + '/api/adminsmuser/saveuserlastorgroles',
    method: 'post',
    data,
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    // },
    needToken: true,
  })
}
 
/**
  * 登录API调用
  * @param {*} data
  */
export function loginFn(data) {
  return request({
    url: backend.uaaService + '/oauth/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': 'Basic WVVTUDoxMjM0NTY='
    },
    needToken: false,
    data
  })
}
 
/**
  * 刷新Token API调用
  * @param {*} data
  */
export function refreshTokenFn(data) {
  /* eslint camelcase:0 */
  let d = {
    grant_type: 'refresh_token',
    refresh_token: data
  }
  if(typeof data === 'object') {
    d = data
  }
  return loginFn(d)
}
 
/**
  * 退出登录/注销API调用
  * @param {*} data
  */
export function logoutFn(data) {
  return request({
    url: backend.uaaService + '/api/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data
  })
}
 
/**
  * 用户会话信息获取API
  */
export function getSessionInfoFn() {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/session/info',
  })
}
 
/**
  * 菜单&控制点获取API
  * @param {*} params
  */
export function getMenuandcontrFn(data) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/account/menuandcontr',
    data
  })
}
 
/**
  * 数据权限信息获取API
  * @param {*} params
  */
export function datacontrFn(data) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/account/datacontr',
    data
  })
}
 
/**
  * 密码信息获取API
  * @param {*} params
  */
export function passwordFn(data) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/account/password',
    data
  })
}
 
/**
  * 控制点URL获取API
  * @param {*} params
  */
export function contrUrlFn(data) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/contr/url',
    data
  })
}
 
/**
  * 获取验证码
  * @param {*} params
  */
export function getVerifyCodeImage(data) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/codeImage/verifyCodeImage',
    data
  })
}
 
/**
  * 重置密码
  */
export function resetPwd(data) {
  return request({
    url: backend.appOcaService + '/api/password/passwordmodification',
    method: 'POST',
    data
  })
}
 
/**
  * 获取机构树数据
  */
export function getOrgTree() {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/adminsmorg/treequeryauth', // 机构树请求 url
    // data
  })
}
 
/**
  * 获取当前用户在该系统下所拥有的可授权的角色数据
  */
export function getenableroles(params) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/adminsmrole/getenableroles', // 当前系统所有角色请求 url
    // data
  })
}
 
/**
  * 获取当前用户在该系统下所有的角色数据getallroles
  */
export function getallroles(params) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/adminsmrole/getallroles', // 当前系统所有角色请求 url
    // data
  })
}
 
 
/**
  * 检测当前系统是否有该用户名
  */
export function checkuserexist(data) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/revise/checkuserexist', // 检测当前系统是否有该用户名 url
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': 'Basic WVVTUDoxMjM0NTY='
    },
    needToken: false,
    data
  })
}
 
/**
  * 忘记密码发送验证码
  */
export function sendSmsCode(data) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/revise/sendsmscode', // 忘记密码发送验证码 url
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': 'Basic WVVTUDoxMjM0NTY='
    },
    needToken: false,
    data
  })
}
 
/**
  * 忘记密码校验验证码
  */
export function checkSmsCode(data) {
  return request({
    method: 'post',
    url: backend.appOcaService + '/api/revise/checksmscode', // 忘记密码校验验证码 url
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': 'Basic WVVTUDoxMjM0NTY='
    },
    needToken: false,
    data
  })
}
 
/**
  * 设置密码
  */
export function revisepassword(data) {
  return request({
    url: backend.appOcaService + '/api/revise/revisepassword',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Basic WVVTUDoxMjM0NTY='
    },
    needToken: false,
    data
  })
}
/**
  * 菜单&点击统计API
  * @param {*} data
  */
export function countMenuClick(data) {
  return request({
    url: `${backend.appOcaService}/api/adminsmmenucall/save`,
    method: 'post',
    data
  })
}
/**
  * 菜单&收藏点击事件
  * @param {*} data
  */
export function likeMenuClick(data) {
  return request({
    url: `${backend.appOcaService}/api/adminsmmenukeep/keepmenu`,
    method: 'post',
    data
  })
}
/**
  * 菜单&搜藏列表
  * @param {*} data
  */
export function likeMenuList() {
  return request({
    method: 'post',
    url: `${backend.appOcaService}/api/adminsmmenukeep/listkeepmenu`,
  })
}
/**
  * 获取用户角色列表(分页)
  * @param {*} data
  */
export function getRolesList(data) {
  return request({
    method: 'post',
    url: `${backend.appOcaService}/api/adminsmrole/auth/page`,
    data
  })
}
/**
  * 获取用户角色列表(分页)
  * @param {*} data
  */
export function getUserMessageConfig(data) {
  return request({
    method: 'post',
    url: `${backend.portalService}/api/xmhmessageconfig/getuserconfig`,
    data
  })
}
 