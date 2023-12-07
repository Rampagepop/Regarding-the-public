/**
* Desc:&emsp;&ensp;贷款余额
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/10/20
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <div class="top-right" slot="topCenter">
      <div class="tab-title">
        <div class="tab-title-right">
          <span v-for="(mode,i) in modes" :key="i"
                :class="['mode'].concat(activeMode === mode.value?['active','c1','bc1','bdc1']:[])"
                @click="()=>{activeMode=mode.value}">{{ mode.label }}</span>
        </div>
      </div>
    </div>
    <div style="width:100%;height:calc(100% - 10px)">
      <checks-line-chart :x-axis-data="xAxisData"
                         :series-data="seriesData"
                         :cover-options="coverOptions"
      ></checks-line-chart>
    </div>
  </card-wrap>
</template>

<script>

// 近12个月的月底数据
const base = new Date();
const date = [base.toJSON()];
const data = [Math.round(Math.random() * 150)];
for (let i = 1; i < 12; i++) {
  base.setDate(0);
  date.push(base.toJSON());
  data.push(Math.round((Math.random() - 0.3) * 10 + data[i - 1]));
}
// 第一笔数据设置成昨天
const lastDay = new Date()
lastDay.setDate(lastDay.getDate() - 1);
date[0] = lastDay.toJSON()
date.reverse()

import cardWrap from "@/views/portal/card/components/card-wrap";
import checksLineChart from "@/views/portal/card/components/charts/checksLineChart"

export default {
  name: "compEvalSubOrg",
  components: {cardWrap, checksLineChart},
  mixins: [],
  props: {},
  data: function () {
    return {
      cardName: this.$t('card.eval.loanBalance'),
      activeMode: 'corp',
      modes: [{label: this.$t('card.eval.corp'), value: 'corp'}, {label: this.$t('card.eval.ps'), value: 'ps'}],
      seriesDataMap: {
        corp: {
          label: this.$t('card.eval.loanBalanceUnit'),
          enableCheck: false,
          value: "8,900,906",
          ratio: {label: this.$t('card.eval.cmpLastMonth'), value: "2%", grow: true},
          data: data
        },
        ps: {
          label: this.$t('card.eval.loanBalanceUnit'),
          enableCheck: false,
          value: "3,189",
          ratio: {label: this.$t('card.eval.cmpLastMonth'), value: "1%", grow: false},
          data: data.concat([]).reverse()
        }
      },
      xAxisData: date,
      coverOptions: {
        grid: {
          top: 16,
          // 横坐标有点超出范围然后被隐藏了，所以通过grid留一点空白
          left: 3
        },
        legend: {
          top: 0
        },
        xAxis: {
          axisLabel: {
            // 从后往前，隔两个显示一个
            interval: i => i === 2 || i === 5 || i === 8 || i === 11,
            align: "right"
          }
        }
      }
    }
  },
  computed: {
    seriesData() {
      return [this.seriesDataMap[this.activeMode]]
    }
  },
  watch: {},
  mounted() {
    // 获取数据
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.top-right {
  font-size: 14px;
  color: #666666;

  .tab-title {
    float: right;

    &-right {
      .mode {
        box-sizing: border-box;
        display: inline-block;
        margin-left: 16px;
        line-height: 30px;
        font-size: 14px;
        cursor: pointer;
        background: none;

        &:first-of-type {
          margin-left: 0;
        }

        &:not(.active) {
          color: #666666;
        }

        // 颜色跟随主题，用['c1','bc1','bdc1']控制
        &.active {
          border-bottom-width: 1px;
          border-bottom-style: solid;
        }
      }

    }
  }
}
</style>

