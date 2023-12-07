<!--
  @created by luoweilin 2021-08-25
  @updated by
  @description 饼图
-->
<template>
  <yu-echarts ref="refRose" :option="option"></yu-echarts>
</template>

<script>
import {resizeFont} from '@/utils/util' 

export default {
  name: 'pieChart',
  // props: {
  //   // 宽度
  //   width: {
  //     type: Number,
  //     default: 560
  //   },
  //   // 高度
  //   height: {
  //     type: Number,
  //     default: 160
  //   },
  //   // 颜色
  //   colors: {
  //     type: Array,
  //     default: () => {
  //       return ['#5888FF', '#6BE5DC', '#FFD16A']
  //     }
  //   },
  //   // 数据
  //   data: {
  //     type: Array,
  //     default: () => {
  //       return []
  //     }
  //   },
  //   // 单位
  //   unit: {
  //     type: String,
  //     default: '%'
  //   },
  //   // 图例
  //   legend: {
  //     type: Object,
  //     default: () => {
  //       return {}
  //     }
  //   },
  //   // 半径
  //   radius: {
  //     type: String,
  //     default: '70%'
  //   },
  //   // 中心位置
  //   center: {
  //     type: Array,
  //     default: () => {
  //       return ['40%', '50%']
  //     }
  //   }
  // },
  props: {
    option: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  // data() {
  //   return {
  //     option: {
  //       color: this.colors,
  //       tooltip: {
  //         trigger: 'item',
  //         textStyle: {
  //           fontSize: resizeFont(1.3),
  //         },
  //         formatter: param => {
  //           return param.marker + param.name + ': ' + param.percent + this.unit;
  //         }
  //       },
  //       legend: Object.assign({
  //         orient: 'vertical',
  //         x: '60%',
  //         y: 'center',
  //         itemWidth: 8,
  //         itemHeight: 8,
  //         icon: 'circle',
  //         textStyle: {
  //           color: '#1a1f36',
  //           fontSize: resizeFont(1.5)
  //         },
  //         itemGap: resizeFont(1.5),
  //         data: this.data.map(item => item.name)
  //       }, this.legend),
  //       series: [
  //         {
  //           type: 'pie',
  //           radius: this.radius,
  //           center: this.center,
  //           itemStyle: {
  //             normal: {
  //               label: {
  //                 show: false
  //               }
  //             }
  //           },
  //           data: this.data
  //         }
  //       ]
  //     }
  //   }
  // },
  mounted() {
    window.addEventListener('resizeChart', this.resize);
    window.addEventListener('resize', this.resize);
  },
  destroyed() {
    window.removeEventListener('resizeChart', this.resize);
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    // 重绘echarts图
    resize() {
      if (this.$refs.refPie && this.$refs.refPie.echartsInstance) {
        setTimeout(() => {
          this.$refs.refPie.echartsInstance.resize();
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>