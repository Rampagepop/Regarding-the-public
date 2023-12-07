/**
 *  深层合并两个对象
 */
export default function deepMergeObj(obj1, obj2) {
  Object.keys(obj2).forEach(key =>
    obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ? deepMergeObj(obj1[key], obj2[key]) : obj2[key]
  )
  return obj1
}
