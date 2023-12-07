/**
* Desc: 审批情况概况-整体
* @author  陈祖英
* @date    2022/10/11
* @since   1.0.0
* @version 1.0
*/
<template>
  <card-wrap :cardName="cardName" class="as-content-box">
    <template slot="topCenter">
      <div class="top-left"><span>{{ orgName }} {{ new Date().toPreMonthLastDay() }}</span></div>
    </template>
    <div class="checke-line-chart-as" v-if="currentData && JSON.stringify(currentData) !== '{}'">
      <checks-line-chart class="check-line-c" v-for="(item,index) in overview.cusStus" :key="index+'l'" style="width:32%" :x-axis-data="item.xAxisData"
                         :series-data="item.seriesData"
                         :cover-options="item.coverOptions"
      ></checks-line-chart>
    </div>
    <div class="search-no-data" style="width:100%" v-else>
      <empty-msg></empty-msg>
    </div>
    
  </card-wrap>
</template>

<script>

import EmptyMsg from "@/components/layout/emptyMsg/index.vue"
import { getApprovalOverview } from "@/api/portal/other"
import cardWrap from "@/views/portal/card/components/card-wrap";
import { mapGetters } from "vuex";
import checksLineChart from "@/views/portal/card/components/charts/checksLineChart"
export default {
  name: "approveInfoSummary",
  components: {checksLineChart, cardWrap, EmptyMsg},
  mixins: [],
  props: {
    cardName: {
      type: String,
      default() {
        return this.$t("card.approveInfoSummary");
      },
    },
  },
  data: function () {
    return { 
      currentData: [],
      overfiledconfig:[
        {
          name:'人均审批笔数',
          filds:[
            'approvalFinishAvg',
            'approvalFinishAvgGrowth',
            'approvalFinishAvgMonthly'
          ]
        },
        {
          name:'审结笔数',
          filds:[
            'approvalFinishSum',
            'approvalFinishSumGrowth',
            'approvalFinishSumMonthly'
          ]
        },
        {
          name:'审批通过率',
          filds:[
            'approvalPassRate',
            'approvalPassRateGrowth',
            'approvalPassRateMonthly'
          ]
        },
        {
          name:'敞口通过率',
          filds:[
            'openPassRate',
            'openPassRateGrowth',
            'openPassRateMonthly'
          ]
        },
        {
          name:'平均分发时长(天)',
          filds:[
            'distributeTimeAvg',
            'distributeTimeAvgGrowth',
            'distributeTimeAvgMonthly'
          ]
        },
        {
          name:'平均审批时长(天)',
          filds:[
            'approvalTimeAvg',
            'approvalTimeAvgGrowth',
            'approvalTimeAvgMonthly'
          ]
        },
        {
          name:'平均资料补充时长(天)',
          filds:[
            'furtherTimeAvg',
            'furtherTimeAvgGrowth',
            'furtherTimeAvgMonthly'
          ]
        }
      ],
      overview: {
        dataDate: "2022-09-26",
        // 按照客户状态分析
        cusStus: [
          {
            xAxisData: [],
            seriesData: [
              {
                label: "人均审批笔数",
                check: true,
                enableCheck:true,
                value: "186",
                ratio: {label: "比上月", value: "2%", grow: true},
                data: []
              },
              {
                label: "审结笔数",
                value: "186",
                check: false,
                enableCheck:true,
                ratio: {label: "比上月", value: "2%", grow: true},
                data: []
              }
            ],
            coverOptions: {
              xAxis: {
                axisLabel: {
                  fontSize: 12
                },
              },
              legend: {
                top: 7
              },
              grid: {
                top: 38,
                right: 4,
                left: 4
              },
            }
          },
          {
            xAxisData: [],
            seriesData: [
              {
                label: "审批通过率",
                check: true,
                enableCheck:true,
                value: "106",
                ratio: {label: "比上月", value: "8%", grow: false},
                data: []
              },
              {
                label: "敞口通过率",
                value: "106",
                check: false,
                enableCheck:true,
                ratio: {label: "比上月", value: "8%", grow: false},
                data: []
              }
            ],
            coverOptions: {
              xAxis: {
                axisLabel: {
                  fontSize: 12
                },
              },
              legend: {
                top: 7
              },
              grid: {
                top: 38,
                right: 4,
                left: 4
              },
            }
          },
          {
            xAxisData: [],
            seriesData: [
              {
                label: "平均审批时长(天)",
                check: true,
                enableCheck:true,
                value: "106",
                ratio: {label: "比上月", value: "8%", grow: false},
                data:[]
              },
              {
                label: "平均分发时长(天)",
                value: "106",
                check: false,
                enableCheck:true,
                ratio: {label: "比上月", value: "8%", grow: false},
                data: []
              },
              {
                label: "平均资料补充时长(天)",
                value: "106",
                check: false,
                enableCheck:true,
                ratio: {label: "比上月", value: "8%", grow: false},
                data: []
              }
            ],
            coverOptions: {
              xAxis: {
                axisLabel: {
                  fontSize: 12
                },
              },
              legend: {
                top: 7,
                formatter:function(name) {
                  if(name.includes("(")) {
                    return name.split('(')[0]
                  }
                },
              },
              grid: {
                top: 38,
                right: 4,
                left: 4
              },
            }
          },
        ]
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
            // it.label = it.label.includes("(") ? it.label.split("(")[0] : it.label
            if(it.label.includes("率")) {
              it.value = data[ls.filds[0]] * 100 + "%"
            }else{
              it.value = data[ls.filds[0]]
            }
            
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
      getApprovalOverview().then(res => {
        if(res.code === '0') {
          this.currentData = res.data;
          this.overview.cusStus.forEach(el => {
            this.$nextTick(() => {
              this.getCurrentItem(el, el.seriesData, res.data)
            })
          });   
        }
      })
    } 
  }
}
</script>
<style>
    .check-line-c:last-child .label-check-wrap .label-check-item .label{
    padding:0 4px;
  }
</style>
<style lang="scss" scoped>     
 ::v-deep{
    .card-content-wrap .checke-line-chart-as{
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
} 
</style>


