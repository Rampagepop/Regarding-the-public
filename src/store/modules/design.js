/*
 * @Description: 
 * @Autor: yangheng2
 * @Date: 2021-12-02 10:40:25
 * @LastEditors: yangheng2
 * @LastEditTime: 2022-03-21 16:53:04
 */

import Vue from 'vue'
import { Message } from 'yuwp-ui'
// import { genUUID, doFilter, filterNullProps } from '@/views/yuxp/utils/index'
import { request } from 'xy-utils'
// import { Bus } from '@/views/yuxp/designer/main/components/index.js'
// import ModelBus from '../../views/yuxp/designer/model/modelBus'
const state = {
  configModelRow: {},
  selectTab: {},
  selectTabName: '',
  selectedNode: {},
  hoverNode: {},
  designActiveTab: '',
  tabs: [],
  modelList: [],
  projectInfo: {},
  modelGrouptree: [],
  pageGrouptree: [],
  leftTreeActiveName: 'page',
  isLeftPanel: true,
  isRightPanel: true,
}
const mutations = {
  SET_INIT: (state, selected) => {
    state.configModelRow = {};
    state.selectTab = {};
    state.selectTabName = '';
    state.selectedNode = {};
    state.hoverNode = {};
    state.designActiveTab = '';
    state.tabs.length = 0;
    state.modelList = [];
    state.projectInfo = {};
    state.modelGrouptree.length = 0;
    state.pageGrouptree.length = 0;
  },
  SET_SELECTED: (state, selected) => {
    console.log('selected', selected)
    state.selectedNode = selected;
  },
  SET_HOVER: (state, hoverNode) => {
    // console.log('hoverNode', hoverNode)
    state.hoverNode = hoverNode;
  },
  /**
   * 设置中间活动页签
   * @param {*} state 
   * @param {*} designActiveTab 
   */
  SET_ACTIVETAB: (state, designActiveTab) => {
    state.designActiveTab = designActiveTab;
    // state.selectedNode = {};
  },
  SET_ACTIVE_TABNAME: (state, name) => {
    state.selectTabName = name;
  },

  ADD_TAB: (state, data) => {
    state.tabs.push(data);
    state.selectTab = data;
  },
  // SET_TAB: (state, data) => {
  //   if (state.selectTab.modelFieldMode === 'excel') {
  //     state.selectTab.modelFieldMode = 'list'
  //     ModelBus.$emit('to-list')
  //   }
  //   if (data.tabType === 'model') {
  //     ModelBus.$emit('del-tab', 'modelfield,formprop,queryprop')
  //   }
  //   state.selectTab = data;
  //   if (data.fields) {
  //     state.selectTab.selectedNode = state.selectTab.fields[0]
  //   }
  // },
  CLOSE_ALL_TAB: (state) => {
    state.tabs.splice(0, state.tabs.length)
    state.selectTab = {}
  },
  CLOSE_OTHER_TAB: (state, data) => {
    state.tabs.splice(0, state.tabs.length)
    state.tabs.push(data)
    state.selectTab = state.tabs[0]
  },
  SET_PROJECT: (state, data) => {
    state.projectInfo = data;
  },
  // 存储模型
  SET_MODEL: (state, data) => {
    state.modelList.splice(0)
    state.modelList.push(...data)
  },
  /**
   * 清空当前设计器
   * @param {*} state 
   * @param {*} data 
   */
  CLEAR_TAB: (state, data) => {
    if (state.selectTab.tabType === 'page') {
      state.selectTab.fields.splice(0, state.selectTab.fields.length)
      state.selectTab.fields.push(data)
      state.selectTab.needSave = true;
    }

  },
  SET_CONFIG_MODEL_ROW({ configModelRow, selectTab }, data) {
    state.configModelRow = data
  },
  UPDATE_NEED_SAVE({ state }) {
    state.selectTab.needSave = true
  },
  // SET_MODEL_FIELDS({ selectTab }, data) {
  //   if (selectTab.tabType === 'model') {
  //     selectTab.xpModelFields.splice(0)
  //     data.forEach(item => {
  //       item.rowShow = doFilter(item, selectTab.dataFilterMode)
  //     })
  //     selectTab.xpModelFields.push(...data)
  //   }
  // },
  // FILTER_MODEL_FIELD_LIST({ selectTab }) {
  //   selectTab.xpModelFields && selectTab.xpModelFields.forEach(item => {
  //     item.rowShow = doFilter(item, selectTab.dataFilterMode)
  //   })
  // },
  UPDATE_PAGE_FUNCTION_CODE({ selectTab }, data) {
    selectTab.functionCode = data
  },
  UPDATE_PAGE_FUNCTION_CODE_ERR({ selectTab }, msg) {
    if (!msg) {
      selectTab.codeErrMsg.splice(0)
      return
    }
    selectTab.codeErrMsg.push(msg)
  },
  UPDATE_PAGE_FUNCTION_FOR_CODE({ selectTab }, data) {
    selectTab.functionFormatCode = data
  },
  UPDATE_PAGE_ACTIVE_NAME({ selectTab }, mode) {
    selectTab.pageActiveName = mode
  },
  // 表格/excel
  UPDATE_MODEL_FIELD_MODE({ selectTab }, mode) {
    selectTab.modelFieldMode = mode
  },
  // 数据筛选
  UPDATE_DATA_FILTER_MODE({ selectTab }, mode) {
    selectTab.dataFilterMode = mode
  },
  UPDATE_PAGE_GROUP_TREE({ pageGrouptree }, data) {
    pageGrouptree.splice(0)
    pageGrouptree.push(...data)
  },
  UPDATE_MODEL_GROUP_TREE({ modelGrouptree }, data) {
    modelGrouptree.splice(0)
    modelGrouptree.push(...data)
  },
  UPDATE_DATA_UPDATED(state, flag) {
    state.selectTab.dataUpdated = flag
  },
  UPDATE_LEFTTREE_ACTIVE_NAME(state, name) {
    state.leftTreeActiveName = name
  },
  UPDATE_IS_LEFT_PANEL(state, flag) {
    state.isLeftPanel = flag
  },
  UPDATE_IS_RIGHT_PANEL(state, flag) {
    state.isRightPanel = flag
  },
}
const actions = {
  doFilterFieldList({ commit }, mode) {
    commit('UPDATE_DATA_FILTER_MODE', mode)
    commit('FILTER_MODEL_FIELD_LIST')
  },
  // addModelField({ commit, state }) {
  //   if(state.selectTab.modelFieldMode === 'excel') {
  //     return Message({type: 'warning', message: '当前处于批量编辑模式，可在任意一行上右击鼠标新增行！'})
  //   }
  //   const sortNo = state.selectTab.xpModelFields.length + 1
  //   const row = Vue.observable({ rowShow: true, fieldId: genUUID(16), modelId: state.selectTab.modelId || '', fieldCode: '', tableField: '', fieldName: '', placeholder: '', fieldType: '', fieldI18N: '', formUiTypeName: '', formUiType: '', formUiProps: '{}', dataCode: '', filterType: '', translateMode: '', formIsHidden: '', formIsDisable: '', formIsRequire: '', formColSpan: '', formLabelWidth: '', formGroupTitle: '', formSortNo: sortNo, formDefalutValue: '', formVerifyRules: '', formServerVerify: '', formVerifyRulesName: '', formFormatRules: '', formFormatRulesName: '', listIsHidden: '', listIsEditable: '', listFixed: '', listIsLocalSortable: '', listWidth: '', listAlignType: '', listFormatRules: '', listFormatRulesName: '', listSortNo: sortNo, queryIsShow: '', queryUiType: '', queryUiProps: '{}', queryIsRequire: '', excelIsTemplate: '', tenantId: '', versionNo: '', createUser: '', createTime: '', updateUser: '', updateTime: '' })
  //   state.selectTab.xpModelFields.push(row)
  //   ModelBus.$emit('addTab', { name: 'modelfield' })
  //   ModelBus.$emit('set-row-active', state.selectTab.xpModelFields.length - 1)
  //   commit('SET_CONFIG_MODEL_ROW', row)
  // },
  deleteModelField({ state }) {
    if (state.selectTab.checkedRows.includes('all')) {
      state.selectTab.xpModelFields.splice(0)
      state.selectTab.checkedRows.splice(0)
    } else {
      const filters = state.selectTab.xpModelFields.filter((item, index) => {
        return !state.selectTab.checkedRows.includes('checkVal' + index)
      })
      state.selectTab.xpModelFields.splice(0)
      state.selectTab.xpModelFields.push(...filters)
      state.selectTab.checkedRows.splice(0)
    }
  },
  // openModel({ dispatch, commit, state }, modelCode) {
  //   return new Promise((resolve, reject) => {
  //     const model = state.tabs.find(item => {
  //       return item.modelCode === modelCode;
  //     })
  //     if (model) {
  //       // 已经打开激活即可
  //       Bus.$emit('SET_ACTIVETAB', {
  //         target: model.id,
  //       });
  //       resolve(model)
  //     } else {
  //       const model = state.modelList.find(item => {
  //         return item.modelCode === modelCode
  //       })
  //       if (model) {
  //         commit('ADD_TAB', {
  //           ...model,
  //           id: model.modelId,
  //           tabType: 'model',
  //           modelFieldMode: 'list',
  //           dataFilterMode: 'all',
  //           checkedRows: [],
  //           xpModelFields: [],
  //           dataUpdated: true
  //         })
  //         Bus.$emit('SET_ACTIVETAB', {
  //           target: model.modelId,
  //         });
  //         resolve(model)
  //       } else {
  //         resolve(null)
  //       }
  //     }
  //   })
  // },
  // saveModel({ state }) {
  //   if (state.selectTab.tabType !== 'model') {
  //     return Promise.reject(new Error('当前选中页签不是模型'))
  //   }
  //   if (state.selectTab.modelFieldMode === 'excel') {
  //     ModelBus.$emit('update-data')
  //   }
  //   ModelBus.$emit('del-tab', 'formprop,queryprop')
  //   const getAllModelData = () => {
  //     const model = []
  //     state.selectTab.xpModelFields.forEach(item => {
  //       filterNullProps(item.queryUiProps)
  //       filterNullProps(item.formUiProps)
  //       item.queryUiProps = typeof item.queryUiProps === 'object' ? JSON.stringify(item.queryUiProps).replace(/\\{2}/g, '\\') : item.queryUiProps
  //       item.formUiProps = typeof item.formUiProps === 'object' ? JSON.stringify(item.formUiProps).replace(/\\{2}/g, '\\') : item.formUiProps
  //     })
  //     model.push({
  //       ...state.selectTab
  //     })
  //     return model
  //   }
  //   const model = getAllModelData()
  //   return model.length > 0 ? request({
  //     url: backend.yuxpService + '/api/model/batch/update',
  //     method: 'POST',
  //     data: model
  //   }) : Promise.resolve('没有打开任何模型页签')
  // }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
