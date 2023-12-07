import { getLanguage } from '@/utils/i18n'
export const EDGE_PRO = getLanguage() === 'zh_CN' ? {
  label: {
    name: '路由名称',
    key: 'label',
    type: 'text',
    readOnly: false
  },
  isContinueBeanId: {
    name: '路由条件',
    key: 'isContinueBeanId',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  routeScriptTxt: {
    name: '脚本编辑',
    key: 'routeScriptTxt',
    type: 'yufp-nodescript-editor',
    readOnly: true
  }
} : {
  label: {
    name: 'Route Name',
    key: 'label',
    type: 'text',
    readOnly: false
  },
  isContinueBeanId: {
    name: 'Condition',
    key: 'isContinueBeanId',
    filterable: true,
    type: 'select',
    defaultValue: '0',
    readOnly: false
  },
  routeScriptTxt: {
    name: 'Script editing',
    key: 'routeScriptTxt',
    type: 'yufp-nodescript-editor',
    readOnly: true
  }
};