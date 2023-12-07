/**
* Desc:&emsp;&ensp;资产质量
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/10/26
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <div class="stat-chart">
      <checks-line-chart :x-axis-data="xAxisData"
                         :series-data="seriesData"
                         :cover-options="coverOptions"
      ></checks-line-chart>
    </div>
    <div class="stat-table">
      <div class="date">
        <yu-date-picker v-model="hisDate" align="right" type="date" placeholder="请选择历史日期"
                        :picker-options="pickerOptions" @change="changeStatData">
        </yu-date-picker>
      </div>
      <div class="table">
        <div class="table-row table-head">
          <div v-for="(label,i) in statTableHeader" :key="i">{{ label }}</div>
        </div>
        <div class="table-row" v-for="(item,i) in statTableData" :key="i">
          <div>
            <span class="label">{{ item.label }}</span>
            <span class="value">{{ item.value }}</span>
          </div>
          <div class="ratio" v-for="(val,ii) in item.ratio" :key="ii"
               :class="val>=0?'ratio-up yu-icon-up':'ratio-down yu-icon-down'">{{ Math.abs(val) + '%' }}
          </div>
        </div>
      </div>
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
  name: "assetsQuality",
  components: {cardWrap, checksLineChart},
  mixins: [],
  props: {},
  data: function () {
    return {
      cardName: this.$t('card.assets.zcZl'),
      seriesData: [
        {
          label: this.$t('card.assets.yqYeYy'),
          enableCheck: false,
          value: "8,000.96",
          ratio: {label: this.$t('card.assets.cmpLstMon'), value: "2%", grow: true},
          legendLabel: this.$t('card.assets.yql'),
          data: data
        },
        {
          label: this.$t('card.assets.blYeYy'),
          enableCheck: false,
          value: "1,621.08",
          ratio: {label: this.$t('card.assets.cmpLstMon'), value: "8%", grow: false},
          legendLabel: this.$t('card.assets.bll'),
          data: data.concat([]).reverse()
        }
      ],
      xAxisData: date,
      coverOptions: {
        tooltip:{
          formatter: param => {
            return param[0].name + "<br\>" +
              param[0].marker + param[0].seriesName + ': ' + param[0].value.toFixed(2) + "%" + "<br\>" +
              param[1].marker + param[1].seriesName + ': ' + param[1].value.toFixed(2) + "%";
          }
        },
        grid: {
          top: 16
        },
        legend: {
          top: 0,
        },
        xAxis: {
          axisLabel: {
            // 从后往前，隔两个显示一个
            interval: i => i === 2 || i === 5 || i === 8 || i === 11,
            align: "right"
          }
        }
      },
      // 右侧数据
      hisDate: null,
      pickerOptions: {
        shortcuts: [{
          text: this.$t('card.assets.monBfr'),
          onClick: function (picker) {
            const tDate = new Date();
            tDate.setMonth(tDate.getMonth() - 1)
            picker.$emit('pick', tDate);
          }
        }, {
          text: this.$t('card.assets.twoMonBfr'),
          onClick: function (picker) {
            const tDate = new Date();
            tDate.setMonth(tDate.getMonth() - 2)
            picker.$emit('pick', tDate);
          }
        }, {
          text: this.$t('card.assets.halfYearBfr'),
          onClick: function (picker) {
            const tDate = new Date();
            tDate.setMonth(tDate.getMonth() - 6)
            picker.$emit('pick', tDate);
          }
        }, {
          text: this.$t('card.assets.yearBfr'),
          onClick: function (picker) {
            const tDate = new Date();
            tDate.setMonth(tDate.getMonth() - 12)
            picker.$emit('pick', tDate);
          }
        }]
      },
      statTableHeader: [this.$t('card.assets.yeYy'), this.$t('card.assets.cmpLstDay'), this.$t('card.assets.cmpLstMon'), this.$t('card.assets.cmpStrYear')],
      statTableData: [{
        label: this.$t('card.assets.dkYe'),
        value: "7,068.23",
        ratio: [1.5, -12.1, 12.1]
      }, {
        label: this.$t('card.assets.yqYe'),
        value: "1,029.06",
        ratio: [-2.5, 22.1, -15.1]
      }, {
        label: this.$t('card.assets.blYe'),
        value: "2,360.00",
        ratio: [1.7, -11.1, 2.1]
      }]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取数据
  },
  methods: {
    // 改变数据
    changeStatData() {
      // 假的数据,做个循环,label不动，value和ratio循环
      this.statTableData.push(Object.assign({}, this.statTableData[0]))
      this.statTableData.forEach((item, i) => {
        if (i < 3) {
          item.value = this.statTableData[i + 1].value
          item.ratio = this.statTableData[i + 1].ratio
        }
      });
      this.statTableData.pop();
    }
  }
}
</script>
<style lang="scss" scoped>
.stat-chart {
  float: left;
  width: calc(50% - 12px);
  height: calc(100% - 10px);
}

.stat-table {
  float: right;
  width: calc(50% - 12px);
  height: calc(100% - 10px);

  .date {
    width: 60%;
    margin-top: 16px;
    margin-left: 40%;
  }
  .table{
    width: 100%;
  }

  .table-row {
    padding:0 12px;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    color: #333333;
    > div{
      display: inline-block;
      flex: auto;
      width: 20%;
      text-align: right;
    }
    > div:first-of-type{
      width: 38%;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .table-head{
    height: 45px;
    line-height: 45px;
  }
  .table-row:not(.table-head){
    height: 40px;
    background: #f2f2f2;
    border-radius: 4px;
    line-height: 40px;
    margin-bottom: 16px;
    .label{
    }
    .value{
      font-size: 18px;
      font-weight: bold;
    }

    .ratio.ratio-up {
      color: #F52C36;
    }

    .ratio.ratio-down {
      color: #11BD19;
    }
    .ratio::before{
      font-size: 12px;
      margin-right: 4px;
    }
  }
  .table-row:last-of-type{
    margin-bottom: 0!important;
  }
}
</style>

