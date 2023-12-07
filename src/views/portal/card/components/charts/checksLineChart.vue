/**
* Desc:&emsp;&ensp;
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/26
* @since   1.0.0
* @version 1.0
*/
<template>
  <div style="width: 100%;height: 100%;overflow: hidden">
    <div class="label-check-wrap">
      <div class="label-check-item"
           v-for="(item,i) in seriesData" :key="i"
           :class="{check:item.check && item.enableCheck}"
           :style="{'border-color':item.enableCheck?rgbaColor[i%(rgbaColor.length-1)]:'transparent'}"
           @click="clickCheckItem(item)"
      >
        <div class="checkBorder">
          <div v-if="item.enableCheck" class="check-icon yu-icon-checked2"
               :style="{'color':color[i%(color.length-1)]}"></div>
          <div class="value">{{ item.value }}</div>
          <div class="label">{{ item.label }}</div>
          <div class="ratio" v-if="item.ratio">
            <span class="ratio-label">{{ item.ratio.label }}</span>
            <span class="ratio-value"
                  :class="item.ratio.grow?'ratio-up yu-icon-up':'ratio-down yu-icon-down'">{{ item.ratio.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart" ref="chart"></div>
  </div>
</template>
<script>
import {debounce} from "@/utils/debounce";
import deepMergeObj from "./deepMergeObj";

export default {
  name: "checksLineChart",
  props: {
    xAxisData: {
      type: Array,
      default: () => []
    },
    seriesData: {
      type: Array,
      // [{label: "包含临时客户", check: true, enableCheck:true, value:"xxx",ratio:{Label:"比上月",value:"1",grow:true},data:[]]
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
      color: ['#2877FF', '#FFC371', '#1ABE95', '#FD706D', '#7585E6', '#88CA8B', '#FFA175 ', '#6AAAF7', '#FF8BC3'],
    };
  },
  computed: {
    options() {
      const defaultOptions = {
        color: this.color,
        // title: {
        //   padding: 0,
        //   left: 64 + 20,
        //   top: '50%',
        //   textAlign: 'center',
        //   textVerticalAlign: 'center',
        // },
        grid: {
          show: false,
          top: 30,
          left: 0,
          right: 0,
          bottom: 20,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          // 垂直布局
          orient: 'horizontal',
          top: '16',
          left: 'center',
          // 图例间距
          itemGap: 10,
          icon: "path://M0,0L100,0L100,10L0,10Z",
          textStyle: {
            fontSize: '14',
            color: '#666666',
          },
          data: []
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#E0E0E0",
            }
          },
          axisTick: {show: false},
          axisLabel: {
            showMinLabel: true,
            showMaxLabel: true,
            color: "#949494",
            fontSize: 14,
            // 左边label居左，右边居右
            interval: Math.floor((this.xAxisData.length - 1) / 3),
          },
          data: this.xAxisData.map((value, i) => {
            value = this.$moment(value).format('YYYY-MM-DD')
            if (i === 0 || i === this.xAxisData.length - 1) {
              return {
                value,
                textStyle: {
                  align: i === 0 ? "left" : "right"
                }
              }
            } else {
              return this.$moment(value).format('YYYY-MM-DD')
            }
          }),
        },
        yAxis: {
          show: false,
          type: 'value',
        },
        series: []
      }
      this.seriesData.filter(item => item.data).forEach((item, i) => {
        if (item.enableCheck && item.check || !item.enableCheck) {
          defaultOptions.legend.data.push(item.legendLabel || item.label);
          defaultOptions.series.push({
            name: item.legendLabel || item.label,
            type: "line",
            data: item.data,
            showSymbol: false,
            smooth: true,
            itemStyle: {
              color: this.color[i]
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: this.rgbaColor[i] // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(255,255,255,0.1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          })
        }
      })
      return this.coverOptions ? deepMergeObj(defaultOptions, this.coverOptions) : defaultOptions
    },
    rgbaColor() {
      return this.color.map(color => "rgba(" + this.hexToRgb(color).join(",") + ",0.5)")
    }
  },
  watch: {
    options: {
      handler(n) {
        if (n) {
          this.chart.setOption(n, true);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.chart = window.echarts.init(this.$refs.chart);
    if (this.options) {
      this.chart.setOption(this.options, true);
    }
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
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
  methods: {
    clickCheckItem(item) {
      if (item.enableCheck) {
        item.check = this.seriesData.filter(s => s.check).length <= 1 ? true : !item.check;
        this.$emit('check-click', item);
      }
    },
    hexToRgb(color) {
      const colorChange = [];
      for (let i = 1; i < 7; i += 2) {
        colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
      }
      return colorChange;
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: calc(100% - 110px);
}

.label-check-wrap {
  width: 100%;
  height: 110px;
  display: flex;
  flex-flow: row nowrap;

  .label-check-item {
    position: relative;
    height: 100%;
    flex: auto;
    margin-left: 16px;

    &:first-of-type {
      margin-left: 0;
    }


    .checkBorder {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-width: 2px;
      border-style: solid;
      border-color: transparent;
      border-radius: 4px;

      display: flex;
      flex-flow: column nowrap;
      justify-content: center;

      align-items: center;
      text-align: center;
      cursor: pointer;
    }

    &.check .checkBorder, &:hover .checkBorder {
      border-color: inherit;
    }

    .check-icon {
      display: none;
      position: absolute;
      right: 10px;
      top: 10px;
      width: 14px;
      height: 14px;
      font-size: 14px;
      line-height: 14px;
    }

    &.check .check-icon {
      display: block;
    }

    .value {
      width: 100%;
      text-align: center;
      height: 19px;
      font-size: 24px;
      color: #333333;
      line-height: 24px;
      font-weight: bold;
    }

    .label {
      display: inline-block;
      margin-top: 10px;
      min-width: 60px;
      padding: 0 10px;
      height: 28px;
      background: #F2F2F2;
      border-radius: 4px;
      line-height: 28px;
      font-size: 14px;
      color: #333333;
    }

    .ratio {
      margin-top: 10px;

      .ratio-label {
        color: #949494;
        font-size: 12px;
        line-height: 14px;
      }

      .ratio-value {
        font-size: 12px !important;
        line-height: 14px;
      }

      .ratio-value.ratio-up {
        color: #F52C36;
      }

      .ratio-value.ratio-down {
        color: #11BD19;
      }
    }
  }
}
</style>
