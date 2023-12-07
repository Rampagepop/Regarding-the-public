/**
* Desc:&emsp;&ensp;综合评价（分行）卡片
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/10/11
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <div class="top-left" slot="topCenter">{{ orgName }}&ensp;{{ date }}</div>
    <div style="width:100%;height:calc(100% - 10px)">
      <checks-line-chart :x-axis-data="xAxisData"
                         :series-data="seriesData"
                         :cover-options="coverOptions"
      ></checks-line-chart>
    </div>
  </card-wrap>
</template>

<script>
import cardWrap from "@/views/portal/card/components/card-wrap";
import checksLineChart from "@/views/portal/card/components/charts/checksLineChart"

export default {
  name: "compEvalSubOrg",
  components: {cardWrap, checksLineChart},
  mixins: [],
  props: {},
  data: function () {
    const year = new Date().getFullYear();
    // 季度日期
    const qDate = [year + '-09-30', year + '-06-30', year + '-03-31', year - 1 + '-12-31', year - 1 + '-09-30', year - 1 + '-06-30', year - 1 + '-03-31'];
    // qDate[idx]为当前时间最近的一个季度
    const idx = 3 - Math.floor(new Date().getMonth() / 3);
    const seriesData = [
      {
        label: this.$t('card.eval.compScore'),
        enableCheck: false,
        value: "88.2",
        ratio: {label: this.$t('card.eval.cmpLastPrd'), value: "3", grow: true},
      }, {
        label: this.$t('card.eval.rank'),
        enableCheck: false,
        value: "10/32",
        ratio: {label: this.$t('card.eval.cmpLastPrd'), value: "6", grow: false},
        data: [20, 25, 15, 10].map(v => 32 - v),
      }
    ];
    return {
      cardName: this.$t('card.eval.compEval'),
      orgName: this.$store.getters.selectedRoles.orgName,
      // 最近一个季度
      date: qDate[idx],
      // 最近4个季度
      xAxisData: qDate.slice(idx, idx + 4).reverse(),
      seriesData: seriesData,
      coverOptions: {
        tooltip:{
          formatter: param => {
            return param[0].name + "<br\>" +
              param[0].marker + param[0].seriesName + ': ' + (32 - param[0].value);
          }
        },
        grid: {
          top: 16
        },
        legend: {
          top: 0
        },
        xAxis:{
          axisLabel:{
            // label全部显示
            interval: 0,
            // 让中间的两个日期靠中间显示一些
            formatter: (val, i) => [val, "      " + val, val + "      ", val][i]
          }
        }
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取数据
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.top-left {
  padding-left: 8px;
  font-size: 14px;
  color: #666666;
}
</style>

