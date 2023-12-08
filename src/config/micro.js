import { getMicroAppsRoutes } from '@/api/uniAuth/index'
import { resigsterApps } from "@yufp/xy-micro"

var ALL_IMG_REGEX = /(<img[\s\S]*?)[\s\S]*?[\/]?>/gi;
var IMG_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
var FULL_PATH_REGEX = /http(s)?:\/\//;
function replaceStaticPath(appContent) {
  // 处理图片src路径
  var allImg = appContent.match(ALL_IMG_REGEX);
  allImg && allImg.forEach(img => {
    var imgPaths = img.match(IMG_SRC_REGEX)
    if (!FULL_PATH_REGEX.test(imgPaths[2])) {
      // 替换路径
      appContent = appContent.replace(imgPaths[0], imgPaths[0].replace(imgPaths[2], 'http://127.0.0.1:5500/yufp-web/' + imgPaths[2]))
    }
  })
  return appContent
}
/**
 * @description 将短杆拼接转换成驼峰
 * @param {String} str 待处理字符串
 * @param {String} sep 分隔符
 * @param {String} isneedmicro 是否需要加上micro
 */
function camelize(str, sep = '-', isneedmicro = true) {
  let regexp = new RegExp(`${sep}(\w)`, 'g');
  if (sep === '-') {
    regexp = /-(\w)/g;
  } else if (sep === '_') {
    regexp = /_(\w)/g;
  }
  // return `micro_${str.replace(regexp, function (_, c) { return c ? c.toUpperCase() : '' })}`;
  return isneedmicro ? `micro_${str.replace(regexp, function (_, c) { return c ? c.toUpperCase() : '' })}` : `${str.replace(regexp, function (_, c) { return c ? c.toUpperCase() : '' })}`;
}

/**
 * @description 获取微前端路由
 * @param {String} data 
 * @param {String} microApps
 * @returns
 */
function getMicroRouter(data, microApps) {
  // 用于存放所有子应用应该有的接口
  const microRouterArray = {}
  // 用于处理微前端需要的路由参数 区分应用，不同的应用归类到一起
  microApps.forEach(ls => {
    microRouterArray[ls] = []
    data && data.forEach(item => {
      if ((item.routePath && item.routePath.substr(0, ls.length + 1)).includes(ls)) {
        microRouterArray[ls].push({ 'path': item.routePath })
      }
      return microRouterArray
    })
    return microRouterArray
  })
  return microRouterArray
}
/**
 * @description 构建子应用列表
 */
function getConfigSubAppsList(apps) {
  const subApps = []
  apps.forEach(item => {
    subApps.push({
      name: item.name, // 配置子应用名称
      devActiveRule: `#/${camelize(item.name, '-', false)}`, // 子应用访问路径
      proActiveRule: `#/${camelize(item.name, '-', false)}`, // 子应用访问路径
      routeRule: `${camelize(item.name, '-', false)}`, // 子应用挂载到父应用的容器ID
      routeMode: 'history', // 路由模式，默认hash,可为history
      devActiveRule: app.devActiveRule || app.routeRule,
      url: process.env.NODE_ENV === "production" ? (item.prodUrl && item.prodUrl.includes('://') ? "//" + item.prodUrl.split('://')[1] : item.prodUrl) : '//10.51.99.15:8102'
    })
  })
  const devAppsProxy = [];
  const buildTime = new Date().getTime()
  subApps.forEach(app => {
    let url = app.url || `http://localhost:${app.port}`
    // if (process.env.NODE_ENV === "production") {
    //   url = app.url || `${process.env.VUE_APP_ROUTE_URL}${app.name}/#`
    // }
    // const rule = `${process.env.NODE_ENV === "production" ? process.env.VUE_APP_ACTIVE_RULE : "#/"}${app.name}`
    // console.log(`${app.name}: [${rule}] ${url}`)

    devAppsProxy.push({
      name: app.name, // 配置子应用名称
      devEntry: url + `?t=${buildTime}`, // 子应用访问路径
      proEntry: url + `?t=${buildTime}`, // 子应用访问路径
      container: `#${camelize(app.name)}`, // 子应用挂载到父应用的容器ID
      routeRule: app.routeRule, // 子应用路由基础路由设置
      devActiveRule: app.devActiveRule || app.routeRule,
      proActiveRule: app.proActiveRule || app.routeRule,
      loadType: app.loadType || "micro", // 标识是html,js,css类型项目接入
      routeMode: app.routeMode || 'history', // 路由模式，默认hash,可为history
      props: {}
    })
  });
  return devAppsProxy
}
/**
 * @description 通过后端接口获取到相关微前端配置
 */
export function getApps() {
  let microapps = []
  return getMicroAppsRoutes ({ type: '0'}).then(res => {
    if (res.code === "0") {
      let _tmp_microapps = {} // 临时对应于与标注重复
      res && res.data && res.data.forEach(item => {
        if (!_tmp_microapps[item.frontName]) {
          microapps.push({
            name: item.frontName,
            developUrl: serviceName.ncmService ? serviceName.ncmService.split(':')[1] : '',
            prodUrl: serviceName.ncmService ? serviceName.ncmService.split(':')[1] : ''
          })
          _tmp_microapps[item.frontName] = true
        }
      })
      const microPrefixs = microapps.map(item => '/' + camelize(item.name, '-', false))
      const routerArray = getMicroRouter(res.data, microPrefixs)
      // 将注册的路由整合后放到子应用中进行动态配置
      window.sessionStorage.setItem('microRouters', JSON.stringify(routerArray))
      resigsterApps(getConfigSubAppsList(microapps))
    }
  }).catch(() => {
    resigsterApps(getConfigSubAppsList(microapps))
  })
}

// 配置子应用
// const apps = (() => {
  // const subApps = [{
  //   name: 'micro_jquery', // jQuery示例
  //   url: '//localhost:8091/jquery',
  //   routeRule: '#/jquery',
  //   loadType: 'html'
  // }];
//   const subApps = []

//   const devAppsProxy = [];
//   subApps.forEach(app => {
//     let url = app.url || `http://localhost:${app.port}`
//     if (process.env.NODE_ENV === "production") {
//       url = app.url || `${process.env.VUE_APP_ROUTE_URL}${app.name}/#`
//     }
//     const rule = `${process.env.NODE_ENV === "production" ? process.env.VUE_APP_ACTIVE_RULE : "#/"}${app.name}`
//     console.log(`${app.name}: [${rule}] ${url}`)

//     devAppsProxy.push({
//       name: app.name, // 配置子应用名称
//       devEntry: url, // 子应用访问路径
//       container: `#${camelize(app.name)}`, // 子应用挂载到父应用的容器ID
//       routeRule: app.routeRule, // 子应用路由基础路由设置
//       devActiveRule: app.devActiveRule || app.routeRule,
//       loadType: app.loadType || "micro", // 标识是html,js,css类型项目接入
//       props: {}
//     })
//   });
//   return devAppsProxy
// })()
// console.log('子应用列表: ', apps)

// export default apps;
