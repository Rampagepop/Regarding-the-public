/**
* Desc:&emsp;&ensp;用于流程类-授信审批中右侧柱状图的展示
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/21
* @since   1.0.0
* @version 1.0
*/
<template>
  <div ref="chart" style="width:100%;height:100%;"></div>
</template>

<script>
import {debounce} from "@/utils/debounce";
import deepMergeObj from "./deepMergeObj";

export default {
  name: "vert-bar",
  components: {},
  props: {
    title: {
      type: String,
      default: null
    },
    data: {
      type: Array,
      //[{label: "XX", value: 100},{label: "XX", value: 100}]
      default: () => []
    },
    // 图表信息，其属性会覆盖当前的options
    coverOptions: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      autoResize: true,
      chart: null,
      chartWidth: 0,
    };
  },
  computed: {
    options() {
      const seriesData = this.data.map(i => i.value);
      const max = Math.max(...seriesData);
      const defaultOptions = {
        grid: {
          // show: false,
          top: 10,
          left: 24,
          right: 24,
          bottom: 10,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show: false,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: "#EDEDED",
            }
          },
          axisTick: {show: false},
          axisLabel: {show: false},
          data: this.data.map(i => i.label)
        },
        yAxis: {
          show: false,
          type: 'value',
          // axisTick和axisLabel不置为false的话，grid仍然会计算宽度
          axisTick: {show: false},
          axisLabel: {show: false},
        },
        series: {
          name: this.title,
          type: "bar",
          barWidth: "10",
          data: this.data.map(i => i.value),
          showSymbol: false,
          smooth: true,
          itemStyle: {
            color: (val) => {
              return val.value === max ? '#FC974D' : '#2877FF'
            },
            barBorderRadius: [2, 2, 0, 0]
          }
        }
      }
      return this.coverOptions ? deepMergeObj(defaultOptions, this.coverOptions) : defaultOptions
    },
  },
  watch: {
    options: {
      handler(n) {
        if (n) {
          this.chart.setOption(n);
        }
      },
      deep: true
    },
  },
  mounted() {
    this.chart = window.echarts.init(this.$refs.chart);
    if (this.options) {
      this.chart.setOption(this.options, true);
    }
    this.chartWidth = this.chart.getWidth();
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
          this.$nextTick(() => {
            this.chartWidth = this.chart.getWidth();
          })
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHandler);
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
</style>
