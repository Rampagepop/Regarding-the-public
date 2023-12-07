import { request } from '@/utils'
import backend from '@/config/constant/app.data.service'

/**
 * @description 新增开屏广告
 * @param {Object} params 查询参数
 */
export function createAdvertisement(params) {
  return request ({
    url: `${backend.portalService}/portalAdvertisementInfo/createAdvertisement`,
    method: 'post',
    params
  })
}

/**
 * @description 暂存开屏广告
 * @param {Object} params 查询参数
 */
export function createTemporaryAdvertisement(params) {
  return request ({
    url: `${backend.portalService}/portalAdvertisementInfo/createTemporaryAdvertisement`,
    method: 'post',
    params
  })
}
/**
 * @description 修改开屏广告
 * @param {Object} params 查询参数
 */
export function modifyAdvertisemenById(params) {
  return request ({
    url: `${backend.portalService}/portalAdvertisementInfo/modifyAdvertisemenById`,
    method: 'post',
    params
  })
}
/**
 * @description 开屏广告删除
 * @param {Object} params 参数
 */
export function deleteAdvertisemenById(params) {
  return request ({
    url: `${backend.portalService}/portalAdvertisementInfo/deleteAdvertisemenById`,
    method: 'post',
    params
  })
}

/**
 * @description 开屏广告列表
 */
export const findAdvertisemenList = `${backend.portalService}/portalAdvertisementInfo/findAdvertisemenList`;

/**
 * @description 查询单条广告详情
 */
export function findAdvertisemenById(params) {
  return request ({
    url: `${backend.portalService}/portalAdvertisementInfo/findAdvertisemenById`,
    method: 'post',
    params
  })
}

/**
 * @description 首页开屏广告展示
 */
export function advertisementShow(data) {
  return request ({
    url: `${backend.portalService}/api/xmhadvertisement/useradvert`,
    method: 'post',
    data
  })
}

/**
 * @description 首页开屏广告下线
 */
export function offlineAdv(data) {
  return request ({
    url: `${backend.portalService}/portalAdvertisementInfo/offline`,
    method: 'post',
    data
  })
}

/**
 * @description banner列表
 */
export const findBannerList = `${backend.portalService}/banner/findBannerList`;

/**
 * @description 门户banner展示
 */
export function showBanner(data) {
  return request ({
    url: `${backend.portalService}/api/xmhbanner/userbannerlist`,
    method: 'post',
    data
  })
}

/**
 * @description 门户banner新增
 */
export function createBanner(params) {
  return request ({
    url: `${backend.portalService}/banner/createBanner`,
    method: 'post',
    params
  })
}

/**
 * @description 门户banner修改
 */
export function modifyBanner(params) {
  return request ({
    url: `${backend.portalService}/banner/modifyBanner`,
    method: 'post',
    params
  })
}

/**
 * @description 门户banner删除
 */
export function deleteBannerById(params) {
  return request ({
    url: `${backend.portalService}/banner/deleteBannerById`,
    method: 'post',
    params
  })
}

/**
 * @description 门户banner详情
 */
export function findBannerById(params) {
  return request ({
    url: `${backend.portalService}/banner/findBannerById`,
    method: 'post',
    params
  })
}

/**
 * @description 获取用户消息列表
 */
export function getUserMessagesList(data) {
  return request ({
    url: `${backend.portalService}/api/xmhmessage/queryunreadmsg`,
    method: 'post',
    data
  })
}
/**
 * @description 消息一键阅读
 */
export function readAllMsg(data) {
  return request ({
    url: `${backend.portalService}/api/xmhmessage/readallmsg`,
    method: 'post',
    data
  })
}
/**
 * @description 消息阅读
 */
export function readMsg(data) {
  return request ({
    url: `${backend.portalService}/api/xmhmessage/readmsg?id=${data}`,
    method: 'post'
  })
}
/**
 * @description 获取未读消息列表
 */
export function getMessagesHasNoRead(data) {
  return request ({
    url: `${backend.portalService}/api/xmhmessage/queryunreadmsg`,
    method: 'post',
    data
  })
}

/**
 * @description 门户banner下线
 */
export function offlineBanner(params) {
  return request ({
    url: `${backend.portalService}/banner/offline`,
    method: 'post',
    params
  })
}


/**
 * @description 门户banner暂存
 */
export function createTemporaryBanner(params) {
  return request ({
    url: `${backend.portalService}/banner/createTemporaryBanner`,
    method: 'post',
    params
  })
}

// 问候语暂存文件上传
export const draftFileUpload = `${process.env.VUE_APP_BASE_API}${backend.portalService}/portalGreetInfo/createTemporaryLibPush`

