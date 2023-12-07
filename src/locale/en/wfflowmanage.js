export default {
  wflist:{
    title : 'Flow Define',
    flowname : 'Flow name', // 流程名称
    flowid : 'Flow ID', // 流程编号
    flowsign : 'Flow sign', // 流程标识
    flowadmin : 'Flow creator', //流程创建者
    updatetime : 'Modification time', // 流程修改时间
    flowstate : 'Flow status', // 流程图状态
    on : 'Enable', // 启用
    edit : 'Edit', // 编辑中
    off : 'Disable', // 停用
    flowver : 'Flow version', // 流程版本
    option : 'Options', // 操作
    flow : 'Flow', // 流程图
    newversion : 'Generate new version', // 生成新版本
    hisversion : 'Historic version', // 历史版本
    editname : 'Change name', // 修改名称
    flowinfo : 'Details', // 流程图详情
    inittime : 'Version generation time', // 版本生成时间
    returnver : 'GoBack', // 回退
    tip: 'Tip',
    msgbtx : 'Required', // 必输项
    msgonlynum: 'Only Number Required！', //只能输入数字！
    msgcdxz64 : 'Cannot exceed 64 characters！', // 长度不能超过64个字符
    msgqyztwfbj : 'Enabled state cannot be edited！', // 启用状态无法编辑
    msgflowisnull : 'Flow content is empty！', // 回退
    msgflownotexit: 'Flow content does not exist！',
    msgerror: 'Get data exception！',
    msgflowon: 'Flow successfully enabled!',
    msgflowoff: 'Flow deactivated successfully!',
    msglctczyc: 'Flow Operation Abnormal',
    msglcbhyjcz: 'The Flow ID already exists, modify the file [flowId] and upload it!',
    msgerrorfiletype: 'File format error, please check！',
    msglctnrwkbyxdc: 'Flow content is empty, export is not allowed！',
    msgselectone: 'Please select a record first!',
    msgqydlcjzsc: 'Enabled flowcharts prohibit deletion!',
    msgsuredelete: 'Are you sure you want to delete the Flow:【',
    msgsccg: 'Successfully deleted Flow!',
    msgdeleteerror: 'Delete Flow error:',
    msgydbbjdlcbyxsc: 'Flowcharts with to-do or historical data do not allow deletion!',
    msgiuputname: 'Please enter a Flow name!',
    msginputillegal: 'Contains special characters!',
    msgflowadd: 'Flow added successfully!',
    msgadderror: 'Add Flow exception!',
    msgqsrxghdmc: 'Please enter the modified Flow name!',
    msgeditsuccess: 'Modify the Flow name successfully!',
    msgqdyjlc: 'Are you sure you want to clone the Flow:【',
    msgklwxdlc: '】to a new version？',
    msgsavenewfail: 'Failed to generate a new version, please check the Flow configuration!',
    msgsavenewver: 'Generate new version Flow successfully!',
    msgreturnsuccess: 'Version rollback succeeded!',
    titletu: "-Flow"
  },
  wfsimulate:{
    title1 : 'Flow List（Running）',
    title2 : 'Flow Simulation Run Results',
    title4 : 'next node selection',
    title3 : 'Simulation routing parameter settings(Optional)',
    flowname : 'Flow name', // 流程名称
    flowid : 'Flow ID', // 流程编号
    flowsign : 'Flow sign', // 流程标识
    flowadmin : 'Flow creator', //流程创建者
    updatetime : 'Modification Time', // 流程修改时间
    flowstate : 'Flow status', // 流程图状态
    option : 'Options', // 操作
    start : 'Simulate', // 开始仿真
    runtime : 'Run Time', // 运行时间
    nodeid: 'Node ID', // 节点编号
    nodename: 'Node Name', // 节点名称
    nextnode : 'Next Node ID', // 下一节点编号
    nodenamelist : 'Optional node', // 可选节点名称
    nodelist : 'Optional node ID', // 可选节点ID
    routeresult : 'Route Run result', // 路由运行结果
    success : 'Success', // 成功
    error : 'Abnormal', // 异常
    param : 'Simulation parameters', // 仿真参数
    paramdemo : 'Example of simulation parameters', // 参数示例
    dw : 'Click', // 点我
    msgparamtip : '(If there are routing parameters that need to be used, please write them into this text field, otherwise ignore them)', // 业务信息
    msgxyb : 'Next', // 下一步
    msgfzjxz : 'Simulation in progress', // 仿真进行中
    msgckrz : 'View logs', // 查看日志
    msgfzcssz : 'Simulation routing parameter settings(Optional)', // 仿真路由参数设置(可选)
    msgparamillegal : 'Parameter is invalid', // 下一节点选择
    msgczlycwsfjx : 'There is a routing error, please choose whether to continue the simulation', // 存在路由错误,请选择是否继续仿真
    msglycwktg: '(Routing error, you can choose to skip)', //(路由错误,可跳过)
    msgparamerror: 'The parameter format is incorrect, please refer to the example to fill in', //参数格式有误，请参考示例填写
    msgwzdlcjdxx: 'No node information found for Flow!', //'未找到流程图的节点信息!'
    msgstartfail: 'Start Simulation failed:', // '仿真失败:'
    msgsimsuccess: 'Simulation complete!', // '仿真完成!'
    msgsimfail: 'Simulation failed:', // '仿真失败:'
    msgselectnext: 'Please select the next node!', //'请选择下一节点!'
  },
  wfbiz:{
    title1 : 'Business Config',
    title2 : 'New',
    title3 : 'Modify',
    title4 : 'Select a Flow',
    title5 : 'Select node',
    title6 : 'Config',
    title7 : 'Add a business page displayed by a node',
    title8 : 'Modify the business page displayed by the node',
    biztype : 'Business Type', // 业务类型
    flowname : 'Flow name', // 流程名称
    flowsign : 'Flow sign', // 流程标识
    flowid : 'Flow ID', // 流程编号
    ext : 'Description', // 描述
    biztypeext : 'Description', // 业务类型描述
    pageurl : 'Business Page', // 业务页面
    gllc : 'Flow', // 关联流程图
    option : 'Options', // 操作
    flowver : 'Flow version', // 流程图版本
    extconfig : 'Extra item', // 额外配置项
    orgid : 'Organization', // 机构编号
    nodeid : 'Node ID', // 节点编号
    nodename : 'Node name', // 节点名称
    icon : 'Please click the search button at the end!', // 请点击尾部查询按钮
    msgselectflow : 'Please select a Flow to associate!', // 请选择要关联的流程图
    msgqsrywlxbsf : 'Please enter a business type identifier!', //请输入业务类型标识符
    msgqsryelxbthzms : 'Please enter a description!', //请输入业务类型标题或者描述
    msgcdxz30 : 'Cannot exceed 30 characters!', // 不能超过30个字符
    msgcdxz60 : 'Cannot exceed 60 characters!', // 不能超过60个字符
    msgconfigpage : 'Please configure the business page path!', // 请配置业务页面路径
    msgnochzn : 'Cannot contain Chinese!', // 不能包含中文
    msgnodeedit : 'The configuration of the associated node of the business type is modified successfully!', // 业务类型关联节点配置修改成功
    msgnodeconfig : 'The business type associated node configuration was added successfully!', // 业务类型关联节点配置新增成功!
    msgselectone : 'Please select a data!', // 请至少选择一条数据
    msgillegal : 'Contains special characters!', // 包含特殊字符
    msgsddsuccess : 'Added successfully!', // 新增成功
    msgadderror : 'Add Error!', // 新增异常:
    msginputillegal : 'Please check if the entry is valid', // 请检查输入项是否合法
    msgeditsuccess : 'Modify the business type configuration successfully!', // 修改业务类型配置成功
    msgediterror : 'Modify business type error!', // 修改业务类型异常
    msggjdybgl : 'The node is already associated, please select another node!', // 该项目池编号的数据不存在!
    msgsuredelete : 'Are you sure you want to delete the selected record？', // 新增成功
    tip : 'Tip', // 提示
    msgdelsucess : 'Delete successfully!', // 删除成功
    msgdelerror : 'Delete failed!', // 删除异常
    msgnodeerror : 'The associated node configuration is abnormal!', // 节点配置异常
    buttonbizorg: 'Org Config', // 适用机构配置
    nodeconfig: 'Node Config', // 节点配置
    config: 'Add' // 添加
  },
  wfbizorg:{
    title1 : 'Business Config',
    title2 : 'New',
    title3 : 'Modify',
    title4 : 'Select Flow',
    title6 : 'Info',
    biztype : 'Business Type', // 业务类型
    flowname : 'Flow name', // 流程名称
    flowsign : 'Flow sign', // 流程标识
    flowid : 'Flow ID', // 流程编号
    ext : 'Description', // 描述
    option : 'Options', // 操作
    flowver : 'Flow version', // 流程图版本
    orgid : 'Organization', // 适用机构
    orgname : 'Organization', // 适用机构
    msgselectflow : 'Please select a Flow!', // 请选择要关联的流程图
    msgqxzywlx : 'Please select a business type identifier!', //请选择业务类型
    msgqxzsyjg : 'Please select a Organization！', //请选择适用机构！
    msgqsryelxbthzms : 'Please enter a description!', //请输入业务类型标题或者描述
    msgcdxz60 : 'Cannot exceed 60 characters!', // 不能超过60个字符
    msgnodeedit : 'The configuration of the associated Organization of the business type is modified successfully!', // 业务类型关联节点配置修改成功
    msgnodeconfig : 'The business type associated Organization configuration was added successfully!', // 业务类型关联节点配置新增成功!
    msgselectone : 'Please select a data!', // 请至少选择一条数据
    msgsddsuccess : 'Added successfully!', // 新增成功
    msgadderror : 'Add error!', // 新增异常:
    msginputillegal : 'Please check if the entry is valid', // 请检查输入项是否合法
    msgextmax60 : 'Description Cannot exceed 60 characters!', // 描述不能超过60个字符
    msgeditsuccess : 'Modify the business type configuration successfully!', // 修改业务类型配置成功
    msgediterror : 'Modify business type error!', // 修改业务类型异常
    msgsuredelete : 'Are you sure you want to delete the selected record？', // 新增成功
    tip : 'Tip', // 提示
    msgdelsucess : 'Delete successfully!', // 删除成功
    msgdelerror : 'Delete failed!', // 删除异常
  },
  wfentrust:{
    title1 : 'Entrust config',
    title2 : 'New',
    title3 : 'Modify',
    title4 : 'Business Type',
    title5 : 'Select original approver', // 原审批人
    title6 : 'Select a proxy approver', // 被委托人
    otheruserid : 'Delegate ID', // 被委托人
    otherusername : 'Delegate', // 被委托人姓名
    biztype : 'Business Type', // 业务类型
    userid : 'Approver ID', // 委托人
    username : 'Approver', // 委托人姓名
    starttime : 'Start Time', // 开始时间
    endtime : 'End Time', // 结束时间
    option : 'Options', // 操作
    tip : 'Tip', // 提示
    logincode : 'Login account', // 登录名
    name : 'Name', // 姓名
    ext : 'Description', // 业务类型描述
    flowid : 'Flow ID', // 流程编号
    flowname : 'Flow name', // 流程名称
    pageurl : 'Business Page', // 业务页面
    msgtime1: 'Please select a start date', // 请选择开始日期
    msgtime2: 'Please select an end date', // 请选择开始日期
    msgtime3: 'Start time cannot be earlier than current!', // 委托开始时间不能早于当前时间
    msgtime4: 'Start time cannot be later than end time!', // 委托开始时间不能晚于结束时间
    msgtime5: 'End time cannot be earlier than start time!', // 委托结束时间不能早于开始时间
    msgicon1: 'Click the tail icon to select the original approver', // 点击尾部图标选择委托人
    msgicon2: 'Click the tail icon to select the delegate', // 点击尾部图标选择被委托人
    msgicon3: 'Click the tail icon to select the business type', // 点击尾部图标选择业务类型
    msgselectbiz: 'Please select business type', // 请选择业务类型
    msgbtx: 'Required', //必填项
    msgselectone : 'Please select a data!', // 请至少选择一条数据
    msgsddsuccess : 'Added successfully!', // 新增成功
    msgadderror : 'Add abnormal!', // 新增异常
    msgczcdwtqx : 'The user already has a duplicate delegation period!', // 您已存在重叠的委托期限
    msginputillegal : 'Please check if the entry is valid!', // 请检查输入项是否合法
    msgnotexit: 'The user does not have a delegation of this business type, please add a new one！', //该用户不存在该业务类型的委托，请新增！
    msgeditsuccess : 'Successfully modified!', // 修改成功
    msgediterror : 'Modify error!', // 新增异常
    msgsuredelete : 'Are you sure you want to delete the selected record？', // 新增成功
    msgdelsucess : 'Delete successfully!', // 删除成功
    msgdelerror : 'Delete failed!', // 删除异常
    msgsameuser: 'The original approver and the delegate cannot be the same person!', //委托人与被委托人不能是同一人!
    alltype: 'All Business', // 全部业务
    singletype: 'Select', // 指定业务
    bizrange: 'Range', // 业务范围
  },
  wftaskpool:{
    title1 : 'Project Pool Config',
    title2 : 'Modify',
    title3 : 'New',
    title4 : 'Associated positions',
    poolid : 'Pool ID', // 项目池编号
    poolname : 'Pool name', // 项目池名称
    desc : 'Description', // 描述
    orgid : 'Organization', // 机构
    option : 'Options', // 操作
    setduty : 'Config', // 关联岗位
    dutycde : 'Duty code', // 客户申请信息
    dutyname : 'Duty name', // 流程信息
    msgbtx : 'Required', // 必填项
    msgcdxz30 : 'Cannot exceed 30 characters', // 长度不能超过30个字符
    sysid : 'System ID', // 系统ID
    msgselectone : 'Please select at least one piece of data!', // 请至少选择一条数据
    msgillegal : 'Contains special characters!', // 包含特殊字符
    msgsddsuccess : 'Added successfully!', // 新增成功
    msgadderror : 'Add error!', // 新增异常:
    msgidmuilt : 'The project pool ID cannot be repeated, please re-enter!', // 项目池编号不能重复，请重新输入！
    msginputillegal : 'Please check if the entry is valid!', // 请检查输入项是否合法
    msgeditsuccess : 'Successfully modified!', // 修改成功
    msgediterror : 'Modify error!', // 修改异常
    msgdatanotexit : 'The data of the project pool ID does not exist!', // 该项目池编号的数据不存在!
    msgsuredelete : 'Are you sure you want to delete the selected records？', // 新增成功
    tip : 'Tip', // 提示
    msgdelsucess : 'Delete successfully!', // 删除成功
    msgdelerror : 'Delete failed!', // 删除异常
  }
}
