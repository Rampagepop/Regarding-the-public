export default {
  wfeditor:{
    title1 : 'XMLPreview', //XML预览
    suofang : 'Zoom', // 缩放
    plselect : 'Please select a handler', // 请选择
    lst : 'Thumbnail', // 缩略图
    properties : 'Property', //属性
    selective : 'Optional', // 可选
    action : 'Action', // 操作
    diycolor : 'CustomColor', // 自定义颜色
    msgbaselost : 'Missing underlying data', // 基础数据缺失
    routeid : 'Route ID', // 路由ID
    nodeid : 'Node ID', // 节点ID
    name: 'Name', //名称
    nodeuser: 'Handler', //处理人员
    fabu : 'Publish', // 发布
    help : 'Help', // 帮助
    msglctfbcg : 'Flowchart published successfully！', // 流程图发布成功
    msginitflowerror : 'Error when initializing mxGraph！',// 初始化mxGraph报错
    msgoptionerror : 'Error in mxGraph operation!',// mxgraph操作出错
    msglxqdhjsbnwk : 'The start or end point of the connection cannot be empty!', // 连线起点或终点不能为空!
    msglxkshjebnzxtygjd : 'The start and end of the connection cannot point to the same node!', // 连线开始和结束不能指向相同节点!
    msgjdjczxtlx : 'There are identical connections between nodes!', // 节点之间存在相同连线!
    msgonlyoneks : 'There can only be one start node!', // 只能有一个开始节点!
    msgbxyksjd : 'Must have a start node!', // 必须有开始节点!
    msgksjdbnyrx : 'The start node cannot be pointed to by other nodes!', // 开始节点不能被其他节点指向!
    msgbxyjsjd : 'Must have an end node!', // 必须有结束节点!
    msgjsjdbnycx : 'The end node cannot point to other nodes!', // 结束节点不能指向其它节点
    msgtzbxhyywjd : 'The graph must contain business nodes!', // 图中必须含有业务节点!
    msgbxylx : 'The graph must contain lines!', // 图中必须含有连线!
    msghzjdbnljhzjd : 'Summary-type nodes cannot connect to summary-type nodes!', // 汇总类型节点不能连接汇总类型节点!
    msgczdxjdbxyhzjd : 'When there is a multi-select type node, there must be a summary-type node!', // 存在多选节点必须有对应的汇总节点!
    msglxqs : 'Missing connection!', // 连线缺失!
    msgksjdbnzjljjsjd : 'The start node cannot directly connect to the end node!', // 开始节点不能直接连接结束节点!
    msglxbxljjd : 'Lines must connect nodes!', // 连线必须连接节点!
    msglxbxljlgjd : 'A Line must connect two nodes!', // 连线必须连接两个节点!
    msgjsjdbxyrx : 'The end node must have an incoming line!', // 结束节点必须要有其它节点指向!
    msgnouser : ']No handler configured!', // 未配置处理人员!
    node : 'The Node:[', // 节点
    nodelevel : 'The node level of Node:[', // 节点
    msglevelisnum : ']should be numeric!', // 的节点级别应为数字!
  },
  wfsubidselector: {
    flowname: 'Flow Name', //流程名称
    flowid: 'Flow ID ', //流程编号
    biztype: 'Business Type', //业务类型
    ext: 'Remark', //备注
    sure: 'Confirm', //确 定
    clear: 'Clear', //清空子流程
    cancel: 'Cancel', //取 消
    search: 'Search', //搜索
    reset: 'Reset', //重置
    track: 'Flow track', //流程轨迹
    title: 'Please select the business type of the sub-flow', //请选取子流程的业务类型
    msgselectone: 'Please select a record!', //请选择一条数据
  },
  wfnodescript: {
    sure: 'Sure', //确 定
    cancel: 'Cancel', //取 消
    title: 'ScriptEditing', //在线脚本编辑
    titleparam: 'FlowParam', //流程变量
    titlenew: 'New Flow Param', //流程变量新增
    titledit: 'Modify Flow Param', //流程变量修改
    titleselect: 'Select Flow Param', //选取流程变量
    param: 'Flow Param', //流程变量
    routescript: 'Route Script', //路由条件
    shuffleconfig: 'Shuffle', //规则引擎配置
    logic: 'logic-operation', //与或
    relation: 'comparison type', //比较符
    type: 'Variable type', //类型
    value: 'Comparison value', //对比值
    varid: 'Variable', //变量名
    varname: 'Variable name', //变量名称
    varvalue: 'Default', //默认值
    vartype: 'variable_type', //变量类型
    bizfield: 'map_fields', //映射字段
    range: 'range', //作用范围
    add: 'New', //添加
    reset: 'Refresh', //重置
    option: 'Option', //操作
    msgqxzrelation: 'Please select a comparison type！', //请选择比较类型！
    msgqxzvarid: 'Please select a variable！', //请选择流程变量！
    msgqxzlogic: 'Please select a logical operation！', //请选择逻辑运算！
    msgqsrvalue: 'Please enter a comparison value！', //请输入比较值！
    msgqsrvarid: 'Please enter variable！', //请输入变量名！
    msgmax: 'Length limit：', //长度限制：
    msgqsrvarname: 'Please enter variable description！', //请输入变量描述！
    msgqxzvartype: 'Please select a variable type！', //请选择变量类型！
    msgand: 'And', //并且
    msgor: 'Or', //或者
    msgall: 'Global', //全局流程图
    msgthis: 'Current', //当前流程图
    msgnum: 'Numerical', //数值
    msgchar: 'Text', //文本
    msg0: 'GreaterThan(number)', //大于（数字）
    msg1: 'GreaterOrEqualTo(number)', //大于等于（数字）
    msg2: 'LessThan（number）', //小于（数字）
    msg3: 'LessThanOrEqualTo（number）', //小于等于（数字）
    msg4: 'Equal（number）', //等于（数字）
    msg5: 'NotEqualTo（number）', //不等于（数字）
    msg6: 'Equal(Text)', //等于(文本)
    msg7: 'NotEqualTo（Text）', //不等于（文本）
    msg8: 'Contain(Text)', //包含(文本)
    msg9: 'NotContain（Text）', //不包含（文本）
    msg10: 'Included_Like（Text）', //包含于like（文本）
    msg11: 'Included_In（Text）', //包含于in（文本）
    msgqxzsametype: 'Please select the same comparison type as the variable type', // 请选择和变量类型相同的比较类型
    msgselectone: 'Please select a data！', //请选择一条数据！
    msgsuredelete: 'Are you sure you want to delete this record！', //确定要删除这一条记录！
    msgdelsucess: 'Successfully deleted！', //删除成功！
    msgdelerror: 'Its abnomal to delete！', //删除异常！
    msginputillegal: 'Please check if the entry is valid！', //请检查输入项是否合法！
    msgaddsuccess: 'Added variable successfully！', //流程变量新增成功！
    msgaddfail: 'Failed to add variable！', //新增流程变量失败！
    msgeditsuccess: 'Modify variable successfully！', //流程变量修改成功！
    msgeditfail: 'Failed to modify variable！', //流程变量修改失败！
    tip: 'tip', // 提示
  },
  wfuserselect: {
    no: 'ID', //编号
    method: 'Method name', //方法名
    name: 'Name', //名称
    ext: 'Description', //描述
    search: 'Search', //查询
    reset: 'Reset', //重置
    selectreturn: 'Select and back', //选取返回
    title: 'Select node handler(Double-click a list item to select)', //节点处理对象选择(双击列表项进行选择)
    user: 'User', //用户
    dept: 'Department', //部门
    role: 'Role', //角色
    duty: 'Duty', //岗位
    org: 'Organization', //机构
    taskpool: 'Project Pool', //项目池
    diy: 'Customize', //自定义
    msg1: 'Task pools and other types of handlers cannot be configured at the same time,And only one task pool can be configured as a handler!', //项目池和其他类型办理人员不能同时配置,且只能配置一个项目池作为办理人员!
    msg2: 'Task pools and other types of handlers cannot be configured at the same time!', //项目池和其他类型办理人员不能同时配置!
    msgselectone: 'Please select at least one handler!', //请至少选择一个处理对象
    msg3: 'Only one task pool can be configured as a handler!!', //只能配置一个项目池作为办理人员!
    relation: 'relation', // 关系
    selectable: 'selectAble', // 可选择关系：
    A00: 'none', // 未选择
    A01: 'Flow Starter', // 流程启动者
    A02: 'Process Manager', // 流程管理者
    A03: 'Previous Manager', // 前一办理人
    A04: 'Users of superior organizations', // 上级机构人员
    A05: 'Users of all participants', // 所有参与者
    A06: 'Users of the same organization', // 同机构人员
    A07: 'Users of subordinate organizations', // 下级机构人员
    A12: 'Users of the same organization line', // 同一机构线上人员
    A13: 'Users of subordinate organizations of superior organizations', // 上级的下级机构人员
    A14: 'Users of superior and superior subordinate organizations', // 上上级的下级机构人员
    A15: 'Users of superior higher higher organizations', // 上上级机构人员
    A16: 'Users of superior and superior organizations', // 上级及上上级机构人员
    A17: 'Users of this level and superior organizations', // 本级及上级机构人员
  },
  wfcopyuserselect: {
    no: 'Number', //编号
    method: 'Method name', //方法名
    name: 'Name', //名称
    ext: 'Description', //描述
    search: 'Search', //查询
    reset: 'Reset', //重置
    selectreturn: 'Select and back', //选取返回
    title: 'Select users to cc(Double-click a list item to select)', //节点处理对象选择(双击列表项进行选择)
    user: 'User', //用户
    dept: 'Department', //部门
    role: 'Role', //角色
    duty: 'Duty', //岗位
    org: 'Organization', //机构
    diy: 'Customize', //自定义
    msgselectone: 'No CC person selected!', //没有选择抄送人员!
  },
  wfyufpinit: {
    titlety: "Agree to submit",
    titleuser: "Select the user to submit to",
    titlecopy: "Select users to cc",
    butback : 'Return',
    butsave : 'Save', // 保存
    butselect: 'Select', //选择
    butcopy: 'Cc', //抄送
    butislast: 'DoNotEndEarly', //不提前提交
    butnolast: 'AnEarlyClosure', //提前提交
    butsubmit: 'Submit', //提交
    butcancel: 'Cancel', //取消
    login: 'UserID', //用户编号
    name: 'Name', //姓名
    commont: 'AgreeToSubmit', //同意提交
    msgstartcancel: 'Cancel process initiation', // 取消流程发起
    msginputillegal: 'Please check if the entry is valid！', // 请检查输入项是否合法!
    msgdeleteerror: 'Delete exception when instance data is canceled！', // 实例数据取消时删除异常
    msgcantsubmit: 'There is an in-transit process, and the current user has approval rights and can continue to approve！', // 存在在途流程，当前用户拥有审批权限，可以继续审批
    msgcansubmit: 'There is an in-transit process, the current user does not have approval rights, and approval is not allowed！', // 存在在途流程，当前用户没有审批权限，不允许审批
    msginitfail: 'Initialization process failed！', //初始化流程失败
    msgselectnn: 'Please select the next node！', // 请选择下一节点
    msgselectnu: 'Please select a node handler！', // 请选择节点处理人
    msgtjerror: 'Commit exception！', // 提交异常
    msggetnonn: 'Cannot get the next node that can be submitted to！', // 未获取到后续可提交节点信息
    msggetnnerror: 'Get the next node information that can be submitted to is abnormal！', // 获取后续可提交节点信息异常
    msggetnonu: 'Cannot get the approvers of the node！', // 获取不到节点可办理人员
    msggetnuerror: 'It is abnormal to get node approver！', // 获取节点审批人员异常
    msgnextnode: ';Next node：', //;下一节点：
    msgnextnodeuser: '@Approver：', //@下一节点审批人：
    msgnocopyuser: 'No cc person to choose from!', //"没有可以选择的抄送人员!"
    msggetcopyuerror: 'Get Ccable Person Exception!', //获取可抄送人员异常
    msgonlyoneuser: 'Only one approver can be selected for this function！', // 该功能只能选择一个办理人员
  }
}
