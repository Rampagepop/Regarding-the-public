import { getLanguage } from '@/utils/i18n'
export const VERTEX_PRO = getLanguage() === 'zh_CN' ? {
  label: {
    name: '节点名称',
    key: 'label',
    type: 'text',
    readOnly: false,
    dist: 'base'
  },
  nodeUser: {
    name: '处理人员',
    key: 'nodeUser',
    type: 'yufp-user-select-dialog',
    readOnly: false,
    dist: 'base'
  },
  opUsersType: {
    name: '人员指定',
    key: 'opUsersType',
    type: 'select',
    value: {'0': '人员列表选择', '2': '系统指定'},
    defaultValue: '0',
    readOnly: false,
    dist: 'base'
  },
  computeType: {
    name: '人员计算',
    key: 'computeType',
    type: 'select',
    value: {'0': '并集', '1': '交集', '2': '组间交集'},
    defaultValue: '0',
    readOnly: false,
    dist: 'base'
  },
  handleType: {
    name: '办理类型',
    key: 'handleType',
    type: 'select',
    value: {'0': '单人签收办理', '1': '单人竞争办理', '2': '多人顺序办理', '3': '多人并行办理', '4': '多人并行按条件转移', '5': '多人顺序可结束', '6': '多人并行可结束'},
    readOnly: false,
    defaultValue: '0',
    dist: 'base'
  },
  noticeType: {
    name: '待办通知',
    key: 'noticeType',
    type: 'select',
    filterable: true,
    value: {'0': '不通知', '1': '消息通知'},
    readOnly: false,
    defaultValue: '0',
    dist: 'base'
  },
  nodeType: {
    name: '节点类型',
    key: 'nodeType',
    type: 'select',
    value: {'0': '普通节点', '1': '单选节点', '2': '多选节点', '3': '条件单选节点', '4': '条件多选节点', '5': '自动运行节点', C: '汇总节点', S: '开始节点', E: '结束节点'},
    readOnly: true
  },
  bizBeanId: {
    name: '业务处理',
    key: 'bizBeanId',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  asynDo: {
    name: '同步/异步',
    key: 'asynDo',
    type: 'select',
    value: {'0': '同步', '1': '异步'},
    defaultValue: '0',
    readOnly: false
  },
  beforeSubmit: {
    name: '提交条件',
    key: 'beforeSubmit',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  strategyBeanId: {
    name: '分配策略',
    key: 'strategyBeanId',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  copyUsers: {
    name: '抄送人员',
    key: 'copyUsers',
    type: 'yufp-copyuser-selector',
    readOnly: false
  },
  nodeLevel: {
    name: '节点级别',
    key: 'nodeLevel',
    type: 'num',
    readOnly: false
  },
  reDoUserSelect: {
    name: '重办人员',
    key: 'reDoUserSelect',
    type: 'select',
    defaultValue: '0',
    value: {'0': '重新发送', '1': '上次办理人'},
    readOnly: false
  },
  conditionSelect: {
    name: '转移条件',
    key: 'conditionSelect',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  nodeSign: {
    name: '节点标识',
    key: 'nodeSign',
    type: 'text',
    readOnly: false
  },
  subFlow: {
    name: '子流程',
    key: 'subFlow',
    type: 'select',
    value: {'0': '手动同步流程', '1': '手动异步流程', '2': '自动同步流程', '3': '自动异步流程'},
    readOnly: false
  },
  subFlowId: {
    name: '子流程ID',
    key: 'subFlowId',
    type: 'yufp-subid-selector',
    readOnly: true
  },
  gather: {
    name: '会办',
    key: 'gather',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  nodeScript: {
    name: '节点脚本',
    key: 'nodeScript',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  nodeScriptTxt: {
    name: '脚本编辑',
    key: 'nodeScriptTxt',
    type: 'yufp-nodescript-editor',
    readOnly: true
  },
  returnBack: {
    name: '退回',
    key: 'returnBack',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  callBack: {
    name: '打回',
    key: 'callBack',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  change: {
    name: '转办',
    key: 'change',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  assist: {
    name: '协办',
    key: 'assist',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  addSign: {
    name: '加签',
    key: 'addSign',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  jump: {
    name: '跳转',
    key: 'jump',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  urged: {
    name: '催办',
    key: 'urged',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  refuse: {
    name: '否决',
    key: 'refuse',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  tackBack: {
    name: '拿回',
    key: 'tackBack',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    readOnly: false,
    defaultValue: '0',
    dist: 'oper'
  }
} : {
  label: {
    name: 'Name',
    key: 'label',
    type: 'text',
    readOnly: false,
    dist: 'base'
  },
  nodeUser: {
    name: 'Handler',
    key: 'nodeUser',
    type: 'yufp-user-select-dialog',
    readOnly: false,
    dist: 'base'
  },
  opUsersType: {
    name: 'Allocation',
    key: 'opUsersType',
    type: 'select',
    value: {'0': 'Select from the list', '2': 'Assigned by system'},
    defaultValue: '0',
    readOnly: false,
    dist: 'base'
  },
  computeType: {
    name: 'Calculation',
    key: 'computeType',
    type: 'select',
    value: {'0': 'Merge', '1': 'Intersect', '2': 'Component intersection'},
    defaultValue: '0',
    readOnly: false,
    dist: 'base'
  },
  handleType: {
    name: 'Handling type',
    key: 'handleType',
    type: 'select',
    value: {'0': 'Single-user by sign', '1': 'Single-user by first', '2': 'Multi-user serial', '3': 'Multi-user parallel', '4': 'Multi-user parallel with condition', '5': 'Multi-user serial optional end', '6': 'Multi-user parallel optional end'},
    readOnly: false,
    defaultValue: '0',
    dist: 'base'
  },
  noticeType: {
    name: 'To-do notice',
    key: 'noticeType',
    type: 'select',
    filterable: true,
    value: {'0': 'No notice', '1': 'Message notification'},
    readOnly: false,
    defaultValue: '0',
    dist: 'base'
  },
  nodeType: {
    name: 'Node type',
    key: 'nodeType',
    type: 'select',
    value: {'0': 'Common node', '1': 'Radio node', '2': 'Checkbox node', '3': 'cd-radio node', '4': 'cd-checkbox node', '5': 'Auto node', C: 'Summary node', S: 'Start node', E: 'End node'},
    readOnly: true
  },
  bizBeanId: {
    name: 'Business Handler',
    key: 'bizBeanId',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  asynDo: {
    name: 'sync/async',
    key: 'asynDo',
    type: 'select',
    value: {'0': 'Sync', '1': 'Async'},
    defaultValue: '0',
    readOnly: false
  },
  beforeSubmit: {
    name: 'Submit condition',
    key: 'beforeSubmit',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  strategyBeanId: {
    name: 'Strategy',
    key: 'strategyBeanId',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  copyUsers: {
    name: 'CC personnel',
    key: 'copyUsers',
    type: 'yufp-copyuser-selector',
    readOnly: false
  },
  nodeLevel: {
    name: 'Node level',
    key: 'nodeLevel',
    type: 'num',
    readOnly: false
  },
  reDoUserSelect: {
    name: 'Redo-User type',
    key: 'reDoUserSelect',
    type: 'select',
    defaultValue: '0',
    value: {'0': 'Re-select', '1': 'Last approver'},
    readOnly: false
  },
  conditionSelect: {
    name: 'Transfer condition',
    key: 'conditionSelect',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  nodeSign: {
    name: 'Node sign',
    key: 'nodeSign',
    type: 'text',
    readOnly: false
  },
  subFlow: {
    name: 'Sub-flow',
    key: 'subFlow',
    type: 'select',
    value: {'0': 'Manual synchronization process', '1': 'Manual asynchronous process', '2': 'Automatic synchronization process', '3': 'Automatic asynchronous process'},
    readOnly: false
  },
  subFlowId: {
    name: 'Sub-flow type',
    key: 'subFlowId',
    type: 'yufp-subid-selector',
    readOnly: true
  },
  gather: {
    name: 'Meet',
    key: 'gather',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  nodeScript: {
    name: 'Node script',
    key: 'nodeScript',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  nodeScriptTxt: {
    name: 'Script editing',
    key: 'nodeScriptTxt',
    type: 'yufp-nodescript-editor',
    readOnly: true
  },
  returnBack: {
    name: 'sendBack',
    key: 'returnBack',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  callBack: {
    name: 'HitBack',
    key: 'callBack',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  change: {
    name: 'TurnToDo',
    key: 'change',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  assist: {
    name: 'Co-organizer',
    key: 'assist',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  addSign: {
    name: 'AddSignature',
    key: 'addSign',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  jump: {
    name: 'Jump',
    key: 'jump',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  urged: {
    name: 'Urge',
    key: 'urged',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  refuse: {
    name: 'Veto',
    key: 'refuse',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    defaultValue: '0',
    readOnly: false,
    dist: 'oper'
  },
  tackBack: {
    name: 'TakeBack',
    key: 'tackBack',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'allow'},
    readOnly: false,
    defaultValue: '0',
    dist: 'oper'
  }
};
