/**
 * @description 定义公共全局变量使用
 */
export const X_AUTHORIZATION = 'Authorization'
export const XIAO_YU_TOKEN = 'UFP-' + X_AUTHORIZATION // token存储key值
export const USER_STORE_KEY = 'YUFP-SESSION-USER' // 会话存储前缀
export const USER_STORE_TEMP = 'TEMP-TOKREM' // 用于初始不存储token避免刷新跳转到首页 临时存储一个用于获取机构
export const MENU_ROOT_PID = '0' // 菜单根节点父级Id
export const MENU_STOREOG_KEY = 'YUFP-SESSION-MENUS-OG'
export const MENU_STORE_KEY = 'YUFP-SESSION-MENUS' // 菜单存储前缀
export const MICO_KYCR_SEARCH_KEYWORDS = 'MICO-KYCR-SEARCH-KEYWORDS' // 菜单最近搜索关键词
export const CTRL_STOREOG_KEY = 'YUFP-SESSION-STRLS-OG'
export const CTRL_STORE_KEY = 'YUFP-SESSION-STRLS'
export const CURRENT_TOP_MENU_STORE_KEY = 'YUFP-SESSION-CURRENT_TOP_MENU' // 当前选中的一级菜单存储前缀
export const CURRENT_MENU_ITEM_STORE_KEY = 'YUFP-SESSION-CURRENT_MENU_ITEM' // 当前选中的最低一级菜单存储前缀
export const ROUTER_STORE_KEY = 'YUFP-SESSION-ROUTER'
export const USER_JSON_ROOT = '' // 用户返回数据节点,如：'data.user'
// #TODO 有部分代码此处key值被写的不一样
export const MENU_JSON_ROOT = 'menu' // 菜单返回数据节点,如：'data.menus'
export const CTRL_JSON_ROOT = 'contr' // 控制点返回数据节点,如：'data.ctrls'，控制点数据，查询需按菜单ID、功能ID排序返回
export const DYNAMIC_ROUTES = 'DYNAMIC_ROUTES' // 动态路由，页面动态增加路由时存储动态路由
export const DYNAMIC_ROUTES_PARAMS = 'DYNAMIC_ROUTES_PARAMS' // 动态路由对应的参数信息
export const VIEW_SIZE = 'VIEW-SIZE' // 视窗大小
export const LANGUAGE = 'language' // 语言
export const SCREENFULL = 'screenfull' // 是否全屏
export const ADMIN_ROLECODE = 'R0120210926000001001,admin'; // 管理员角色编号
export const ADMIN_ROLECODES = ADMIN_ROLECODE.split(','); // 管理员角色编号列表
export const SMS_CODE_TIMEOUT = 60; // 短信验证码失效时间
export const SHOW_ADV_DIALOG = 'SHOW-ADV-DIALOG' // 是否显示广告
export const MAX_LIKE_MENU_COUNT = 8 // 最多收藏菜单数量
export const MAX_COMMON_MENU_COUNT = 10 // 最多展示常用菜单数量
export const MAX_SEARCH_KEYWORDS_COUNT = 5 // 查询关键字保留最大数量
export const MAX_SEARCH_RESULT_COUNT = 5 // 查询各项结果展示最大数量
export const MENU_LIKE = 'YUFPS-MENU-LIKE' // 收藏菜单数据列表缓存key
export const VISITED_VIEWS = 'VISITED-VIEWS' // tab标签缓存数据
export const SEARCH_KEYWORDS = 'SEARCH-KEYWORDS' // 搜索历史关键词
export const FROM_LOGIN = 'FROM-LOGIN' // 用户登陆状态信息
export const USER_MESSAGE_CONFIG = 'USER_MESSAGE_CONFIG' // 用户消息提醒配置
export const CURRENTFIRSTMENU = 'CURRENT-FIRST-MENU' // 当前一级菜单key
export const CURRENMENUINDEX = 'CURRENT-MENU-INDEX' // 当前一级菜单index


export const USER_MAPPING = { // 用户后端数据模型映射
  userId: 'userId', // 用户ID
  userName: 'userName', // 用户姓名
  userCode: 'loginCode', // 用户登录码
  userSex: 'userSex', // 用户性别
  userAvatar: 'userAvatar', // 用户头像
  logicSys: 'logicSys', // 逻辑系统Object
  roles: 'roles', // 角色数组Object
  org: 'org', // 机构Object
  dpt: 'dpt', // 部门Object
  instu: 'instuOrg', // 金融机构Object
  upOrg: 'upOrg', // 上级机构Object
  upDpt: 'upDpt', // 上级部门Object
  loginCode: 'loginCode' // 登录代码
}

export const MENU_MAPPING = { // 菜单后端数据模型映射
  mId: 'menuId', // 菜单ID
  mText: 'menuName', // 菜单名称
  mPid: 'upMenuId', // 上级菜单ID
  mIcon: 'menuIcon', // 菜单图标
  routeId: 'funcId', // 菜单功能ID
  routeUrl: 'funcUrl', // 菜单功能URL
  mType: 'menuType' // 菜单类型
}

export const CONTRL_MAPPING = { // 控制点数据模型映射
  mId: 'menuId', // 菜单ID
  rId: 'funcId', // 菜单功能ID
  cId: 'contrCode', // 控制点CODE
  cText: 'contrName' // 控制点名称
}
