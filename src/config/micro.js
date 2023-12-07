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
 */
function camelize(str, sep = '-') {
  let regexp = new RegExp(`${sep}(\w)`, 'g');
  if (sep === '-') {
    regexp = /-(\w)/g;
  } else if (sep === '_') {
    regexp = /_(\w)/g;
  }
  return `micro_${str.replace(regexp, function (_, c) { return c ? c.toUpperCase() : '' })}`;
}
// 配置子应用
const apps = (() => {
  const subApps = [{
    name: 'cdp-web', // jQuery示例 'cdp-web'
    devActiveRule: '#/cdpWeb',
    proActiveRule:'#/cdpWeb',
    routeRule: 'cdpWeb',
    routeMode: 'hash', // 路由模式，默认hash ,可为history//192.168.50.33:31011 
    url: process.env.NODE_ENV === "production" ? '//192.168.50.33:30976' : '//localhost:8102',
    //'//192.168.50.62'  : 
    // port: '8102'
    //process.env.NODE_ENV === "production"? 'http://192.168.50.62/index.html' : '', //http://192.168.50.62/index.html#/login?redirect=%2F解决生产上entry为空的问题
  }];
  // const subApps = []

  const devAppsProxy = [];
  subApps.forEach(app => {
    let url = app.url || `//localhost:${app.port}`
    if (process.env.NODE_ENV === "production") {
      url = app.url || `${process.env.VUE_APP_ROUTE_URL}${app.name}/#`
    }
    const rule = `${process.env.NODE_ENV === "production" ? process.env.VUE_APP_ACTIVE_RULE : "#/"}${app.name}`
    console.log(`${app.name}: [${rule}] ${url}`)

    devAppsProxy.push({
      name: app.name, // 配置子应用名称
      devEntry: url, // 子应用访问路径
      proEntry: url, //解决生产上entry为空的问题
      container: `#${camelize(app.name)}`, // 子应用挂载到父应用的容器ID
      routeRule: app.routeRule, // 子应用路由基础路由设置
      devActiveRule: app.devActiveRule || app.routeRule,
      proActiveRule: app.proActiveRule || app.routeRule, //用于生产测试环境问题
      loadType: app.loadType || "micro", // 标识是html,js,css类型项目接入
      routeMode: app.routeMode || 'hash',
      props: {}
    })
  });
  return devAppsProxy
})()

export default apps;
