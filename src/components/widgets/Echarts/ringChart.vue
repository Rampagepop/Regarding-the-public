<!--
  @created by luoweilin 2021-08-25
  @updated by
  @description 环形图
-->
<template>
  <div class="ring-chart">
    <yu-echarts ref="refRing" :option="option"></yu-echarts>
    <div v-if="showTip" class="chart-tip" :style="{left: center[0], top: center[1]}">
      <div class="chart-num">{{ total }}</div>
      <div class="chart-text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
import {hexToRgb, resizeFont} from '@/utils/util'
export default {
  name: 'ringChart',
  props: {
    // 宽度
    width: {
      type: Number,
      default: 280
    },
    // 高度
    height: {
      type: Number,
      default: 300
    },
    // 颜色
    colors: {
      type: Array,
      default: () => {
        return ['#43D5AF', '#F2C02D', '#6D73FF', '#5888FF', '#FF8F3E', '#FF4E3E']
      }
    },
    // 数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 单位
    unit: {
      type: String,
      default: ''
    },
    // 图例
    legend: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 半径
    radius: {
      type: Array,
      default: () => {
        return ['40%', '60%']
      }
    },
    // 中心位置
    center: {
      type: Array,
      default: () => {
        return ['45%', '35%']
      }
    },
    // 是否显示文字信息
    showTip: {
      type: Boolean,
      default: false
    },
    // 总数
    total: Number,
    // 描述文字
    text: {
      type: String,
      default() {
        return ''
      }
    },
    otherData: Number
  },
  data() {
    const _this = this;
    return {
      option: {
        color: this.colors,
        tooltip: {
          trigger: 'item',
          formatter: param => {
            return param.marker + param.name + ': ' + param.value + this.unit;
          }
        },
        legend: Object.assign({
          itemWidth: 8,
          itemHeight: 8,
          icon: 'emptyCircle',
          textStyle: {
            color: hexToRgb('#3c4358', 0.8),
            fontSize: resizeFont(1.4)
          },
          itemGap: resizeFont(2),
          data: this.data.map(item => item.name),
          formatter: function(item, idx) {
            if (item === '未完成') {
              return item + '，其中超期' + _this.otherData;
            } else {
              return item;
            }
          }
        }, this.legend),
        series: [
          {
            type: 'pie',
            radius: this.radius,
            center: this.center,
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            },
            data: this.data
          }
        ]
      }
    }
  },
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
      if (this.$refs.refRing && this.$refs.refRing.echartsInstance) {
        setTimeout(() => {
          this.$refs.refRing.echartsInstance.resize();
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/styles/variables.scss';
  .ring-chart {
    position: relative;
    height: 100%;
    .chart-tip {
      position: absolute;
      text-align: center;
      width: 60px;
      transform: translate(-30px, -30px);
      .chart-num {
        font-size: 18px;
        color: $black;
        line-height: 30px;
      }
      .chart-text {
        white-space: nowrap;
        font-size: 14px;
        color: $fontColor;
        line-height: 20px;
      }
    }
  }
</style>