/**
 * @created by helin3 2019-04-06
 * @updated by
 * @description 认证相关store模块：登录、注销、获取权限（用户、菜单）
 */
/* eslint camelcase:0 */

import { getMenuandcontrFn, getSessionInfoFn, loginFn, logoutFn, refreshTokenFn, getAllocationConfig } from '@/api/common/oauth'
import { getCommonTokenFn } from '@/api/uniAuth/index';
// 在这里调用微前端获取配置接口 渲染注册微前端,由于接口应该是在token存在的情况调用
import { getApps } from "@/config/micro.js"
import { Message } from 'element-ui'
import router, {resetRouter} from '@/router'
import constantRoutes from '@/router/constant-routes'

import { cleanSession, cleanAllSession, generateRoutes, removeToken, setToken, setCommonToken} from '@/utils/oauth'
import {
  CTRL_JSON_ROOT,
  CTRL_STORE_KEY,
  CTRL_STOREOG_KEY,
  MICO_KYCR_SEARCH_KEYWORDS,
  CURRENT_MENU_ITEM_STORE_KEY,
  CURRENT_TOP_MENU_STORE_KEY,
  MENU_JSON_ROOT,
  MENU_STORE_KEY,
  MENU_STOREOG_KEY,
  ROUTER_STORE_KEY,
  USER_MAPPING,
  USER_STORE_KEY,
  LOCATION_CONFIG
} from '@/config/constant/app.data.common'
import { extend, sessionStore, toMappingFn } from 'xy-utils'

