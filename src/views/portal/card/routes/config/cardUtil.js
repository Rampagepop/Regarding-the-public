import {lookup} from "@/utils";

/**
 * 批量获取字典项的信息
 */
export function getOptsByDataCodes(codes, cb, isArray = true) {
  // 先批量注册
  lookup.reg(codes.join(','));
  const obj = {};
  let count = 0;
  const recur = (code) => {
    // bind会等待reg注册完后调用回调
    lookup.bind(code, () => {
      obj[code] = lookup.find(code, isArray);
      count++;
      if (count >= codes.length) {
        cb(obj)
      } else {
        recur(codes[count]);
      }
    })
  }
  recur(codes[0])
}
