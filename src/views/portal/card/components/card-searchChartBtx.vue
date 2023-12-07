/**
* Desc:&emsp;&ensp;上边搜索，中间图表，下边按钮的1/4卡片组件，右上角可点击“更多统计信息”
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/9/15
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <div class="top-center" slot="topCenter">
      <yu-tooltip v-if="notice" effect="light" placement="top-start">
        <div slot="content" style="white-space: pre">{{ notice }}</div>
        <span class="yu-icon-warning1"></span>
      </yu-tooltip>
      <yu-button v-if="moreInfoClickFn!=null" type="text" @click="moreInfoClickFn">
        {{ $t('card.searchChartBtx.moreStatisticInfo') }}
      </yu-button>
    </div>
    <yu-card-empty v-if="!staticData"></yu-card-empty>
    <div class="cb-scb-wrap" v-else>
      <yu-autocomplete v-if="searchProps!=null"
                       icon="search"
                       v-model="searchVal"
                       clearable
                       :fetch-suggestions="searchContent"
                       :placeholder="searchProps.placeholder"
                       :trigger-on-focus="false"
                       :custom-item="searchProps.customItem"
                       :props="searchProps.props"
                       :popper-append-to-body="false"
                       class="cb-scb-search-wrap"
                       @select="searchProps.select"></yu-autocomplete>
      <div class="cb-scb-chart-wrap">
        <slot name="chart">
          <div ref="chart"></div>
        </slot>
      </div>
      <div class="cb-scb-btx-wrap">
        <yu-button class="cb-scb-button"
                   v-for="(bt,i) in buttons.slice(0,buttons.length<=maxLength?buttons.length:maxLength-1)" :key="i"
                   :class="{'cb-scb-button--first-row':i/rowButtonsNum<1,'cb-scb-button--first-col':i%rowButtonsNum==0}"
                   :style="{width:'calc('+Math.floor(100/rowButtonsNum)+'% - 10px)'}" :title="bt.label"
                   @click="bt.handleClick">
          {{ bt.label }}
        </yu-button>
        <yu-dropdown v-if="buttons.length>maxLength"
                     class="cb-scb-button" :style="{width:'calc('+Math.floor(100/rowButtonsNum)+'% - 10px)'}"
                     :class="{'cb-scb-button--first-row':(maxLength-1)/rowButtonsNum<1,'cb-scb-button--first-col':(maxLength-1)%rowButtonsNum==0}"
                     trigger="click" menu-align="start">
          <yu-button>{{ $t('card.searchChartBtx.moreFunc') }}<em class="el-icon-caret-bottom el-icon--right"></em>
          </yu-button>
          <yu-dropdown-menu slot="dropdown">
            <yu-dropdown-item
              :style="{width:buttonWidth+'px','font-size':'14px','box-sizing':'border-box','text-align':'center'}"
              v-for="(bt,i) in buttons.slice(maxLength-1)"
              :key="i"
              @click.native="bt.handleClick">
              {{ bt.label }}
            </yu-dropdown-item>
          </yu-dropdown-menu>
        </yu-dropdown>
      </div>
    </div>
  </card-wrap>
</template>

<script>
// 需要全局注入组件YuCustomerItem
import cardWrap from "@/views/portal/card/components/card-wrap";
import YuCardEmpty from "@/views/portal/card/components/empty.vue";
import {debounce} from "throttle-debounce";
import {getRecentDay} from "@/utils/util";
import config from "@/config";

export default {
  name: "card-search-chart-btx",
  components: {
    cardWrap,
    YuCardEmpty
  },
  props: {
    cardName: {
      type: String,
      default: "Demo",
    },
    // 提示信息
    notice: {
      type: String,
      default: ""
    },
    // 更多信息点击事件，默认不显示
    moreInfoClickFn: {
      type: Function,
      default: null
    },
    // 搜索控制，默认不显示
    searchProps: {
      type: Object,
      default: null
      /** 属性参考以下值
       {
          // 防抖,不传默认300
          debounce: 300,
            // 搜索展示自定义组件
          customItem: "yu-customer-item",
          placeholder: this.$t('card.searchChartBtx.placeholder'),
          // 查询结果回调函数
          handleSearchContent(queryString, cb) {
            cb([])
          },
          // 选择返回
          select(item) {
          },
       */
    },
    // 默认不显示按钮组
    buttons: {
      type: Array,
      //[{label:"";handleClick:null}]
      default: () => []
    },
    // 最多展示的按钮数量，超出用更多功能下拉展示
    maxLength: {
      type: Number,
      default: 6
    },
    // 一行展示的按钮数量
    rowButtonsNum: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      searchVal: "",
      autoResize: true,
      chart: null,

      staticData: [],
      staticText: {
        total: this.$t("card.customer.total"),
        stock: this.$t("card.customer.stock"),
        temp: this.$t("card.customer.temp"),
      },
      mode: '周',
      options: {
        color: ['#8477FF', '#FFC76E', '#294292'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
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
          top: '40',
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
              color: '#8CA0B3',
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
      seriesData3: ['545', '211', '123', '124', '324', '134', '126', '546', '342', '165', '675', '325'],
      // 按钮宽度，以便于下拉按钮的菜单宽度和按钮一致
      buttonWidth: 200
    };
  },
  mounted() {
    this.init();
    if (config.isdebug) {
      setTimeout(() => {
        window.debug2 = this;
      }, 100)
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }
  },
  methods: {
    /**
     * 初始化：搜索延迟函数+图表+resize监听
     */
    init() {
      if (this.searchProps) {
        this.debouncedGetCustomerList = debounce(
          this.searchProps.debounce ? this.searchProps.debounce : 300,
          this.searchProps.handleSearchContent
        );
      }
      if (this.$refs.chart) {
        this.chart = window.echarts.init(this.$refs.chart);
        this.getLineData();
      }
      if (this.autoResize) {
        this.__resizeHandler = debounce(100, () => {
          if (this.buttons.length) {
            this.buttonWidth = this.$el.querySelector(".cb-scb-button").clientWidth
          }
          if (this.chart) {
            this.chart.resize();
          }
        });
        window.addEventListener("resize", this.__resizeHandler);
        this.__resizeHandler();
      }
    },
    /**
     * 搜索内容，延迟获取
     */
    searchContent(queryString, cb) {
      this.debouncedGetCustomerList(queryString, cb)
    },
    changeMode(val) {
      this.mode = val;
      if (this.mode == '周') {
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
      for (let i = 0; i < 12; i++) {
        this.xAxisData.unshift(getRecentDay(i * -7, 'week'));
      }
      return this.xAxisData;
    },
    // 获取月度数据
    getMonth() {
      this.xAxisData = [];
      for (let i = 0; i < 12; i++) {
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
  },
};
</script>

<style lang="scss" scoped>
/*卡片总高度*/
$cardHeight: 320px;
/*header高度*/
$cardHeaderHeight: 48px;
/*下边的padding*/
$cardPaddingBottom: 16px;

$cardBodyHeight: $cardHeight - $cardHeaderHeight - $cardPaddingBottom;

.top-center {
  float: right;

  button {
    display: inline-block;
    padding: 0 !important;
  }

  span {
    line-height: 30px;

    /* notice图标 */
    &::before {
      font-size: 16px;
    }
  }
}

.cb-scb-wrap {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  /* 内容高度=卡片总高度，减去header高度，减去最下边的padding */
  height: $cardBodyHeight;
}

.cb-scb-search-wrap {
  flex: none;
  margin-top: 16px;
  width: 100%;

  ::v-deep .el-autocomplete-suggestion__wrap {
    width: 100%;
    max-height: $cardBodyHeight - 32px;
  }
}

.cb-scb-chart-wrap {
  flex: 1 1 auto;
  width: 100%;
  height: 100px;
}

.cb-scb-btx-wrap {
  flex: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-content: space-between;
  background: #ffffff;
  padding: 0;
  width: 100%;

  .cb-scb-button {
    flex: auto;
    height: 32px;
    margin: 10px 0 0 10px;
    color: #666666;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.cb-scb-button--first-row {
      margin-top: 0px;
    }

    &.cb-scb-button--first-col {
      margin-left: 0px;
    }

    .el-icon-caret-bottom {
      color: #949494;
    }

    button {
      width: 100%;
      height: 32px;
    }
  }
}


</style>