import menusAndContrls from '@/api/common/menus-contrls' // #TODO临时菜单处理
const { demoMenus, demoContrls } = menusAndContrls
const sessionUser = sessionStore.get(USER_STORE_KEY) || {}
const { additionals = {}, userName = '', userId = '', userCode = '', userAvatar = '', userSex = '' } = sessionUser
const { authOrgRoles = [], currentOrgRole = {}, authOrgs = [] } = additionals
const state = {
  token: '', // 会话token信息
  accessToken: '', // 访问token
  refreshToken: '', // 刷新toekn
  expiresIn: '', // 过期时间
  // lastRefreshTime: '', // 上次刷新时间

  userId, // 用户ID
  userName, // 用户姓名
  userCode, // 用户登录码
  userSex, // 用户性别
  userAvatar, // 用户头像
  logicSys: null, // 逻辑系统Object
  roles: authOrgRoles, // 角色数组Object
  rolename: authOrgs,
  selectedRoles: currentOrgRole, // 选中角色
  org: null, // 机构Object
  orgCode: null, // 当前机构ID
  dpt: null, // 部门Object
  instu: null, // 金融机构Object
  upOrg: null, // 上级机构Object
  upDpt: null, // 上级部门Object
  loginCode: '', //登录代码
  roleCode: sessionUser && sessionUser.role && sessionUser.role.roleCode || '', //当前角色CODE

  otherInfo: null, // 其它用户信息
  locationconfig: sessionStore.get(LOCATION_CONFIG) || [],
  originalMenus: sessionStore.get(MENU_STOREOG_KEY) || [],
  originalCtrls: sessionStore.get(CTRL_STOREOG_KEY) || [],
  menus: sessionStore.get(MENU_STORE_KEY) || [], // 菜单数据
  currentTopMenu: sessionStore.get(CURRENT_TOP_MENU_STORE_KEY), // 当前选中的一级菜单
  showLeftMenu: false, // 上左菜单时 是否显示左侧二级菜单
  ctrls: sessionStore.get(CTRL_STORE_KEY) || [], // 控制点权限
  currentMenuItem: sessionStore.get(CURRENT_MENU_ITEM_STORE_KEY) || {}, // 当前选中最低一级菜单

  routes: sessionStore.get(ROUTER_STORE_KEY) || [] // 全量路由
}
const mutations = {
  SET_COMMON_TOKEN: (state, tokenInfo) => {
    state.userName = tokenInfo.userName;
    state.access_token = tokenInfo.access_token;
    state.expires_datetime = tokenInfo.expires_datetime;
    state.refresh_Token = tokenInfo.refresh_Token;
    setCommonToken(tokenInfo)
  },
  SET_TOKEN: (state, tokenInfo) => {
    state.accessToken = tokenInfo.access_token;
    state.expiresIn = tokenInfo.expires_in;
    setToken(tokenInfo)
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  SET_ACCESS_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken
  },
  SET_EXPIRES_IN: (state, expiresIn) => {
    state.expiresIn = expiresIn
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  // SET_LAST_REFRESH_TIME: (state, lastRefreshTime) => {
  //   state.lastRefreshTime = lastRefreshTime
  // },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
    localStorage.setItem('userId', userId);
  },
  SET_LOGIN_CODE: (state, loginCode) => {
    state.loginCode = loginCode
    localStorage.setItem('loginCode', loginCode);
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  },
  SET_USER_CODE: (state, userCode) => {
    state.userCode = userCode
  },
  SET_USER_SEX: (state, userSex) => {
    state.userSex = userSex
  },
  SET_USER_AVATAR: (state, userAvatar) => {
    state.userAvatar = userAvatar
  },
  SET_LOGIC_SYS: (state, logicSys) => {
    state.logicSys = logicSys
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLELIST: (state, rolelist) => {
    state.rolelist = rolelist
  },
  SET_ROLENAME: (state, rolename) => {
    state.rolename = rolename
  },
  SET_SELECTED_ROLES: (state, selectedRoles) => {
    state.selectedRoles = selectedRoles
    // state.roleCode = selectedRoles.roleCode
  },
  SET_ORG: (state, org) => {
    state.org = org
    state.orgCode = org.code
  },
  SET_DPT: (state, dpt) => {
    state.dpt = dpt
  },
  SET_INSTU: (state, instu) => {
    state.instu = instu
  },
  SET_UP_ORG: (state, upOrg) => {
    state.upOrg = upOrg
  },
  SET_UP_DPT: (state, upDpt) => {
    state.upDpt = upDpt
  },
  SET_ORIGINAL_MENUS: (state, originalMenus) => {
    state.originalMenus = originalMenus
    sessionStore.set(MENU_STOREOG_KEY, originalMenus)
  },
  SET_ORIGINAL_CTRLS: (state, originalCtrls) => {
    state.originalCtrls = originalCtrls
    sessionStore.set(CTRL_STOREOG_KEY, originalCtrls)
  },
  SET_CTRLS: (state, ctrls) => {
    state.ctrls = ctrls
    sessionStore.set(CTRL_STORE_KEY, ctrls)
  },
  SET_OTHER_INFO: (state, otherInfo) => {
    state.otherInfo = otherInfo
  },
  SET_ROUTES: (state, routes) => {
    // 本应放于constant-routes定义，但由于是*通配符，必须置于路由数组最后
    state.menus = routes
    sessionStore.set(MENU_STORE_KEY, routes)
    // routes.push({ path: '*', redirect: '/404', hidden: true })
    routes = constantRoutes.concat(routes)
    state.routes = routes
    sessionStore.set(ROUTER_STORE_KEY, routes)
  },
  SET_CURRENT_TOP_MENU: (state, menu) => {
    let stateMenu = Object.assign({}, menu); // eslint-disable-line
    stateMenu.children = [];
    state.currentTopMenu = stateMenu;
    sessionStore.set(CURRENT_TOP_MENU_STORE_KEY, stateMenu)
  },
  SET_SHOW_LEFT_MENU: (state, isShow) => {
    state.showLeftMenu = isShow;
  },
  SET_CURRENT_MENU_ITEM: (state, menu) => {
    let stateMenu = {}; // eslint-disable-line
    stateMenu.name = menu.name;
    state.currentMenuItem = stateMenu;
    sessionStore.set(CURRENT_MENU_ITEM_STORE_KEY, stateMenu)
  },
}

const actions = {
  // oauth/login
  login ({ dispatch, commit }, reqData) {
    return new Promise(async (resolve, reject) => {
      await dispatch('getAccessToken', reqData).catch(error => {
        reject(error)
      })
      await dispatch('getSessionInfo').catch(error => {
        reject(error)
      })
      resolve()
    })
  },
  // 获取统一认证token0
  getCommonTokenInfo({ commit }, code) {
    return new Promise((resolve, reject) => {
      getCommonTokenFn(code).then(response => {
        const { access_token, expires_datetime, userName, refresh_Token } = response
        commit('SET_COMMON_TOKEN', { access_token, expires_datetime, refresh_Token})
        commit('SET_ACCESS_TOKEN', access_token)
        commit('SET_EXPIRES_IN', expires_datetime)
        commit('SET_REFRESH_TOKEN', refresh_Token)
        setCommonToken({ access_token, expires_datetime, userName, refresh_Token })
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  //  1、获取用户会话信息
  //  2、菜单及控制点信息
  getAccessInfo({
    dispatch,
    commit
  }, appId) {
    if(appId) {
      return; // todo 存储当前applicationId 由于当前四系统未实现多系统切换，故直接返回
    }
    return new Promise(async (resolve, reject) => {
      var resData;
      //step 1
      await getSessionInfoFn().then(response => {
        if (!response) {
          reject('Verification failed, please Login again.')
        }
        const resLoginCode = response.loginCode // toMappingFn 中不包含此对象的存储 故单独定义
        const userInfo = toMappingFn(response, USER_MAPPING)
        // 如果从返回的登录用户信息里拿不到longicSys.id,使用后台管理系统默认初始化的系统id
        // if (!userInfo.logicSys.id) {
        //   userInfo.logicSys.id = '1cab27def8fb4c0f9486dcf844b783c0'
        // }
        const {
          userId,
          userName,
          userCode,
          userAvatar,
          logicSys,
          org,
          dpt,
          instu,
          upOrg,
          upDpt,
          ...otherInfo
        } = userInfo

        yufp.session.userId = userId;
        yufp.session.userName = userName;
        yufp.session.userCode = userCode;
        yufp.session.org = org;
        const { authOrgRoles = [], currentOrgRole = {}, userSex, authOrgs = [] } = response.additionals || {}
        const { rolelist = [] } = response.roles || []
        if ( currentOrgRole ) {
          yufp.session.currentOrgRole = currentOrgRole
        } else {
          // 接口报错
          Message({ type: 'error', message: '该机构不在27机构树下'})
          return
        }
        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getSessionInfo: roles must be a non-null array!')
        // }
        // ;
        commit('SET_USER_ID', userId)
        commit('SET_LOGIN_CODE', resLoginCode)
        commit('SET_USER_NAME', userName)
        commit('SET_USER_CODE', userCode)
        commit('SET_USER_SEX', userSex)
        commit('SET_USER_AVATAR', userAvatar)
        commit('SET_LOGIC_SYS', logicSys)
        commit('SET_ROLES', authOrgRoles)
        commit('SET_ROLELIST', rolelist)
        commit('SET_ROLENAME', authOrgs)
        commit('SET_SELECTED_ROLES', currentOrgRole)
        commit('SET_ORG', org)
        commit('SET_DPT', dpt)
        commit('SET_INSTU', instu)
        commit('SET_UP_ORG', upOrg)
        commit('SET_UP_DPT', upDpt)
        commit('SET_OTHER_INFO', otherInfo)
        sessionStore.set(USER_STORE_KEY, userInfo)
        resData = userInfo;
        const wordList = sessionStore.get(MICO_KYCR_SEARCH_KEYWORDS) || {};
        if (!wordList[state.userCode]) {
          wordList[state.userCode] = {}
        }
        delete wordList[state.userCode]['0000000'];
        sessionStore.set(MICO_KYCR_SEARCH_KEYWORDS, wordList);
      }).catch(error => {
        const wordList = sessionStore.get(MICO_KYCR_SEARCH_KEYWORDS) || {};
        if (!wordList[state.userCode]) {
          wordList[state.userCode] = {}
        }
        delete wordList[state.userCode]['0000000'];
        sessionStore.set(MICO_KYCR_SEARCH_KEYWORDS, wordList);
        reject(error)
      })
      var data = {
        userId: yufp.session.userCode,
        orgId: yufp.session.currentOrgRole.orgId
      }
      window.localStorage.setItem('choseOrg',yufp.session.currentOrgRole.orgId)
      // 当有token的时候调用接口获取微前端配置
      // 下边genrateRoutes组装路由会调用loadView方法,会用微前端环境标识window.micro做判断,所以需要等getApps处理完(否则在切机构的时候路由组装错误导致报错)
      await getApps()
      //step 2
      await getMenuandcontrFnExt(data).then(response => {
        // 处理数据，将路径调整到对应的路由上，仅供测试使用
        response.menu.forEach(m => {
          if (m.funcUrl) {
            m.funcUrl = m.funcUrl.replace('pages/', '')
          }
        })
        // #TODO 使用测试菜单处理数据
        // response = {
        //   menu: demoMenus,
        //   contr: response[CTRL_JSON_ROOT]
        // }
        // console.log('菜单数据', response, {menu: demoMenus, contr: demoContrls})
        if (!response || !response[MENU_JSON_ROOT]) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_ORIGINAL_MENUS', response[MENU_JSON_ROOT])
        // 调用接口更新tab缓存数据
        dispatch('tagsView/updateCache', {}, { root: true })
        commit('SET_ORIGINAL_CTRLS', response[CTRL_JSON_ROOT])

        const copyData = extend({}, response, true)
        let menus = copyData[MENU_JSON_ROOT];
        menus = menus.filter(item => {
          return (item.menuName !== '工作台' && item.menuName !== 'Home');
        })

        const accessRoutes = generateRoutes(menus)
        // const contrs = toMappingFn(copyData.contr, CONTRL_MAPPING)
        commit('SET_ROUTES', accessRoutes)
        resetRouter()

        router.addRoutes(accessRoutes)
        resData = accessRoutes;
        // commit('SET_CTRLS', contrs) // TODO 操作级权限点
      }).catch(error => {
        reject(error)
      })
      resolve(resData)
    })
  },
  // 首次获取token
  getAccessToken ({ commit }, reqData) {
    return new Promise((resolve, reject) => {
      loginFn(reqData).then(response => {
        const { access_token, expires_in, refresh_token } = response
        commit('SET_TOKEN', { access_token, expires_in })
        commit('SET_ACCESS_TOKEN', access_token)
        commit('SET_EXPIRES_IN', expires_in)
        // commit('SET_REFRESH_TOKEN', refresh_token)
        // commit('SET_LAST_REFRESH_TIME', lastRefreshTime)
        setToken({ access_token, expires_in, refresh_token })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 刷新AccessToken
  refreshAccessToken ({ commit }, reqData) {
    return new Promise((resolve, reject) => {
      refreshTokenFn(reqData).then(response => {
        const { access_token, expires_in, refresh_token } = response
        // // 记录 access_token 时间（相对于浏览器客户端来说），默认减去1min中
        // const lastRefreshTime = new Date().getTime() - 60000 // 单位：毫秒
        commit('SET_TOKEN', { access_token, expires_in })
        commit('SET_ACCESS_TOKEN', access_token)
        commit('SET_EXPIRES_IN', expires_in)
        commit('SET_REFRESH_TOKEN', refresh_token)
        // commit('SET_LAST_REFRESH_TIME', lastRefreshTime)
        // setToken({ access_token, expires_in, refresh_token, lastRefreshTime })
        setToken({ access_token, expires_in, refresh_token })
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户会话信息、菜单及控制点信息
  getSessionInfo ({ dispatch, commit }) {
    return new Promise(async (resolve, reject) => {
      await getSessionInfoFn().then(response => {
        if (!response) {
          reject('Verification failed, please Login again.')
        }
        const userInfo = toMappingFn(response, USER_MAPPING)
        const { userId, userName, userCode, userAvatar, logicSys, loginCode,
          org, dpt, instu, upOrg, upDpt, ...otherInfo } = userInfo

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getSessionInfo: roles must be a non-null array!')
        // }
        // debugger;
        const {authOrgRoles = [], currentOrgRole = {}, userSex, authOrgs = []} = response.additionals || {}
        commit('SET_USER_ID', userId)
        commit('SET_USER_NAME', userName)
        commit('SET_USER_CODE', userCode)
        commit('SET_USER_SEX', userSex)
        commit('SET_USER_AVATAR', userAvatar)
        commit('SET_LOGIC_SYS', logicSys)
        commit('SET_ROLES', authOrgRoles)
        commit('SET_ROLENAME', authOrgs)
        commit('SET_SELECTED_ROLES', currentOrgRole)
        commit('SET_ORG', org)
        commit('SET_DPT', dpt)
        commit('SET_INSTU', instu)
        commit('SET_UP_ORG', upOrg)
        commit('SET_UP_DPT', upDpt)
        commit('SET_OTHER_INFO', otherInfo)
        sessionStore.set(USER_STORE_KEY, userInfo)
      }).catch(error => {
        reject(error)
      })
      let orgnum = ''
      sessionUser && sessionUser.additionals && sessionUser.additionals.authOrgRoles.map(item => {
        orgnum = item.orgId
      })
      await getMenuandcontrFnExt(data).then(response => {
        // 处理数据，将路径调整到对应的路由上，仅供测试使用
        response.menu.forEach(m => {
          if(m.funcUrl) {
            m.funcUrl = m.funcUrl.replace('pages/', '')
          }
        })
        // #TODO 使用测试菜单处理数据
        // response = {
        //   menu: demoMenus,
        //   contr: response[CTRL_JSON_ROOT]
        // }
        // console.log('菜单数据', response, {menu: demoMenus, contr: demoContrls})
        if (!response || !response[MENU_JSON_ROOT]) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_ORIGINAL_MENUS', response[MENU_JSON_ROOT])
        // 调用接口更新tab缓存数据
        dispatch('tagsView/updateCache', {}, { root: true })
        commit('SET_ORIGINAL_CTRLS', response[CTRL_JSON_ROOT])

        const copyData = extend({}, response, true)
        let menus = copyData[MENU_JSON_ROOT];
        menus = menus.filter(item => {
          return (item.menuName !== '工作台' && item.menuName !== 'Home');
        })
        const accessRoutes = generateRoutes(menus)
        // const contrs = toMappingFn(copyData.contr, CONTRL_MAPPING)
        commit('SET_ROUTES', accessRoutes)
        resetRouter()
        router.addRoutes(accessRoutes)

        // commit('SET_CTRLS', contrs) // TODO 操作级权限点
      }).catch(error => {
        reject(error)
      })

      resolve()
    })
  },

  // 注销登录
  logout ({ dispatch, commit, state }, flag) {
    if(flag) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', {})
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_EXPIRES_IN', '')
        commit('SET_REFRESH_TOKEN', '')
        // commit('SET_ROLES', []) // 会导致首页数据重新刷新
        commit('SET_ORIGINAL_MENUS', [])
        commit('SET_ORIGINAL_CTRLS', [])
        removeToken()
        if (window.MICRO) {
          cleanAllSession()
        } else {
          cleanSession()
        }
        resetRouter()
        resolve()
      })
    }else{
      return new Promise((resolve, reject) => {
        logoutFn({ token: state.token }).then(() => {
          commit('SET_TOKEN', {})
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_EXPIRES_IN', '')
          commit('SET_REFRESH_TOKEN', '')
          // commit('SET_ROLES', []) // 会导致首页数据重新刷新
          commit('SET_ORIGINAL_MENUS', [])
          commit('SET_ORIGINAL_CTRLS', [])
          // 用户退出登录后清除菜单访问记录
          dispatch('tagsView/delAllVisitedViews', {}, { root: true })
          removeToken()
          if (window.MICRO) {
            cleanAllSession()
          } else {
            cleanSession()
          }
          resetRouter()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },

  // 移除Token信息
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_EXPIRES_IN', '')
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_LAST_REFRESH_TIME', '')
      commit('SET_ROLES', [])
      commit('SET_ORIGINAL_MENUS', []) // 清除菜单信息
      commit('SET_ORIGINAL_CTRLS', []) // 清除控制点信息
      removeToken()
      cleanSession()
      resetRouter()
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
