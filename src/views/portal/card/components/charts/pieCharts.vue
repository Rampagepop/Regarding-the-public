/**
* Desc:&emsp;&ensp;用于功能类二级卡片中的饼图，携带checkbox
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/21
* @since   1.0.0
* @version 1.0
*/
<template>
  <div style="width:100%;height:100%;position: relative;">
    <div ref="chart" style="width:100%;height:100%;"></div>
    <div v-if="checks && checks.length" class="check-box-wrap">
      <yu-checkbox class="check-box-item" v-for="(item,i) in checks" :key="i"
                   v-model="checkValList[i]" @input="(val)=>{$emit('change-checkbox',val,item)}">
        {{ item.label }}
      </yu-checkbox>
    </div>
  </div>
</template>

<script>
import {debounce} from "@/utils/debounce";
import deepMergeObj from "./deepMergeObj";

export default {
  name: "pie-charts",
  components: {},
  props: {
    checks: {
      type: Array,
      //[{label: "包含临时客户", value: true}]
      default: null
    },
    title: {
      type: String,
      default: null
    },
    data: {
      type: Array,
      //[{label: "临时客户", value: 100},{label: "正式客户", value: 100}]
      default: () => []
    },
    // 饼图左边留白
    left: {
      type: Number,
      default: 20
    },
    // 平均单个图例汉字数量，用于计算宽度进行居中
    legendWords: {
      type: Number,
      default: 5
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
      checkValList: [],
      chartWidth: 0,
    };
  },
  computed: {
    showData() {
      return this.data.filter(item => item.show === undefined || item.show)
    },
    options() {
      const legendData = this.showData.map(item => item.label);
      // 空串为换行，由于legend.orient='vertical',则垂直布局下
      // 每行的图例数量为换行数+1
      // rowLegendNum可用来计算图例居中（除去左侧图表的宽度后居中）
      const rowLegendNum = legendData.filter(l => l === "").length + 1;
      const legendWidth = (14 * this.legendWords + 40) * rowLegendNum;
      // 默认options，可通过props.coverOptions
      const defaultOptions = {
        color: ['#2877FF', '#1ABE95', '#FFC371', '#FD706D', '#7585E6', '#88CA8B', '#FFA175 ', '#6AAAF7', '#FF8BC3'],
        title: {
          text: this.title,
          padding: 0,
          left: this.left + 64,
          top: '50%',
          textAlign: 'center',
          textVerticalAlign: 'center',
          textStyle: {
            color: "#666666",
            fontSize: 16,
            fontWeight: 400,
          },
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          // 垂直布局
          orient: 'vertical',
          // 垂直居中
          top: 'middle',
          // this.left + 64 *2 为饼图的右边界，
          // 图例在去掉左侧环形图的宽度占位后居中显示
          left: (this.chartWidth + this.left + 64 * 2 - legendWidth) / 2,
          // 图例间距
          itemGap: 10,
          textStyle: {
            fontSize: '14',
            color: '#666666',
          },
          data: this.showData.map(item => item.label),
        },
        series: {
          // name: '单一客户',
          type: 'pie',
          radius: [48, 64],
          center: [64 + this.left, '50%'],
          // 过滤掉换行标志
          data: this.showData.filter(item => item.label).map(item => ({name: item.label, value: item.value})),
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      }
      return this.coverOptions ? deepMergeObj(defaultOptions, this.coverOptions) : defaultOptions
    }
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
    checks: {
      handler(n) {
        if (n) {
          this.$set(this, "checkValList", this.checks.map(item => item.value));
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.chart = window.echarts.init(this.$refs.chart);
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
.check-box-wrap {
  position: absolute;
  top: 10px;
  left: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;

  .check-box-item {

  }
}
</style>
