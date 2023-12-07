<template>
  <card-wrap :cardName="cardName">
    <template slot="topCenter">
      <div class="yu-title">
        <div class="yu-title-right">
          <span :class="['mode', {'activeMode': mode === '周'}]" @click="changeMode('周')">周</span>
          <span :class="['mode', {'activeMode': mode === '月'}]" @click="changeMode('月')">月</span>
        </div>
      </div>
    </template>
    <div ref="chart" style="width:100%;height:100%;"></div>
  </card-wrap>
</template>

<script>
import cardWrap from '@/views/portal/card/components/card-wrap';
import { debounce } from "@/utils/debounce";
import { getRecentDay } from '@/utils/util';
export default {
  components: {
    cardWrap
  },
  props: {
    // 图表信息
    /* echartsData: {
      require: true,
      type: Object,
      default: function() {
        return {
          xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'], //x轴刻度标签值
          seriesData1: ['1231', '123', '211', '214', '124', '324', '134'], //系列值
          seriesData2: ['352', '675', '345', '345', '533', '455', '1231'], //系列值
          seriesData3: ['545', '211', '123', '124', '324', '134', '126'] //系列值
        };
      }
    }, */
    cardName: {
      type: String,
      default() {
        return this.$t('card.linesCharts')
      }
    }
  },
  data() {
    return {
      autoResize: true,
      chart: null,
      mode: '周',
      options: {
        color: ['#8477FF', '#FFC76E', '#294292'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type:'shadow'
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 15,
          itemHeight: 2,
          data: ['单一客户', '集团客户', '同业客户'],
          padding: 5,
          textStyle: {
            color: '#333333',
            fontFamily: 'PingFangSC-Regular, PingFang SC'
          }
        },
        grid: {
          top:'40',
          left: '10',
          right: '35',
          bottom: '15',
          containLabel: true
        },
        textStyle: {
          color: '#999999 ',
          fontFamily: 'PingFangSC-Regular',
          fontWeight: 400
        },
        xAxis: {
          type: 'category',
          boundaryGap: false, // 第一个值从原点开始
          data: [],
          axisTick: {
            show: false // 隐藏刻度尺
          },
          axisLine: {
            lineStyle: {
              color:'#8CA0B3',
              type: 'dotted',
              width: 0.5
            }
          }/* ,
          axisLabel: {
            interval: 0
          } */
        },
        yAxis: {
          type: 'value',
          min: 'dataMin',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false // 隐藏刻度尺
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
              color: '#8CA0B3',
              width: 0.5
            }
          },
        },
        series: [
          {
            name: '单一客户',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(159, 200, 255, 0.4)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(255, 255, 255, 0.4)' // 100% 处的颜色
                }]
              }
            }
          },
          {
            name: '集团客户',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(159, 200, 255, 0.4)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(255, 255, 255, 0.4)' // 100% 处的颜色
                }]
              }
            }
          },
          {
            name: '同业客户',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(159, 200, 255, 0.4)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(255, 255, 255, 0.4)' // 100% 处的颜色
                }]
              }
            }
          }
        ]
      },
      xAxisData: [],
      seriesData1: ['1231', '123', '211', '214', '124', '324', '134', '324', '546', '342', '169', '350'], //系列值
      seriesData2: ['352', '675', '345', '345', '533', '455', '1231', '165', '675', '390', '567', '678'], //系列值
      seriesData3: ['545', '211', '123', '124', '324', '134', '126', '546', '342', '165', '675', '325']
    };
  },
  watch: {
    echartsData: {
      handler(n, o) {
        if(n) {
          this.getLineData();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.chart = window.echarts.init(this.$refs.chart);
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHandler);
    }
    this.getLineData();
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
    changeMode(val) {
      this.mode = val;
      if(this.mode == '周') {
        this.options.xAxis.data = this.getWeek();
        this.options.series[0].data = this.seriesData1;
        this.options.series[1].data = this.seriesData2;
        this.options.series[2].data = this.seriesData3;
        this.chart.setOption(this.options);
      } else {
        this.options.xAxis.data = this.getMonth();
        this.options.series[0].data = ['352', '675', '345', '345', '533', '455', '352', '675', '345', '345', '533', '455'];
        this.options.series[1].data = ['1231', '211', '123', '211', '214', '124', '324', '134', '126', '211', '214', '124'];
        this.options.series[2].data = ['211', '214', '124', '324', '134', '126', '345', '533', '455', '211', '123', '563'];
        this.chart.setOption(this.options);
      }
    },
    // 获取周度数据
    getWeek() {
      this.xAxisData = [];
      for(let i = 0; i < 12; i++) {
        this.xAxisData.unshift(getRecentDay(i * -7, 'week'));
      }
      return this.xAxisData;
    },
    // 获取月度数据
    getMonth() {
      this.xAxisData = [];
      for(let i = 0; i < 12; i++) {
        this.xAxisData.unshift(getRecentDay(i * -30));
      }
      return this.xAxisData;
    },
    getLineData() {
      this.options.xAxis.data = this.getWeek();
      this.options.series[0].data = this.seriesData1;
      this.options.series[1].data = this.seriesData2;
      this.options.series[2].data = this.seriesData3;
      this.chart.setOption(this.options);
    }
  }
};
</script>
<style lang="scss" scoped>
.yu-title {
  display: flex;
  flex-direction: row-reverse;
  line-height: 48px;
  &-left {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
  }
  &-right {
    .mode {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 14px;
      display: inline-block;
      margin-left: 16px;
      cursor: pointer;
    }
    .activeMode {
      color: #2877FF;
      padding-bottom: 8px;
      border-bottom: 1px solid #2877FF;
    }
  }
}
</style>