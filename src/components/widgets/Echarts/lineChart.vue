<!--
  @created by luoweilin 2021-08-25
  @updated by
  @description 折线图
-->
<template>
  <yu-echarts ref="refLine" :option="option"></yu-echarts>
</template>

<script>
// import {hexToRgb, resizeFont, moneyFormatter} from '@/utils/util'

export default {
  name: 'lineChart',
  props: {
    option: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
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
      if (this.$refs.refLine && this.$refs.refLine.echartsInstance) {
        setTimeout(() => {
          this.$refs.refLine.echartsInstance.resize();
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>