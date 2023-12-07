export default {
  wfmonitor:{
    title1 : '流程实例办理数量统计',
    title2 : '用户待办数量统计',
    username : '办理人姓名', // 办理人姓名
    userid : '办理人ID', // 办理人ID
    num : '待办数量', // 待办数量
    sysid : '所属系统', // 所属系统
    orgid : '所属机构', // 所属机构
    todonum : '办理中流程实例数量', // 办理中流程实例数量
    hisnum : '已办结流程实例数量', // 已办结流程实例数量
    msgerror : '获取数据异常:', // 获取数据异常
    max : '最大值', // 最大值
    min : '最小值', // 最小值
    average : '平均值' // 平均值
  },
  wftodomonitor:{
    title1 : '运行实例监控',
    title2 : '流程轨迹',
    title3 : '选择重置后的节点办理人员',
    lcslh : '流程实例号', // 流程实例号
    ywlsh : '业务流水号', // 业务流水号
    khmc : '客户名称', // 客户名称
    khbh : '客户编号', //客户编号
    flowsign : '流程标识', // 流程标识
    flowname : '流程名称', // 流程名称
    flowid : '流程编号', // 流程编号
    flowadmin : '流程管理员',// 流程管理员
    flowstarter : '流程发起者',// 流程发起者
    flowStarterName: '流程发起者',// 流程发起者
    flowtime : '流程发起时间',// 流程发起时间
    flowstate : '流程状态',// 流程状态
    option : '操作',// 操作
    reset : '重置办理人',// 重置办理人
    cancel : '废除',// 废除
    tip : '提示',// 提示
    userid : '用户编号',// 当前处理人工号
    username : '用户姓名',// 当前处理人
    starttime : '开始时间',// 开始时间
    msgsurecancel : '确定作废此流程？',// 确定作废此流程？
    msgcancelcomment : '管理员作废',// 管理员作废
    msgcaccelerror : '作废异常:',// 作废异常:
    msgcancel : '已取消',// 已取消
    msgselectnode : '请选择要重置的待办节点！',// 请选择要重置的待办节点！
    msgselectone : '请选择一条数据！',// 请选择一条数据！
    msgresetsuccess : '重置办理人成功',// 重置办理人成功
    msgreseterror: '重置办理人异常:', // 重置办理人异常:
    msgdataerror : '获取数据异常:',// 获取数据异常:
    msgsuredelete: '确定要删除此流程实例么？', //确定要删除此流程实例么？
    msgdeleteerror: '删除异常：', //删除异常：
  },
  wfhismonitor:{
    title1 : '办结实例监控',
    title2 : '流程轨迹',
    title3 : '选择重置后的节点办理人员',
    lcslh : '流程实例号', // 流程实例号
    ywlsh : '业务流水号', // 业务流水号
    khmc : '客户名称', // 客户名称
    khbh : '客户编号', //客户编号
    flowsign : '流程标识', // 流程标识
    flowname : '流程名称', // 流程名称
    flowid : '流程编号', // 流程编号
    flowstarter: '流程发起者',// 流程发起者
    flowtime : '流程发起时间',// 流程发起时间
    flowstate : '流程状态',// 流程状态
    option : '操作',// 操作
    activate : '激活',// 激活
    biztype : '业务类型',// 业务类型
    tip : '提示',// 提示
    starttime : '开始时间',// 开始时间
    endtime : '结束时间',// 结束时间
    msgsureactivite : '确定要执行激活操作吗？',// 确定要执行激活操作吗？
  },
  wfusermonitor:{
    title1 : '人员待办监控',
    title2 : '选择重置后的节点办理人员',
    lcslh : '流程实例号', // 流程实例号
    ywlsh : '业务流水号', // 业务流水号
    khmc : '客户名称', // 客户名称
    biztype : '业务类型', // 业务类型
    flowname : '流程名称', // 流程名称
    flowStarterName: '流程发起者',// 流程发起者
    option : '操作',// 操作
    reset : '重置办理人',// 重置办理人
    nodeid : '当前节点编号',// 当前节点编号
    nodename : '当前节点',// 当前节点
    userid : '当前处理人工号',// 当前处理人工号
    username : '当前处理人',// 当前处理人
    starttime : '开始时间',// 开始时间
    lastnodeid : '上一节点编号',// 上一节点编号
    lastnodename : '上一节点',// 上一节点
    lastuserid : '上一节点处理人',// 上一节点处理人
    lastusername : '上一处理人',// 上一处理人
    nodestate : '审批状态',// 审批状态
    signstate : '签收状态',// 签收状态
    flowstate : '流程状态',// 流程状态
    flowparam : '流程参数',// 流程参数
    userid1 : '用户编号',// 用户编号
    username1 : '用户姓名',// 用户姓名
    msguserlistnull : '获取办理人员列表为空',// 获取办理人员列表为空
    msguserlisterror : '获取办理人员列表出错 ',// 获取办理人员列表出错
    msgsurereset : '确定要重置当前节点办理人员吗？',// 确定要重置当前节点办理人员吗？
    tip : '提示',// 提示
    msgreseterror : '节点办理人重置异常',// 节点办理人重置异常
    msgcancel : '已取消',// 已取消
  },
  wfexception:{
    title1 : '异常队列',
    title2 : '异常详情',
    lcslh : '流程实例号', // 流程实例号
    ywlsh : '业务流水号', // 业务流水号
    khmc : '客户名称', // 客户名称
    biztype : '业务类型', // 业务类型
    flowname : '流程名称', // 流程名称
    flowid : '流程编号', // 流程编号
    option : '操作',// 操作
    info : '查看',// 查看
    retry : '重试',// 重试
    sure : '确 定',// 确 定
    nodeid : '节点编号',// 节点编号
    nodename : '节点名称',// 节点名称
    userid : '提交人编号',// 当前处理人工号
    username : '提交人',// 提交人
    starttime : '异常时间',// 异常时间
    optype : '操作类型',// 操作类型
  },
  wftravel:{
    defcomment : '未审批',
    lcslh : '流程实例号:', // 流程实例号
    flowname : '流程名称:', // 流程名称
    flowid : '流程编号:', // 流程编号
    currentnode : '当前节点编号:',// 当前节点编号
    nodeid : '节点编号:',// 节点编号
    nodename : '节点名称:',// 节点名称
    currentuser : '当前审批人员:',// 当前审批人员:
    userid : '提交人编号:',// 当前处理人工号
    username : '审批人员:',// 提交人
    starttime1 : '开始审批时间:',// 开始审批时间
    starttime2 : '审批时间:',// 审批时间
    result : '审批结果:',// 审批结果
    comment : '审批意见:',
  }
}
