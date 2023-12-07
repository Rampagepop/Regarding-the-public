/*
 * Desc: 统计类卡片-评价类--审批人员效率
 * @Author: 陈祖英
 * @Date: 2022-10-14 10:25:23
 * @Last Modified time: 2022-10-14 10:25:23
 */
<template>
  <card-top-last
    :card-name="cardName"
    :isMock="ismock"
    :num="32" :group-num="groupNum"
    :top-data="topData" :last-data="lastData"
  >
    <template slot="ctlTopCenter">
      <div class="yu-title">
        <div class="top-left">{{ orgName }} {{ new Date().toPreMonthLastDay() }} 共{{ num }}人参与排名</div>
        <div class="yu-title-right">
          <span v-for="(item,index) in modeArray" :key="index+'ae'"
                :class="['mode'].concat(mode === item.label?['active','c1','bc1','bdc1']:[])"
                @click="changeMode(item.label)"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </template>
    <template slot="headerTop">
      <div class="top">审批笔数排名TOP{{ groupNum }}（笔）</div>
      <div class="last">平均审批时长排名TOP{{ groupNum }}（天/笔）</div>
    </template>
  </card-top-last>
</template>

<script>

import { getApprovalEfficiency } from "@/api/portal/other"
import cardTopLast from "@/views/portal/card/components/card-topLast";
import EmptyMsg from "@/components/layout/emptyMsg/index.vue"
import { mapGetters } from "vuex";
export default {
  name: "approvalEfficiency",
  components: {cardTopLast, EmptyMsg},
  mixins: [],
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.approvalEffic");
      },
    },
  },
  data: function () {
    return {
      ismock: false,
      modeArray: [
        { label:"月度", value:1 },
        { label:"季度", value:2 },
        { label:"年度", value:3 }
      ],
      mode: "月度",
      num: 108,
      groupNum: 10,
      topData: [
        // {label: "张兴全", value: "96.2", rank: 1, ratio: {grow: true, value: "1"}},
      ],
      lastData: [
        // {label: "张兴全", value: "65.1", rank: 23, ratio: {grow: false, value: "3"}},
      ]
    }
  },
  computed: {
    ...mapGetters([
      "selectedRoles",
    ]),
    orgName() {
      if (this.selectedRoles) {
        return `${this.selectedRoles.orgName}`;
      }
      return "";
    },
  },
  watch: {},
  mounted() {
    // 获取数据
    this.getApprovalEfficiencyData();
  },
  methods: {
    changeMode(val) {
      this.mode = val;
      this.getApprovalEfficiencyData()
    },
    getApprovalEfficiencyData() {
      getApprovalEfficiency({dimensionality:this.modeArray.filter(item => item.label === this.mode)[0].value}).then(res => {
        if(res.code === '0') {
          this.topData = res.data.approvalFinishSum.map(item => {
            return {
              "label":item.name,
              "value":item.currSuccess,
              "rank":item.ranking,
              "ratio":{"grow":item.rise < 0 ? false : true, "value":item.rise}
            }
          })
          this.lastData = res.data.approvalTimeAvg.map(item => {
            return {
              "label":item.name,
              "value":item.currSuccess.toFixed(2),
              "rank":item.ranking,
              "ratio":{"grow":item.rise < 0 ? false : true, "value":item.rise}
            }
          })
        }
      })

    },
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .rank-wrap .rank-item .rank{
      width:18px;
    }
    .rank-wrap .rank-item .ratio,.rank-wrap .rank-item .label{
       text-align:left;
    }
  }
.rank-title {
  display: flex;
  width: 100%;
  padding: 0;
  flex-flow: row nowrap;
  justify-content: space-around;

  > div {
    height: 28px;
    border-radius: 14px;
    padding: 0 15px;
    line-height: 28px;
    font-size: 14px;
    font-weight: bold;
  }

  .top {
    background: rgba(40, 119, 255, 0.2500);
    color: #2877FF;
  }
  .last {
    background: rgba(251, 141, 18, 0.2500);
    color: #FB8D12;
  }
}
.top-left {
  padding-left:8px;
  font-size: 14px;
  color: #666666;
}
.yu-title {
  display: flex;
  /* flex-direction: row-reverse; */
  justify-content:space-between;
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
      /* color: #999999; */
      line-height: 30px;
      display: inline-block;
      margin-left: 16px;
      cursor: pointer;
      background:none;
    }
    .mode.active {
      border-bottom-width: 1px;
      border-bottom-style: solid;
    }

    /* .activeMode {
      color: #2877ff;
      padding-bottom: 8px;
      border-bottom: 1px solid #2877ff;
    } */
  }
}
</style>

