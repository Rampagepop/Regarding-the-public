<!--
  @created by luoweilin 2021-08-25
  @updated by
  @description 柱状图
-->
<template>
  <yu-echarts ref="refBar" :option="option"></yu-echarts>
</template>
<script>
// import {hexToRgb, resizeFont, moneyFormatter} from '@/utils/util'
export default {
  name: 'barChart',
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
  mounted() {
    // console.log(echarts);
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
      if (this.$refs.refBar && this.$refs.refBar.echartsInstance) {
        setTimeout(() => {
          this.$refs.refBar.echartsInstance.resize();
        }, 300)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>