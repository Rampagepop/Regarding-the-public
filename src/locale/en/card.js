export default {
  card: {
    infoCenter: 'infoCenter',
    emptyText: 'loading',
    settings: 'settings',
    id: 'card number',
    cardtype: 'card type',
    name: 'card name',
    type: 'card type',
    size: 'card size',
    level: 'nesting level',
    pCard: 'parent card',
    description: 'card description',
    dataType: 'data presentation form',
    deptSource: 'department source',
    sysSource: 'system source',
    targetUser: 'target role user',
    status: 'enable/deactivate',
    like: 'like logo',
    collect: 'collect logo',
    online: 'new online logo',
    use: 'used logo',
    createTime: 'creation time',
    card: 'card',
    add: 'add',
    update: 'update',
    delete: 'delete',
    success: 'success',
    failed: 'failed',
    view: 'view detail',
    bccg: 'Save successful!',
    ifDelete: 'delete or not?',
    qsr: 'Please enter',
    qxz: 'Please select',

    cardmore:'card more',

    // 卡片标题翻译
    tools: 'tools',
    quickEntrance: 'quick',
    quickEntranceEdit: 'edit',
    quickEntranceEditTitle: 'quick entry',
    riskWarning: 'riskWarning',
    processTracking: 'processTracking',
    pieCharts: 'pieCharts',
    pendingBusi: 'pendingBusi',
    myClient: 'myClient',
    linesCharts: 'linesCharts',
    expirationPrompt: 'expirationPrompt',
    calendar: 'calendar',
    agentReminder: 'agentReminder',
    approveContract: 'approve constract task',
    gratingClientInfo: 'grating clientInfo',
    copySuccess: "Copy Success!",
    approvalEffic: 'approvalEffic', //审核人员效率
    approveInfoSummary: 'approveInfoSummary', //审批情况概况
    creditUntriedInfo: 'creditUntriedInfo', //授信未审结情况
    monitoryReplayment: "monitory replayment",//还款监控
    monitoryReplaymentDetail: "monitory replayment detail",//还款监控详情
    policyLibrary: 'policyLibrary',//政策库
    policyLibraryDetail: 'policyLibrary detail',
    policyLibraryPublish:'policyLibrary publish',//政策库发布
    contractApproveConfig: 'contract approve config',//合同审核要点配置
    // 合同审核任务
    approveContractCfg: {
      shyd: 'approve tips'
    },
    // 授信审批
    creditApprove: {
      title: '授信审批任务',
      placeholder: '客户编号、名称、任务流水号',
    },

    // 搜索-图表-按钮
    searchChartBtx: {
      placeholder: 'Key Words',
      moreStatisticInfo: 'More Statistical Info',
      moreFunc: 'More',
    },
    // 我的客户
    cusMgr: {
      myCusTitle: "My Client",
      notice: "Data Date: $\nNote: There are loan customers as part of the formal customers!",
      placeholder: 'Account No, Customer Name, Id No',
      addCorp: 'Corporate Customer Creation',
      addPs: 'Individual customer Creation',
      addTradeCus: 'Trade customer Creation',
      importRiskCus: 'Risk Customer Import',
      cusSharingApply: 'Customer Sharing Application',
      groupCorpIdentify: 'Group Customer Identification',
      frmlCus: 'Formal Cus',
      tempCus: 'Temp Cus',
      hasTempCus: 'Contain Temp Cus',
      hvLoanCus: 'Loan Cus',
      hvCrCus: 'Credit Cus',
      cusTot: 'Cus Total',
      population: 'population',
      id: 'Id',
      idNo: 'Id No',
      title: "Customer Management",
      // 二级页面
      corp: "Corp",
      ps: "Ps",
      overview: 'Overview',
      dataDate: 'Date',
      cmpLastMonth: 'Month Basis',
      cusSearch: 'Cus Search',
      query: 'Query',
      reset: 'Reset',
      other: 'Other',
      disabledCusSearch: 'Tip: Click $ for searching Canceled Accounts',
      corporate: 'corporate',
      Peer: 'Peer',
      here: 'here',
      noData: 'No Data',
      all: 'ALL',
      cusNum: 'Cus Number',
      // 客户管理表格字段
      fields: {
        cusId: 'Cus Id',
        cusName: 'Cus Name',
        cusTyp: 'Cus Typ',
        idTyp: 'Id Typ',
        idNo: 'Id No',
        cusCat: 'Cus Cat',
        corpScal: 'Corp Scal',
        indyCat: 'Indy Cat',
        hldgTyp: 'Hldg Typ',
        nesLrgClss: 'Neslrg Clss',
        manMgrName: 'Manmgr Name',
        mgrBchName: 'Mgrbch Name',
        cusSts: 'Cus Sts',
        sex: 'SEX',
        hgtEdu: 'Hgt Edu',
        nesLrg: 'Nesl Rg',
        phInd: 'Ph Ind',
        dfltInd: 'Dflt Ind',
        nation: 'NATION',
        occp: 'OCCP',
        unitChr: 'Unit Chr',
        indyCde: 'INDY_CDE',
      }
    },
    // 客户卡片
    customer: {
      total: 'total',
      stock: 'stock',
      temp: 'temp',
      mgr: 'mgr',
      add: 'add',
    },
    // 评价类
    eval: {
      compEval: 'Comprehensive Assessment',
      compEvalHead: 'Comprehensive Assessment（Head Office）',
      riskEval: 'Risk Assessment',
      riskEvalHead: 'Risk Assessment（Head Office）',
      compScore: 'Comprehensive Score',
      rank: 'Rank',
      orgNum: 'A total of $ branches participated in the score ranking', // $会被替换成数字
      loanBalance: "Loan Balance",
      loanBalanceUnit: "Loan Balance (Ten Thousand)",
      cmpLastMonth: "Compared with Last Month",
      cmpLastPrd: "Compared with Last Period",
      corp: "Corporation",
      ps: "Person",
    },
    // 资产类
    assets: {
      // 资产质量
      zcZl:"资产质量",
      yqYeYy:"逾期余额（亿元）",
      yql:"逾期率",
      blYeYy:"不良余额（亿元）",
      bll:"不良率",
      monBfr:"一月前",
      twoMonBfr:"两月前",
      halfYearBfr:"半年前",
      yearBfr:"一年前",
      yeYy:"余额（亿元）",
      cmpLstDay:"比昨日",
      cmpLstMon:"比上月",
      cmpStrYear:"比年初",
      dkYe:"贷款余额",
      yqYe:"逾期余额",
      blYe:"不良余额",

      // 资产结构
      zcJg: "资产结构",
      bnDkYe: "表内贷款余额",
      bnTxYe: "表内贴现余额",
      bwSxYx: "表外授信-用信",
      bnnDkYe: "表内\n贷款余额",
      cp: "pro",
      yeWy: "余额（万元）",
      zb: "ratio",
      ldZjDk: "流动资金贷款",
      gdZcDk: "固定资产贷款",
      ytDk: "银团贷款",
      pjTx: "票据贴现",
      qt: "other",
    },
    // 风险预警
    risk: {
      update: 'update',
      takeeffect: 'takeeffect',
      userName: 'userName',
      updateOrg: 'updateOrg',
      reason: 'reason',
      takeeffectreason: 'takeeffectreason',
      content: 'content',
    },
    //审批人员效率
    approvalEffic: {
      yd: 'mouth',
      jd: 'season',
      nd: 'year'
    },
    //授信未审结
    creditUntriedInfo: {
      pieTitle: 'current level pie'//所处阶段分布情况
    },
    //还款监控
    monitoryReplayment: {
      moreInfo: 'More info',
      title:'Monitory replayment Detail'
    },
    // policyLibraryPublish:{
    //   add: 'add'
    // },
    //政策库-更多
    policyLibrary: {
      more: 'more',
      title: 'policy library'
    },
    processTracking: {
      btnLog: 'journal', // 日志
      btnDetail: 'details', // 详情
      sx: 'Credit facilities', // 授信
      fk: 'loan', // 放款
      bizId: 'Business serial number', // 业务流水号
      fee: 'Credit amount', // 授信金额
      startTime: 'Date received', // 收件日期
      nodeName: 'Current stage', // 当前阶段
      tracktitle: 'Process track' // 流程轨迹
    },
    agentReminder: {
      settings: 'modify', // 修改
      editTitle: 'To do reminder card configuration', // 待办提醒卡片配置
      tip: 'Drag for sort',
      qd: 'comfirm', // 确定
      qx: 'cancel', // 取消
      success: 'Saved successfully', // 保存成功
      other: 'Other'
    },
    pendingBusi: {
      all: 'all',
      zq: 'Extension period', // 展期
      add: 'add', // 新增
      sxqx: 'Credit period', // 授信期限
      jb: 'Handling', // 经办
      handle: 'handle', // 处理
      fksq: 'Loan application' // 放款申请
    },
    expirationPrompt: {
      household: 'household', // 户
      stroke: 'stroke' // 笔
    },
    // 快捷入口
    quickEntry: {
      gztkpxs: 'Workbench card display', // 工作台卡片显示
      tip1: 'Drag and move to sort. Add up to 8 shortcut entries. Please remove them before adding them', // 拖拽移动进行排序，最多添加8个快捷入口，超出请移除后再添加
      tip2: 'No configuration, please select or add a shortcut entry from below', // 未进行配置，请从下方选择或新增快捷入口后进行添加
      tip3: 'The system built-in shortcut entry cannot be edited or deleted', // 系统内置快捷入口不可编辑、删除
      tip4: 'Custom upload or select built-in icon. It is recommended that the aspect ratio be 1:1 (size)', // 自定义上传或选择内置图标，建议宽高比1:1(尺寸)
      qbkjrk: 'All quick entrances', // 全部快捷入口
      clear: 'clear', // 清空
      add: 'add', // 新增
      builtin: 'built-in', // 内置
      save: 'save', // 保存
      qx: 'cancel', // 取消
      zdy: 'custom', // 自定义
      select: 'select', // 选择
      reset: 'reset', // 重置
      kjrkmc: 'Quick entry name', // 快捷入口名称
      address: 'address', // 地址
      tb: 'Icon', // 图标
      xzkjrk: 'Add a shortcut entry', // 新增快捷入口
      bjkjrk: 'Edit quick entry', // 编辑快捷入口
      btx: 'Required', // 必填项
      czcg: 'Operation successful', // 操作成功
      sccg: 'Deletion succeeded', // 删除成功
      tip5: 'At most 8 quick entries can be added. Please remove them before adding them', // 最多添加8个快捷入口，超出请移除后再添加
      qd: 'comfirm', // 确定
      ts: 'Tips', // 提示
      sfjx: 'This operation will be permanently deleted. Continue?' // 此操作将永久删除, 是否继续?
    },
    askInfo: {
      readedSuccess: '全部阅读!',
      needSelectOne: '至少选择一条！'
    },

    // 完成事项
    complTrans: {
      title: "Completed Transaction",
      editTitle: " Edit Completed Transaction",
      edit: "Edit",
      more: "More",
      noAccessOfPrcCenter: "当前无进度中心菜单权限！",
      customer: {},
      other: 'Other',
      credit: "授信管理",
      collateral: "押品管理",
      contract: "合同管理",
      useLetter: "用信管理",
      loan: "放款管理",
      postLoan: "贷后管理",
    },
  }
}
