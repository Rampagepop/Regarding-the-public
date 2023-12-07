import Vue from 'vue'
import SvgIcon from '@/components/base/SvgIcon'// svg组件
// 将所有图标设置到对应的名称
import { svgIcon } from '@/config/constant/app.data.icon'

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  // 处理图标
  requireContext.keys().forEach(svg => {
    svgIcon.push({ 
      "id": svg.replace(/(.\/)*(.svg)?/g,''), 
      "tag": "" 
    })
  });
  return requireContext.keys().map(requireContext)
}
requireAll(req)
