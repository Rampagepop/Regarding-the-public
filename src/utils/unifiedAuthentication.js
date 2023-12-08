/**
 * @description 统一认证配置
 */
import { genUUID, sessionStore } from '@/utils' // 初始化xy-utils
import { loginFn, orgListFn, getUserMessageConfig } from '@/api/common/oauth';
import { Message} from 'element-ui'
import store from '@/store'
import router from '@/router'
import { USER_STORE_TEMP, COMMON_TOKEN, LOGIN_SUCCESS_TIME, USER_MESSAGE_CONFIG } from '@/config/constant/app.data.common';
const imageUUID = genUUID(16, 16) + Date.parse(new Date());
let defaultOrg, commonTokenInfo;

/**
 * @description 监听路由判断是否有统一认证token0和code有的话直接进入首页
 * 没有就进入统一认证登录页面，登录后调用门户登录然后进入首页
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
    return null;
}
/**
 * @description 获取消息频率接口，用于设置待办等消息提醒接口轮询的时间
 */
function setUserMessageConfig() {
    getUserMessageConfig().then(res => {
        sessionStore.set(USER_MESSAGE_CONFIG, res.data);
    })
}
/**
 * @description 判断当前路由是否有code并且缓存是否有统一认证token，是否跳转统一认证首页
 */
export function judgeUrlToAuthen() {
    let redirectLoginPath = window.localStorage.getItem('redirectLoginPath')
    if (getQueryString('code') && getQueryString('state') && !sessionStore.get(COMMON_TOKEN)) {
        // 有code无token
        store.dispatch('oauth/getCommonTokenInfo', { code: getQueryString('code') }).then(response => {
            if (response && Object.keys(response).length === 0) {
                // 接口报错
                Message({
                    type: 'error',
                    message: 'getLoginInfo接口返回值为空,请查看是否传递参数code或者联系系统管理员'
                })
            } else {
                // 这里只会成功，不成功不会跳转过来，不成功在统一登录页面自己处理
                commonTokenInfo = response
                window.localStorage.setItem('systemRelationInfoMicro', JSON.stringify({
                    "userbaseinfo": response.userbaseinfo ? response.userbaseinfo : '',
                    "auth": response.auth ? response.auth : {}
                }))
                loginIn();
            }
        }).catch(err => {
            console.log(err, '获取统一认证登录信息报错')
            window.location.href = redirectLoginPath
        })
    }
}
/**
 * @description 获取所有机构用于筛选默认机构
 * dftOrgInd 1是 0否
 * 这里还要考虑登录成功后在首页切换机构的情况 todo
 */
function getDefaultOrgByOrgList(username) {
    orgListFn({ loginCode: username }).then(res => {
        if (res.code === '0') {
            defaultOrg = res.data.filter(item => item.dftOrgInd === 1) || []
            // 先默认使用
            if (res && res.data.length) {
                defaultOrg = res.data[0]
            }
            loginIn('two');
        }
    })
}
/**
 * @description 调用门户登录方法然后跳转到首页 todo 这里需要考虑一下token需不需要加密
 */
function loginIn(flag) {
    if (commonTokenInfo && JSON.stringify(commonTokenInfo) == '{}') {
        return
    }
    let data = {}
    if (flag) {
        data = {
            org_id: defaultOrg.orgId,
            refresh_token: sessionStore.get(USER_STORE_TEMP).refresh_token,
            grant_type: 'refresh_token',
        }
    } else {
        loginFn(data).then((response) => {
            if (response.code === '00000000') {
                // 调用二次登录接口
                sessionStore.set(USER_STORE_TEMP, { 'access_token': response.access_token, 'expires_in': response.expires_in, 'refresh_token': response.refresh_token })
                if (flag) {
                    // commonTokenInfo 当统一认证的时候这里用这个操作
                    store.commit("oauth/SET_TOKEN", {
                        access_token: response.access_token,
                        expires_in: response.expires_in,
                        refresh_token: response.refresh_token
                    });
                    sessionStore.remove(USER_STORE_TEMP)
                    store.dispatch("oauth/getAccessInfo").then((resData) => {
                        // 登录成功获取权限成功跳转到首页并且还要重新设置路由避免路由地址比较奇怪的问题
                        sessionStore.set(LOGIN_SUCCESS_TIME, Date.now())
                        if (getQueryString('code') && getQueryString('state') ==1 && window.location.href.includes('/?code')) {
                            // 将原来看起来不正常的跳转页面重新跳转一下为正常页面
                            window.history.pushState({}, null, window.location.origin + window.location.href);
                            router.push({ name: 'Dashboard', params: {islogin: true} })
                        }
                    });
                    setUserMessageConfig()
                } else {
                    getDefaultOrgByOrgList(commonTokenInfo.username)
                }
            }
        })
    }
}