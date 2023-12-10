import { sessionStore } from '@/utils' // 初始化xy-utils
import { LOGIN_SUCCESS_TIME } from '@/config/constant/app.data.common';
import { toSencondeLoginFn } from '@/api/uniAuth/index';
import { cleanAllSession } from '@/utils/oauth';
import { Message } from 'element-ui'
/**
 * @description 判断是否到30分钟后, 30分钟后在接口拦截处调用方法大于30分钟,弹窗
 */
export function isloginSecond() {
    if (sessionStore.get(LOGIN_SUCCESS_TIME)) {
        const loginTime = sessionStore.get(LOGIN_SUCCESS_TIME);
        const stepTime = 30 * 60 * 1000; // 分钟
        if ((Date.now() - loginTime) > stepTime) {
            return true
        } else {
            return false
        }
    }
}
/**
 * @description 二次登录--只做密码验证
 */
export function toSecondlogin(data) {
    const judeSystemLoginout = 12 * 60 * 60 * 1000; //用户当登录超过12个小时后清除所有缓存
    const loginTime = sessionStore.get(LOGIN_SUCCESS_TIME);
    toSencondeLoginFn(data).then(res => {
        if (res && res.result === "0000") {
            // 登录成功
            if ((Date.now() - loginTime) > judeSystemLoginout) {
                // 清除所有缓存 统一认证那边登录态过期那么跳转到统一认证重新登录，如果没有过期继续跳转到门户首页
                cleanAllSession()
            }
        } else {
            Message({ type: 'error', message: (res && res.message || '接口报错') })
        }
    })
}