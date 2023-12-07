/**
* Desc:&emsp;&ensp;资产结构
* @author  李渊&emsp;liyuan7@yusys.com.cn
* @date    2022/10/27
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <div class="stat-chart">
      <pie-charts :data="pieData" :cover-options="coverOptions"></pie-charts>
    </div>
    <div class="stat-table">
      <div class="table-row table-head">
        <div v-for="(label,i) in statTableHeader" :key="i">{{ label }}</div>
      </div>
      <div class="table-row" v-for="(item,i) in statTableData" :key="i">
        <div :title="item.label">{{ item.label }}</div>
        <div :title="item.value">{{ item.value }}</div>
        <div :title="item.ratio">{{ item.ratio }}</div>
      </div>
    </div>
  </card-wrap>
</template>

<script>

import cardWrap from "@/views/portal/card/components/card-wrap";
import pieCharts from "@/views/portal/card/components/charts/pieCharts"

export default {
  name: "assetsStructure",
  components: {cardWrap, pieCharts},
  mixins: [],
  props: {},
  data: function () {
    return {
      cardName: this.$t('card.assets.zcJg'),
      pieData: [
        {
          label: this.$t('card.assets.bnDkYe'),
          value: 8000.96,
        },
        {
          label: this.$t('card.assets.bnTxYe'),
          value: 7123.76,
        },
        {
          label: this.$t('card.assets.bwSxYx'),
          value: 5123.22,
        }
      ],
      coverOptions: {
        title: {
          text: this.$t('card.assets.bnnDkYe'),
          top: 64 + 32,
          left: '50%',
          textStyle: {
            lineHeight: 20,
          },
        },
        legend: {
          top: 'auto',
          left: "center",
          bottom: 24,
        },
        series: {
          center: ["50%", 64 + 32],
        },
        tooltip: {
          position: function (point) {
            return [point[0] + 10, Math.max(0, point[1] - 50)];
          }
        }
      },
      // 右侧数据
      statTableHeader: [this.$t('card.assets.cp'), this.$t('card.assets.yeWy'), this.$t('card.assets.zb')],
      statTableData: [{
        label: this.$t('card.assets.ldZjDk'),
        value: "38027",
        ratio: "35%"
      }, {
        label: this.$t('card.assets.gdZcDk'),
        value: "20571",
        ratio: "19%"
      }, {
        label: this.$t('card.assets.ytDk'),
        value: "19582",
        ratio: "18%"
      }, {
        label: this.$t('card.assets.pjTx'),
        value: "8083",
        ratio: "7%"
      }, {
        label: this.$t('card.assets.qt'),
        value: "21736",
        ratio: "20%"
      }]
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
.stat-chart {
  float: left;
  width: 38%;
  height: 100%;
}

.stat-table {
  float: right;
  width: 60%;
  height: 100%;

  .table-row {
    padding: 0 10px;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    color: #333333;
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-around;

    &:last-of-type {
      margin-bottom: 0 !important;
    }

    > div {
      display: inline-block;
    }

    div:first-of-type {
      flex: auto;
      width: 60%;
      text-align: left;
    }

    > div:nth-of-type(2) {
      flex: auto;
      width: 30%;
      text-align: right;
    }

    > div:nth-of-type(3) {
      flex: none;
      width: 30px;
      margin-left: 18px;
      text-align: left;
    }

  }

  .table-head {
    margin: 13px 0;
  }
  .table-head > div:nth-of-type(1) {
    flex: none;
    width: 40px;
  }

  .table-row:not(.table-head) {
    background: #f2f2f2;
    border-radius: 4px;
  }
}
</style>

