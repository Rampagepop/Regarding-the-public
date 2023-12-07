/**
 * @created by helin3 2019-04-11
 * @description 静态数据字典
 */

export default {
  CRUD_TYPE: [
    { key: 'ADD', value: '新增' },
    { key: 'EDIT', value: '编辑' },
    { key: 'DETAIL', value: '详情' }
  ],
  GENDER: [
    { key: '01', value: '男' },
    { key: '02', value: '女' }
  ],
  YES_NO: [
    { key: '01', value: '是' },
    { key: '02', value: '否' }
  ],
  YES_NO_YN: [
    { key: 'Y', value: '是' },
    { key: 'N', value: '否' }
  ],
  HASNO: [
    { key: '01', value: '有' },
    { key: '02', value: '无' }
  ],
  OBJECT_TYPE: [
    { 'key': 'R', 'value': '角色' },
    { 'key': 'U', 'value': '用户' },
    { 'key': 'D', 'value': '部门' },
    { 'key': 'G', 'value': '机构' }
  ],
  NOTICE_LEVEL: [
    { 'key': 'I', 'value': '重要' },
    { 'key': 'N', 'value': '一般' }
  ],
  TOP_FLAG: [
    { 'key': 'I', 'value': '是' },
    { 'key': 'N', 'value': '否' }
  ],
  USER_CLASSIFY: [
    { 'key': 'gg', 'value': '通知公告' },
    { 'key': 'kx', 'value': '行业快讯' }
  ],
  USER_STATUS: [
    { 'key': '01', 'value': '生效' },
    { 'key': '03', 'value': '待生效' },
    { 'key': '02', 'value': '失效' }
  ],
  DEPARTMENT: [
    { key: 't01', value: '技术一部' },
    { key: 't02', value: '技术二部' },
    { key: 'board_director', value: '董事会' },
    { key: 't03', value: '技术三部' },
    { key: 't04', value: '技术四部' }
  ],
  BRANCH: [
    { key: 'c1001', value: '成都支行' },
    { key: 'c1002', value: '北京总部' }
  ],
  EDUCATION_TYPE: [
    { key: '0', value: '博士' },
    { key: '1', value: '硕士' },
    { key: '2', value: '本科' },
    { key: '3', value: '大专' },
    { key: '4', value: '高中及以下' }
  ],
  COMPANY_TYPE: [
    { key: '01', value: '国有企业' },
    { key: '02', value: '集体企业' },
    { key: '03', value: '研究生' },
    { key: '04', value: '私营企业' },
    { key: '05', value: '个体工商户' }
  ],
  JOB_TYPE: [
    { key: '01', value: '管理岗位' },
    { key: '02', value: '专技岗位' },
    { key: '03', value: '工勤岗位' }
  ],
  RESOURCE_TYPE: [
    { 'key': 'M', 'value': '菜单' },
    { 'key': 'C', 'value': '控制点' },
    { 'key': 'D', 'value': '数据权限' }
  ],
  RECIVE_TYPE: [
    { 'key': 'R', 'value': '角色' },
    { 'key': 'G', 'value': '机构' }
  ],
  PUB_STS: [
    { 'key': 'O', 'value': '已发布' },
    { 'key': 'C', 'value': '未发布' }
  ],
  OP_TYPE: [
    { 'key': 'O-0', 'value': '拿回'},
    { 'key': 'O-1', 'value': '打回'},
    { 'key': 'O-2', 'value': '退回'},
    { 'key': 'O-3', 'value': '挂起'},
    { 'key': 'O-4', 'value': '唤醒'},
    { 'key': 'O-5', 'value': '催办'},
    { 'key': 'O-6', 'value': '转办'},
    { 'key': 'O-7', 'value': '协办'},
    { 'key': 'O-8', 'value': '否决'},
    { 'key': 'O-9', 'value': '跳转'},
    { 'key': 'O-10', 'value': '委托'},
    { 'key': 'O-11', 'value': '抄送'},
    { 'key': 'O-12', 'value': '同意'},
    { 'key': 'O-13', 'value': '自动提交'},
    { 'key': 'O-14', 'value': '正常结束'},
    { 'key': 'O-15', 'value': '撤回'},
    { 'key': 'O-16', 'value': '发起'},
    { 'key': 'O-17', 'value': '作废'},
    { 'key': 'O-18', 'value': '签收'},
    { 'key': 'O-19', 'value': '撤销签收'},
    { 'key': 'O-26', 'value': '补签'},
    { 'key': 'O-27', 'value': '加签'}
  ],
  NODE_STATE:[
    { 'key': 'O-16', 'value': '发起'},
    { 'key': 'O-12', 'value': '同意'},
    { 'key': 'O-1', 'value': '打回'},
    { 'key': 'O-2', 'value': '退回'},
    { 'key': 'O-3', 'value': '挂起'},
    { 'key': 'O-0', 'value': '拿回'},
    { 'key': 'O-6', 'value': '转办'},
    { 'key': 'O-7', 'value': '协办'},
    { 'key': 'O-9', 'value': '跳转'},
    { 'key': 'O-8', 'value': '否决'},
    { 'key': 'O-17', 'value': '作废'},
    { 'key': 'O-14', 'value': '正常结束'},
    { 'key': 'O-15', 'value': '撤回'},
    {'key': 'O-27', 'value': '加签'}
  ],
  FLOW_STATE:[
    { 'key': 'S', 'value': '发起'},
    { 'key': 'R', 'value': '运行中'},
    { 'key': 'H', 'value': '挂起'},
    { 'key': 'W', 'value': '暂停'},
    { 'key': 'E', 'value': '正常结束'},
    { 'key': 'F', 'value': '否决'},
    { 'key': 'C', 'value': '作废'}
  ],
  DATA_STS: [
    {'key': 'A', 'value': '启用'},
    {'key': 'I', 'value': '停用'},
    {'key': 'W', 'value': '待启用'}
  ],
  ORG_TYPE: [
    {'key': 1, 'value': '经营机构'},
    {'key': 2, 'value': '非经营机构'}
  ],
  REL_STS: [
    {'key': true, 'value': '已关联'},
    {'key': false, 'value': '未关联'}
  ],
  HTTP_METHOD_TYPE: [
    {'key': 'POST', 'value': 'POST'},
    {'key': 'GET', 'value': 'GET'}
  ],
  SEX_TYPE: [
    {'key': '0', 'value': '女'},
    {'key': '1', 'value': '男'},
    {'key': '2', 'value': '未知'}
  ],
  IDENT_TYPE: [
    {'key': 'A', 'value': '境内企业代码'},
    {'key': 'D', 'value': '台湾居民身份证'},
    {'key': 'K', 'value': '工会机构代码'},
    {'key': 'M', 'value': '境内居民护照'},
    {'key': 'F', 'value': '境外居民护照'},
    {'key': 'H', 'value': '境内企业名称核准号'},
    {'key': 'B', 'value': '境外机构代码'},
    {'key': 'C', 'value': '境内居民身份证'},
    {'key': 'E', 'value': '港澳居民身份证'},
  ],
  HIGHEST_EDU: [
    {'key': '1', 'value': '博士后'},
    {'key': '2', 'value': '博士'},
    {'key': '3', 'value': '硕士'},
    {'key': '4', 'value': '大学本科'},
    {'key': '5', 'value': '大学专科/电大'},
    {'key': '6', 'value': '中专'},
    {'key': '7', 'value': '技术学校'},
    {'key': '8', 'value': '高中'},
    {'key': '9', 'value': '高中'},
    {'key': '10', 'value': '小学'},
    {'key': '11', 'value': '文盲或半文盲'},
    {'key': '99', 'value': '其他'},
  ],
  MESSAGE_LEVEL: [
    {'key': 'info', 'value': '信息'},
    {'key': 'M001', 'value': '未知错误'},
    {'key': 'success', 'value': '成功'},
    {'key': 'error', 'value': '错误'},
  ],
  MESSAGE_TYPE: [
    {'key': 'MODULEINFO', 'value': '模块提示'},
    {'key': 'COMINFO', 'value': '系统级通用提示'},
    {'key': 'DBERR', 'value': '数据库错误提示'},
  ],
  LOG_TYPE: [
    {'key': '2', 'value': '查询数据日志'},
    {'key': '5', 'value': '登出系统'},
    {'key': '9', 'value': '授权日志'},
    {'key': '7', 'value': '访问菜单'},
    {'key': '1', 'value': '操作用户'},
    {'key': '6', 'value': '记录操作日志'},
    {'key': '8', 'value': '访问报表'},
    {'key': '10', 'value': '报表导出'},
    {'key': '3', 'value': '登录系统'},
    {'key': '4', 'value': '按钮操作日志'}
  ],
  READ_STS: [
    {'key': '1', 'value': '已读'},
    {'key': '0', 'value': '未读'},
  ],
  PASSWD_COMPLEX_RULE: [
    {'key': 'number', 'value': '数字'},
    {'key': 'uppercase', 'value': '大写字母'},
    {'key': 'lowercase', 'value': '小写字母'},
    {'key': 'specialCharacters', 'value': '特殊字符'},
  ],

  DIC_MODEL_TYPE: [
    { key: '0', value: '单表模型' },
    // { key: '1', value: '主从表模型' },
    // { key: '2', value: '接口模型' },
    { key: '3', value: '复杂SQL模型' }
  ],
  DIC_MODEL_ORIGIN: [
    { key: '0', value: '物理表' },
    { key: '1', value: '元数据表管理' },
    { key: '2', value: '元数据接口管理' },
    // { key: '3', value: 'Swagger接口' },
    // { key: '4', value: '自定义接口' }
  ],
  DIC_FORM_COLUMN: [
    { key: '1', value: '1列' },
    { key: '2', value: '2列' },
    { key: '3', value: '3列' },
    { key: '4', value: '4列' },
    { key: '5', value: '5列' }
  ],
  DIC_TREE_TYPE: [
    { key: 'tree', value: '树结构' },
    { key: 'array', value: '数组结构' }
  ],
  DIC_DB_TYPE: [
    { key: 'MySQL', value: 'MySQL' },
    { key: 'Oracle', value: 'Oracle' },
    { key: 'SqlServer', value: 'SqlServer' },
    { key: 'PostgreSQL', value: 'PostgreSQL' }
  ],
  DIC_CREATE_COMP: [
    { key: '0', value: '表格' },
    { key: '1', value: '表单' },
    { key: '2', value: '树' },
    { key: '3', value: '工作流' },
  ],
  DIC_LIST_ALIGN: [
    { key: 'left', value: '靠左' },
    { key: 'center', value: '居中' },
    { key: 'right', value: '靠右' }
  ],
  DIC_LIST_FIXED: [
    { key: 'left', value: '靠左' },
    { key: 'right', value: '靠右' },
  ],
  DIC_FIELD_TYPE: [
    { key: '0', value: '主键字段' },
    { key: '1', value: '常规字段' },
    { key: '2', value: '虚拟字段' },
    { key: '3', value: '上传字段' },
    { key: '4', value: '创建人字段' },
    { key: '5', value: '创建时间字段' },
    { key: '6', value: '更新人字段' },
    { key: '7', value: '更新时间字段' },
  ],
  DIC_FILTER_TYPE: [
    { key: 'no', value: '无' },
    { key: 'eq', value: '等于' },
    { key: 'ne', value: '不等于' },
    { key: 'gt', value: '大于' },
    { key: 'ge', value: '大于等于' },
    { key: 'lt', value: '小于' },
    { key: 'le', value: '小于等于' },
    { key: 'like', value: '全模糊匹配' },
    { key: 'notLike', value: '非模糊匹配' },
    { key: 'likeLeft', value: '左模糊匹配' },
    { key: 'likeRight', value: '右模糊匹配' },
  ],
  DIC_YES_OR_NOT: [
    { key: 'Y', value: '是' },
    { key: 'N', value: '否' },
  ],
  DIC_ACTION_TYPE: [
    { key: '0', value: '自定义操作' },
    { key: '1', value: '跳转页面/弹窗操作' },
    { key: '2', value: '确认操作' },
    { key: '3', value: 'URL操作' },
    { key: '4', value: '跳页操作' },
    { key: '5', value: '关闭操作' },
    { key: '6', value: '导出操作' },
  ],
  DIC_DIAPLAY_TYPE: [
    { key: '0', value: '按钮' },
    { key: '1', value: '列操作' },
  ],
  DIC_OPERATE_TYPE: [
    { key: '0', value: '按钮操作' },
    { key: '1', value: '事件操作' },
  ],
  DIC_CMP_TYPE: [
    { key: '0', value: '容器组件' },
    { key: '1', value: '内容组件' },
    { key: '2', value: '表单项组件' },
    { key: '3', value: '其他组件' },
  ],
  DIC_PROP_DATA_TYPE: [
    { key: '0', value: 'String' },
    { key: '1', value: 'Number' },
    { key: '2', value: 'Object' },
    { key: '3', value: 'Function' },
    { key: '4', value: 'Boolean' },
    { key: '5', value: 'Array' },
    // { key: '6', value: 'Promise' }
  ],
  DIC_PROP_DATA_TYPE_CN: [
    { key: '0', value: '字符串' },
    { key: '1', value: '数字' },
    { key: '2', value: '对象' },
    { key: '3', value: '函数' },
    { key: '4', value: '布尔值' },
    { key: '5', value: '数组' },
    // { key: '6', value: 'Promise' }
  ],
  DIC_BIND_AREA: [
    { key: '0', value: '查询区域' },
    { key: '1', value: 'Toolbar区域' },
    { key: '2', value: '表格区域' },
    { key: '3', value: '表单区域' },
  ],
  PAGE_TYPE: [
    {key: '0', value: '页面'},
    {key: '1', value: '弹窗'},
  ],
  VERIFY_RULE_TYPE: [
    {key: '0', value: '内置规则'},
    {key: '1', value: '自定义规则'},
  ],
  FORMAT_RULE_TYPE: [
    {key: '0', value: '内置规则'},
    {key: '1', value: '自定义规则'},
  ],
  DIC_TPL_TYPE_CONFIG: [
    {key: '0', value: '前端schema模版'},
    {key: '1', value: '后端代码模版'},
  ],
  DIC_PROP_TYPE: [
    {key: '0', value: '属性'},
    {key: '1', value: '事件'}
  ],
  TPL_STATUS: [
    {key: '0', value: '草稿'},
    {key: '1', value: '已发布'},
  ],
  TPL_TYPE: [
    {key: '0', value: '内置模板'},
    {key: '1', value: '共享模版'},
    {key: '2', value: '私有模板'},
  ],
  PROJECT_TYPE: [
    {key: '0', value: '单体工程'},
    {key: '1', value: '微服务工程'},
  ],
  PROJECT_TYPE_SHORT: [
    {key: '0', value: '单体'},
    {key: '1', value: '微服务'},
  ],
  SERVICE_TYPE: [
    {key: '0', value: '基础应用服务'},
    {key: '1', value: '业务应用服务'},
  ],
  REL_TYPE: [
    {key: '0', value: '多对多'},
    {key: '1', value: '一对一'},
    {key: '2', value: '一对多'},
  ],
  WHETHER_SUPPORT:[
    { key: 'Y', value: '支持' },
    { key: 'N', value: '不支持' },
  ],
  /**
   * 写死会造成 修改数据库界面组件不出来 才需要和数据联动
   */
  CMPCODE_TAG: [
    { key: 'page', value: 'xpPage' },
    { key: 'container', value: 'container' },
    { key: 'left', value: 'el-aside' },
    { key: 'header', value: 'el-header' },
    { key: 'main', value: 'el-main' },
    { key: 'right', value: 'el-aside' },
    { key: 'footer', value: 'el-footer' },
    { key: 'tabs', value: 'tabPane' },
    { key: 'tab-child', value: 'yu-tab-pane' },
    { key: 'collapse', value: 'collapse' },
    { key: 'collapse-child', value: 'yu-collapse-pane' },
    { key: 'card', value: 'card' },
    { key: 'table', value: 'tableComponent' },
    { key: 'form', value: 'formComponent' },
    { key: 'tree', value: 'treeComponent' },
    { key: 'toolbar', value: 'toolComponent' },
    { key: 'divider', value: 'divider' },
    { key: 'crud', value: 'crudComponent' },
    { key: 'custom', value: 'customComponent' },
  ],
  CMPCODE_CN: [
    { key: 'page', value: '页面根' },
    { key: 'container', value: '布局容器' },
    { key: 'tabs', value: 'Tabs页签' },
    { key: 'collapse', value: '折叠面板' },
    { key: 'card', value: '普通面板' },
    { key: 'table', value: '表格组件' },
    { key: 'form', value: '表单组件' },
    { key: 'tree', value: '树形组件' },
    { key: 'toolbar', value: '工具栏' },
    { key: 'divider', value: '分割线' },
    { key: 'crud', value: 'CRUD组件' },
    { key: 'custom', value: '定制区域' },
  ],
  BANNER_STS: [
    {'key': ' ', 'value': '全部'},
    {'key': 2, 'value': '下线'},
    {'key': 3, 'value': '上线'}
  ],
  ADVERTISEMENT_STS: [
    {'key': ' ', 'value': '全部'},
    {'key': 2, 'value': '下线'},
    {'key': 3, 'value': '上线'}
  ],
  ADVERT_SHOW_FREQUENCY_STS: [
    {'key': 1, 'value': '首次登录展示一次'},
    {'key': 2, 'value': '每日一次'},
    {'key': 3, 'value': '每次登录'}
  ],
  ADVERT_CONTENT_TYPE: [
    {'key': 1, 'value': '图片'},
    {'key': 2, 'value': '视频'}
  ],
  ADVERT_CONTENT_SIZE: [
    {'key': 1, 'value': '小'},
    {'key': 2, 'value': '中'},
    {'key': 3, 'value': '大'},
    {'key': 4, 'value': '全屏'}
  ],
  CARD_TYPE: [
    {'key': 1, 'value': '流程类'},
    {'key': 2, 'value': '统计类'},
    {'key': 3, 'value': '工具类'},
    {'key': 4, 'value': '功能类'}
  ],
  CARD_SIZE: [
    {'key': 1, 'value': '小'},
    {'key': 2, 'value': '中'},
    {'key': 3, 'value': '大'},
    {'key': 4, 'value': '超大'}
  ],
  CARD_USE_STATUS: [
    {'key': 1, 'value': '启用'},
    {'key': 0, 'value': '停用'}
  ],
  INFORMATION_STS: [
    {'key': ' ', 'value': '全部'},
    {'key': 2, 'value': '下线'},
    {'key': 3, 'value': '上线'}
  ],
  INFORMATION_TYPE: [
    {'key': 1, 'value': '公告'},
    {'key': 2, 'value': '资讯'}
  ],
  MSG_REMIND_TYPE: [
    {'key': 1, 'value': '风险预警'},
    {'key': 2, 'value': '资讯要闻'},
    {'key': 3, 'value': '到期提醒'},
    {'key': 4, 'value': '日历日程'},
    // {'key': 5, 'value': '待办提醒'}
  ],
  NOTICE_FREQUENCY: [
    {'key': 1, 'value': '5分钟'},
    {'key': 2, 'value': '15分钟'},
    {'key': 3, 'value': '1小时'},
    {'key': 4, 'value': '3小时'},
    {'key': 5, 'value': '实时'}
  ],
  SHOW_UNREAD: [
    {'key': 1, 'value': '是'},
    {'key': 0, 'value': '否'}
  ],
  MSG_TYPE: [
    {'key': 1, 'value': '待办'},
    {'key': 2, 'value': '消息'},
    {'key': 3, 'value': '提醒'}
  ],
  REMIND_TIME: [
    {'key': 5, 'value': '5分钟前'},
    {'key': 10, 'value': '10分钟前'},
    {'key': 15, 'value': '15分钟前'},
    {'key': 30, 'value': '30分钟前'},
    {'key': 60, 'value': '1小时前'},
    {'key': 1440, 'value': '1天前'},
    {'key': 10080, 'value': '1周前'}
  ],
  REPEATED_TYPE: [
    {'key': 1, 'value': '不重复'},
    {'key': 2, 'value': '每天'},
    {'key': 3, 'value': '每周'},
    {'key': 4, 'value': '每月'},
    {'key': 5, 'value': '每年'}
  ],
  IMPORTANT_TYPE: [
    {'key': 1, 'value': '是'},
    {'key': 0, 'value': '否'}
  ],
  LIMIT_TYPE: [
    {'key': 1, 'value': '综合授信额度'}
  ],
  CERT_TYPE: [ // 证件类型
    {'key': 'Ent01', 'value': '组织机构代码证'},
    {'key': 'Ind01', 'value': '身份证'},
    {'key': 'Ind11', 'value': '其他企业证件'}
  ],
  CUSTOMER_TYPE: [ // 客户类型
    {'key': '01', 'value': '单一(法人)客户'},
    {'key': '0101', 'value': '法人企业'},
    {'key': '0102', 'value': '非法人企业'},
    {'key': '0104', 'value': '事业单位'}
  ],
}
