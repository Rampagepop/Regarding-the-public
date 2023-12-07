import { request, sessionStore } from "@/utils";
import { USER_STORE_KEY, X_AUTHORIZATION } from '@/config/constant/app.data.common'
import backend from '@/config/constant/app.data.service'
const preApp = backend.workflow;
// const preApp = '';
// 自定义token //如果是接口是流程，则使用自定义token
const userInfo = sessionStore.get(USER_STORE_KEY);
const {userCode, userName} = userInfo;
const {orgCode, orgName} = userInfo.org;
const groupCode = process.env.VUE_APP_BASE_API === 'http://bkycr.dev.pab.com.cn/kycr-api' ? 'CIMP-BPAAS-UFLOW' : 'KYCR';
//dev:CIMP-BPAAS-UFLOW  fat/uat/prd:KYCR
export const tokenVal = encodeURI(JSON.stringify({
  userCode, userName, groupCode, orgCode, orgName
}));
/*
@description 待办事项330 毛元
 */
//1.0接口是各业务系统待办数据的汇总 http://22.7.17.192:9999/8080
export function otherQueryTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/bridge/other/queryTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}
//2.0接口是workflow的待办数据； 
export function workflowQueryTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/bridge/workflow/queryTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}
//流程跟踪接口 http://22.7.17.192:9999
export function queryCompleteTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/bridge/workflow/queryCompleteTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}
/**
 * @description 获取待办任务卡片列表
 * @param {Object} params 查询参数
 */
export function statisticsTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/statisticsTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 获取任务总览卡片列表
 * @param {Object} params 查询参数
 */
export function overviewTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/overviewTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 任务总览-列表
 * @param {Object} params 查询参数
 */
export function queryTasksFn(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/queryTasks`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}
export const queryTasks = `${preApp}/v1.0/kycr-workflow/queryTasks`

/**
 * @description 任务总览-列表
 * @param {Object} params 查询参数
 */
export function modifyTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/modifyTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 任务 - 新增督导任务
 * @param {Object} params 查询参数
 */
export function superviseTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/superviseTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 任务 - 督导任务列表查询
 * @param {Object} params 查询参数
 */
export function querySuperiveTasks(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/querySuperiveTasks`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 任务 - 查询快速清单
 * @param {Object} params 查询参数
 */
export function selectShortcuts(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/selectShortcuts`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 任务 - 快速清单新增&删除
 * @param {Object} params 查询参数
 */
export function shortcut(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/shortcut`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 任务 - 计算任务数量
 * @param {Object} params 查询参数
 */
export function countTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/countTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 任务 - 导出
 * @param {Object} params 查询参数
 */
export function exportTasks(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/exportTasks`,
    method: "post",
    params,
    headers: {},
    responseType: 'blob'
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 日历查询
 * @param {Object} params 查询参数
 */
export function queryCalendarTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/queryCalendarTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}

/**
 * @description 日历新增
 * @param {Object} params 查询参数
 */
export function calendarTask(params) {
  const reqObj = {
    url: `${preApp}/v1.0/kycr-workflow/calendarTask`,
    method: "post",
    params,
    headers: {}
  };
  reqObj.headers[X_AUTHORIZATION] = tokenVal;
  return request(reqObj);
}


// 获取用户列表
export function getUserList(data) {
  return request({
    url: backend.permissionService + '/v1.0/permission/queryUsers',
    method: 'post',
    data,
  })
}

// 获取机构列表
export function getOrgList(data) {
  return request({
    url: backend.permissionService + '/permOrgInfo/selectOrgByOrgName',
    data,
  })
}

// 获取分行列表
export function getBranchList(data) {
  return request({
    url: backend.riskCmc + '/groupRiskManager/selectBranchOrgByOrgName',
    data,
  })
}