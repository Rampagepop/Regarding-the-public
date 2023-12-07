<template>
  <card-wrap :cardName="cardName">
    <template slot="topCenter">
      <div class="yu-title">
        <div class="yu-title-right">
          <span :class="['mode', {'activeMode': mode === '授信类型'}]" @click="changeMode('授信类型')">授信类型</span>
          <span :class="['mode', {'activeMode': mode === '贷款阶段'}]" @click="changeMode('贷款阶段')">贷款阶段</span>
        </div>
      </div>
    </template>
    <div ref="chart" style="width:100%;height:100%;"></div>
  </card-wrap>
</template>

<script>
import cardWrap from '@/views/portal/card/components/card-wrap';
import { debounce } from "@/utils/debounce";
export default {
  components: {
    cardWrap
  },
  props: {
    // 图表信息
    echartsData: {
      require: true,
      type: Object,
      default: function() {
        return {
          seriesData: ['1231', '211', '123', '211', '214', '124'], //系列值
        };
      }
    },
    cardName: {
      type: String,
      default() {
        return this.$t('card.pieCharts')
      }
    }
  },
  data() {
    return {
      autoResize: true,
      chart: null,
      mode: '授信类型',
      options: {
        color: ['#36C1FC', '#2877FF', '#FFB962'],
        title: {
          text: '{b|38.11%}',
          subtext: '{a|表内}',
          itemGap: 6,
          subtextStyle:  {
            rich: {
              a: {
                fontSize: '16',
                color: '#666666',
                fontFamily: 'PingFangSC-Regular, PingFang SC'
              }
            }
          },
          textStyle: {
            rich: {
              b: {
                fontSize: '24',
                color: '#333333',
                fontFamily: 'MicrosoftYaHei-Bold, MicrosoftYaHei'
              }
            }
          },
          left: 'center',
          top: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type:'shadow'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['表内', '表外', '其他'],
          padding: 5,
          textStyle: {
            color: '#333333',
            fontFamily: 'PingFangSC-Regular, PingFang SC'
          }
        },
        grid: {
          top:'40',
          left: '0',
          right: '10',
          bottom: '15',
          containLabel: true
        },
        textStyle: {
          color: '#999999 ',
          fontFamily: 'PingFangSC-Regular',
          fontWeight: 400
        },
        series: [
          {
            // name: '单一客户',
            type: 'pie',
            radius: ['40%', '55%'],
            center: ['50%', '50%'],
            data: [
              {value: 335, name: '表内'},
              {value: 310, name: '表外'},
              {value: 234, name: '其他'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    };
  },
  watch: {
    echartsData: {
      handler(n, o) {
        if(n) {
          this.getPieData();
        }
      },
      deep: true
    }
  },
  mounted() {
    const _this = this
    this.chart = window.echarts.init(this.$refs.chart);
    this.chart.on('click', function (params) {
      var name = params.name
      var percent = params.percent
      _this.options.title.text = `{b|${percent}%}`
      _this.options.title.subtext = `{a|${name}}`
      _this.chart.setOption(_this.options);
    });
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHandler);
    }
    this.getPieData();
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
      if (this.mode === '授信类型') {
        this.options.series[0].data = [
          {value: 335, name: '表内'},
          {value: 310, name: '表外'},
          {value: 234, name: '其他'}
        ];
        this.options.title.text = `{b|${38.11}%}`
        this.options.title.subtext = '{a|表内}'
        this.chart.setOption(this.options);
        this.getPieData();
      } else {
        this.options.series[0].data = [
          {value: 131, name: '表内'},
          {value: 223, name: '表外'},
          {value: 345, name: '其他'}
        ];
        this.options.title.text = `{b|${18.74}%}`
        this.options.title.subtext = '{a|表内}'
        this.chart.setOption(this.options);
        this.getPieData();
      }
    },
    getPieData() {
      // this.options.series[0].data = this.echartsData.seriesData1;
      this.chart.setOption(this.options);
    }
  }
};
</script>
<style lang="scss" scoped>
.yu-title {
  display: flex;
  flex-direction: row-reverse;
  &-left {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
  }
  &-right {
    font-size: 0;
    .mode {
      box-sizing: border-box;
      display: inline-block;
      margin-left: 16px;
      line-height: 30px;
      font-size: 14px;
      color: #999999;
      cursor: pointer;
      &:first-of-type {
        margin-left: 0;
      }
    }
    .activeMode {
      color: #2877FF;
      border-bottom: 1px solid #2877FF;
    }
  }
}
</style>
