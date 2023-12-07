import { getLanguage } from '@/utils/i18n'
export const WORKFLOW_PRO = getLanguage() === 'zh_CN' ? {
  flowId: {
    name: '流程ID',
    key: 'flowId',
    type: 'text',
    readOnly: true
  },
  flowName: {
    name: '流程名称',
    key: 'flowName',
    type: 'text',
    readOnly: true
  },
  startCondition: {
    name: '启动条件',
    key: 'startCondition',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  hangUp: {
    name: '挂起/唤醒',
    key: 'hungUp',
    type: 'select',
    value: {'0': '关闭', '1': '打开'},
    defaultValue: '0',
    readOnly: false
  },
  cancel: {
    name: '作废',
    key: 'cancel',
    type: 'select',
    value: {'0': '不允许', '1': '允许'},
    defaultValue: '0',
    readOnly: false
  }
} : {
  flowId: {
    name: 'Flow ID',
    key: 'flowId',
    type: 'text',
    readOnly: true
  },
  flowName: {
    name: 'Name',
    key: 'flowName',
    type: 'text',
    readOnly: true
  },
  startCondition: {
    name: 'Start condition',
    key: 'startCondition',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  hangUp: {
    name: 'hungUp',
    key: 'hungUp',
    type: 'select',
    value: {'0': 'close', '1': 'open'},
    defaultValue: '0',
    readOnly: false
  },
  cancel: {
    name: 'Void',
    key: 'cancel',
    type: 'select',
    value: {'0': 'Not Allow', '1': 'Allow'},
    defaultValue: '0',
    readOnly: false
  }
};
