export default {
  wfcommon:{
    lcslh : 'Instance ID', // 流程实例号
    ywlsh : 'Business ID', // 业务流水号
    khmc : 'Custom Name', // 客户名称
    khbh : 'Custom ID', //客户编号
    biztype : 'Business Type', // 业务类型
    flowsign : 'Flow Sign', // 流程标识
    flowname : 'Flow Name', // 流程名称
    pageurl : 'Business Page', // 业务页面
  },
  // 按钮名称
  wfbutton:{
    search : 'Search', // 按钮搜索
    find : 'Search', // 按钮查询
    reset : 'Reset', // 按钮重置
    xqfh : 'Select Back', // 按钮选取返回
    sure : 'Sure', // 按钮确定
    save : 'Save', // 按钮保存
    return : 'Return', // 按钮返回
    cancel : 'Cancel', // 按钮取消
    startmeet : 'Start', // 开始会议
    restartmeet : 'Restart', // 重新开始会议
    voteinfo : 'Detail', // 按钮投票详情
    vote : 'Vote', // 按钮投票
    add : 'New', // 按钮新增
    import : 'Import', // 按钮导入
    export : 'Export', // 按钮导出
    edit : 'Modify', // 按钮修改
    delete : 'Delete', // 按钮删除
    track : 'Track', // 流程轨迹
    refresh : 'Refresh', // 按钮刷新
    config : 'Config', // 按钮配置
    info: 'info'
  },
  // 消息提示
  wfmessage:{
    qxzytjl : 'Please select a record!', // 请选择一条记录
    biztyeisnull : 'Business type cannot be empty！', // 业务类型不能为空！
    startsuccess : 'successfully initiated!', // 成功发起
    starterror : 'Process initiated exception  ', // 流程发起异常
    return : 'Return' // 业务类型
  },
  // 签收状态
  wfsignstate:{
    sign0 : 'NoNeedToSign', // 无需签收
    sign1 : 'NotSigned', // 未签收
    sign2 : 'HaveBeenReceived', // 已签收
    sign3 : 'Exclusive', // 排他
    sign4 : 'TaskPoolSignIn' // 项目池签收
  },
  // 节点审批状态
  wfnodestate:{
    nahui : 'TakeBack', // 拿回
    dahui : 'HitBack', // 打回
    tuihui : 'sendBack', // 退回
    cuiban : 'Urge', // 催办
    change : 'TurnToDo', // 转办
    xieban : 'Co-Organizer', // 协办
    jump : 'Jump', // 跳转
    agree : 'Agree', // 同意
    chehui : 'Withdraw', // 撤回
    weituo : 'Entrust', // 委托
    faqi : 'Initiate', // 发起
    zdtj : 'AutoCommit', // 自动提交
    refuse : 'Veto', // 否决
    end : 'End', // 正常结束
    cancel : 'Void', // 作废
    buqian : 'Supplementary signature', // 补签
    jiaqian : 'AddSignature', // 加签
  },
  // 流程状态
  wfflowstate:{
    flowstates : 'Pending', // 流程发起
    flowstater : 'Running', // 运行中
    flowstateh : 'Hang', // 流程挂起
    flowstatew : 'Pause  ', // 流程暂停
    flowstatef : 'Veto', // 成功发起
    flowstatee : 'End  ', // 流程结束
    flowstatec : 'Invalid' // 流程作废
  },
  // 会议状态
  wfmeetstate:{
    meetstates : 'Pending', // 会议未开始
    meetstater : 'Voting', // 正在投票中
    meetstatee : 'End' // 会议已结束
  },
  // 投票状态
  wfvotestate:{
    votestatey : 'Agree', // 同意
    votestaten : 'Veto', // 否决
    votestateg : 'Abstain', // 弃权
    votestatee : 'NotVoted' // 未投票
  }
}
