/*
 * @Author: helin3
 * @Date: 2021-11-26 09:49:50
 * @LastEditors: yangheng2
 * @LastEditTime: 2022-01-05 11:30:44
 * @Description:
 */
import { request } from "xy-utils";

/**
 * 数据字典查询
 * @param {*} param
 */
export function GetPageSchema(pageId, type) {
  return request({
    url:
      backend.yuxpService +
      "/api/xppage/online/code?pageId=" +
      pageId +
      "&type=" +
      type,
    method: "get",
  });
}
