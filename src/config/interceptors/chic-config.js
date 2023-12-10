import axios from 'axios'
import { Message } from 'element-ui'
import { debouce } from '@/utils/utils'

const authError = debouce(message => {
    Message({ message, type: 'error'})
},1000)
export const ChicRequestConfig = {
    baseURL: '/oms',
    timeout: 30000, // 超时时间
    retry: 2, // 超时后重新请求次数
    retryDelay: 1000, // 超时后,重新请求间隔事件
    headers: {
        post: {
            'Content-Type': 'application/json'
        }
    }
}

// http request 拦截器
export function chicRequestSuccessFunc(config) {
    // 注释该判断,430生产环境发现window.$CHIc为underfined，导致报错,页面无法正常显示,且token不应该缓存至localStorage中
    // if (localStorage.token) {
    //     config.headers['Menu-Id'] = store.state.app.menuId
    //     config.headers['Authorization'] = localStorage.getItem('token')
    //     // 某些情况下,window.$CHIc为underfined,导致系统无法进入,页面空白
    //     config.headers['appName'] = window.$CHIc ? window.$CHIc.appName : ''
    // }
    if (config.data && config.data.transRecord) {
        const _data = Object.assign( config.data.result ? config.data.result : {}, config.data.sysHead)
        const params = {}
        for (const key in _data) {
            if (_data.hasOwnproperty(key)) {
                params[key] = _data[key]
            }
        }
        if (config.data.result) {
            delete config.data.result
        }
        if (config.data.transRecord) {
            delete config.data.transRecord
        }
    }
    return config
}
export function chicRequestFailFunc(error) {
    return Promise.reject(error)
}
// http response 拦截器
export function chicResponseSuccessFunc(res) {
    return res.data
}
export function chicResponseFailFunc(error) {
    const config = error.config
    // 超时处理
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        if (!config || config.retry) return Promise.reject(error)
        // 设置变量来跟踪重置次数
        config._retryCount = config._retryCount || 0
        // 判断是否已经达到最大重新请求次数
        if (config._retryCount >= config.retry) {
            Message.error('服务器超时!')
            return Promise.reject(error) 
        }
        config._retryCount += 1
        const backoff = new Promise(reslove => {
            setTimeout(() => {
                reslove()
            }, config.retryDelay || 1)
        })
        delete config.baseURL
        return backoff.then(() => axios(config))
    }
    if (error.response) {
        // 根据响应状态码,做不同处理
        switch (error.response.status) {
            case 401:
              authError((error.response && error.response.data && error.response.data.error_description))
              localStorage.clear
              if (!window.MICRO && window.sessionStorage.getItem("COMMON_TOKEN")) {
                if (window.$CHIC && window.$CHIC.IsSSo) {
                    window.location.href = window.$CHIC.ssoUrl
                } else {
                    return
                }
              }
              break;
            case 500:
              let msg = ''
              if (error.response.config.responseType && error.response.config.responseType === 'blob') {
                error.response.data.text().then(res => {
                    msg = JSON.parse(res).message || '服务器错误'
                    msg = msg.indexOf('404') > -1 ? msg.slice(4) : msg
                    authError(msg)
                })
              } else {
                msg = (error.response && error.response.data && error.response.data.message)
                msg = msg.indexOf('404') > -1 ? msg.slice(4) : msg
                authError(msg)
              }
              break;
            default:
              authError((error.response && error.response.data && error.response.data.message))
              break;
        }
    }
    return Promise.reject(error && error.response)
}