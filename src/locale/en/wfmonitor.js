export default {
  wfmonitor:{
    title1 : 'Statistics on the number of process instances',
    title2 : 'User to-do statistics',
    username : 'Approver Name', // 审批人姓名
    userid : 'Approver ID', // 审批人ID
    num : 'Amount', // 待办数量
    sysid : 'System', // 所属系统
    orgid : 'Organization', // 所属机构
    todonum : 'Number of process instances in process', // 办理中流程实例数量
    hisnum : 'Number of closed process instances', // 已办结流程实例数量
    msgerror : 'It is abnormol to get data:', // 获取数据异常
    max : 'Maximum', // 最大值
    min : 'Minimum', // 最小值
    average : 'Average' // 平均值
  },
  wftodomonitor:{
    title1 : 'Running instances monitoring',
    title2 : 'Track', // 流程轨迹
    title3 : 'Select approvers after node reset', // 选择节点重置后的审批人员
    lcslh : 'Instance ID', // 流程实例号
    ywlsh : 'Business ID', // 业务流水号
    khmc : 'Custom Name', // 客户名称
    khbh : 'Custom ID', //客户编号
    flowsign : 'Flow Sign', // 流程标识
    flowname : 'Flow Name', // 流程名称
    flowid : 'Flow ID', // 流程编号
    flowadmin : 'Flow Admin',// 流程管理员
    flowstarter : 'Initiator',// 流程发起者
    flowStarterName: 'Initiator',// 流程发起者
    flowtime : 'Start Time',// 流程发起时间
    flowstate : 'Process state',// 流程状态
    option : 'Options',// 操作
    reset : 'ResetApprover',// 重置审批人员
    cancel : 'Void',// 废除
    tip : 'Tip',// 提示
    userid : 'ID',// 当前处理人工号
    username : 'User Name',// 当前处理人
    starttime : 'Start Time',// 开始时间
    msgsurecancel : 'Are you sure you want to void this process？',// 确定作废此流程？
    msgcancelcomment : 'Admin voided',// 管理员作废
    msgcaccelerror : 'It is abnormal to void this process:',// 作废异常:
    msgcancel : 'Cancelled',// 已取消
    msgselectnode : 'Please select a to-do node to reset！',// 请选择要重置的待办节点！
    msgselectone : 'Please select a record！',// 请选择一条数据！
    msgresetsuccess : 'Successfully reset the approver',// 成功重置审批人
    msgreseterror: 'Reset the approver abnormal:', // 重置办理人异常:
    msgdataerror : 'Get data abnormal:',// 获取数据异常:
    msgsuredelete: 'Are you sure you want to delete this process instance？', //确定要删除此流程实例么？
    msgdeleteerror: 'Delete abnormal：', //删除异常：
  },
  wfhismonitor:{
    title1 : 'Complete instances monitoring',
    title2 : 'Track',
    title3 : 'Select the approver after node reset',
    lcslh : 'Instance ID', // 流程实例号
    ywlsh : 'Business ID', // 业务流水号
    khmc : 'Custom Name', // 客户名称
    khbh : 'Custom ID', //客户编号
    flowsign : 'Flow Sign', // 流程标识
    flowname : 'Flow Name', // 流程名称
    flowid : 'Flow ID', // 流程编号
    flowstarter: 'Initiator',// 流程发起者
    flowtime : 'Flow Start Time',// 流程发起时间
    flowstate : 'Process state',// 流程状态
    option : 'Options',// 操作
    activate : 'Activate',// 激活
    biztype : 'Business Type',// 业务类型
    tip : 'Tip',// 提示
    starttime : 'Start Time',// 开始时间
    endtime : 'End Time',// 结束时间
    msgsureactivite : 'Are you sure you want to activate？',// 确定要执行激活操作吗？
  },
  wfusermonitor:{
    title1 : 'Staff to-do monitoring',
    title2 : 'Select the approver after node reset',
    lcslh : 'Instance ID', // 流程实例号
    ywlsh : 'Business ID', // 业务流水号
    khmc : 'Custom Name', // 客户名称
    biztype : 'Business Type', // 业务类型
    flowname : 'Flow Name', // 流程名称
    flowStarterName: 'Initiator',// 流程发起者
    option : 'Options',// 操作
    reset : 'ResetApprover',// 重置审批人
    nodeid : 'Node ID',// 当前节点编号
    nodename : 'Node Name',// 当前节点
    userid : 'Approver ID',// 当前处理人工号
    username : 'Approver',// 当前处理人
    starttime : 'Start Time',// 开始时间
    lastnodeid : 'Last Node ID',// 上一节点编号
    lastnodename : 'Last Node',// 上一节点
    lastuserid : 'Last Approver ID',// 上一节点处理人
    lastusername : 'Last Approver',// 上一处理人
    nodestate : 'Approval status',// 审批状态
    signstate : 'Signing state',// 签收状态
    flowstate : 'Process state',// 流程状态
    flowparam : 'Process parameters',// 流程参数
    userid1 : 'User ID',// 用户编号
    username1 : 'User Name',// 用户姓名
    msguserlistnull : 'Get the User list is empty',// 获取用户列表为空
    msguserlisterror : 'Error getting user list ',// 获取用户列表出错
    msgsurereset : 'Are you sure you want to reset the current node approver？',// 确定要重置当前节点办理人员吗？
    tip : 'Tip',// 提示
    msgreseterror : 'Reset the current node approver abnormal',// 节点办理人重置异常
    msgcancel : 'Cancelled',// 已取消
  },
  wfexception:{
    title1 : 'Exception Queue',
    title2 : 'Exception Details',
    lcslh : 'Instance ID', // 流程实例号
    ywlsh : 'Business ID', // 业务流水号
    khmc : 'Custom Name', // 客户名称
    biztype : 'Business Type', // 业务类型
    flowname : 'Flow Name', // 流程名称
    flowid : 'Flow ID', // 流程编号
    option : 'Options',// 操作
    info : 'Details',// 查看
    retry : 'Retry',// 重试
    sure : 'Sure',// 确 定
    nodeid : 'Node ID',// 节点编号
    nodename : 'Node Name',// 节点名称
    userid : 'Submitter ID',// 提交人工号
    username : 'Submitter',// 提交人
    starttime : 'Abnormal time',// 异常时间
    optype : 'Operation',// 操作类型
  },
  wftravel:{
    defcomment : 'Not approved', // 未审批
    lcslh : 'Instance ID:', // 流程实例号
    flowname : 'Flow Name:', // 流程名称
    flowid : 'Flow ID:', // 流程编号
    currentnode : 'Current Node:',// 当前节点编号
    nodeid : 'Node ID:',// 节点编号
    nodename : 'Node Name:',// 节点名称
    currentuser : 'Current approver:',// 当前审批人员:
    userid : 'Approver ID:',// 审批人工号
    username : 'Approver:',// 审批人
    starttime1 : 'Start time:',// 开始审批时间
    starttime2 : 'Approve time:',// 审批时间
    result : 'Result:',// 审批结果
    comment : 'Opinion:', //意见
  }
}
