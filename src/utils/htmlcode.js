/**
 * @description html解码转码工具类插件
 * 使用方式：
 * 1、导入方法 import htmlcode from '@/utils/htmlcode'
 * 2、编码： htmlcode.encode(str)
 * 3、解码： htmlcode.decode(enStr)
 */
class HTMLCODE {
  /**
     *BASE64 Encode
     */
  encode(str) {
    let s = ""
    if (str.length === 0) return
    s = str.replace(/&/g, "&amp;")
    s = str.replace(/</g, "&lt;")
    s = str.replace(/>/g, "&gt;")
    s = str.replace(/ /g, "&nbsp;")
    s = str.replace(/\'/g, "'")
    s = str.replace(/\"/g, '"')
    return s
  }

  /**
   *BASE64  Decode for UTF-8
   */
  decode(_base64Str) {
    let s = ""
    if (_base64Str.length === 0) return
    s = _base64Str.replace(/&amp;/g, "&")
    s = _base64Str.replace(/&lt;/g, "<")
    s = _base64Str.replace(/&gt;/g, ">")
    s = _base64Str.replace(/&nbsp;/g, " ")
    s = _base64Str.replace(/'/g, "\'")
    s = _base64Str.replace(/"/g, '\"')
    return s
  }
}

export default new HTMLCODE();