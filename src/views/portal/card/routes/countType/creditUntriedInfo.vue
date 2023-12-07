/**
* Desc: 授信未审结情况
* @author  陈祖英
* @date    2022/10/11
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName">
    <template slot="topCenter">
      <div class="top-left"><span>{{ orgName }}</span> {{ new Date().toPreMonthLastDay() }}</div>
    </template>
    <div style="width:48%;">
      <div v-if="currentData && JSON.stringify(currentData) !== '{}'">
        <checks-line-chart v-for="(item,index) in overview.cusStus" :key="index+'k'" :x-axis-data="item.xAxisData"
                           :series-data="item.seriesData"
                           :cover-options="item.coverOptions"
        ></checks-line-chart>
      </div>
      <div class="search-no-data" style="height:100%" v-else>
        <empty-msg></empty-msg>
      </div>
    </div>
    <div style="width:48%;">
      <div style="height:100%" v-if="currentData && JSON.stringify(currentData) !== '{}' && overview.cusStus[0].seriesData[0].value !== 0">
        <div v-for="(item,i) in overview.cusTypeAlz.data" style="height:100%" :key="i+'cu'">
          <pie-charts
            :title="$t('card.creditUntriedInfo.pieTitle')" :data="item.data" :left="40"
            :coverOptions="overview.cusTypeAlz.options"
          ></pie-charts>
        </div>
      </div>
      <div class="search-no-data" style="height:100%" v-else>
        <empty-msg></empty-msg>
      </div>
    </div>


  </card-wrap>
</template>
<script>
import EmptyMsg from "@/components/layout/emptyMsg/index.vue"
import { getCreditUntriedInfo } from "@/api/portal/other"
import checksLineChart from "@/views/portal/card/components/charts/checksLineChart"
import cardWrap from "@/views/portal/card/components/card-wrap";
import PieCharts from "@/views/portal/card/components/charts/pieCharts";
import { parseTime } from "@/utils/util";
import { mapGetters } from "vuex";
export default {
  name: "creditUntriedInfo",
  components: {checksLineChart, cardWrap, PieCharts, EmptyMsg},
  mixins: [],
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.creditUntriedInfo");
      },
    },
  },
  data: function () {
    return {
      currentData:{},
      overfiledconfig:[
        {
          name:'未审结数量（笔）',
          filds:[
            'approvalUnderwaySum',
            'approvalPendingGrowth',
            'approvalPendingMonthly'
          ]
        },
      ],
      overview: {
        dataDate: "",
        // 按照客户状态分析
        cusStus: [{
          xAxisData: [],
          seriesData: [
            {
              label: "未审结数量（笔）",
              check: true,
              enableCheck:true,
              value: "186",
              ratio: {label: "比上月", value: "2%", grow: true},
              data: []
            },
          ],
          coverOptions: {
            legend: {
              top:'6'
            },
            grid: {
              top: 40,
            },
            xAxis:{
              axisLabel:{
                // 左边label居左，右边居右,中间显示一个
                fontSize:12,
                interval:4,
              }
            }
          }
        }],
        cusTypeAlz: {
          data: [
            {
              title: "所处阶段分布情况",
              data: [
                {label: "分发中", value: 20}, {label: "审批中", value: 15}, {label: "补充资料中", value: 15}]
            }
          ],
          options: {
            legend: {
              left: '68%',
              textStyle: {
                fontSize: '12',
                color: '#666666',
              }
            },
            series: {
              radius: [70, 86],
            },
            tooltip: {
              formatter: (params) => {
                return `${parseTime(new Date(), "{y}-{m}-{d}")}<br/>${params.marker}${params.name}笔数：${params.value}<br/>&emsp;占比：${params.percent}%`
              }
            },
          }
        }
      }
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
    this.getApprovalOverviewData();
  },
  methods: {
    getCurrentItem(modulex, item, data) {
      item.forEach(it => {
        this.overfiledconfig.map((ls) => {
          if(ls.name === it.label) {
            it.value = data[ls.filds[0]]
            if(it.enableCheck == true) {
              modulex.xAxisData = []
              it.data = []
              for(const i in data[ls.filds[2]]) {
                modulex.xAxisData.push(i)
                it.data.push(data[ls.filds[2]][i])
              }
            }
            if(data[ls.filds[1]] > 0) {
              it.ratio.grow = true
              //增长
            }else{
              //下降
              it.ratio.grow = false
            }
            it.ratio.value = ((data[ls.filds[1]]) + "%").replace(/-/, '')
          }
        })
      })
    },
    getApprovalOverviewData() {
      getCreditUntriedInfo().then(res => {
        if(res.code === "0") {
          this.currentData = res.data || {};
          this.overview.cusStus.forEach(el => {
            this.$nextTick(() => {
              this.getCurrentItem(el, el.seriesData, res.data)
              this.overview.cusTypeAlz.data[0].data.forEach((item) => {
                if(item.label === '分发中') {
                  item.value = res.data.distributeCount
                }else if(item.label === '审批中') {
                  item.value = res.data.approvingCount
                }else{
                  item.value = res.data.furtherCount
                }
              })
            })
          })
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
     ::v-deep{
    .card-content-wrap{
        display: flex;
        justify-content: space-between;
    }
    .chart{
      height:146px;
    }
    .top-left{
      font-size:14px;
    }
    .top-left span{
      padding-left:8px;
    }
    .checkBorder{
      border-width:0!important;
    }
    .yu-icon-checked2:before{
      content:''!important;
    }
}
</style>

