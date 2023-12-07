export default {
  wflist:{
    title : '流程定义',
    flowname : '流程名称', // 流程名称
    flowid : '流程编号', // 流程编号
    flowsign : '流程标识', // 流程标识
    flowadmin : '流程创建者', //流程创建者
    updatetime : '流程修改时间', // 流程修改时间
    flowstate : '流程图状态', // 流程图状态
    on : '启用', // 启用
    edit : '编辑中', // 编辑中
    off : '停用', // 停用
    flowver : '流程版本', // 流程版本
    option : '操作', // 操作
    flow : '流程图', // 流程图
    newversion : '生成新版本', // 生成新版本
    hisversion : '历史版本', // 历史版本
    editname : '修改名称', // 修改名称
    flowinfo : '流程图详情', // 流程图详情
    inittime : '版本生成时间', // 版本生成时间
    returnver : '回退', // 回退
    tip: '提示',
    msgbtx : '必输项', // 必输项
    msgonlynum: '只能输入数字！', //只能输入数字！
    msgcdxz64 : '长度不能超过64个字符', // 长度不能超过64个字符
    msgqyztwfbj : '启用状态无法编辑', // 启用状态无法编辑
    msgflowisnull : '流程图内容为空', // 回退
    msgflownotexit: '流程图内容不存在',
    msgerror: '获取数据异常',
    msgflowon: '流程已成功启用!',
    msgflowoff: '流程已停用!',
    msglctczyc: '流程图操作异常',
    msglcbhyjcz: '流程编号已经存在，修改文件【flowId】后再上传!',
    msgerrorfiletype: '文件格式错误请检查',
    msglctnrwkbyxdc: '流程图内容为空，不允许导出！',
    msgselectone: '请先选择一条记录!',
    msgqydlcjzsc: '启用的流程禁止删除!',
    msgsuredelete: '确定要删除流程图:【',
    msgsccg: '成功删除流程图!',
    msgdeleteerror: '删除异常:',
    msgydbbjdlcbyxsc: '有待办或办结的流程不允许删除!',
    msgiuputname: '请输入流程名称!',
    msginputillegal: '包含特殊字符!',
    msgflowadd: '流程图新增成功!',
    msgadderror: '新增异常!',
    msgqsrxghdmc: '请输入修改后的流程名称!',
    msgeditsuccess: '修改成功!',
    msgqdyjlc: '确定要将流程:【',
    msgklwxdlc: '】克隆为新的版本吗？',
    msgsavenewfail: '生成失败,请检查流程图配置!',
    msgsavenewver: '另存新版本流程图成功!',
    msgreturnsuccess: '版本回退成功！',
    titletu: "图"
  },
  wfsimulate:{
    title1 : '流程列表（运行中）',
    title2 : '流程仿真运行结果',
    title4 : '下一节点选择',
    title3 : '仿真路由参数设置(可选)',
    flowname : '流程名称', // 流程名称
    flowid : '流程编号', // 流程编号
    flowsign : '流程标识', // 流程标识
    flowadmin : '流程创建者', //流程创建者
    updatetime : '流程修改时间', // 流程修改时间
    flowstate : '流程图状态', // 流程图状态
    option : '操作', // 操作
    start : '开始仿真', // 开始仿真
    runtime : '进行时间', // 客户申请信息
    nodeid: '节点编号', // 节点编号
    nodename: '节点名称', // 节点名称
    nextnode : '下一节点编号', // 下一节点编号
    nodenamelist : '可选节点节点名称', // 可选节点节点名称
    nodelist : '可选节点ID', // 可选节点ID
    routeresult : '路由运行结果', // 路由运行结果
    success : '成功', // 成功
    error : '异常', // 异常
    param : '仿真参数', // 仿真参数
    paramdemo : '参数示例', // 参数示例
    dw : '点我', // 点我
    msgparamtip : '(有需要用到的路由参数请写入本文本域，无则忽略)', // 业务信息
    msgxyb : '下一步', // 下一步
    msgfzjxz : '仿真进行中', // 仿真进行中
    msgckrz : '查看日志', // 查看日志
    msgfzcssz : '仿真路由参数设置(可选)', // 仿真路由参数设置(可选)
    msgparamillegal : '参数不合法', // 下一节点选择
    msgczlycwsfjx : '存在路由错误,请选择是否继续仿真', // 存在路由错误,请选择是否继续仿真
    msglycwktg: '(路由错误,可跳过)', //(路由错误,可跳过)
    msgparamerror: '参数格式有误，请参考示例填写', //参数格式有误，请参考示例填写
    msgwzdlcjdxx: '未找到流程的节点信息!', //'未找到流程的节点信息!'
    msgstartfail: '仿真发起失败:', // '仿真发起失败:'
    msgsimsuccess: '仿真完成!', // '仿真完成!'
    msgsimfail: '仿真失败:', // '仿真失败:'
    msgselectnext: '请选择下一节点!', //'请选择下一节点!'
  },
  wfbiz:{
    title1 : '业务配置',
    title2 : '新增',
    title3 : '修改',
    title4 : '流程选取',
    title5 : '节点选取',
    title6 : '配置',
    title7 : '新增节点外挂业务页面',
    title8 : '修改节点外挂业务页面',
    biztype : '业务类型', // 业务类型
    flowname : '流程名称', // 流程名称
    flowsign : '流程标识', // 流程标识
    flowid : '流程编号', // 流程编号
    ext : '描述', // 描述
    biztypeext : '业务类型描述', // 业务类型描述
    pageurl : '业务页面', // 业务页面
    gllc : '关联流程', // 流程标识
    option : '操作', // 操作
    flowver : '流程版本', // 流程版本
    extconfig : '扩展配置项', // 扩展配置项
    orgid : '机构编号', // 机构编号
    nodeid : '节点编号', // 节点编号
    nodename : '节点名称', // 节点名称
    icon : '请点击尾部查询按钮', // 请点击尾部查询按钮
    msgselectflow : '请选择要关联的流程!', // 请选择要关联的流程
    msgqsrywlxbsf : '请输入业务类型标识符!', //请输入业务类型标识符
    msgqsryelxbthzms : '请输入业务类型描述!', //请输入业务类型标题或者描述
    msgcdxz30 : '长度不能超过30个字符!', // 长度不能超过30个字符
    msgcdxz60 : '长度不能超过60个字符!', // 长度不能超过60个字符
    msgconfigpage : '请配置业务页面路径!', // 请配置业务页面路径
    msgnochzn : '不能包含中文!', // 不能包含中文
    msgnodeedit : '业务类型关联节点配置修改成功!', // 业务类型关联节点配置修改成功
    msgnodeconfig : '业务类型关联节点配置新增成功!', // 业务类型关联节点配置新增成功!
    msgselectone : '请选择一条数据!', // 请至少选择一条数据
    msgillegal : '包含特殊字符!', // 包含特殊字符
    msgsddsuccess : '新增成功!', // 新增成功
    msgadderror : '新增异常!', // 新增异常:
    msginputillegal : '请检查输入项是否合法!', // 请检查输入项是否合法
    msgeditsuccess : '修改业务配置成功!', // 修改业务配置成功
    msgediterror : '修改异常!', // 修改异常
    msggjdybgl : '该节点已被关联，请选择其他节点关联!', // 该项目池编号的数据不存在!
    msgsuredelete : '确定需要删除选中的记录吗？', // 新增成功
    tip : '提示', // 提示
    msgdelsucess : '删除成功!', // 删除成功
    msgdelerror : '删除异常!', // 删除异常
    msgnodeerror : '节点配置异常!', // 节点配置异常
    buttonbizorg: '适用机构配置', // 适用机构配置
    nodeconfig: '节点配置',
    config: '添加'
  },
  wfbizorg:{
    title1 : '流程关联机构配置',
    title2 : '新增',
    title3 : '修改',
    title4 : '流程选取',
    title6 : '查看',
    biztype : '业务类型', // 业务类型
    flowname : '流程名称', // 流程名称
    flowsign : '流程标识', // 流程标识
    flowid : '流程编号', // 流程编号
    ext : '备注', // 描述
    option : '操作', // 操作
    flowver : '流程版本', // 流程版本
    orgid : '适用机构', // 机构编号
    orgname : '适用机构', // 机构编号
    icon : '请点击尾部按钮', // 请点击尾部按钮
    msgselectflow : '请选择要关联的流程!', // 请选择要关联的流程
    msgqxzywlx : '请选择业务类型!', //请选择业务类型
    msgqxzsyjg : '请选择适用机构！', //请选择适用机构！
    msgcdxz60 : '长度不能超过60个字符!', // 长度不能超过60个字符
    msggetywlxerror : '业务类型查询失败!', // 业务类型查询失败
    msgnodeedit : '业务类型关联机构配置修改成功!', // 业务类型关联机构配置修改成功
    msgnodeconfig : '业务类型关联机构配置新增成功!', // 业务类型关联机构配置新增成功!
    msgselectone : '请选择一条数据!', // 请至少选择一条数据
    msgsddsuccess : '新增成功!', // 新增成功
    msgadderror : '新增异常!', // 新增异常:
    msginputillegal : '请检查输入项是否合法!', // 请检查输入项是否合法
    msgextmax60 : '描述不能超过60个字符!', // 描述不能超过60个字符
    msgeditsuccess : '修改业务配置成功!', // 修改业务配置成功
    msgediterror : '修改异常!', // 修改异常
    msggjdybgl : '该节点已被关联，请选择其他节点关联!', // 该项目池编号的数据不存在!
    msgsuredelete : '确定需要删除选中的记录吗？', // 新增成功
    tip : '提示', // 提示
    msgdelsucess : '删除成功!', // 删除成功
    msgdelerror : '删除异常!', // 删除异常
  },
  wfentrust:{
    title1 : '委托配置',
    title2 : '新增',
    title3 : '修改',
    title4 : '业务类型',
    title5 : '委托人选取',
    title6 : '被委托人选取',
    otheruserid : '被委托人', // 被委托人
    otherusername : '被委托人姓名', // 被委托人姓名
    biztype : '业务类型', // 业务类型
    userid : '委托人', // 委托人
    username : '委托人姓名', // 委托人姓名
    starttime : '开始时间', // 开始时间
    endtime : '结束时间', // 结束时间
    option : '操作', // 操作
    tip : '提示', // 提示
    logincode : '登录名', // 流程信息
    name : '姓名', // 业务信息
    ext : '业务类型描述', // 业务类型描述
    flowid : '流程编号', // 流程编号
    flowname : '流程名称', // 流程名称
    pageurl : '业务页面', // 业务页面
    msgtime1: '请选择开始日期!', // 请选择开始日期
    msgtime2: '请选择结束日期!', // 请选择开始日期
    msgtime3: '委托开始时间不能早于当前时间!', // 委托开始时间不能早于当前时间
    msgtime4: '委托开始时间不能晚于结束时间!', // 委托开始时间不能晚于结束时间
    msgtime5: '委托结束时间不能早于开始时间!', // 委托结束时间不能早于开始时间
    msgicon1: '点击尾部图标选择委托人', // 点击尾部图标选择委托人
    msgicon2: '点击尾部图标选择被委托人', // 点击尾部图标选择被委托人
    msgicon3: '点击尾部图标选择业务类型', // 点击尾部图标选择业务类型
    msgselectbiz: '请选择业务类型', // 请选择
    msgbtx: '必填项', //必填项
    msgselectone : '请选择一条数据!', // 请至少选择一条数据
    msgsddsuccess : '新增成功!', // 新增成功
    msgadderror : '新增异常!', // 新增异常
    msgczcdwtqx : '您已存在重叠的委托期限!', // 您已存在重叠的委托期限
    msginputillegal : '请检查输入项是否合法!', // 请检查输入项是否合法
    msgnotexit: '该用户不存在该业务类型的委托，请新增！', //该用户不存在该业务类型的委托，请新增！
    msgeditsuccess : '修改成功!', // 修改成功
    msgediterror : '修改异常!', // 新增异常
    msgsuredelete : '确定需要删除选中的记录吗？', // 新增成功
    msgdelsucess : '删除成功!', // 删除成功
    msgdelerror : '删除异常!', // 删除异常
    msgsameuser: '对不起，委托人与被委托人不能是同一人!', //对不起，委托人与被委托人不能是同一人!
    alltype: '全部业务', // 全部业务
    singletype: '指定业务', // 指定业务
    bizrange: '业务范围', // 业务范围
  },
  wftaskpool:{
    title1 : '项目池配置',
    title2 : '修改',
    title3 : '新增',
    title4 : '关联岗位',
    poolid : '项目池编号', // 项目池编号
    poolname : '项目池名称', // 项目池名称
    desc : '描述', // 描述
    orgid : '机构', // 机构
    option : '操作', // 操作
    setduty : '关联岗位', // 关联岗位
    dutycde : '岗位码', // 客户申请信息
    dutyname : '岗位名称', // 流程信息
    msgbtx : '必填项', // 必填项
    msgcdxz30 : '长度不能超过30个字符', // 长度不能超过30个字符
    sysid : '系统ID', // 系统ID
    msgselectone : '请至少选择一条数据!', // 请至少选择一条数据
    msgillegal : '包含特殊字符', // 包含特殊字符
    msgsddsuccess : '新增成功!', // 新增成功
    msgadderror : '新增异常!', // 新增异常:
    msgidmuilt : '项目池编号不能重复，请重新输入！', // 项目池编号不能重复，请重新输入！
    msginputillegal : '请检查输入项是否合法!', // 请检查输入项是否合法
    msgeditsuccess : '修改成功!', // 修改成功
    msgediterror : '修改异常!', // 修改异常
    msgdatanotexit : '该项目池编号的数据不存在!', // 该项目池编号的数据不存在!
    msgsuredelete : '您确定需要删除选中的记录吗？', // 新增成功
    tip : '提示', // 提示
    msgdelsucess : '删除成功!', // 删除成功
    msgdelerror : '删除异常!', // 删除异常
  }
}
