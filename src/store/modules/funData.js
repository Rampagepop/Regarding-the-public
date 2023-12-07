/**
 * @created by zhuly8 2021-04-06
 * @updated by
 * @description 全局公共数据存储
 */
/* eslint camelcase:0 */
import { clone } from '@/utils'
import { getOrgTree, getenableroles, getallroles } from '@/api/common/oauth'
const state = {
  orgTreeData: [], // 机构树
  rolesData: [], // 系统所拥有的所有角色列表
}
const mutations = {
  SET_ORG_TREE_DATA: (state, data) => {
    state.orgTreeData = clone(data, []);
  },
  SET_ROLES_DATA: (state, data) => {
    state.rolesData = clone(data, []);
  },
}
const actions = {
  orgTreeFn({dispatch, commit}, res) {
    return new Promise((resolve, reject) => {
      console.log(res, resolve, reject, 'orgTreeFn获取机构数报错栈溢出？')
      getOrgTree().then(res => {
        commit('SET_ORG_TREE_DATA', res.data);
        resolve(res);
      }).catch(err => {
        console.log(err, 'orgTreeFn===')
      })
    })
  },
  rolesDataFn({dispatch, commit}, res) {
    return new Promise((resolve, reject) => {
      console.log(res, resolve, reject, 'rolesDataFn===start')
      getenableroles().then(res => {
        commit('SET_ROLES_DATA', res.data);
        resolve(res);
      }).catch(err => {
        console.log(err, 'rolesDataFn')
      })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