// 问候语新增 文件上传接口
export const createLibPushFileUpload = `${process.env.VUE_APP_BASE_API}${backend.portalService}/portalGreetInfo/createLibPush`
// export const createLibPushFileUpload = `/portalGreetInfo/createLibPush`

// 问候语修改 文件上传接口
export const modifyLibGreetByIdFileUpload = `${process.env.VUE_APP_BASE_API}${backend.portalService}/portalGreetInfo/modifyLibGreetById`

/**
 * @description 问候语Id查询
 */
export function findGreetById(params) {
  return request ({
    url: `${backend.portalService}/portalGreetInfo/findGreetById`,
    method: 'post',
    params
  })
}

// 删除问候语
export function delGreet(params) {
  return request({
    url: backend.portalService + '/portalGreetInfo/deleteGreetById',
    // url: '/information/remove',
    // method: "post",
    method: "post",
    params
  });
}

/**
 *  @description 新建定向推送
 */
export function createDirPush(params) {
  return request ({
    url: `${backend.portalService}/portalGreetInfo/createDirPush`,
    method: 'post',
    params
  })
}

/**
 * @description 新建定向推送 暂存
 */
export function createTemporaryDirPush(params) {
  return request ({
    url: `${backend.portalService}/portalGreetInfo/createTemporaryDirPush`,
    method: 'post',
    params
  })
}

/**
 * @description 新建库推送(无文件) 暂存
 */
export function createTemporaryExceptFileLibPush(params) {
  return request ({
    url: `${backend.portalService}/portalGreetInfo/createTemporaryExceptFileLibPush`,
    method: 'post',
    params
  })
}

/**
 * @description 修改定向推送
 */
export function modifyDirGreetById(params) {
  return request ({
    url: `${backend.portalService}/portalGreetInfo/modifyDirGreetById`,
    method: 'post',
    params
  })
}

/**
 * @description 修改库推送(无文件)
 */
export function modifyLibGreetExceptFileById(params) {
  return request ({
    url: `${backend.portalService}/portalGreetInfo/modifyLibGreetExceptFileById`,
    method: 'post',
    params
  })
}

/**
 * @description 下线问候语
 */
export function greetOffline(params) {
  return request ({
    url: `${backend.portalService}/portalGreetInfo/offline`,
    method: 'post',
    params
  })
}

// 文件上传
export const fileUploadUrl = `${process.env.VUE_APP_BASE_API}${backend.portalService}/file/upload`
// export const fileUploadUrl = `/file/upload`

// 文件下载路径
export function getFileUrl(fileId) {
  return `${process.env.VUE_APP_BASE_API}${backend.portalService}/file/download/${fileId}`;
}
/**
 * 菜单&常用菜单查询API, 传递默认参数
 * @param {*} params
 */
export function findListLimit() {
  return request({
    url: `${backend.appOcaService}/api/adminsmmenucall/listMenuByType`,
    method: 'post',
    data: {
      menuType: '1'
    }
  })
}
// 获取用户当前资讯列表
export function getAskListTitle(data) {
  return request({
    url: `${backend.portalService}/api/xmhinformation/userinformationpage`,
    method: "post",
    data
  });
}
// 获取资讯列表
export function getAskList(data) {
  return request({
    url: `${backend.portalService}/api/xmhinformation/userinformationpage`,
    method: "post",
    data
  });
}
// 搜索资讯列表
export function getSearchAskList(data) {
  return request({
    url: `${backend.portalService}/api/xmhsearch/query`,
    method: "post",
    data
  });
}

// /**
//  * @description 用户工作台展示
//  *
//  */
// export function workbenchShow(params) {
//   return request ({
//     url: `${backend.portalService}/api/xmhcardbench/querybench`,
//     method: 'get',
//     params
//   })
// }

// 获得咨询详情
export function getAskDetail(params) {
  return request({
    url: `${backend.portalService}/api/xmhinformation/infouser/${params.id || ''}`,
    method: "post"
  });
}
// 用户阅读记录数
export function addViewTime(data) {
  return request({
    url: `${backend.portalService}/information/addViewTime`,
    method: "post",
    data
  });
}
// 返回文件访问路径
export function downloadAPI(params) {
  return request({
    url: `${backend.appOcaService}/file/download/${params}`,
    method: "post",
    responseType: "blob",
  });
}
// 全部已读
export function modifyStatus(params) {
  return request({
    url: `${backend.portalService}/api/xmhinformation/readallinfo`,
    method: "post",
  });
}
