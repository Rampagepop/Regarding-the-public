/**
 * @description 懒加载路由
 * @param {String} view 待加载路由路径
 * @returns Promise 返回加载对应的vue页面
 */
export const loadView = (view, name) => {
  /** 新增开始 */
  const mMico = window.MICRO ? window.MICRO.getMICROSubRoute(view) : false;
  if(mMico) {
    return null;
  }
  /** 新增结束 */
  // 去掉第一个/，优化上一版写法
  view = /^\/.*/.test(view) ? view.slice(1) : view
  // name以数字开头则添加P字母
  name && !isNaN(parseInt(name.slice(0, 1))) && (name = "P" + name)
  if (process.env.NODE_ENV === 'development') {
    return () => {
      const component = require(`@/views/${view}`).default
      if (name) {
        component.name = name.replace(/-/g, '')
      }
      return Promise.resolve(component)
    }
  } else {
    return (resolve) => {
      return require([`@/views/${view}`], function (module) {
        if (name) {
          module.default.name = name.replace(/-/g, '')
        }
        resolve(module)
      })
    }
  }
}
