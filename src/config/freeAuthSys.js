/**
 * Desc:&emsp;&ensp;特定前缀菜单直接跳转到对应的免登系统下对应的页面
 * @author  李渊&emsp;liyuan7@yusys.com.cn
 * @date    2022/11/02
 * @since   1.0.0
 * @version 1.0
 */
import {sessionStore} from "@/utils";
import {XIAO_YU_TOKEN} from "@/config/constant/app.data.common";

// 配置其他系统信息
const config = [
  {
    name: "信贷中台", // 描述该系统名称，非必须
    origin: "http://localhost:8102",
    // funUrl的前缀，用于注册菜单到门户时时自动添加，后续匹配后直接跳转（有无斜杠都不影响，只是一个标志，实际url会去掉prefix）
    funcUrlPrefix: "/cdpCusTest",
    // 在本系统中所属的菜单和业务功能模块，用来添加菜单同步到门户
    upMenuId: "c067244000a6442bad339dbfecbc10d6",
    modId: "60BDB9B372D64C5BAABFCD7FADF2D2A4",
  }
]


/**
 * 过滤url，决定是否需要跳转到其他系统
 * @param path
 * @returns {boolean} true:需要，false:不需要
 */
export function freeAuthSysFilterFn(path) {
  config.forEach(cfg => {
    if (path.startsWith(cfg.funcUrlPrefix) || path.startsWith("/" + cfg.funcUrlPrefix)) {
      const url = new URL(cfg.origin);
      url.searchParams.append("tokenInfo", encodeURIComponent(JSON.stringify(sessionStore.get(XIAO_YU_TOKEN))));
      url.hash = path.replace(cfg.funcUrlPrefix, "").replace("//", "/");
      window.open(url.toString(), "_blank")
      return true;
    }
  })
  return false
}

