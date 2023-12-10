import { request } from 'xy-utils'
import backend from '@/config/constant/app.data.service'


/**
 * @description 类型检测,相对typeof更精确
 * @param {*} params 
 */
export function getCommonTokenFn(params) {
    return request({
        url: backend.uaaService + '/api/getLoginInfo',
        method: 'get',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': 'Basic wWTUDoxMjMONTY='
        },
        params,
        needToken: false
    })
}

/**
 * @description 用于门户未操作页面超过30分钟后的二次登录验证密码
 * @param {*} data
 */
export function toSencondeLoginFn(data) {
    return request({
        url: backend.uaaService + '/api/checkAcc',
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': 'Basic d2ViX2FwcDo='
        },
        needToken: false,
        data
    })
}

/**
 * @description 获取统一认证的登录动态地址
 */
export function getUniLoginUrl() {
    return request({
        url: backend.uaaService + '/api/getSsoServerUrl',
        method: 'get',
        needToken: false
    })
}

/**
 * @description 获取所有链接到的子应用数组
 */
export function getMicroApps() {
    return request({
        url: backend.portalService + '/api/outerSysInfo/getResourceInfo',
        method: 'POST',
    })
}

/**
 * @description 获取所有接入到的主应用的子应用接口用于组装当前路由
 */
export function getMicroAppsRoutes(data) {
    return request({
        url: backend.portalService + '/api/outerSysInfo/getResourceInfoByType',
        method: 'POST',
        data
    })
}
/**
 * @description 切换机构的时候获取到相应的权限信息
 */
export function getUniInfoByChoseOrg(data) {
    return request({
        url: backend.appOcaService + '/api/revise/getUserInfoByOrgId',
        method: 'POST',
        data
    })
}