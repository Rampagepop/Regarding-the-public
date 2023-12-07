/**
 * 节点类型数组,开始节点和结束节点nodeType为固定 S、E
 * 节点类型需要与属性中选项值相同,画板左侧示例图标会根据数组顺序添加
 * {
 *   img: 'start', // 画板左侧示例图标名称，png格式，libs\mxgraph\images
 *   title: '开始', // 画板左侧示例图标下显示文本
 *   nodeType: 'S', // 节点类型，在画图区域会根据该类型直接展示对应的图标png格式，libs\mxgraph\images,与img中图标不一致
 *   label: '开始' // 图标节点默认展示文本，如果没有该属性，则默认会被设置成title值
 *   fields: [] // 节点要显示的字段名称列表,默认vertex.js中全部字段列表
 *   exfields: [] // 节点不显示的字段列表，与fields互斥，优先级高,默认从vertex.js字段列表中排除
 * }
 */
import { getLanguage } from '@/utils/i18n'
export const NODE_TYPE = getLanguage() === 'zh_CN' ? [
  { img: 'start', title: '开始', nodeType: 'S', label: '开始'},
  { img: 'end', title: '结束', nodeType: 'E'},
  { img: 'common', title: '普通', nodeType: '0'},
  { img: 'radio', title: '单选', nodeType: '1'},
  { img: 'checkbox', title: '多选', nodeType: '2'},
  { img: 'summary', title: '汇总', nodeType: 'C', fields: ['label']},
  { img: 'auto', title: '自动运行', nodeType: '5', fields: ['label', 'nodeType', 'bizBeanId', 'asynDo', 'nodeLevel']},
  { img: 'radio_condition', title: '条件单选', nodeType: '3'},
  { img: 'checkbox_condition', title: '条件多选', nodeType: '4'}
] : [
  { img: 'start', title: 'start', nodeType: 'S', label: 'start'},
  { img: 'end', title: 'end', nodeType: 'E'},
  { img: 'common', title: 'common', nodeType: '0'},
  { img: 'radio', title: 'radio', nodeType: '1'},
  { img: 'checkbox', title: 'checkbox', nodeType: '2'},
  { img: 'summary', title: 'summary', nodeType: 'C', fields: ['label']},
  { img: 'auto', title: 'auto', nodeType: '5', fields: ['label', 'nodeType', 'bizBeanId', 'asynDo', 'nodeLevel']},
  { img: 'radio_condition', title: 'cd_radio', nodeType: '3'},
  { img: 'checkbox_condition', title: 'cd_ckbox', nodeType: '4'}
];